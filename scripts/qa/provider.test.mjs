#!/usr/bin/env node
/**
 * Provider-path acceptance tests for inquiry delivery — lib/email-provider.ts
 * against the shared mock provider service (scripts/qa/mock-provider.mjs).
 * No Next.js server; nothing is delivered.
 *
 *   npx tsx scripts/qa/provider.test.mjs
 *
 * The provider's idempotency key is the only duplicate guard, so what must
 * hold is the provider contract as seen THROUGH the adapter the route uses:
 *   - same key + same payload → the ORIGINAL accepted result, one send;
 *   - same key + different payload → invalid_idempotent_request;
 *   - same key while a send is in flight → concurrent_idempotent_requests;
 *   - INDEPENDENT handlers (separate worker threads, each with its own
 *     adapter instance and no shared local state) sending the same key at
 *     once → exactly one send; every later unchanged retry from any of them
 *     receives the original id;
 *   - the reviewer's two-worker interleaving (second worker acts while the
 *     first is mid-send, or after it finished) can never produce two sends;
 *   - provider errors map to the route's explicit conflict codes;
 *   - the in-process memory mock (used when no service is running) applies
 *     the same contract.
 * Exit 1 on any failure.
 */
import { Worker, isMainThread, parentPort, workerData } from "node:worker_threads";

const PROVIDER = new URL("../../lib/email-provider.ts", import.meta.url).href;

