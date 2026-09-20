#!/usr/bin/env node
/**
 * Mocked action tests for the inquiry form — Build Standard §12 / Library §15.
 *
 *   node scripts/qa/forms.test.mjs <base-url> [--host hostname] [--no-second-instance]
 *
 * Runs against a server started with INQUIRY_DELIVERY=mock and
 * INQUIRY_MOCK_PROVIDER_URL pointing at the mock provider SERVICE
 * (scripts/qa/mock-provider.mjs) — never a real provider. This script needs
 * the same INQUIRY_MOCK_PROVIDER_URL to read the service's ledger. Three layers:
 *   1. API contract (fetch): validation codes, honeypot, cross-origin, rate
 *      limit shape.
 *   2. Idempotency (fetch, mocked delivery through the provider adapter):
 *      the provider key is the only guard. Simultaneous requests deliver
 *      once and the rest are the original result or an explicit in-progress
 *      conflict; a retry after "delivery accepted but response lost"
 *      receives the original id; the same id with changed content is
 *      refused; a malformed id is ignored; stale or corrupt records left by
 *      the former local store cannot block a send; a retry through a FRESH
 *      handler instance (a second server process started by this script
 *      from the same build, sharing nothing but the provider) receives the
 *      original result, and concurrent requests split across the two
 *      instances still send once. Delivery counts come from the mock
 *      service's ledger. Adapter-level cases live in ./provider.test.mjs.
 *   3. Browser behaviour (Playwright + Chromium via ./browser-launch.mjs):
 *      errors readable and associated with fields, focus on the first
 *      invalid field, input survives a failure, a retry after a network
 *      failure succeeds ONCE with the same submission id, an EDITED message
 *      after an ambiguous failure gets a NEW id, a server-returned
 *      validation error preserves input and focuses the field, success only
 *      after {ok:true}, and a second click during submission sends once.
 * Exit 1 on any failure. Scripted automation, not an AI-agent trial.
 */
