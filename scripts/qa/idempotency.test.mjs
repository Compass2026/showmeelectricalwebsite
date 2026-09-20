#!/usr/bin/env node
/**
 * Module-level acceptance tests for the inquiry idempotency layer —
 * lib/idempotency.ts (local lease store) and lib/mock-provider.ts (the
 * mocked provider-call path). No server, no network, nothing delivered.
 *
 *   npx tsx scripts/qa/idempotency.test.mjs
 *
 * What must hold (C1 recovery contract):
 *   - an ABANDONED pending claim (sender interrupted; lease expired) is
 *     recoverable at once, not after the 24 h retention window;
 *   - after a failed sender RELEASES its claim, several waiters cannot all
 *     acquire ownership — exactly one does, and the rest see its result;
 *   - the same holds for takers of an abandoned lease, an unreadable record
 *     and an expired completed record: acquisition is atomic on every path;
 *   - completion and release are honoured only for the current owner;
 *   - a live sender is still reported as `pending`, never taken over early;
 *   - the mocked provider enforces the key contract the real provider does:
 *     same key + same payload → original id (duplicate), same key +
 *     different payload → invalid_idempotent_request, in flight → concurrent.
 * Exit 1 on any failure.
 */
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

process.env.INQUIRY_IDEMPOTENCY_DIR = mkdtempSync(path.join(tmpdir(), "idem-test-"));
process.env.INQUIRY_MOCK_PROVIDER_DIR = mkdtempSync(path.join(tmpdir(), "idem-mock-"));

const { claim, complete, release, readRecord, seedRecord, contentFingerprint, PENDING_LEASE_MS, IDEMPOTENCY_RETENTION_MS } = await import("../../lib/idempotency.ts");
const { mockSend, mockSends } = await import("../../lib/mock-provider.ts");

let failures = 0;
const check = (name, ok, detail = "") => { console.log(`${ok ? "ok  " : "FAIL"} ${name}${detail ? ` — ${detail}` : ""}`); if (!ok) failures++; };
const uuid = () => crypto.randomUUID();
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const hash = contentFingerprint({ name: "QA", details: "Mocked. Not a real inquiry.", email: "qa@example.test" });
const otherHash = contentFingerprint({ name: "QA", details: "Different wording.", email: "qa@example.test" });
/** A contender that, if it wins the lease, completes at once — so the losers observe `done`. */
const contender = (id, h = hash) => claim(id, h).then((o) => { if (o.state === "claimed") complete(id, o.owner, { via: "test" }); return o; });
const tally = (outcomes) => Object.fromEntries(["claimed", "done", "mismatch", "pending"].map((s) => [s, outcomes.filter((o) => o.state === s).length]));

console.log("# Abandoned lease recovery");
{
  const id = uuid();
  const tenMinutesAgo = Date.now() - 10 * 60 * 1000;
  seedRecord(id, { hash, status: "pending", at: tenMinutesAgo, owner: "crashed-sender", deliveries: 0 });
  const t0 = Date.now();
  const o = await claim(id, hash);
  const took = Date.now() - t0;
  check("pending claim abandoned 10 min ago (same content) → claimed at once, not after 24 h", o.state === "claimed" && took < 1000, `${o.state} in ${took} ms (lease ${PENDING_LEASE_MS / 1000} s)`);
  check("the record now carries the new owner", readRecord(id)?.owner === o.owner && readRecord(id)?.status === "pending");
  check("the interrupted sender's late complete() is refused", complete(id, "crashed-sender", {}) === false && readRecord(id)?.status === "pending");
  check("the interrupted sender's late release() is refused", release(id, "crashed-sender") === false && readRecord(id) !== null);
  check("the new owner completes", complete(id, o.owner, { ok: true }) === true && readRecord(id)?.deliveries === 1);
  check("an unchanged retry after that → done (duplicate)", (await claim(id, hash)).state === "done");

  const id2 = uuid();
  seedRecord(id2, { hash: otherHash, status: "pending", at: tenMinutesAgo, owner: "crashed-sender", deliveries: 0 });
  check("an abandoned claim for DIFFERENT content is recoverable too (nothing was delivered under it)", (await claim(id2, hash)).state === "claimed");
}

console.log("\n# Ownership after release — several waiters");
{
  const id = uuid();
  const a = await claim(id, hash);
  check("first sender claims", a.state === "claimed");
  const waiters = Array.from({ length: 5 }, () => contender(id));
  await wait(300);
  check("first sender fails and releases its claim", release(id, a.owner) === true);
  const outcomes = await Promise.all(waiters);
  const t = tally(outcomes);
  check("exactly ONE waiter acquires ownership", t.claimed === 1, JSON.stringify(t));
  check("the other waiters see its completed result, never a claim of their own", t.done === 4 && t.pending === 0, JSON.stringify(t));
  check("one delivery recorded", readRecord(id)?.deliveries === 1 && readRecord(id)?.status === "done", JSON.stringify(readRecord(id)));
}

