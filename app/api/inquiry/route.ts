import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { inquiryConfig } from "@/config/inquiry.config";
import {
  normaliseInquiry,
  validateInquiry,
  isValidEmail,
  readSubmissionId,
  type InquiryErrors,
  type InquiryConflictCode,
} from "@/lib/inquiry";
import { claim, complete, release, contentFingerprint } from "@/lib/idempotency";

export const runtime = "nodejs";

/**
 * POST /api/inquiry — the contact form's delivery endpoint.
 *
 * Contract: a 2xx with `{ ok: true }` is the ONLY success. The form shows
 * its success state on nothing else. Validation problems answer 400 with
 * `{ errors }` keyed by field (same codes as the client), everything else
 * answers with `{ error }` and a non-2xx status, and the form keeps the
 * visitor's input on every one of those paths.
 *
 * Spam protection, in order: same-origin check, per-IP rate limit (per
 * serverless instance — see config), honeypot (silent accept), server-side
 * validation and length limits. No captcha — nothing here needs a
 * third-party script. There is deliberately NO timing trap: a visitor who
 * pastes or autofills can finish in under a second, and a message that
 * passes every other check must never be silently discarded.
 *
 * Delivery: Resend, the same provider the live careers form uses; key from
 * the environment only. `INQUIRY_DELIVERY=mock|fail` short-circuits the
 * provider for local and preview testing and is IGNORED in production, so a
 * mocked success can never reach a real visitor.
 *
 * The careers `/api/apply` route is untouched by this file.
 */

/* ---------- Rate limit — PER INSTANCE, same pattern as /api/apply ----------
 * `hits` is module state in one function instance. Vercel runs many
 * instances; each has its own map, and a cold start begins empty. Treat this
 * as a brake on a single connection hammering one warm instance, not as a
 * deployment-wide quota. */
const hits = new Map<string, number[]>();
function rateLimited(ip: string): boolean {
  const { windowMs, maxPerWindow } = inquiryConfig.rateLimit;
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= maxPerWindow) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= windowMs)) hits.delete(key);
    }
  }
  return false;
}

/* ---------- Duplicate guard — see lib/idempotency.ts and lib/inquiry.ts.
 * Two layers: the durable store (atomic claim per submission id + content
 * fingerprint; shared by every handler instance on a shared disk) and the
 * provider's Idempotency-Key on the real send (the guard across serverless
 * instances). Outcomes are explicit — duplicate, changed, in progress —
 * and success is only ever reported after a completed delivery. */
const conflict = (code: InquiryConflictCode, message: string) =>
  NextResponse.json({ ok: false, code, error: message }, { status: 409 });
const CHANGED_MESSAGE = "This message changed since the first attempt, so it was not sent. Please send it again.";
const IN_PROGRESS_MESSAGE = "This message is still being sent. Please wait a moment before trying again.";

/** Classify a provider error as an idempotency conflict, if it is one. */
function providerConflict(error: { name?: string; message?: string } | null | undefined): InquiryConflictCode | null {
  const text = `${error?.name ?? ""} ${error?.message ?? ""}`.toLowerCase();
  if (!text.includes("idempoten")) return null;
  return text.includes("concurrent") ? "in_progress" : "submission_changed";
}