import { spawn } from "node:child_process";
import { mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { createServer } from "node:net";
import { launchChromium } from "./browser-launch.mjs";

/** An unused TCP port for the second handler instance. */
const freePort = () => new Promise((resolve, reject) => { const srv = createServer(); srv.listen(0, "127.0.0.1", () => { const { port } = srv.address(); srv.close(() => resolve(port)); }); srv.on("error", reject); });
/** Stop a child process and wait for it to exit (SIGKILL after 3 s). */
const stop = (child) => new Promise((resolve) => { if (child.exitCode !== null) return resolve(); const t = setTimeout(() => child.kill("SIGKILL"), 3000); child.once("exit", () => { clearTimeout(t); resolve(); }); child.kill("SIGTERM"); });

const args = process.argv.slice(2);
const base = args[0] ?? "http://localhost:3000";
const hostArg = args.indexOf("--host");
const host = hostArg > -1 ? args[hostArg + 1] : null;
const secondInstance = !args.includes("--no-second-instance");
const browserBase = host ? base.replace("localhost", `${host}.localhost`).replace("127.0.0.1", `${host}.localhost`) : base;
const headers = { "content-type": "application/json", ...(host ? { host } : {}) };
let failures = 0;
const check = (name, ok, detail = "") => { console.log(`${ok ? "ok  " : "FAIL"} ${name}${detail ? ` — ${detail}` : ""}`); if (!ok) failures++; };
const uuid = () => crypto.randomUUID();
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
// Every request gets its own forwarded IP, from a range chosen per run, so
// the per-IP rate limit (tested explicitly below) never interferes with the
// other checks — even when the suite runs repeatedly against one server.
let ipN = 0;
const runOctet = 1 + Math.floor(Math.random() * 200);
const nextIp = () => `10.${runOctet}.${Math.floor(ipN / 250)}.${(ipN++ % 250) + 1}`;
const postTo = (b, body, extra = {}) => fetch(`${b}/api/inquiry`, { method: "POST", headers: { ...headers, "x-forwarded-for": nextIp(), ...extra }, body: JSON.stringify(body) });
const post = (body, extra = {}) => postTo(base, body, extra);
const providerUrl = (process.env.INQUIRY_MOCK_PROVIDER_URL ?? "").replace(/\/$/, "");
if (!providerUrl) { console.error("forms.test: INQUIRY_MOCK_PROVIDER_URL is not set. Start `node scripts/qa/mock-provider.mjs`, start the site with INQUIRY_DELIVERY=mock and that URL, and pass the same URL to this script."); process.exit(1); }
try { if (!(await (await fetch(`${providerUrl}/health`)).json()).ok) throw new Error(); } catch { console.error(`forms.test: no mock provider service at ${providerUrl}`); process.exit(1); }
/** How many times the mock provider service actually "sent" for a submission id (its idempotency key). */
const sends = async (id) => (await (await fetch(`${providerUrl}/ledger/${encodeURIComponent(`inquiry/${id}`)}`)).json()).sends ?? 0;
const valid = (over = {}) => ({ name: "QA idempotency test", details: "Mocked delivery. Not a real inquiry.", email: "qa@example.test", ...over });

/* ---------- 1. API contract ---------- */
console.log("# API contract");
{
  let r = await post({});
  let j = await r.json();
  check("empty body → 400 with field codes", r.status === 400 && j.errors?.name === "required" && j.errors?.details === "required" && j.errors?.contact === "contact", JSON.stringify(j));
  r = await post({ name: "Test", details: "x", email: "nope", phone: "12" });
  j = await r.json();
  check("bad email + bad phone → invalid codes, no contact code", r.status === 400 && j.errors?.email === "invalid" && j.errors?.phone === "invalid" && !j.errors?.contact, JSON.stringify(j));
  r = await post({ name: "Test", details: "x", email: "a@b.co", service: "Not a real service" });
  j = await r.json();
  check("unknown service → invalid", r.status === 400 && j.errors?.service === "invalid", JSON.stringify(j));
  r = await post({ name: "Bot", details: "x", email: "a@b.co", website: "http://spam" });
  j = await r.json();
  check("honeypot filled → silent 200 ok (no delivery field)", r.status === 200 && j.ok === true && !("delivery" in j), JSON.stringify(j));
  r = await post({ name: "QA", details: "x", email: "a@b.co" }, { origin: "https://evil.example" });
  check("cross-origin POST → 403", r.status === 403, String(r.status));
  const ip = `10.${runOctet}.250.${1 + Math.floor(Math.random() * 250)}`;
  let last;
  for (let i = 0; i < 6; i++) last = await fetch(`${base}/api/inquiry`, { method: "POST", headers: { ...headers, "x-forwarded-for": ip }, body: JSON.stringify({ name: "QA", details: "x", email: "a@b.co" }) });
  check("6th message from one IP in the window → 429", last.status === 429, String(last.status));
}

/* ---------- 2. Idempotency (mocked delivery via the provider adapter) ---------- */
console.log("\n# Idempotency");
{
  // a) delivery accepted but the response was lost → the retry receives the original result
  const id = uuid();
  let r = await post(valid({ submissionId: id }));
  let j = await r.json();
  const firstId = j.id;
  check("valid message → 200 {ok:true, delivery:'mock', id}", r.status === 200 && j.ok === true && j.delivery === "mock" && /^mock_/.test(j.id ?? ""), JSON.stringify(j));
  r = await post(valid({ submissionId: id }));
  j = await r.json();
  check("retry after lost response (same id, same content) → ok with the ORIGINAL provider id, flagged duplicate", r.status === 200 && j.ok === true && j.id === firstId && j.duplicate === true, JSON.stringify(j));
  check("mock provider received exactly one send for the id's key", (await sends(id)) === 1, `sends=${await sends(id)}`);

  // b) same id, different content → explicit refusal, no delivery
  r = await post(valid({ submissionId: id, details: "Edited message under the OLD id. Must not be sent." }));
  j = await r.json();
  check("same id + different content → 409 submission_changed (not a silent success)", r.status === 409 && j.ok === false && j.code === "submission_changed" && /changed/i.test(j.error ?? ""), JSON.stringify(j));
  check("changed content did not deliver", (await sends(id)) === 1);

  // c) an id cannot launder an invalid message
  r = await post({ name: "QA", details: "x", submissionId: id });
  j = await r.json();
  check("known id cannot launder an invalid message → 400", r.status === 400 && j.errors, JSON.stringify(j));

  // d) malformed id is ignored (message still delivered, no key)
  r = await post(valid({ submissionId: "not-a-uuid" }));
  j = await r.json();
  check("malformed submissionId is ignored, message still delivered", r.status === 200 && j.ok === true && j.delivery === "mock", JSON.stringify(j));

  // e) simultaneous requests for one id deliver exactly once
  const cid = uuid();
  const results = await Promise.all(Array.from({ length: 6 }, () => postTo(base, valid({ submissionId: cid })).then(async (res) => ({ status: res.status, body: await res.json() }))));
  const delivered = results.filter((x) => x.status === 200 && x.body.delivery === "mock" && !x.body.duplicate).length;
  const dups = results.filter((x) => x.status === 200 && x.body.duplicate === true).length;
  const inProgress = results.filter((x) => x.status === 409 && x.body.code === "in_progress").length;
  check("6 simultaneous requests, one id → exactly one delivery", delivered === 1 && (await sends(cid)) === 1, `delivered=${delivered} duplicate=${dups} in_progress=${inProgress}`);
  check("the others receive the original result or an explicit in_progress conflict, never a second send", delivered + dups + inProgress === 6, JSON.stringify(results.map((x) => x.status)));

  // f) records left behind by the FORMER local claim store — stale pending,
  //    "done", corrupt — must not block or fake anything: the route consults
  //    no local record before the provider.
  const staleDir = path.join(tmpdir(), "compass-inquiry-idempotency");
  mkdirSync(staleDir, { recursive: true });
  const stale = [
    [uuid(), JSON.stringify({ hash: "x", status: "pending", at: Date.now() - 10 * 60 * 1000, owner: "crashed-sender", deliveries: 0 })],
    [uuid(), JSON.stringify({ hash: "x", status: "done", at: Date.now(), owner: "someone", deliveries: 1, result: { id: "fake" } })],
    [uuid(), "{not json"],
  ];
  for (const [sid, body] of stale) writeFileSync(path.join(staleDir, `${sid}.json`), body);
  const before = readdirSync(staleDir).length;
  const staleResults = await Promise.all(stale.map(([sid]) => post(valid({ submissionId: sid })).then(async (res) => ({ status: res.status, body: await res.json(), sid }))));
  check("stale pending / 'done' / corrupt former local records → every message delivered by the provider, none blocked or faked", staleResults.every((x) => x.status === 200 && x.body.delivery === "mock" && !x.body.duplicate && /^mock_/.test(x.body.id)), JSON.stringify(staleResults.map((x) => [x.status, x.body.duplicate ?? false])));
  check("…each sent exactly once, and no local record was written", (await Promise.all(stale.map(([sid]) => sends(sid)))).every((n) => n === 1) && readdirSync(staleDir).length === before);

  // g) a FRESH handler instance (second server process, same build) shares
  //    NOTHING with the first but the provider — as serverless instances do.
  if (secondInstance) {
    const port2 = await freePort();
    const child = spawn("npx", ["next", "start", "-p", String(port2)], { env: { ...process.env, INQUIRY_DELIVERY: "mock" }, stdio: ["ignore", "pipe", "pipe"] });
    let ready = false;
    for (let i = 0; i < 60 && !ready; i++) { await wait(500); try { ready = (await fetch(`http://localhost:${port2}/api/inquiry`, { method: "OPTIONS" })).status < 600; } catch {} }
    if (!ready) { check("second handler instance started", false, "could not start a second `next start` from this build"); }
    else {
      const b2 = `http://localhost:${port2}`;
      r = await postTo(b2, valid({ submissionId: id }));
      j = await r.json();
      check("unchanged retry through the fresh instance → the ORIGINAL accepted id, one send", r.status === 200 && j.ok === true && j.id === firstId && j.duplicate === true && (await sends(id)) === 1, JSON.stringify(j));
      const id2 = uuid();
      r = await postTo(b2, valid({ submissionId: id2 }));
      j = await r.json();
      const id2Provider = j.id;
      check("new message delivered by the fresh instance", j.delivery === "mock" && !j.duplicate && (await sends(id2)) === 1, JSON.stringify(j));
      r = await post(valid({ submissionId: id2 }));
      j = await r.json();
      check("its retry on the FIRST instance (which never saw the id) → the original id, one send", j.ok === true && j.id === id2Provider && j.duplicate === true && (await sends(id2)) === 1, JSON.stringify(j));
      r = await postTo(b2, valid({ submissionId: id2, name: "QA edited on instance 2" }));
      j = await r.json();
      check("changed content on the fresh instance → 409 submission_changed, nothing sent", r.status === 409 && j.code === "submission_changed" && (await sends(id2)) === 1, JSON.stringify(j));
      r = await post(valid({ submissionId: id2, details: "Edited on the FIRST instance." }));
      j = await r.json();
      check("changed content on the first instance → 409 submission_changed, nothing sent", r.status === 409 && j.code === "submission_changed" && (await sends(id2)) === 1, JSON.stringify(j));
      const id3 = uuid();
      const split = await Promise.all([base, b2, base, b2].map((b) => postTo(b, valid({ submissionId: id3 })).then(async (res) => ({ status: res.status, body: await res.json() }))));
      const sent3 = split.filter((x) => x.status === 200 && !x.body.duplicate).length;
      const rest3 = split.filter((x) => (x.status === 200 && x.body.duplicate === true) || (x.status === 409 && x.body.code === "in_progress")).length;
      check("4 simultaneous requests split across BOTH instances → one delivery; the rest original-result or in_progress", sent3 === 1 && rest3 === 3 && (await sends(id3)) === 1, JSON.stringify(split.map((x) => [x.status, x.body.duplicate ?? x.body.code ?? "sent"])));
    }
    await stop(child);
  } else {
    console.log("skip second-instance checks (--no-second-instance)");
  }
}

/* ---------- 3. Browser behaviour ---------- */
console.log("\n# Browser");
const browser = await launchChromium();
// A distinct forwarded IP per run so repeated runs against one server are not
// tripped by the per-IP rate limit (the API layer above already covers it).
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, extraHTTPHeaders: { "x-forwarded-for": `10.8.${Math.floor(Math.random() * 250)}.${Math.floor(Math.random() * 250) + 1}` } });
const page = await ctx.newPage();
const apiCalls = [];
page.on("request", (req) => { if (req.url().endsWith("/api/inquiry") && req.method() === "POST") apiCalls.push(JSON.parse(req.postData() ?? "{}")); });
await page.goto(`${browserBase}/contact`, { waitUntil: "load" });
await page.waitForFunction(() => !document.querySelector("form button[type=submit]")?.disabled, null, { timeout: 15000 });
const submit = page.locator("form button[type=submit]");
check("submit button enabled only after hydration", await submit.isEnabled());

