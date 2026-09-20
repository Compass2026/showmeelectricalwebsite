import { closeSync, mkdirSync, openSync, readFileSync, unlinkSync, writeFileSync, writeSync } from "node:fs";
import { createHash } from "node:crypto";
import { tmpdir } from "node:os";
import path from "node:path";

/**
 * DURABLE IDEMPOTENCY STORE for form actions (server only).
 *
 * Every inquiry carries a client-minted `submissionId`. This store records,
 * per id, a fingerprint of the message content and whether delivery
 * completed, so that:
 *
 *   - a retry of UNCHANGED content (same id, same fingerprint) after a lost
 *     response answers `duplicate` without delivering again;
 *   - the SAME id with DIFFERENT content is refused explicitly
 *     (`mismatch`), never reported as success;
 *   - two SIMULTANEOUS requests for one id contend on an atomic file
 *     create: exactly one claims delivery, the other waits briefly for its
 *     result or is told the send is still `pending`.
 *
 * Records live as one JSON file per id under `INQUIRY_IDEMPOTENCY_DIR`
 * (default `<os tmpdir>/compass-inquiry-idempotency`) and survive process
 * restarts and separate handler instances that share that directory (a
 * VM, a container, the mock/preview servers, the test harness). On a
 * serverless platform instances do NOT share a disk, so this store is the
 * local layer only; the cross-instance guard there is the email provider's
 * own idempotency key, which the route passes for every send (Resend keeps
 * a key for 24 hours). Retention here matches that window.
 */
export const IDEMPOTENCY_RETENTION_MS = 24 * 60 * 60 * 1000;
/** How long a contending request waits for an in-flight delivery to finish. */
const PENDING_WAIT_MS = 2500;

export interface IdempotencyRecord {
  hash: string;
  status: "pending" | "done";
  /** Epoch ms of the claim (retention is counted from here). */
  at: number;
  /** Completed deliveries for this id (0 or 1 when the store works). */
  deliveries: number;
  result?: unknown;
}

export type ClaimOutcome =
  | { state: "claimed" }
  | { state: "done"; record: IdempotencyRecord }
  | { state: "mismatch"; record: IdempotencyRecord }
  | { state: "pending"; record: IdempotencyRecord };

export function idempotencyDir(): string {
  return process.env.INQUIRY_IDEMPOTENCY_DIR || path.join(tmpdir(), "compass-inquiry-idempotency");
}

/** Stable fingerprint of the normalised message content. */
export function contentFingerprint(content: object): string {
  const ordered = Object.entries(content as Record<string, unknown>)
    .filter(([, v]) => typeof v === "string")
    .sort(([a], [b]) => (a < b ? -1 : 1));
  return createHash("sha256").update(JSON.stringify(ordered)).digest("hex");
}

function fileFor(id: string) {
  // ids are validated UUIDs before they reach here; belt and braces anyway
  return path.join(idempotencyDir(), `${id.replace(/[^0-9a-f-]/gi, "")}.json`);
}

function read(file: string): IdempotencyRecord | null {
  try {
    return JSON.parse(readFileSync(file, "utf8")) as IdempotencyRecord;
  } catch {
    return null;
  }
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Try to claim delivery for `id` with this content fingerprint.
 * Atomic: `openSync(..., "wx")` fails if the record exists, so of several
 * simultaneous callers exactly one gets `claimed`.
 */
export async function claim(id: string, hash: string): Promise<ClaimOutcome> {
  const dir = idempotencyDir();
  mkdirSync(dir, { recursive: true });
  const file = fileFor(id);
  const fresh: IdempotencyRecord = { hash, status: "pending", at: Date.now(), deliveries: 0 };
  try {
    const fd = openSync(file, "wx");
    writeSync(fd, JSON.stringify(fresh));
    closeSync(fd);
    return { state: "claimed" };
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== "EEXIST") throw err;
  }
  let record = read(file);
  if (!record || Date.now() - record.at > IDEMPOTENCY_RETENTION_MS) {
    // Expired (or unreadable): start over for this id.
    writeFileSync(file, JSON.stringify(fresh));
    return { state: "claimed" };
  }
  if (record.hash !== hash) return { state: "mismatch", record };
  if (record.status === "done") return { state: "done", record };
  // Another request is delivering this very message right now. Give it a
  // moment; if it finishes, this is a duplicate; otherwise say so.
  const deadline = Date.now() + PENDING_WAIT_MS;
  while (Date.now() < deadline) {
    await sleep(100);
    record = read(file);
    if (!record) return { state: "claimed" }; // the other side released it (its send failed)
    if (record.status === "done") return { state: "done", record };
    if (record.hash !== hash) return { state: "mismatch", record };
  }
  return { state: "pending", record };
}

/** Delivery succeeded: record it so every later attempt with this id is a duplicate. */
export function complete(id: string, result?: unknown): void {
  const file = fileFor(id);
  const prev = read(file);
  const record: IdempotencyRecord = {
    hash: prev?.hash ?? "",
    status: "done",
    at: prev?.at ?? Date.now(),
    deliveries: (prev?.deliveries ?? 0) + 1,
    result,
  };
  writeFileSync(file, JSON.stringify(record));
}

/** Delivery failed before the provider accepted it: forget the claim so a retry can send. */
export function release(id: string): void {
  try {
    unlinkSync(fileFor(id));
  } catch {
    /* already gone */
  }
}

/** For diagnostics and tests. */
export function readRecord(id: string): IdempotencyRecord | null {
  return read(fileFor(id));
}