if (!isMainThread) {
  // An independent handler: its own adapter instance, no shared state,
  // sends when told and reports the provider's answer.
  const { httpMockProvider } = await import(PROVIDER);
  const provider = httpMockProvider(workerData.url);
  parentPort.on("message", async ({ payload, key, delayMs = 0 }) => {
    if (delayMs) await new Promise((r) => setTimeout(r, delayMs));
    const result = await provider.send(payload, { idempotencyKey: key });
    parentPort.postMessage(result);
  });
  parentPort.postMessage("ready");
} else {
  const { createMockProvider } = await import("./mock-provider.mjs");
  const { httpMockProvider, memoryMockProvider, providerConflict } = await import(PROVIDER);

  let failures = 0;
  const check = (name, ok, detail = "") => { console.log(`${ok ? "ok  " : "FAIL"} ${name}${detail ? ` — ${detail}` : ""}`); if (!ok) failures++; };
  const uuid = () => crypto.randomUUID();
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const payload = { from: "QA <qa@example.test>", to: ["inbox@example.test"], replyTo: "visitor@example.test", subject: "QA — mocked", html: "<p>Mocked. Not a real inquiry.</p>", text: "Mocked. Not a real inquiry." };
  const edited = { ...payload, text: "Edited wording.", html: "<p>Edited wording.</p>" };
  const kinds = (results) => results.map((r) => (r.error ? r.error.name : r.duplicate ? "duplicate" : "sent"));
  const tally = (results) => Object.fromEntries(["sent", "duplicate", "concurrent_idempotent_requests", "invalid_idempotent_request"].map((k) => [k, kinds(results).filter((x) => x === k).length]));

  const service = createMockProvider();
  const url = await service.listen(0);
  const sends = async (key) => (await (await fetch(`${url}/ledger/${encodeURIComponent(key)}`)).json()).sends ?? 0;

  console.log("# Adapter ↔ mock provider service: the key contract");
  {
    const provider = httpMockProvider(url);
    const key = `inquiry/${uuid()}`;
    const first = await provider.send(payload, { idempotencyKey: key });
    check("first send → accepted with an id", first.error === null && /^mock_/.test(first.data?.id ?? "") && !first.duplicate, JSON.stringify(first));
    const again = await provider.send(payload, { idempotencyKey: key });
    check("unchanged retry (delivery accepted, response lost) → the ORIGINAL id, flagged duplicate, one send", again.error === null && again.data?.id === first.data.id && again.duplicate === true && (await sends(key)) === 1, JSON.stringify(again));
    const changed = await provider.send(edited, { idempotencyKey: key });
    check("same key + changed payload → invalid_idempotent_request, nothing sent", changed.data === null && changed.error?.name === "invalid_idempotent_request" && (await sends(key)) === 1, JSON.stringify(changed));
    check("…which the route maps to 409 submission_changed", providerConflict(changed.error) === "submission_changed");
    const key2 = `inquiry/${uuid()}`;
    const race = await Promise.all([provider.send(payload, { idempotencyKey: key2 }), provider.send(payload, { idempotencyKey: key2 })]);
    check("two simultaneous sends, one key → one accepted, one concurrent_idempotent_requests", tally(race).sent === 1 && tally(race).concurrent_idempotent_requests === 1 && (await sends(key2)) === 1, JSON.stringify(kinds(race)));
    check("…which the route maps to 409 in_progress", providerConflict(race.find((r) => r.error)?.error) === "in_progress");
    check("an unrelated provider error is not a conflict", providerConflict({ name: "validation_error", message: "bad address" }) === null && providerConflict(null) === null);
    const bare = await provider.send(payload);
    check("no key → plain send", bare.error === null && !bare.duplicate);
  }

  console.log("\n# Independent handlers (worker threads, isolated state) under one key");
  const workers = await Promise.all(Array.from({ length: 4 }, () => new Promise((resolve, reject) => {
    const w = new Worker(new URL(import.meta.url), { workerData: { url } });
    w.once("message", (m) => (m === "ready" ? resolve(w) : reject(new Error(String(m)))));
    w.once("error", reject);
  })));
  const ask = (w, msg) => new Promise((resolve) => { w.once("message", resolve); w.postMessage(msg); });
  {
    const key = `inquiry/${uuid()}`;
    const burst = await Promise.all(workers.map((w) => ask(w, { payload, key })));
    const t = tally(burst);
    check("4 handlers send the same message + key at once → exactly ONE send", t.sent === 1 && (await sends(key)) === 1, JSON.stringify(kinds(burst)));
    check("the other handlers receive the original result or an explicit in-progress conflict, never a second send", t.sent + t.duplicate + t.concurrent_idempotent_requests === 4 && t.invalid_idempotent_request === 0, JSON.stringify(t));
    await wait(200);
    const retries = await Promise.all(workers.map((w) => ask(w, { payload, key })));
    const originalId = burst.find((r) => r.data && !r.duplicate)?.data.id;
    check("every handler's later unchanged retry receives the ORIGINAL accepted id", retries.every((r) => r.error === null && r.data?.id === originalId && r.duplicate === true) && (await sends(key)) === 1, JSON.stringify(retries.map((r) => r.data?.id)));
    const changes = await Promise.all(workers.map((w) => ask(w, { payload: edited, key })));
    check("every handler's changed-content retry under the used key is refused", changes.every((r) => r.error?.name === "invalid_idempotent_request") && (await sends(key)) === 1, JSON.stringify(kinds(changes)));
  }
  {
    // The reviewer's interleaving: two workers, the second acting after the first has begun.
    const [a, b] = workers;
    const key = `inquiry/${uuid()}`;
    const mid = await Promise.all([ask(a, { payload, key }), ask(b, { payload, key, delayMs: 50 })]);
    check("worker B sends 50 ms into worker A's send → A accepted, B in progress; one send", kinds(mid)[0] === "sent" && kinds(mid)[1] === "concurrent_idempotent_requests" && (await sends(key)) === 1, JSON.stringify(kinds(mid)));
    const key2 = `inquiry/${uuid()}`;
    const late = await Promise.all([ask(a, { payload, key: key2 }), ask(b, { payload, key: key2, delayMs: 300 })]);
    check("worker B sends 300 ms after worker A → B receives A's original id; one send", late[0].data?.id && late[1].data?.id === late[0].data.id && late[1].duplicate === true && (await sends(key2)) === 1, JSON.stringify(kinds(late)));
  }
  await Promise.all(workers.map((w) => w.terminate()));

  console.log("\n# In-process memory mock (no service running) applies the same contract");
  {
    const provider = memoryMockProvider();
    const key = `inquiry/${uuid()}`;
    const first = await provider.send(payload, { idempotencyKey: key });
    const again = await provider.send(payload, { idempotencyKey: key });
    const changed = await provider.send(edited, { idempotencyKey: key });
    const key2 = `inquiry/${uuid()}`;
    const race = await Promise.all([provider.send(payload, { idempotencyKey: key2 }), provider.send(payload, { idempotencyKey: key2 })]);
    check("unchanged retry → original id, duplicate", first.error === null && again.data?.id === first.data.id && again.duplicate === true);
    check("changed payload → invalid_idempotent_request", changed.error?.name === "invalid_idempotent_request");
    check("simultaneous → one accepted, one concurrent", tally(race).sent === 1 && tally(race).concurrent_idempotent_requests === 1, JSON.stringify(kinds(race)));
  }

  await service.close();
  console.log(failures ? `\n${failures} FAILED` : "\nALL PASSED");
  process.exit(failures ? 1 : 0);
}
