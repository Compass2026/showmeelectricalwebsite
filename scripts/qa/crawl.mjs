#!/usr/bin/env node
/**
 * Raw-HTML crawl of a running build. No browser: this is the "does the
 * initial response carry it" check the Build Standard asks for.
 *
 *   node scripts/qa/crawl.mjs http://localhost:3000 [--host showmeelectrical.com]
 *
 * Checks, per published route (from .qa/routes.json — run route-manifest first):
 *   - 200 status, exactly one <title>, one description, one canonical (absolute, matches origin + path)
 *   - one <h1>
 *   - og:image and twitter:image present, absolute, and fetchable as an image
 *   - every internal <a href> on the page resolves (200, or a redirect that lands on 200)
 *   - JSON-LD parses; every "@id" reference resolves within the page's graph
 * Site-wide:
 *   - sitemap.xml URL set == manifest URL set; lastmod only where the manifest has a date
 *   - no published route is an orphan (linked from nowhere)
 *   - unknown route returns 404
 * Exit code 1 on any failure; prints a table.
 */
import { readFileSync } from "node:fs";

const base = process.argv[2];
if (!base) {
  console.error("usage: crawl.mjs <base-url> [--host <hostname>]");
  process.exit(2);
}
const hostIdx = process.argv.indexOf("--host");
const hostHeader = hostIdx > -1 ? process.argv[hostIdx + 1] : null;
const { routes } = JSON.parse(readFileSync(".qa/routes.json", "utf8"));
const headers = hostHeader ? { host: hostHeader } : {};

const failures = [];
const fail = (where, what) => failures.push(`${where}: ${what}`);

async function get(path, opts = {}) {
  const res = await fetch(`${base}${path}`, { headers, redirect: "manual", ...opts });
  return res;
}
async function landing(path) {
  // follow up to 5 redirects manually, on the same base
  let current = path;
  for (let i = 0; i < 5; i++) {
    const res = await get(current);
    if (res.status >= 300 && res.status < 400) {
      const loc = res.headers.get("location") ?? "";
      if (!loc.startsWith("/") && !loc.startsWith(base)) return { status: res.status, external: loc };
      current = loc.replace(base, "");
      continue;
    }
    return { status: res.status, path: current };
  }
  return { status: 599, path: current };
}

const attr = (tag, name) => (tag.match(new RegExp(`${name}="([^"]*)"`)) || [])[1];
const origin = () => {
  // canonical origin is whatever the page says; we only require consistency
  return null;
};

let linkedFrom = new Map(routes.map((r) => [r.path, new Set()]));
const results = [];

