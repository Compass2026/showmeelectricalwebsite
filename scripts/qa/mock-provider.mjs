#!/usr/bin/env node
/**
 * MOCK EMAIL PROVIDER SERVICE for QA — the authoritative shared test double.
 *
 *   node scripts/qa/mock-provider.mjs [--port 3999]
 *
 * One process with in-memory state that every handler instance under test
 * talks to over HTTP, the way every real handler instance talks to the real
 * provider. It implements the provider's idempotency-key contract
 * (https://resend.com/docs/dashboard/emails/idempotency-keys):
 *
 *   POST /emails   body: the email payload; header Idempotency-Key optional
 *     200 { id }                                   first send for the key (or no key)
 *     200 { id, duplicate: true }                  same key + same payload → the ORIGINAL id, nothing sent again
 *     422 { name: "invalid_idempotent_request" }   same key + different payload
 *     409 { name: "concurrent_idempotent_requests" } same key while a send is in flight
 *   GET  /ledger/<key>   { sends, id, status, hash } — how many times the key actually "sent" (tests)
 *   GET  /ledger         every key
 *   GET  /health         { ok: true, keys }
 *
 * Because all state lives in ONE process, exclusivity needs no lock: the
 * event loop serialises the check-then-set for a key, and a 150 ms
 * processing window keeps a second concurrent caller visibly "in progress".
 * Keys are kept for 24 h. Nothing is delivered anywhere.
 */
import { createServer } from "node:http";
import { createHash, randomUUID } from "node:crypto";

const RETENTION_MS = 24 * 60 * 60 * 1000;
const PROCESSING_MS = 150;

export function createMockProvider() {
  const ledger = new Map(); // key → { hash, status, id, sends, at }
  const hashOf = (payload) => createHash("sha256").update(JSON.stringify([payload.from, payload.to, payload.replyTo ?? null, payload.subject, payload.html, payload.text])).digest("hex");
  const json = (res, status, body) => { res.writeHead(status, { "content-type": "application/json" }); res.end(JSON.stringify(body)); };
  const readBody = (req) => new Promise((resolve, reject) => { let s = ""; req.on("data", (c) => (s += c)); req.on("end", () => resolve(s)); req.on("error", reject); });

  const server = createServer(async (req, res) => {
    const url = new URL(req.url, "http://localhost");
    if (req.method === "GET" && url.pathname === "/health") return json(res, 200, { ok: true, keys: ledger.size });
    if (req.method === "GET" && url.pathname === "/ledger") return json(res, 200, Object.fromEntries(ledger));
    if (req.method === "GET" && url.pathname.startsWith("/ledger/")) {
      const key = decodeURIComponent(url.pathname.slice("/ledger/".length));
      return json(res, 200, ledger.get(key) ?? { sends: 0 });
    }
    if (req.method === "POST" && url.pathname === "/emails") {
      let payload;
      try { payload = JSON.parse(await readBody(req)); } catch { return json(res, 400, { name: "validation_error", message: "Invalid JSON body." }); }
      const key = req.headers["idempotency-key"];
      const id = `mock_${randomUUID()}`;
      if (!key) { console.log("[mock-provider] send (no key)", id); return json(res, 200, { id }); }
      const now = Date.now();
      const hash = hashOf(payload);
      const prev = ledger.get(key);
      if (prev && now - prev.at > RETENTION_MS) ledger.delete(key);
      const current = ledger.get(key);
      if (current) {
        if (current.hash !== hash) return json(res, 422, { name: "invalid_idempotent_request", message: "Idempotency key was used with a different payload." });
        if (current.status === "sending") return json(res, 409, { name: "concurrent_idempotent_requests", message: "A request with this idempotency key is already in progress." });
        return json(res, 200, { id: current.id, duplicate: true });
      }
      ledger.set(key, { hash, status: "sending", id, sends: 1, at: now });
      await new Promise((r) => setTimeout(r, PROCESSING_MS));
      ledger.set(key, { hash, status: "sent", id, sends: 1, at: now });
      console.log("[mock-provider] send", id, key);
      return json(res, 200, { id });
    }
    json(res, 404, { name: "not_found", message: "Unknown endpoint." });
  });

  return {
    server,
    ledger,
    /** Listen on `port` (0 = any free port); resolves the base URL. */
    listen: (port = 0) => new Promise((resolve, reject) => { server.once("error", reject); server.listen(port, "127.0.0.1", () => resolve(`http://127.0.0.1:${server.address().port}`)); }),
    close: () => new Promise((resolve) => server.close(() => resolve())),
  };
}

if (process.argv[1] && import.meta.url.endsWith(process.argv[1].split("/").pop())) {
  const i = process.argv.indexOf("--port");
  const port = i > -1 ? Number(process.argv[i + 1]) : 3999;
  const provider = createMockProvider();
  provider.listen(port).then((url) => console.log(`mock provider listening at ${url} (nothing is delivered)`));
}