console.log("\n# Atomic acquisition on every recovery path");
{
  const id = uuid();
  seedRecord(id, { hash, status: "pending", at: Date.now() - PENDING_LEASE_MS - 5000, owner: "crashed-sender", deliveries: 0 });
  const t = tally(await Promise.all(Array.from({ length: 6 }, () => contender(id))));
  check("6 simultaneous takers of an ABANDONED lease → one claimed, five done", t.claimed === 1 && t.done === 5, JSON.stringify(t));
  check("one delivery recorded", readRecord(id)?.deliveries === 1);

  const id2 = uuid();
  seedRecord(id2, { hash, status: "done", at: 0, owner: "x", deliveries: 1 });
  writeFileSync(path.join(process.env.INQUIRY_IDEMPOTENCY_DIR, `${id2}.json`), "{not json");
  const t2 = tally(await Promise.all(Array.from({ length: 6 }, () => contender(id2))));
  check("6 simultaneous claims on an UNREADABLE record → one claimed, five done", t2.claimed === 1 && t2.done === 5, JSON.stringify(t2));

  const id3 = uuid();
  seedRecord(id3, { hash, status: "done", at: Date.now() - IDEMPOTENCY_RETENTION_MS - 5000, owner: "x", deliveries: 1, result: { old: true } });
  const t3 = tally(await Promise.all(Array.from({ length: 6 }, () => contender(id3))));
  check("6 simultaneous claims on an EXPIRED completed record → one claimed, five done", t3.claimed === 1 && t3.done === 5, JSON.stringify(t3));
  check("the expired record was replaced (deliveries restart at 1)", readRecord(id3)?.deliveries === 1 && readRecord(id3)?.result?.via === "test", JSON.stringify(readRecord(id3)));

  const id4 = uuid();
  const t4 = tally(await Promise.all(Array.from({ length: 6 }, () => contender(id4))));
  check("6 simultaneous claims on a MISSING record → one claimed, five done", t4.claimed === 1 && t4.done === 5, JSON.stringify(t4));
}

console.log("\n# Explicit outcomes are unchanged");
{
  const id = uuid();
  const a = await claim(id, hash);
  complete(id, a.owner, { id: "sent-1" });
  check("same id + same content after delivery → done with the stored result", (await claim(id, hash)).state === "done" && readRecord(id)?.result?.id === "sent-1");
  check("same id + DIFFERENT content after delivery → mismatch (explicit, no claim)", (await claim(id, otherHash)).state === "mismatch");
  const id2 = uuid();
  const b = await claim(id2, hash);
  check("same id + different content while a live sender holds the lease → mismatch", (await claim(id2, otherHash)).state === "mismatch");
  const t0 = Date.now();
  const p = await claim(id2, hash);
  check("same id + same content while a LIVE sender holds the lease → pending after the wait (never taken over early)", p.state === "pending" && Date.now() - t0 >= 2000 && readRecord(id2)?.owner === b.owner, `${p.state} after ${Date.now() - t0} ms`);
  check("wrong owner cannot complete or release a live lease", complete(id2, "someone-else", {}) === false && release(id2, "someone-else") === false && readRecord(id2)?.owner === b.owner);
  check("the owner can release", release(id2, b.owner) === true && readRecord(id2) === null);
  check("release of a record that is gone → false", release(id2, b.owner) === false);
}

console.log("\n# Mocked provider: idempotency-key contract on the real call path");
{
  const key = `inquiry/${uuid()}`;
  const payload = { from: "a@example.test", to: ["b@example.test"], subject: "QA", text: "Mocked. Not a real inquiry." };
  const first = await mockSend(payload, { idempotencyKey: key });
  check("first send → id, not a duplicate", first.error === null && /^mock_/.test(first.data?.id ?? "") && first.duplicate === false, JSON.stringify(first));
  const again = await mockSend(payload, { idempotencyKey: key });
  check("same key + same payload → the ORIGINAL id, flagged duplicate, nothing sent again", again.error === null && again.data?.id === first.data.id && again.duplicate === true && mockSends(key) === 1, JSON.stringify(again));
  const changed = await mockSend({ ...payload, text: "Changed." }, { idempotencyKey: key });
  check("same key + different payload → invalid_idempotent_request, nothing sent", changed.data === null && changed.error?.name === "invalid_idempotent_request" && mockSends(key) === 1, JSON.stringify(changed));
  const key2 = `inquiry/${uuid()}`;
  const race = await Promise.all([mockSend(payload, { idempotencyKey: key2 }), mockSend(payload, { idempotencyKey: key2 })]);
  const ok = race.filter((r) => r.error === null).length;
  const concurrent = race.filter((r) => r.error?.name === "concurrent_idempotent_requests").length;
  check("two simultaneous sends with one key → one accepted, one concurrent_idempotent_requests", ok === 1 && concurrent === 1 && mockSends(key2) === 1, JSON.stringify(race.map((r) => r.error?.name ?? "ok")));
  const bare = await mockSend(payload);
  check("no key → plain send (no ledger)", bare.error === null && bare.duplicate === false);
  // The ledger is plain JSON on disk, shared across handler instances on one machine.
  const ledger = JSON.parse(readFileSync(path.join(process.env.INQUIRY_MOCK_PROVIDER_DIR, `${key.replace(/[^0-9a-z-]/gi, "_")}.json`), "utf8"));
  check("ledger records one send for the key", ledger.sends === 1 && ledger.status === "sent" && ledger.id === first.data.id, JSON.stringify(ledger));
}

console.log(failures ? `\n${failures} FAILED` : "\nALL PASSED");
process.exit(failures ? 1 : 0);