// a) empty submit: readable errors bound to fields, focus on the first
await submit.click();
await page.waitForSelector("[role=alert]");
const nameInvalid = await page.locator("input[name=name]").getAttribute("aria-invalid");
const nameErr = await page.locator("input[name=name]").getAttribute("aria-describedby");
const nameErrText = nameErr ? await page.locator(`#${nameErr.split(" ")[0]}`).textContent() : "";
check("empty submit → name field aria-invalid with a readable error", nameInvalid === "true" && /name/i.test(nameErrText ?? ""), nameErrText ?? "");
check("empty submit → no API call made (client validation)", apiCalls.length === 0);
await wait(300);
check("empty submit → focus moves to the first invalid field", await page.evaluate(() => document.activeElement?.getAttribute("name") === "name"));

// a2) name only: the contact rule (email position) is focused before the later details error
await page.fill("input[name=name]", "QA Focus Order");
await submit.click();
await wait(300);
check("name-only submit → focus on the email field (contact rule), not the later details error", await page.evaluate(() => document.activeElement?.getAttribute("name") === "email"), await page.evaluate(() => document.activeElement?.getAttribute("name") ?? document.activeElement?.tagName));
check("hidden hints are not referenced by aria-describedby", await page.evaluate(() => [...document.querySelectorAll("[aria-describedby]")].every((el) => el.getAttribute("aria-describedby").split(" ").every((id) => document.getElementById(id)))));