/* ---------- Helpers ---------- */
function readEnv(name: string): string {
  const raw = process.env[name];
  if (typeof raw !== "string") return "";
  return raw.trim().replace(/^["']|["']$/g, "").trim();
}

function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function row(label: string, value: string): string {
  if (!value) return "";
  return `<tr>
    <td style="padding:10px 16px;border-bottom:1px solid #e6e9ef;font-weight:600;color:#0a1b33;white-space:nowrap;vertical-align:top;">${esc(label)}</td>
    <td style="padding:10px 16px;border-bottom:1px solid #e6e9ef;color:#33415c;">${esc(value).replace(/\n/g, "<br/>")}</td>
  </tr>`;
}

function sameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true; // Non-browser clients; the other checks still apply.
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? "";
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

const isProduction = process.env.VERCEL_ENV === "production";

const failure = (message: string, status: number) =>
  NextResponse.json({ ok: false, error: message }, { status });


export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) {
    return failure("Invalid request origin.", 403);
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (rateLimited(ip)) {
    return failure("Too many messages from this connection in a short time — please wait a few minutes.", 429);
  }

  let raw: Record<string, unknown>;
  try {
    raw = (await request.json()) as Record<string, unknown>;
    if (!raw || typeof raw !== "object") throw new Error("not an object");
  } catch {
    return failure("Invalid submission.", 400);
  }

  // Honeypot: a field people never see. Pretend success so bots learn nothing.
  const honeypot = typeof raw.website === "string" ? raw.website.trim() : "";
  if (honeypot) {
    return NextResponse.json({ ok: true });
  }

  const data = normaliseInquiry(raw);
  const errors: InquiryErrors = validateInquiry(data);
  if (Object.keys(errors).length) {
    return NextResponse.json({ ok: false, errors }, { status: 400 });
  }

  // Duplicate-safe: claim the submission id for THIS content. (After
  // validation, so an id can never make an invalid message look accepted.)
  const submissionId = readSubmissionId(raw.submissionId);
  const fingerprint = contentFingerprint(data);
  if (submissionId) {
    const outcome = await claim(submissionId, fingerprint);
    if (outcome.state === "done") return NextResponse.json({ ok: true, duplicate: true });
    if (outcome.state === "mismatch") return conflict("submission_changed", CHANGED_MESSAGE);
    if (outcome.state === "pending") return conflict("in_progress", IN_PROGRESS_MESSAGE);
  }

  /* ---------- Delivery ---------- */
  const mode = isProduction ? "" : inquiryConfig.forceMock ? "mock" : readEnv(inquiryConfig.env.delivery);
  if (mode === "fail") {
    console.error("[inquiry] simulated provider failure (INQUIRY_DELIVERY=fail)");
    if (submissionId) release(submissionId);
    return failure("The message could not be handed to our email service.", 502);
  }

  const recipientEnv = readEnv(inquiryConfig.env.recipient);
  const recipients = recipientEnv
    ? recipientEnv.split(",").map((a) => a.trim()).filter(Boolean)
    : [...inquiryConfig.recipients];
  const from = readEnv(inquiryConfig.env.from) || inquiryConfig.from;
  const subject = [inquiryConfig.subjectPrefix, data.service || null, data.name]
    .filter(Boolean)
    .join(" — ");

  const html = `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f4f6f9;font-family:Arial,Helvetica,sans-serif;">
    <div style="max-width:640px;margin:0 auto;padding:24px 16px;">
      <div style="background:#0a1b33;border-radius:12px 12px 0 0;padding:24px 28px;">
        <p style="margin:0;color:#c0d634;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">${esc(inquiryConfig.subjectPrefix)}</p>
        <h1 style="margin:8px 0 0;color:#ffffff;font-size:22px;">${esc(data.name)}${data.service ? ` — ${esc(data.service)}` : ""}</h1>
      </div>
      <div style="background:#ffffff;border-radius:0 0 12px 12px;padding:8px 12px 20px;">
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          ${row("Name", data.name)}
          ${row("Email", data.email)}
          ${row("Phone", data.phone)}
          ${row("Service", data.service)}
          ${row("Project details", data.details)}
        </table>
        <p style="margin:20px 16px 0;font-size:12px;color:#8a94a6;">
          Submitted via ${esc(inquiryConfig.sourceLabel)}${data.email ? " · Reply to this email to answer the visitor." : " · No email given — reply by phone."}
        </p>
      </div>
    </div>
  </body>
</html>`;
  const text = [
    `${inquiryConfig.subjectPrefix} — ${data.name}`,
    "",
    `Name: ${data.name}`,
    data.email ? `Email: ${data.email}` : "",
    data.phone ? `Phone: ${data.phone}` : "",
    data.service ? `Service: ${data.service}` : "",
    "",
    "Project details:",
    data.details,
    "",
    `Submitted via ${inquiryConfig.sourceLabel}`,
  ].join("\n");

  if (mode === "mock") {
    console.log("[inquiry] MOCK delivery (INQUIRY_DELIVERY=mock):", {
      from,
      to: recipients,
      replyTo: data.email || undefined,
      subject,
    });
    if (submissionId) complete(submissionId, { delivery: "mock" });
    return NextResponse.json({ ok: true, delivery: "mock" });
  }

  const apiKey = readEnv(inquiryConfig.env.apiKey);
  if (!apiKey) {
    console.error(`[inquiry] ${inquiryConfig.env.apiKey} is not set in this environment.`);
    if (submissionId) release(submissionId);
    return failure("The contact form is not configured on this server.", 500);
  }

  try {
    const resend = new Resend(apiKey);
    // The provider's idempotency key is the cross-instance duplicate guard:
    // the same key with the same payload returns the original send; the
    // same key with a different payload or a concurrent send is refused
    // by the provider, and mapped below to the same explicit conflicts.
    const { data: sent, error } = await resend.emails.send(
      {
        from,
        to: recipients,
        ...(data.email && isValidEmail(data.email) ? { replyTo: data.email } : {}),
        subject,
        html,
        text,
      },
      submissionId ? { idempotencyKey: `inquiry/${submissionId}` } : undefined
    );
    if (error) {
      const code = providerConflict(error);
      if (submissionId) release(submissionId);
      if (code) return conflict(code, code === "in_progress" ? IN_PROGRESS_MESSAGE : CHANGED_MESSAGE);
      console.error("[inquiry] Resend send failed:", error);
      return failure("The message could not be handed to our email service.", 502);
    }
    if (submissionId) complete(submissionId, { id: sent?.id ?? null });
    return NextResponse.json({ ok: true, id: sent?.id ?? null });
  } catch (err) {
    if (submissionId) release(submissionId);
    console.error("[inquiry] Resend threw:", err);
    return failure("The message could not be handed to our email service.", 502);
  }
}
