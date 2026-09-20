#!/usr/bin/env node
/**
 * Mocked action tests for the inquiry form — Build Standard §12 / Library §15.
 *
 *   node scripts/qa/forms.test.mjs <base-url> [--host hostname]
 *
 * Runs against a server started with INQUIRY_DELIVERY=mock (never a real
 * provider). Two layers:
 *   1. API contract (fetch): validation codes, honeypot, duplicate-safe
 *      submission ids, rate limit shape.
 *   2. Browser behaviour (Playwright + the bundled Chromium): errors are
 *      readable and associated with fields, input survives a failure,
 *      a retry after a network failure succeeds ONCE (same submission id),
 *      the success state is shown only after {ok:true}, and a second click
 *      during submission does not send twice.
 * Exit 1 on any failure. This is scripted browser automation, not an
 * AI-agent trial — see docs/agent-compatibility.md for those.
 */
import { chromium } from "playwright-core";

const base = process.argv[2] ?? "http://localhost:3000";
const hostArg = process.argv.indexOf("--host");
const host = hostArg > -1 ? process.argv[hostArg + 1] : null;
const browserBase = host ? base.replace("localhost", `${host}.localhost`).replace("127.0.0.1", `${host}.localhost`) : base;
const headers = { "content-type": "application/json", ...(host ? { host } : {}) };
let failures = 0;
const check = (name, ok, detail = "") => { console.log(`${ok ? "ok  " : "FAIL"} ${name}${detail ? ` — ${detail}` : ""}`); if (!ok) failures++; };
const uuid = () => crypto.randomUUID();
let ipN = 0;
const post = (body, extra = {}) => fetch(`${base}/api/inquiry`, { method: "POST", headers: { ...headers, "x-forwarded-for": `10.9.${Math.floor(ipN / 250)}.${(ipN++ % 250) + 1}`, ...extra }, body: JSON.stringify(body) });

/* ---------- 1. API contract ---------- */
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
  const id = uuid();
  r = await post({ name: "QA duplicate test", details: "Mocked delivery. Not a real inquiry.", email: "qa@example.test", submissionId: id });
  j = await r.json();
  check("valid message → 200 {ok:true, delivery:'mock'}", r.status === 200 && j.ok === true && j.delivery === "mock", JSON.stringify(j));
  r = await post({ name: "QA duplicate test", details: "Mocked delivery. Not a real inquiry.", email: "qa@example.test", submissionId: id });
  j = await r.json();
  check("same submissionId again → 200 {ok:true, duplicate:true}, nothing delivered", r.status === 200 && j.ok === true && j.duplicate === true && !("delivery" in j), JSON.stringify(j));
  r = await post({ name: "QA", details: "x", submissionId: id });
  j = await r.json();
  check("known id cannot launder an invalid message → 400", r.status === 400 && j.errors, JSON.stringify(j));
  r = await post({ name: "QA", details: "x", email: "a@b.co", submissionId: "not-a-uuid" });
  j = await r.json();
  check("malformed submissionId is ignored, message still delivered", r.status === 200 && j.ok === true && j.delivery === "mock", JSON.stringify(j));
  r = await post({ name: "QA", details: "x", email: "a@b.co" }, { origin: "https://evil.example" });
  check("cross-origin POST → 403", r.status === 403, String(r.status));
  // rate limit: 5 per window per IP on one instance
  const ip = "10.7.7.7";
  let last;
  for (let i = 0; i < 6; i++) last = await fetch(`${base}/api/inquiry`, { method: "POST", headers: { ...headers, "x-forwarded-for": ip }, body: JSON.stringify({ name: "QA", details: "x", email: "a@b.co" }) });
  check("6th message from one IP in the window → 429", last.status === 429, String(last.status));
}

/* ---------- 2. Browser behaviour ---------- */
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
const page = await ctx.newPage();
const apiCalls = [];
page.on("request", (req) => { if (req.url().endsWith("/api/inquiry") && req.method() === "POST") apiCalls.push(JSON.parse(req.postData() ?? "{}")); });
await page.goto(`${browserBase}/contact`, { waitUntil: "load" });
await page.waitForFunction(() => !document.querySelector('form button[type=submit]')?.disabled, null, { timeout: 15000 });
const submit = page.locator("form button[type=submit]");
check("submit button enabled only after hydration", await submit.isEnabled());

// a) empty submit: readable errors bound to fields
await submit.click();
await page.waitForSelector('[role=alert]');
const nameInvalid = await page.locator('input[name=name]').getAttribute("aria-invalid");
const nameErr = await page.locator('input[name=name]').getAttribute("aria-describedby");
const nameErrText = nameErr ? await page.locator(`#${nameErr.split(" ")[0]}`).textContent() : "";
check("empty submit → name field aria-invalid with a readable error", nameInvalid === "true" && /name/i.test(nameErrText ?? ""), nameErrText ?? "");
check("empty submit → no API call made (client validation)", apiCalls.length === 0);

// b) fill, then fail the network on first attempt; input must survive; retry succeeds once
await page.fill('input[name=name]', "QA Browser Test");
await page.fill('input[name=email]', "qa-browser@example.test");
await page.fill('textarea[name=details]', "Mocked delivery test from scripts/qa/forms.test.mjs. Not a real inquiry.");
await page.route("**/api/inquiry", (route) => route.abort("failed"), { times: 1 });
await submit.click();
const alert = page.locator('[role=alert]').filter({ hasText: /couldn.t/i }).first();
await alert.waitFor({ timeout: 15000 });
check("network failure → failure notice shown (no false success)", (await page.locator('[role=status]').count()) === 0);
check("failure notice receives focus", await page.evaluate(() => document.activeElement?.getAttribute("role") === "alert"));
check("input preserved after failure", (await page.inputValue('input[name=name]')) === "QA Browser Test" && (await page.inputValue('textarea[name=details]')).startsWith("Mocked delivery"));
const firstId = apiCalls[0]?.submissionId;
await submit.click();
await page.waitForSelector('[role=status]', { timeout: 15000 });
check("retry → success state only after {ok:true}", (await page.locator('[role=status]').count()) === 1);
check("retry reused the same submissionId", apiCalls.length === 2 && apiCalls[1].submissionId === firstId && /^[0-9a-f-]{36}$/.test(firstId ?? ""), `${apiCalls.map((c) => c.submissionId).join(", ")}`);
const successText = await page.locator('[role=status]').textContent();
check("success state names the fallback phone", /\d{3}/.test(successText ?? ""));

// c) "send another" mints a NEW id; double-click during submit sends once
await page.getByRole("button", { name: /another/i }).click();
await page.fill('input[name=name]', "QA Second Message");
await page.fill('input[name=phone]', "3145550100");
await page.fill('textarea[name=details]', "Second mocked message. Not a real inquiry.");
await page.route("**/api/inquiry", async (route) => { await new Promise((r) => setTimeout(r, 800)); route.continue(); }, { times: 1 });
const before = apiCalls.length;
await submit.click();
await submit.click({ force: true }).catch(() => {});
await page.waitForSelector('[role=status]', { timeout: 15000 });
check("double-click during submission → exactly one request", apiCalls.length === before + 1, `${apiCalls.length - before} requests`);
check("new message → new submissionId", apiCalls[apiCalls.length - 1].submissionId !== firstId);
await browser.close();

console.log(failures ? `\nforms.test: ${failures} FAILURE(S)` : "\nforms.test: all checks passed (mocked delivery; nothing sent)");
process.exit(failures ? 1 : 0);