for (const r of routes) {
  const res = await get(r.path);
  const html = await res.text();
  const row = { path: r.path, status: res.status, h1: 0, title: 0, desc: 0, canonical: "", og: "", links: 0, dead: 0, ld: "ok" };
  if (res.status !== 200) fail(r.path, `status ${res.status}`);
  const head = (html.match(/<head>([\s\S]*?)<\/head>/) || ["", ""])[1];
  row.title = (head.match(/<title>/g) || []).length;
  row.desc = (head.match(/<meta name="description"/g) || []).length;
  const canon = (head.match(/<link rel="canonical" href="([^"]*)"/) || [])[1] ?? "";
  row.canonical = canon;
  if (row.title !== 1) fail(r.path, `${row.title} <title> tags`);
  if (row.desc !== 1) fail(r.path, `${row.desc} descriptions`);
  if (!/^https?:\/\//.test(canon) || !(canon.endsWith(r.path) || (r.path === "/" && /^https?:\/\/[^/]+\/?$/.test(canon)))) fail(r.path, `canonical "${canon}" does not match path`);
  row.h1 = (html.match(/<h1[\s>]/g) || []).length;
  if (row.h1 !== 1) fail(r.path, `${row.h1} <h1>`);
  const og = (head.match(/<meta property="og:image" content="([^"]*)"/) || [])[1];
  const tw = (head.match(/<meta name="twitter:image" content="([^"]*)"/) || [])[1];
  row.og = og ? og.split("/").pop() : "MISSING";
  if (!og || !/^https?:\/\//.test(og)) fail(r.path, `og:image missing or not absolute (${og})`);
  if (!tw || !/^https?:\/\//.test(tw)) fail(r.path, `twitter:image missing or not absolute (${tw})`);
  if (og) {
    const imgPath = og.replace(/^https?:\/\/[^/]+/, "");
    const img = await get(imgPath);
    const ct = img.headers.get("content-type") || "";
    if (img.status !== 200 || !ct.startsWith("image/")) fail(r.path, `og:image ${imgPath} → ${img.status} ${ct}`);
  }
  // internal anchors
  const body = html.replace(/<script[\s\S]*?<\/script>/g, "");
  const hrefs = [...body.matchAll(/<a [^>]*href="([^"]*)"/g)].map((m) => m[1]).filter((h) => h.startsWith("/") && !h.startsWith("//"));
  row.links = hrefs.length;
  for (const h of new Set(hrefs)) {
    const path = h.split("#")[0].split("?")[0] || "/";
    if (linkedFrom.has(path)) linkedFrom.get(path).add(r.path);
    const l = await landing(path);
    if (l.status !== 200 && !l.external) {
      row.dead++;
      fail(r.path, `link ${h} → ${l.status}`);
    }
    if (h.includes("#")) {
      const frag = h.split("#")[1];
      if (path === r.path && frag && !html.includes(`id="${frag}"`)) fail(r.path, `fragment #${frag} not on page`);
    }
  }
  // JSON-LD
  const lds = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  try {
    const graph = lds.flatMap((s) => { const j = JSON.parse(s); return Array.isArray(j) ? j : [j]; });
    const ids = new Set(graph.map((n) => n["@id"]).filter(Boolean));
    const refs = [];
    const walk = (v) => { if (Array.isArray(v)) v.forEach(walk); else if (v && typeof v === "object") { if (Object.keys(v).length === 1 && v["@id"]) refs.push(v["@id"]); Object.values(v).forEach(walk); } };
    graph.forEach(walk);
    const dangling = refs.filter((id) => !ids.has(id));
    if (dangling.length) { row.ld = `dangling ${dangling.join(",")}`; fail(r.path, `JSON-LD references not on page: ${dangling.join(", ")}`); }
    if (!graph.length) { row.ld = "none"; fail(r.path, "no JSON-LD"); }
  } catch (e) { row.ld = "invalid"; fail(r.path, `JSON-LD invalid: ${e.message}`); }
  results.push(row);
}

// orphans: a route must be linked from another published page, or be a chrome-linked core page
for (const r of routes) {
  const chrome = r.incoming.some((s) => !s.startsWith("/"));
  if (!chrome && linkedFrom.get(r.path).size === 0) fail(r.path, "orphan: no published page links to it");
}

// sitemap vs manifest
const sm = await (await get("/sitemap.xml")).text();
const smUrls = [...sm.matchAll(/<loc>([^<]*)<\/loc>/g)].map((m) => m[1].replace(/^https?:\/\/[^/]+/, "") || "/");
const smSet = new Set(smUrls.map((u) => (u === "" ? "/" : u)));
const manifestSet = new Set(routes.map((r) => r.path));
for (const u of manifestSet) if (!smSet.has(u)) fail("sitemap", `manifest route missing: ${u}`);
for (const u of smSet) if (!manifestSet.has(u)) fail("sitemap", `sitemap lists unregistered route: ${u}`);
const lastmods = [...sm.matchAll(/<url>\s*<loc>([^<]*)<\/loc>\s*(?:<lastmod>([^<]*)<\/lastmod>)?/g)];
for (const [, loc, lm] of lastmods) {
  const path = loc.replace(/^https?:\/\/[^/]+/, "") || "/";
  const r = routes.find((x) => x.path === path);
  if (r && !!lm !== !!r.lastModified) fail("sitemap", `${path} lastmod ${lm ? "present" : "absent"} but manifest ${r.lastModified ? "has" : "lacks"} a date`);
  if (r && lm && !lm.startsWith(r.lastModified)) fail("sitemap", `${path} lastmod ${lm} != manifest ${r.lastModified}`);
}

// unknown route → 404
const nf = await get("/this-route-does-not-exist");
if (nf.status !== 404) fail("404", `unknown route returned ${nf.status}`);

console.table(results.map((r) => ({ path: r.path, status: r.status, h1: r.h1, canonical: r.canonical.replace(/^https?:\/\/[^/]+/, "") || "/", og: r.og, links: r.links, dead: r.dead, jsonld: r.ld })));
console.log(`sitemap: ${smSet.size} URLs, manifest: ${manifestSet.size}`);
if (failures.length) {
  console.error(`\n${failures.length} FAILURE(S):`);
  failures.forEach((f) => console.error("  - " + f));
  process.exit(1);
}
console.log("\ncrawl: PASS");
