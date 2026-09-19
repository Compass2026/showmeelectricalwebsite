#!/usr/bin/env node
/**
 * Raw-HTML crawl of a running build — the "does the initial response carry
 * it" check from the Build Standard. No browser.
 *
 *   node scripts/qa/crawl.mjs <base-url> [--origin https://example.com]
 *                             [--host <hostname>] [--assets remote|remap|skip]
 *                             [--routes .qa/routes.json]
 *
 * Expected production origin: `--origin`, else the `origin` recorded in the
 * routes file by route-manifest. Every canonical and every sitemap <loc> is
 * compared as a FULL URL against `${origin}${path}`; a right path on the wrong
 * host fails.
 *
 * Per published route:
 *   - 200; exactly one <title>, one meta description, one canonical equal to
 *     the expected full URL; exactly one <h1>
 *   - og:image AND twitter:image present, absolute, hostname == expected
 *     origin's hostname; then the image is fetched according to --assets:
 *       remote  fetch the declared absolute URL as-is (deployed production
 *               or any host that serves the declared origin)
 *       remap   the declared URL is an owned asset on the expected origin; it
 *               is fetched from <base-url> instead and REPORTED as
 *               "asset validated on <base host> (remapped)", never as a
 *               fetch of the declared URL
 *       skip    declared URLs are validated for hostname only
 *     Default: remote when <base-url> host == origin host, otherwise the run
 *     refuses to guess and asks for --assets.
 *   - every internal <a href> resolves (200, or a redirect landing on 200,
 *     or an external redirect target)
 *   - every fragment (same-page, cross-page or fragment-only) resolves to an
 *     element with that id on the destination page
 *   - JSON-LD parses and every {"@id"} reference resolves within the page
 * Site-wide:
 *   - incoming links come from RENDERED pages: a route is an orphan unless at
 *     least one OTHER crawled page links to it (self-links ignored; registry
 *     notes such as "nav"/"footer" do not exempt a route)
 *   - sitemap <loc> set == expected full URLs of the manifest; lastmod only
 *     where the manifest records a date, and equal to it
 *   - an unknown route returns 404
 *
 * Exit 1 on any failure. Exported `runCrawl` is what the negative fixtures in
 * crawl.test.mjs exercise.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

export async function runCrawl({ base, origin, routes, assets = "remote", hostHeader = null, fetchImpl = fetch, unknownPath = "/this-route-does-not-exist" }) {
  const failures = [];
  const notes = [];
  const fail = (where, what) => failures.push(`${where}: ${what}`);
  const headers = hostHeader ? { host: hostHeader } : {};
  const originUrl = new URL(origin);
  const baseUrl = new URL(base);
  const expectedUrl = (path) => (path === "/" ? origin : `${origin}${path}`);
  const htmlCache = new Map();

  const get = (path, opts = {}) => fetchImpl(`${base}${path}`, { headers, redirect: "manual", ...opts });
  const pageHtml = async (path) => {
    if (!htmlCache.has(path)) {
      const res = await get(path);
      htmlCache.set(path, { status: res.status, html: res.status === 200 ? await res.text() : "" });
    }
    return htmlCache.get(path);
  };
  async function landing(path) {
    let current = path;
    for (let i = 0; i < 5; i++) {
      const res = await get(current);
      if (res.status >= 300 && res.status < 400) {
        const loc = res.headers.get("location") ?? "";
        if (loc.startsWith(base)) { current = loc.slice(base.length) || "/"; continue; }
        if (loc.startsWith("/")) { current = loc; continue; }
        return { status: res.status, external: loc };
      }
      return { status: res.status, path: current };
    }
    return { status: 599, path: current };
  }
  const hasId = (html, id) => new RegExp(`\\sid="${id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`).test(html) || new RegExp(`\\sname="${id}"`).test(html);

  const manifestPaths = new Set(routes.map((r) => r.path));
  const inbound = new Map(routes.map((r) => [r.path, new Set()]));
  const results = [];

  for (const r of routes) {
    const { status, html } = await pageHtml(r.path);
    const row = { path: r.path, status, h1: 0, canonical: "", og: "-", tw: "-", links: 0, dead: 0, frags: 0, jsonld: "ok" };
    if (status !== 200) { fail(r.path, `status ${status}`); results.push(row); continue; }
    const head = (html.match(/<head>([\s\S]*?)<\/head>/) || ["", ""])[1];

    // ---- head: title, description, canonical (exactly one, full URL) ----
    const titles = (head.match(/<title>/g) || []).length;
    const descs = (head.match(/<meta name="description"/g) || []).length;
    const canons = [...head.matchAll(/<link rel="canonical" href="([^"]*)"/g)].map((m) => m[1]);
    row.canonical = canons.join(" | ");
    if (titles !== 1) fail(r.path, `${titles} <title> tags`);
    if (descs !== 1) fail(r.path, `${descs} meta descriptions`);
    if (canons.length !== 1) fail(r.path, `${canons.length} canonical links`);
    else if (canons[0] !== expectedUrl(r.path) && canons[0] !== `${expectedUrl(r.path)}/`.replace(/\/\/$/, "/")) {
      fail(r.path, `canonical "${canons[0]}" != expected "${expectedUrl(r.path)}"`);
    }
    row.h1 = (html.match(/<h1[\s>]/g) || []).length;
    if (row.h1 !== 1) fail(r.path, `${row.h1} <h1>`);

    // ---- share images: declared hostname first, then fetch per mode ----
    const og = (head.match(/<meta property="og:image" content="([^"]*)"/) || [])[1];
    const tw = (head.match(/<meta name="twitter:image" content="([^"]*)"/) || [])[1];
    for (const [label, url] of [["og:image", og], ["twitter:image", tw]]) {
      if (!url) { fail(r.path, `${label} missing`); continue; }
      let u;
      try { u = new URL(url); } catch { fail(r.path, `${label} not absolute: ${url}`); continue; }
      if (u.host !== originUrl.host) { fail(r.path, `${label} host "${u.host}" != expected "${originUrl.host}"`); continue; }
      if (assets === "skip") continue;
      const target = assets === "remap" ? `${base}${u.pathname}` : url;
      let res;
      try { res = await fetchImpl(target, { headers, redirect: "follow" }); } catch (e) { fail(r.path, `${label} fetch failed (${assets}): ${e.message}`); continue; }
      const ct = res.headers.get("content-type") || "";
      if (res.status !== 200 || !ct.startsWith("image/")) fail(r.path, `${label} ${assets === "remap" ? `${u.pathname} on ${baseUrl.host} (remapped)` : url} → ${res.status} ${ct}`);
    }
    row.og = og ? og.split("/").pop() : "MISSING";
    row.tw = tw ? tw.split("/").pop() : "MISSING";

    // ---- links, fragments, inbound graph (from rendered HTML) ----
    const body = html.replace(/<script[\s\S]*?<\/script>/g, "");
    const hrefs = [...body.matchAll(/<a\s[^>]*href="([^"]*)"/g)].map((m) => m[1]).filter((h) => (h.startsWith("/") && !h.startsWith("//")) || h.startsWith("#"));
    row.links = hrefs.length;
    for (const h of new Set(hrefs)) {
      const [pathPart, frag] = h.split("#");
      const path = h.startsWith("#") ? r.path : (pathPart.split("?")[0] || "/");
      if (path !== r.path && inbound.has(path)) inbound.get(path).add(r.path); // self-links never count
      if (path !== r.path) {
        const l = await landing(path);
        if (l.status !== 200 && !l.external) { row.dead++; fail(r.path, `link ${h} → ${l.status}`); continue; }
      }
      if (frag !== undefined && frag !== "") {
        row.frags++;
        const dest = path === r.path ? { status: 200, html } : await pageHtml(path);
        if (dest.status !== 200) { fail(r.path, `fragment ${h}: destination ${path} → ${dest.status}`); continue; }
        if (!hasId(dest.html, frag)) fail(r.path, `fragment ${h}: no element with id "${frag}" on ${path}`);
      }
    }

    // ---- JSON-LD ----
    const lds = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);
    try {
      const graph = lds.flatMap((s) => { const j = JSON.parse(s); return Array.isArray(j) ? j : [j]; });
      const ids = new Set(graph.map((n) => n["@id"]).filter(Boolean));
      const refs = [];
      const walk = (v) => { if (Array.isArray(v)) v.forEach(walk); else if (v && typeof v === "object") { if (Object.keys(v).length === 1 && v["@id"]) refs.push(v["@id"]); Object.values(v).forEach(walk); } };
      graph.forEach(walk);
      const dangling = refs.filter((id) => !ids.has(id));
      if (dangling.length) { row.jsonld = "dangling"; fail(r.path, `JSON-LD references not on page: ${dangling.join(", ")}`); }
      if (!graph.length) { row.jsonld = "none"; fail(r.path, "no JSON-LD"); }
    } catch (e) { row.jsonld = "invalid"; fail(r.path, `JSON-LD invalid: ${e.message}`); }
    results.push(row);
  }

  // ---- orphans from rendered links only ----
  for (const r of routes) {
    const from = inbound.get(r.path);
    if (from.size === 0) fail(r.path, "orphan: no other published page links to it in rendered HTML");
  }

  // ---- sitemap: full URLs against the expected origin ----
  const smRes = await get("/sitemap.xml");
  const sm = smRes.status === 200 ? await smRes.text() : "";
  if (smRes.status !== 200) fail("sitemap", `status ${smRes.status}`);
  const entries = [...sm.matchAll(/<url>\s*<loc>([^<]*)<\/loc>\s*(?:<lastmod>([^<]*)<\/lastmod>)?/g)].map((m) => ({ loc: m[1], lastmod: m[2] }));
  const expected = new Map(routes.map((r) => [expectedUrl(r.path), r]));
  const seen = new Set();
  for (const e of entries) {
    const key = e.loc.replace(/\/$/, "") === origin.replace(/\/$/, "") ? origin : e.loc;
    seen.add(key);
    const r = expected.get(key);
    if (!r) { fail("sitemap", `lists URL not in manifest or on wrong origin: ${e.loc}`); continue; }
    if (!!e.lastmod !== !!r.lastModified) fail("sitemap", `${e.loc} lastmod ${e.lastmod ? "present" : "absent"} but manifest ${r.lastModified ? "has" : "lacks"} a date`);
    else if (e.lastmod && !e.lastmod.startsWith(r.lastModified)) fail("sitemap", `${e.loc} lastmod ${e.lastmod} != manifest ${r.lastModified}`);
  }
  for (const [url] of expected) if (!seen.has(url)) fail("sitemap", `manifest route missing from sitemap: ${url}`);

  // ---- unknown route ----
  const nf = await get(unknownPath);
  if (nf.status !== 404) fail("404", `unknown route returned ${nf.status}`);

  notes.push(`share images: ${assets === "remap" ? `validated on ${baseUrl.host} by remapping declared ${originUrl.host} paths (local asset validation — declared URLs NOT fetched)` : assets === "remote" ? "declared absolute URLs fetched as-is" : "hostname validated only, not fetched"}`);
  notes.push(`incoming links: from rendered anchors on other pages only (self-links and registry notes ignored)`);
  notes.push(`canonical + sitemap: compared as full URLs against ${origin}`);
  return { failures, results, notes, inbound: Object.fromEntries([...inbound].map(([k, v]) => [k, [...v]])), sitemapCount: entries.length };
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isMain) {
  const argv = process.argv.slice(2);
  const base = argv.find((a) => !a.startsWith("--"));
  const opt = (name) => { const i = argv.indexOf(name); return i > -1 ? argv[i + 1] : undefined; };
  if (!base) { console.error("usage: crawl.mjs <base-url> [--origin URL] [--host hostname] [--assets remote|remap|skip] [--routes file]"); process.exit(2); }
  const routesFile = opt("--routes") ?? ".qa/routes.json";
  const manifest = JSON.parse(readFileSync(routesFile, "utf8"));
  const origin = opt("--origin") ?? manifest.origin;
  if (!origin) { console.error("expected origin unknown: pass --origin or regenerate the manifest"); process.exit(2); }
  let assets = opt("--assets");
  if (!assets) {
    if (new URL(base).host === new URL(origin).host) assets = "remote";
    else { console.error(`base host ${new URL(base).host} differs from expected origin ${new URL(origin).host}: pass --assets remap (validate owned assets on this host) or --assets remote/skip`); process.exit(2); }
  }
  const { failures, results, notes, sitemapCount } = await runCrawl({ base, origin, routes: manifest.routes, assets, hostHeader: opt("--host") ?? null });
  console.table(results);
  console.log(`sitemap: ${sitemapCount} URLs, manifest: ${manifest.routes.length}, expected origin: ${origin}`);
  notes.forEach((n) => console.log("note: " + n));
  if (failures.length) { console.error(`\n${failures.length} FAILURE(S):`); failures.forEach((f) => console.error("  - " + f)); process.exit(1); }
  console.log("\ncrawl: PASS");
}
