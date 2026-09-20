import { closeSync, mkdirSync, openSync, readFileSync, renameSync, unlinkSync, writeFileSync, writeSync } from "node:fs";
import { createHash, randomUUID } from "node:crypto";
import { tmpdir } from "node:os";
import path from "node:path";

/**
 * MOCK EMAIL PROVIDER for local and preview testing (server only).
 *
 * Mirrors the idempotency contract of the real provider (Resend
 * `Idempotency-Key`, https://resend.com/docs/dashboard/emails/idempotency-keys)
 * so mocked tests exercise the SAME call path the real send uses:
 *   - same key + same payload  → the original response, nothing sent again
 *   - same key + different payload → error `invalid_idempotent_request`
 *   - same key while a send is in flight → error `concurrent_idempotent_requests`
 * Its ledger is one file per key under `INQUIRY_MOCK_PROVIDER_DIR`
 * (default `<os tmpdir>/compass-inquiry-mock-provider`), shared by every
 * handler instance on the machine — like the provider's global key space —
 * so a retry from an instance with ISOLATED local storage still reaches
 * the same key and sends once. Nothing is ever delivered anywhere.
 */
export interface MockSendResult {
  data: { id: string } | null;
  error: { name: string; message: string } | null;
  /** True when this call matched an earlier send for the same key. */
  duplicate: boolean;
}

interface Ledger {
  hash: string;
  status: "sending" | "sent";
  id: string;
  sends: number;
  at: number;
}

export function mockProviderDir(): string {
  return process.env.INQUIRY_MOCK_PROVIDER_DIR || path.join(tmpdir(), "compass-inquiry-mock-provider");
}

const fileFor = (key: string) => path.join(mockProviderDir(), `${key.replace(/[^0-9a-z-]/gi, "_")}.json`);
const read = (file: string): Ledger | null => {
  try {
    return JSON.parse(readFileSync(file, "utf8")) as Ledger;
  } catch {
    return null;
  }
};

export async function mockSend(payload: object, options?: { idempotencyKey?: string }): Promise<MockSendResult> {
  const id = `mock_${randomUUID()}`;
  const hash = createHash("sha256").update(JSON.stringify(payload)).digest("hex");
  if (!options?.idempotencyKey) {
    console.log("[inquiry] MOCK provider send (no idempotency key)", { id });
    return { data: { id }, error: null, duplicate: false };
  }
  mkdirSync(mockProviderDir(), { recursive: true });
  const file = fileFor(options.idempotencyKey);
  const mine: Ledger = { hash, status: "sending", id, sends: 1, at: Date.now() };
  let fd: number | null = null;
  try {
    fd = openSync(file, "wx");
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== "EEXIST") throw err;
  }
  if (fd === null) {
    const prev = read(file);
    if (prev && prev.hash !== hash) return { data: null, error: { name: "invalid_idempotent_request", message: "Idempotency key was used with a different payload." }, duplicate: false };
    if (prev && prev.status === "sending") return { data: null, error: { name: "concurrent_idempotent_requests", message: "A request with this idempotency key is already in progress." }, duplicate: false };
    if (prev) return { data: { id: prev.id }, error: null, duplicate: true };
    // unreadable ledger: treat as a new send
    try { unlinkSync(file); } catch { /* ignore */ }
    return mockSend(payload, options);
  }
  // Simulate the provider's processing window so concurrent callers see "in progress".
  writeSync(fd, JSON.stringify(mine));
  closeSync(fd);
  await new Promise((r) => setTimeout(r, 150));
  const sent: Ledger = { ...mine, status: "sent" };
  const tmp = `${file}.${id}.tmp`;
  writeFileSync(tmp, JSON.stringify(sent));
  renameSync(tmp, file);
  console.log("[inquiry] MOCK provider send", { id, idempotencyKey: options.idempotencyKey });
  return { data: { id }, error: null, duplicate: false };
}

/** For tests: how many times the mock provider actually "sent" for a key. */
export function mockSends(idempotencyKey: string): number {
  return read(fileFor(idempotencyKey))?.sends ?? 0;
}
