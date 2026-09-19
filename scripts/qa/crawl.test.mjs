#!/usr/bin/env node
/**
 * Negative fixtures for crawl.mjs. Each fixture is a tiny in-memory site
 * served on a local port; the crawl must FAIL for the stated reason and PASS
 * for the control site. Run: node scripts/qa/crawl.test.mjs
 */
import { createServer } from "node:http";
import { runCrawl } from "./crawl.mjs";

const ORIGIN = "https://example.test";
const PNG = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==", "base64");

function page({ path, title, canonical = `${ORIGIN}${path === "/" ? "" : path}`, og = `${ORIGIN}/share.png`, tw = `${ORIGIN}/share.png`, body = "", ids = [] }) {
  return `<!doctype html><html><head><title>${title}</title><meta name="description" content="${title} description"/><link rel="canonical" href="${canonical}"/>${og ? `<meta property="og:image" content="${og}"/>` : ""}${tw ? `<meta name="twitter:image" content="${tw}"/>` : ""}</head><body><h1>${title}</h1>${ids.map((id) => `<section id="${id}">${id}</section>`).join("")}${body}<script type="application/ld+json">[{"@context":"https://schema.org","@type":"WebSite","@id":"${ORIGIN}/#website","url":"${ORIGIN}"}]</script></body></html>`;
}
function sitemap(paths, lastmods = {}) {
  return `<?xml version="1.0"?><urlset>${paths.map((p) => `<url><loc>${p.startsWith("http") ? p : ORIGIN + (p === "/" ? "" : p)}</loc>${lastmods[p] ? `<lastmod>${lastmods[p]}</lastmod>` : ""}</url>`).join("")}</urlset>`;
}
const nav = `<nav><a href="/">Home</a> <a href="/a">A</a> <a href="/b">B</a></nav>`;

/** control: everything correct */
function control() {
  return {
    routes: [{ path: "/", lastModified: undefined }, { path: "/a", lastModified: "2026-01-02" }, { path: "/b" }],
    files: {
      "/": page({ path: "/", title: "Home", body: nav + `<a href="/a#part">deep</a>`, ids: ["top"] }),
      "/a": page({ path: "/a", title: "A", body: nav + `<a href="#top">up</a>`, ids: ["part", "top"] }),
      "/b": page({ path: "/b", title: "B", body: nav }),
      "/sitemap.xml": sitemap(["/", "/a", "/b"], { "/a": "2026-01-02" }),
      "/share.png": PNG,
    },
  };
}

const fixtures = {
  "control passes": { build: control, expectFail: null },
  "wrong canonical origin fails": {
    build: () => { const f = control(); f.files["/a"] = page({ path: "/a", title: "A", canonical: "https://wrong.test/a", body: nav, ids: ["part", "top"] }); return f; },
    expectFail: /canonical "https:\/\/wrong\.test\/a" != expected/,
  },
  "wrong sitemap origin fails": {
    build: () => { const f = control(); f.files["/sitemap.xml"] = sitemap(["/", "https://wrong.test/a", "/b"], {}); return f; },
    expectFail: /sitemap: lists URL not in manifest or on wrong origin: https:\/\/wrong\.test\/a|manifest route missing from sitemap: https:\/\/example\.test\/a/,
  },
  "orphan page fails even with registry note": {
    build: () => { const f = control(); f.routes.push({ path: "/lonely", incoming: ["nav", "footer"] }); f.files["/lonely"] = page({ path: "/lonely", title: "Lonely", body: nav }); f.files["/sitemap.xml"] = sitemap(["/", "/a", "/b", "/lonely"], { "/a": "2026-01-02" }); return f; },
    expectFail: /\/lonely: orphan/,
  },
  "self-linked page still fails as orphan": {
    build: () => { const f = control(); f.routes.push({ path: "/selfie" }); f.files["/selfie"] = page({ path: "/selfie", title: "Selfie", body: nav + `<a href="/selfie">me</a><a href="#top">top</a>`, ids: ["top"] }); f.files["/sitemap.xml"] = sitemap(["/", "/a", "/b", "/selfie"], { "/a": "2026-01-02" }); return f; },
    expectFail: /\/selfie: orphan/,
  },
  "missing cross-page fragment fails": {
    build: () => { const f = control(); f.files["/"] = page({ path: "/", title: "Home", body: nav + `<a href="/a#nowhere">deep</a>`, ids: ["top"] }); return f; },
    expectFail: /fragment \/a#nowhere: no element with id "nowhere" on \/a/,
  },
  "missing fragment-only link fails": {
    build: () => { const f = control(); f.files["/b"] = page({ path: "/b", title: "B", body: nav + `<a href="#ghost">ghost</a>` }); return f; },
    expectFail: /fragment #ghost: no element with id "ghost" on \/b/,
  },
  "missing twitter image fails": {
    build: () => { const f = control(); f.files["/b"] = page({ path: "/b", title: "B", tw: null, body: nav }); return f; },
    expectFail: /\/b: twitter:image missing/,
  },
  "share image on foreign host fails": {
    build: () => { const f = control(); f.files["/b"] = page({ path: "/b", title: "B", og: "https://cdn.other.test/x.png", body: nav }); return f; },
    expectFail: /og:image host "cdn\.other\.test" != expected/,
  },
  "unfetchable owned image fails under remap": {
    build: () => { const f = control(); f.files["/b"] = page({ path: "/b", title: "B", og: `${ORIGIN}/missing.png`, body: nav }); return f; },
    expectFail: /og:image \/missing\.png on 127\.0\.0\.1:\d+ \(remapped\) → 404/,
  },
  "sitemap lastmod on a route without a recorded date fails": {
    build: () => { const f = control(); f.files["/sitemap.xml"] = sitemap(["/", "/a", "/b"], { "/a": "2026-01-02", "/b": "2026-05-05" }); return f; },
    expectFail: /\/b lastmod present but manifest lacks a date/,
  },
};

async function serve(files) {
  const server = createServer((req, res) => {
    const path = req.url.split("?")[0];
    const body = files[path];
    if (body === undefined) { res.writeHead(404, { "content-type": "text/html" }); res.end("<h1>404</h1>"); return; }
    res.writeHead(200, { "content-type": path.endsWith(".png") ? "image/png" : path.endsWith(".xml") ? "application/xml" : "text/html; charset=utf-8" });
    res.end(body);
  });
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  return { server, base: `http://127.0.0.1:${server.address().port}` };
}

let bad = 0;
for (const [name, fx] of Object.entries(fixtures)) {
  const { routes, files } = fx.build();
  const { server, base } = await serve(files);
  const { failures } = await runCrawl({ base, origin: ORIGIN, routes, assets: "remap" });
  server.close();
  const ok = fx.expectFail ? failures.some((f) => fx.expectFail.test(f)) : failures.length === 0;
  console.log(`${ok ? "ok  " : "FAIL"} ${name}${fx.expectFail ? "" : ` (${failures.length} failures)`}${ok ? "" : "\n     got: " + failures.join("\n          ")}`);
  if (!ok) bad++;
}
console.log(bad ? `\n${bad} fixture(s) did not behave as expected` : "\ncrawl.test: all fixtures behaved as expected");
process.exit(bad ? 1 : 0);