// b) fill; network fails on the first attempt; input survives; retry succeeds once with the SAME id
await page.fill("input[name=name]", "QA Browser Test");
await page.fill("input[name=email]", "qa-browser@example.test");
await page.fill("textarea[name=details]", "Mocked delivery test from scripts/qa/forms.test.mjs. Not a real inquiry.");
await page.route("**/api/inquiry", (route) => route.abort("failed"), { times: 1 });
await submit.click();
await page.locator("[role=alert]").filter({ hasText: /couldn.t/i }).first().waitFor({ timeout: 15000 });
check("network failure → failure notice shown (no false success)", (await page.locator("[role=status]").count()) === 0);
check("failure notice receives focus", await page.evaluate(() => document.activeElement?.getAttribute("role") === "alert"));
check("input preserved after failure", (await page.inputValue("input[name=name]")) === "QA Browser Test" && (await page.inputValue("textarea[name=details]")).startsWith("Mocked delivery"));
const firstId = apiCalls[0]?.submissionId;
await submit.click();
await page.waitForSelector("[role=status]", { timeout: 15000 });
check("retry → success state only after {ok:true}", (await page.locator("[role=status]").count()) === 1);
await wait(200);
check("success panel receives focus", await page.evaluate(() => document.activeElement?.getAttribute("role") === "status"));
check("retry of UNCHANGED content reused the same submissionId", apiCalls.length === 2 && apiCalls[1].submissionId === firstId && /^[0-9a-f-]{36}$/.test(firstId ?? ""), apiCalls.map((c) => c.submissionId).join(", "));
check("success state names the fallback phone", /\d{3}/.test((await page.locator("[role=status]").textContent()) ?? ""));

