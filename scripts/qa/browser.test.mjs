#!/usr/bin/env node
/**
 * Browser regression checks — scripted automation (NOT an AI-agent trial).
 *   node scripts/qa/browser.test.mjs <base-url> --host <hostname> [--paths /a,/b]
 * For each path: content visible without JavaScript, reduced-motion renders
 * everything visible with no pending transforms, no horizontal overflow at
 * 390px, keyboard reach (skip link first, focus visible on nav), touch
 * targets ≥ 24px, and every comparison table has a caption, header scopes
 * and a horizontally scrollable wrapper on narrow screens.
 */
import { launchChromium } from "./browser-launch.mjs";
const args = process.argv.slice(2);
const base = args[0];
const host = args[args.indexOf("--host") + 1];
const browserBase = base.replace(/localhost|127\.0\.0\.1/, `${host}.localhost`);
const pathsArg = args.indexOf("--paths");
const paths = pathsArg > -1 ? args[pathsArg + 1].split(",") : ["/"];
let failures = 0;
const check = (name, ok, detail = "") => { console.log(`${ok ? "ok  " : "FAIL"} ${name}${detail ? ` — ${detail}` : ""}`); if (!ok) failures++; };
const browser = await launchChromium();
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

for (const p of paths) {
  console.log(`\n# ${p}`);
  // 1. No JavaScript: the server HTML must carry the content, visibly.
  {
    const ctx = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
    const pg = await ctx.newPage(); await pg.goto(browserBase + p, { waitUntil: "load" });
    const r = await pg.evaluate(() => {
      const main = document.querySelector("main"); const h1 = document.querySelector("h1");
      const hidden = [...main.querySelectorAll("h1,h2,h3,p,li,a,button")].filter((e) => { const cs = getComputedStyle(e); const rect = e.getBoundingClientRect(); return rect.width > 0 && (cs.opacity === "0" || cs.visibility === "hidden"); }).length;
      return { h1: h1?.textContent.trim(), textLen: main.innerText.length, hidden, submitDisabled: document.querySelector("form button[type=submit]")?.disabled ?? null, noscript: !!document.querySelector("noscript") };
    });
    check("no-JS: h1 and main text present", !!r.h1 && r.textLen > 200, `${r.h1} (${r.textLen} chars)`);
    check("no-JS: no content hidden by opacity/visibility", r.hidden === 0, `${r.hidden} hidden`);
    if (r.submitDisabled !== null) check("no-JS: form submit disabled (no native submission)", r.submitDisabled === true);
    await ctx.close();
  }
  // 2. Reduced motion: everything visible, nothing left translated/faded.
  {
    const ctx = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const pg = await ctx.newPage(); await pg.goto(browserBase + p, { waitUntil: "load" }); await wait(1500);
    const r = await pg.evaluate(() => {
      const els = [...document.querySelectorAll("main *")].filter((e) => e.children.length === 0 && e.textContent.trim().length > 0);
      const faded = els.filter((e) => { const cs = getComputedStyle(e); return cs.opacity !== "1" && cs.opacity !== "" && +cs.opacity < 0.99 && !e.closest("[aria-hidden=true]"); });
      const moved = [...document.querySelectorAll("main [style*='transform']")].filter((e) => !/none|matrix\(1, 0, 0, 1, 0, 0\)/.test(getComputedStyle(e).transform));
      return { faded: faded.length, moved: moved.length, overflow: document.documentElement.scrollWidth > innerWidth };
    });
    check("reduced motion: no faded text after load", r.faded === 0, `${r.faded} faded`);
    check("reduced motion: no elements left translated", r.moved === 0, `${r.moved} moved`);
    check("390px: no horizontal page overflow", !r.overflow);
    // tables
    const t = await pg.evaluate(() => [...document.querySelectorAll("table")].map((t) => ({ caption: !!t.querySelector("caption"), cols: t.querySelectorAll("th[scope=col]").length, rows: t.querySelectorAll("th[scope=row]").length, scrollable: t.parentElement.scrollWidth > t.parentElement.clientWidth && /auto|scroll/.test(getComputedStyle(t.parentElement).overflowX) })));
    for (const [i, tb] of t.entries()) check(`table ${i + 1}: caption, column headers, row headers, scrolls in its wrapper`, tb.caption && tb.cols > 0 && tb.rows > 0 && tb.scrollable, JSON.stringify(tb));
    const small = await pg.evaluate(() => [...document.querySelectorAll("a,button,summary,input,select,textarea")].filter((e) => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 0 && r.height > 0 && r.height < 24 && cs.visibility !== "hidden"; }).map((e) => e.textContent.trim().slice(0, 30) || e.tagName));
    check("touch targets ≥ 24px (skip link excepted)", small.filter((s) => !/skip to content/i.test(s)).length === 0, small.join(" | "));
    await ctx.close();
  }
  // 3. Keyboard: skip link is the first stop and works; nav links receive visible focus.
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const pg = await ctx.newPage(); await pg.goto(browserBase + p, { waitUntil: "load" }); await wait(800);
    await pg.keyboard.press("Tab");
    const first = await pg.evaluate(() => ({ text: document.activeElement?.textContent?.trim(), visible: (() => { const r = document.activeElement.getBoundingClientRect(); return r.width > 0 && r.height > 0; })() }));
    check("keyboard: first Tab lands on a visible skip link", /skip/i.test(first.text ?? "") && first.visible, JSON.stringify(first));
    await pg.keyboard.press("Enter"); await wait(300);
    const landed = await pg.evaluate(() => location.hash === "#main" || document.activeElement?.id === "main");
    check("keyboard: skip link reaches #main", landed);
    await pg.goto(browserBase + p, { waitUntil: "load" }); await wait(500);
    let sawNav = false, focusVisible = false;
    for (let i = 0; i < 12 && !sawNav; i++) { await pg.keyboard.press("Tab"); const r = await pg.evaluate(() => { const a = document.activeElement; const inNav = !!a?.closest("nav"); const cs = getComputedStyle(a); return { inNav, ring: cs.outlineStyle !== "none" || cs.boxShadow !== "none" || cs.textDecorationLine.includes("underline") || cs.borderBottomWidth !== "0px" }; }); if (r.inNav) { sawNav = true; focusVisible = r.ring; } }
    check("keyboard: nav links reachable with visible focus", sawNav && focusVisible);
    await ctx.close();
  }
}
await browser.close();
console.log(failures ? `\nbrowser.test: ${failures} FAILURE(S)` : "\nbrowser.test: all checks passed");
process.exit(failures ? 1 : 0);
