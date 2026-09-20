import { Resend } from "resend";
import type { InquiryConflictCode } from "@/lib/inquiry";

/**
 * EMAIL PROVIDER ADAPTER (server only).
 *
 * One contract for every way the inquiry route can hand a message to a
 * provider, so the route's delivery path is the same code whether the
 * provider is real or mocked:
 *
 *   send(payload, { idempotencyKey }) → { data: { id } | null, error | null }
 *
 * That is Resend's own `emails.send` shape, and the idempotency-key contract
 * is Resend's (https://resend.com/docs/dashboard/emails/idempotency-keys):
 *   - same key + same payload  → the ORIGINAL response, nothing sent again;
 *   - same key + different payload → error `invalid_idempotent_request`;
 *   - same key while a send is in flight → error `concurrent_idempotent_requests`;
 *   - keys are kept for 24 hours.
 *
 * The provider is the ONLY authority for acceptance, duplicates, conflicts
 * and retries. There is deliberately no local record, lock or lease in
 * front of it: serverless handler instances share nothing, and a local gate
 * can only add ways to block or double-report a send.
 *
 * Implementations:
 *   - `resendProvider`  — the real send (production, and any environment
 *                          with an API key and no mock setting);
 *   - `httpMockProvider` — the QA mock SERVICE (`scripts/qa/mock-provider.mjs`),
 *                          one process with authoritative in-memory state
 *                          that every handler instance under test shares,
 *                          exactly like the real provider's key space;
 *   - `memoryMockProvider` — an in-process double for local development and
 *                          the fictional preview brand when no mock service
 *                          is running. Same contract, but per process only.
 * Both mocks apply the contract above. Nothing mocked is ever delivered.
 */
export interface EmailPayload {
  from: string;
  to: string[];
  replyTo?: string;
  subject: string;
  html: string;
  text: string;
}

export interface SendOptions {
  idempotencyKey?: string;
}

export interface SendResult {
  data: { id: string } | null;
  error: { name: string; message: string } | null;
  /** Set by the mocks only when the key matched an earlier send. Resend does not report this. */
  duplicate?: boolean;
}

export interface EmailProvider {
  readonly kind: "resend" | "mock";
  send(payload: EmailPayload, options?: SendOptions): Promise<SendResult>;
}

/** Classify a provider error as an idempotency conflict, if it is one. */
export function providerConflict(error: { name?: string; message?: string } | null | undefined): InquiryConflictCode | null {
  const text = `${error?.name ?? ""} ${error?.message ?? ""}`.toLowerCase();
  if (!text.includes("idempoten")) return null;
  return text.includes("concurrent") ? "in_progress" : "submission_changed";
}

export function resendProvider(apiKey: string): EmailProvider {
  const resend = new Resend(apiKey);
  return {
    kind: "resend",
    async send(payload, options) {
      const { data, error } = await resend.emails.send(payload, options?.idempotencyKey ? { idempotencyKey: options.idempotencyKey } : undefined);
      return { data: data ? { id: data.id } : null, error: error ? { name: error.name, message: error.message } : null };
    },
  };
}

/**
 * The mock provider SERVICE: `POST <url>/emails` with an `Idempotency-Key`
 * header, answering in the provider's shapes (200 `{id, duplicate?}`,
 * 409 `{name: "concurrent_idempotent_requests"}`, 422
 * `{name: "invalid_idempotent_request"}`).
 */
export function httpMockProvider(url: string): EmailProvider {
  const base = url.replace(/\/$/, "");
  return {
    kind: "mock",
    async send(payload, options) {
      const res = await fetch(`${base}/emails`, {
        method: "POST",
        headers: { "content-type": "application/json", ...(options?.idempotencyKey ? { "idempotency-key": options.idempotencyKey } : {}) },
        body: JSON.stringify(payload),
      });
      const body = (await res.json()) as { id?: string; duplicate?: boolean; name?: string; message?: string };
      if (!res.ok) return { data: null, error: { name: body.name ?? "mock_provider_error", message: body.message ?? `HTTP ${res.status}` } };
      return { data: { id: body.id ?? "" }, error: null, ...(body.duplicate ? { duplicate: true } : {}) };
    },
  };
}

interface MemoryRecord {
  hash: string;
  status: "sending" | "sent";
  id: string;
  at: number;
}
const MEMORY_RETENTION_MS = 24 * 60 * 60 * 1000;
const memoryLedger = new Map<string, MemoryRecord>();

/** Stable fingerprint of a payload, as a provider would compare it. */
export function payloadHash(payload: EmailPayload): string {
  return JSON.stringify([payload.from, payload.to, payload.replyTo ?? null, payload.subject, payload.html, payload.text]);
}

export function memoryMockProvider(): EmailProvider {
  return {
    kind: "mock",
    async send(payload, options) {
      const id = `mock_${crypto.randomUUID()}`;
      const key = options?.idempotencyKey;
      if (!key) {
        console.log("[inquiry] MOCK delivery (in-process, no idempotency key)", { id });
        return { data: { id }, error: null };
      }
      const now = Date.now();
      const hash = payloadHash(payload);
      const prev = memoryLedger.get(key);
      if (prev && now - prev.at > MEMORY_RETENTION_MS) memoryLedger.delete(key);
      const current = memoryLedger.get(key);
      if (current) {
        if (current.hash !== hash) return { data: null, error: { name: "invalid_idempotent_request", message: "Idempotency key was used with a different payload." } };
        if (current.status === "sending") return { data: null, error: { name: "concurrent_idempotent_requests", message: "A request with this idempotency key is already in progress." } };
        return { data: { id: current.id }, error: null, duplicate: true };
      }
      memoryLedger.set(key, { hash, status: "sending", id, at: now });
      await new Promise((r) => setTimeout(r, 150)); // the provider's processing window
      memoryLedger.set(key, { hash, status: "sent", id, at: now });
      console.log("[inquiry] MOCK delivery (in-process)", { id, idempotencyKey: key });
      return { data: { id }, error: null };
    },
  };
}