// c) "send another": ambiguous failure, then EDIT the message → a NEW id is used
await page.getByRole("button", { name: /another/i }).click();
await page.fill("input[name=name]", "QA Edited Message");
await page.fill("input[name=phone]", "3145550100");
await page.fill("textarea[name=details]", "First wording of the second message.");
await page.route("**/api/inquiry", (route) => route.abort("failed"), { times: 1 });
const before = apiCalls.length;
await submit.click();
await page.locator("[role=alert]").filter({ hasText: /couldn.t/i }).first().waitFor({ timeout: 15000 });
const ambiguousId = apiCalls[before]?.submissionId;
await page.fill("textarea[name=details]", "EDITED wording after the ambiguous failure. Must be sent as a new message.");
await submit.click();
await page.waitForSelector("[role=status]", { timeout: 15000 });
check("edited message after an ambiguous failure → NEW submissionId", apiCalls.length === before + 2 && apiCalls[before + 1].submissionId !== ambiguousId && ambiguousId !== firstId, `${ambiguousId} → ${apiCalls[before + 1]?.submissionId}`);
check("edited message delivered under its new id (one send at the provider)", (await sends(apiCalls[before + 1].submissionId)) === 1);

// d) server-returned validation error: input preserved, the reported field focused
await page.getByRole("button", { name: /another/i }).click();
await page.fill("input[name=name]", "QA Server Validation");
await page.fill("input[name=email]", "server-says-invalid@example.test");
await page.fill("textarea[name=details]", "Server-side validation test. Not a real inquiry.");
await page.route("**/api/inquiry", (route) => route.fulfill({ status: 400, contentType: "application/json", body: JSON.stringify({ ok: false, errors: { email: "invalid" } }) }), { times: 1 });
await submit.click();
await page.locator("input[name=email][aria-invalid=true]").waitFor({ timeout: 15000 });
await wait(300);
const emailErrId = await page.locator("input[name=email]").getAttribute("aria-describedby");
const emailErrText = emailErrId ? await page.locator(`#${emailErrId.split(" ")[0]}`).textContent() : "";
check("server validation error → readable message on the reported field", /email/i.test(emailErrText ?? ""), emailErrText ?? "");
check("server validation error → focus moves to that field (form captured before await)", await page.evaluate(() => document.activeElement?.getAttribute("name") === "email"), await page.evaluate(() => document.activeElement?.getAttribute("name") ?? document.activeElement?.tagName));
check("server validation error → input preserved", (await page.inputValue("input[name=name]")) === "QA Server Validation" && (await page.inputValue("textarea[name=details]")).startsWith("Server-side"));
check("server validation error → no success state", (await page.locator("[role=status]").count()) === 0);

// e) double-click during submission sends once
await page.fill("input[name=email]", "qa-double@example.test");
await page.route("**/api/inquiry", async (route) => { await wait(800); route.continue(); }, { times: 1 });
const beforeDouble = apiCalls.length;
await submit.click();
await submit.click({ force: true }).catch(() => {});
await page.waitForSelector("[role=status]", { timeout: 15000 });
check("double-click during submission → exactly one request", apiCalls.length === beforeDouble + 1, `${apiCalls.length - beforeDouble} requests`);
await browser.close();

console.log(failures ? `\nforms.test: ${failures} FAILURE(S)` : "\nforms.test: all checks passed (mocked delivery; nothing sent)");
process.exit(failures ? 1 : 0);
