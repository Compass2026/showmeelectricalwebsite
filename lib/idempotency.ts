import { closeSync, mkdirSync, openSync, readFileSync, renameSync, unlinkSync, writeFileSync, writeSync } from "node:fs";
import { createHash, randomUUID } from "node:crypto";
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
 *     response answers `done` (a duplicate) without delivering again;
 *   - the SAME id with DIFFERENT content is refused explicitly
 *     (`mismatch`), never reported as success;
 *   - SIMULTANEOUS requests for one id contend on atomic file creation or
 *     an atomic rename: exactly one becomes the OWNER of the pending lease;
 *     the others wait briefly for its result or are told `pending`.
 *
 * Ownership. A claim is a lease held by an owner token. A pending lease is
 * valid for `PENDING_LEASE_MS`; after that the sender is presumed
 * interrupted (crash, timeout) and any retry may take the lease over —
 * atomically, so of several takers exactly one wins. `complete()` and
 * `release()` act only for the current owner; a stale owner's late calls
 * are ignored. Every path that finds no usable record (missing, unreadable,
 * expired, abandoned) goes back through acquisition; nothing is ever
 * reported as `claimed` without holding the lease.
 *
 * Records live as one JSON file per id under `INQUIRY_IDEMPOTENCY_DIR`
 * (default `<os tmpdir>/compass-inquiry-idempotency`) and survive process
 * restarts and separate handler instances that share that directory. On a
 * serverless platform instances do NOT share a disk, so this store is the
 * local layer only; the cross-instance guard there is the email provider's
 * own idempotency key, which the route passes on every send (Resend keeps
 * a key for 24 hours). Completed records are kept for that same window.
 */
export const IDEMPOTENCY_RETENTION_MS = 24 * 60 * 60 * 1000;
/** A pending lease older than this belongs to an interrupted sender and may be taken over. */
export const PENDING_LEASE_MS = 60 * 1000;
/** How long a contending request waits for an in-flight delivery to finish. */
const PENDING_WAIT_MS = 2500;
const POLL_MS = 100;

export interface IdempotencyRecord {
  hash: string;
  status: "pending" | "done";
  /** Epoch ms of the (latest) claim; the lease and retention count from here. */
  at: number;
  /** Token of the request that holds or held the lease. */
  owner: string;
  /** Completed deliveries for this id (0 or 1 when the store works). */
  deliveries: number;
  result?: unknown;
}

export type ClaimOutcome =
  | { state: "claimed"; owner: string }
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
    const r = JSON.parse(readFileSync(file, "utf8")) as Partial<IdempotencyRecord>;
    if (typeof r.hash !== "string" || typeof r.at !== "number" || (r.status !== "pending" && r.status !== "done")) return null;
    return { hash: r.hash, status: r.status, at: r.at, owner: typeof r.owner === "string" ? r.owner : "", deliveries: r.deliveries ?? 0, result: r.result };
  } catch {
    return null;
  }
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function isAbandoned(record: IdempotencyRecord, now: number) {
  return record.status === "pending" && now - record.at > PENDING_LEASE_MS;
}
function isExpired(record: IdempotencyRecord, now: number) {
  return record.status === "done" && now - record.at > IDEMPOTENCY_RETENTION_MS;
}

/** Create the record only if none exists (O_EXCL). True = this owner holds the lease. */
function tryCreate(file: string, record: IdempotencyRecord): boolean {
  try {
    const fd = openSync(file, "wx");
    writeSync(fd, JSON.stringify(record));
    closeSync(fd);
    return true;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "EEXIST") return false;
    throw err;
  }
}

/**
 * Replace an abandoned/expired/unreadable record. Write to a private temp
 * file and rename it over the record: rename is atomic, so when several
 * takers race, the file ends up holding exactly one of their records. Each
 * re-reads and only the one whose owner token survived holds the lease.
 */
function tryTakeOver(file: string, record: IdempotencyRecord): boolean {
  const tmp = `${file}.${record.owner}.tmp`;
  writeFileSync(tmp, JSON.stringify(record));
  try {
    renameSync(tmp, file);
  } catch {
    try { unlinkSync(tmp); } catch { /* ignore */ }
    return false;
  }
  return read(file)?.owner === record.owner;
}

/**
 * Acquire the delivery lease for `id` with this content fingerprint, or
 * learn why not. Loops until it either holds the lease, finds a completed
 * matching delivery, finds a different message under the id, or has waited
 * long enough on a live sender. Never returns `claimed` without ownership.
 */
export async function claim(id: string, hash: string): Promise<ClaimOutcome> {
  const dir = idempotencyDir();
  mkdirSync(dir, { recursive: true });
  const file = fileFor(id);
  const owner = randomUUID();
  const deadline = Date.now() + PENDING_WAIT_MS;

  for (;;) {
    const now = Date.now();
    const mine: IdempotencyRecord = { hash, status: "pending", at: now, owner, deliveries: 0 };

    if (tryCreate(file, mine)) return { state: "claimed", owner };

    const record = read(file);
    if (!record || isExpired(record, now) || isAbandoned(record, now)) {
      // Nothing usable: an unreadable file, a delivery older than the
      // retention window, or a sender that never finished. Take the lease
      // over atomically; if someone else wins the race, go round again and
      // observe what they wrote.
      if (!record && tryCreate(file, mine)) return { state: "claimed", owner };
      if (tryTakeOver(file, mine)) return { state: "claimed", owner };
      continue;
    }
    if (record.hash !== hash) return { state: "mismatch", record };
    if (record.status === "done") return { state: "done", record };
    // A live sender holds the lease for this very message. Give it a
    // moment, then re-evaluate from the top (it may finish, fail and
    // release, or exceed its lease).
    if (Date.now() >= deadline) return { state: "pending", record };
    await sleep(POLL_MS);
  }
}

/** Delivery succeeded: the OWNER records it so every later attempt with this id is a duplicate. */
export function complete(id: string, owner: string, result?: unknown): boolean {
  const file = fileFor(id);
  const prev = read(file);
  if (!prev || prev.owner !== owner) return false; // the lease moved on; a stale sender does not overwrite
  const record: IdempotencyRecord = { ...prev, status: "done", deliveries: prev.deliveries + 1, result };
  writeFileSync(file, JSON.stringify(record));
  return true;
}

/** Delivery failed before the provider accepted it: the OWNER forgets the lease so a retry can send. */
export function release(id: string, owner: string): boolean {
  const file = fileFor(id);
  const prev = read(file);
  if (!prev || prev.owner !== owner) return false;
  try {
    unlinkSync(file);
  } catch {
    /* already gone */
  }
  return true;
}

/** For diagnostics and tests. */
export function readRecord(id: string): IdempotencyRecord | null {
  return read(fileFor(id));
}

/** For tests: write a record as if left behind by another process. */
export function seedRecord(id: string, record: IdempotencyRecord): void {
  mkdirSync(idempotencyDir(), { recursive: true });
  writeFileSync(fileFor(id), JSON.stringify(record));
}
