#!/usr/bin/env node
/**
 * Mocked action tests for the inquiry form — Build Standard §12 / Library §15.
 *
 *   node scripts/qa/forms.test.mjs <base-url> [--host hostname] [--no-second-instance]
 *
 * Runs against a server started with INQUIRY_DELIVERY=mock (never a real
 * provider). Three layers:
 *   1. API contract (fetch): validation codes, honeypot, cross-origin, rate
 *      limit shape.
 *   2. Idempotency (fetch, mocked delivery): simultaneous requests deliver
 *      once; a retry after "delivery accepted but response lost" is a
 *      duplicate; a retry through a FRESH handler instance (a second
 *      server process started by this script from the same build) is a
 *      duplicate; the same id with different content is refused explicitly;
 *      a malformed id is ignored. Delivery counts are read from the durable
 *      store (INQUIRY_IDEMPOTENCY_DIR, default <tmpdir>/compass-inquiry-idempotency).
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
import { readFileSync } from "node:fs";
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
const storeDir = process.env.INQUIRY_IDEMPOTENCY_DIR || path.join(tmpdir(), "compass-inquiry-idempotency");
const record = (id) => { try { return JSON.parse(readFileSync(path.join(storeDir, `${id}.json`), "utf8")); } catch { return null; } };
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

/* ---------- 2. Idempotency (mocked delivery, durable store) ---------- */
console.log("\n# Idempotency");
{
  // a) delivery accepted but the response was lost → the retry is a duplicate
  const id = uuid();
  let r = await post(valid({ submissionId: id }));
  let j = await r.json();
  check("valid message → 200 {ok:true, delivery:'mock'}", r.status === 200 && j.ok === true && j.delivery === "mock", JSON.stringify(j));
  r = await post(valid({ submissionId: id }));
  j = await r.json();
  check("retry after lost response (same id, same content) → {ok:true, duplicate:true}, nothing sent", r.status === 200 && j.ok === true && j.duplicate === true && !("delivery" in j), JSON.stringify(j));
  check("durable store records exactly one delivery for the id", record(id)?.deliveries === 1 && record(id)?.status === "done", JSON.stringify(record(id)));

  // b) same id, different content → explicit refusal, no delivery
  r = await post(valid({ submissionId: id, details: "Edited message under the OLD id. Must not be sent." }));
  j = await r.json();
  check("same id + different content → 409 submission_changed (not a silent success)", r.status === 409 && j.ok === false && j.code === "submission_changed" && /changed/i.test(j.error ?? ""), JSON.stringify(j));
  check("changed content did not deliver", record(id)?.deliveries === 1);

  // c) an id cannot launder an invalid message
  r = await post({ name: "QA", details: "x", submissionId: id });
  j = await r.json();
  check("known id cannot launder an invalid message → 400", r.status === 400 && j.errors, JSON.stringify(j));

  // d) malformed id is ignored (message still delivered, no record)
  r = await post(valid({ submissionId: "not-a-uuid" }));
  j = await r.json();
  check("malformed submissionId is ignored, message still delivered", r.status === 200 && j.ok === true && j.delivery === "mock", JSON.stringify(j));

  // e) simultaneous requests for one id deliver exactly once
  const cid = uuid();
  const results = await Promise.all(Array.from({ length: 6 }, () => postTo(base, valid({ submissionId: cid })).then(async (res) => ({ status: res.status, body: await res.json() }))));
  const delivered = results.filter((x) => x.body.delivery === "mock").length;
  const dups = results.filter((x) => x.body.duplicate === true).length;
  const inProgress = results.filter((x) => x.status === 409 && x.body.code === "in_progress").length;
  check("6 simultaneous requests, one id → exactly one delivery", delivered === 1, `delivered=${delivered} duplicate=${dups} in_progress=${inProgress}`);
  check("the others are explicit duplicates or in_progress, never a second send", delivered + dups + inProgress === 6 && record(cid)?.deliveries === 1, JSON.stringify(results.map((x) => x.status)));

  // f) a retry through a FRESH handler instance (second server process, same build)
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
      check("retry of the delivered message through a fresh instance → duplicate, nothing sent", r.status === 200 && j.duplicate === true && record(id)?.deliveries === 1, JSON.stringify(j));
      const id2 = uuid();
      r = await postTo(b2, valid({ submissionId: id2 }));
      j = await r.json();
      check("new message delivered by the fresh instance", j.delivery === "mock", JSON.stringify(j));
      r = await post(valid({ submissionId: id2 }));
      j = await r.json();
      check("its retry on the FIRST instance → duplicate (store shared across instances)", j.duplicate === true && record(id2)?.deliveries === 1, JSON.stringify(j));
      r = await postTo(b2, valid({ submissionId: id2, name: "QA edited on instance 2" }));
      j = await r.json();
      check("changed content on the fresh instance → 409 submission_changed", r.status === 409 && j.code === "submission_changed", JSON.stringify(j));
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
check("edited message delivered (server saw the new id as new)", record(apiCalls[before + 1].submissionId)?.deliveries === 1);

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
