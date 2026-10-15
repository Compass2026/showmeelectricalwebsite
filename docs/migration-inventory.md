# WordPress → Next.js Migration Inventory

**Source:** `https://showmeelectrical.com` · crawled 2026-09-16 from `wp-sitemap.xml`
**Status:** complete — every URL below has an implemented destination or a
deliberate 410, verified with `curl` on 2026-09-19 (§4).

The WordPress install publishes `wp-sitemap.xml` (the core sitemap — there is no
Yoast/RankMath `sitemap_index.xml`; that URL 404s). Everything below came from
that sitemap plus a fetch of each URL, not from a homepage crawl.

---

## 1. Pages (11)

| # | Existing URL | Purpose | Proposed URL | Action | Notes |
|---|---|---|---|---|---|
| 1 | `/` | Homepage | `/` | **Improve** | Rebuilt in this milestone. Keeps hero, 3 service pillars, 3-step process and testimonials as source material. **FAQ: do not reuse wholesale** — its emergency-service answer is factually wrong (see §9). |
| 2 | `/about/` | Owner story (Dan) | `/about` | **Improve** | Strong, usable copy. Reused on the homepage About section. Trailing-slash change needs a redirect. |
| 3 | `/services/` | Services hub | `/services` | **Rebuilt ✅ — 301 at launch** | The live page is empty chrome; the rebuilt directory lists the three pathways and all 22 services from the registry of built pages. `/services/` → `/services` (trailing slash only). |
| 4 | `/locations/` | Locations index | `/service-area` | **Consolidated ✅ — 301 at launch** | The live page is thin. Rebuilt as the service-area page: seven counties, approved communities, no city pages yet. `/locations/` → `/service-area`. |
| 5 | `/st-louis/` | St. Louis "city" page | `/services/industrial` | **Redirected ✅ — 301 at launch** | Inspected 2026-09-19: the page is an industrial pitch, not a city page — H1 *"Industrial Electrical solutions for St. Louis, Missouri"*, sub-head *"Powering St. Charles, Lincoln & Warren Counties with Expert Industrial power"*, and a six-county "Areas we serve" list. Nothing else. The nearest built page by topic is the industrial hub; the county list lives at `/service-area`. **Final on the old page's content** (Tom, 2026-09-19): this mapping stands regardless of whether a St. Louis city page is built later. Not retained as a page: the old copy is thinner than the hub and would be a second, weaker industrial page. |
| 6 | `/contact/` | Contact + form | `/contact` | **Improve** | Form backend must be replaced (see §5). |
| 7 | `/careers/` | Careers | `https://careers.showmeelectrical.com/` | **Redirected ✅** | `middleware.ts` rule 4 sends main-host `/careers*` to the careers host (path preserved, so `/careers/jobs/x` → `/jobs/x`). |
| 8 | `/career/` | Careers (duplicate) | `https://careers.showmeelectrical.com/` | **Redirected ✅** | **Duplicate of #7.** Same middleware rule. |
| 9 | `/global-styles/` | Elementor artifact | — | **410 Gone ✅** | `app/global-styles/route.ts`. Never content; not redirected anywhere. |
| 10 | `/terms-of-service/` | Legal | `/terms-of-service` | **Migrated ✅** | Verbatim in `content/legal/terms-of-service.ts`; outdated references flagged in the reviewer notice (§10). |
| 11 | `/privacy-policy/` | Legal | `/privacy-policy` | **Migrated ✅** | Verbatim in `content/legal/privacy-policy.ts`; flags in §10. |

## 2. Posts (3)

| Existing URL | Proposed URL | Action |
|---|---|---|
| `/top-5-signs-your-home-needs-electrical-rewiring/` | `/blog/top-5-signs-your-home-needs-electrical-rewiring` | **Migrated ✅ + 301** — published June 14, 2025, byline Tom Dombrowski, reproduced word for word. |
| `/the-most-common-electrical-hazards-found-in-missouri-homes/` | `/blog/the-most-common-electrical-hazards-found-in-missouri-homes` | **Migrated ✅ + 301** — January 22, 2026, same byline. |
| `/top-signs-you-need-to-call-an-electrician-immediately/` | `/blog/top-signs-you-need-to-call-an-electrician-immediately` | **Migrated ✅ + 301** — January 22, 2026, same byline. Checked against D-001: it says "Need Help Fast?" and "fast, trusted electrical help" but makes no 24/7, after-hours or arrival-time promise. Flagged, not rewritten. |

## 3. Taxonomy

| Existing URL | Proposed URL | Action |
|---|---|---|
| `/category/blog/` | `/blog` | **Consolidated ✅ + 301** — single category, flat index. |
| `/wp-sitemap.xml` and its four sub-sitemaps (`-posts-post-1`, `-posts-page-1`, `-taxonomies-category-1`, `-users-1`) | `/sitemap.xml` | **301 ✅** — the author sitemap included, so no legacy sitemap URL 404s. |
| `/wp-content/uploads/…` (282 in the library; 32 referenced by live pages) | `/photos/<name>.webp` for the 11 retained photos | **11 redirected ✅, rest 404 by design.** The retained job-site photos redirect from their original upload URL to the re-encoded file (§7a); stock, unused and duplicate uploads are not redirected (§7b, §7c). |

## 4. Redirect map — implemented, verified

`config/redirects.ts` (data) → `next.config.ts` `redirects()`; `middleware.ts`
rule 4 for the careers paths; `app/global-styles/route.ts` for the 410.
`trailingSlash: false` is settled. Verified with `curl -I` against the
production build on 2026-09-19; every row lands on a page that exists.

| From (live WordPress) | Lands on | How | Hops |
|---|---|---|---|
| `/about/` | `/about` | Next's own slash-strip 308 | 1 |
| `/services/` | `/services` | same | 1 |
| `/contact/` | `/contact` | same | 1 |
| `/privacy-policy/` | `/privacy-policy` | same | 1 |
| `/terms-of-service/` | `/terms-of-service` | same | 1 |
| `/locations/` | `/service-area` | slash-strip, then `redirects.ts` | 2 |
| `/st-louis/` | `/services/industrial` | same | 2 |
| `/top-5-signs-…-rewiring/` | `/blog/top-5-signs-…-rewiring` | same | 2 |
| `/the-most-common-…-missouri-homes/` | `/blog/the-most-common-…-missouri-homes` | same | 2 |
| `/top-signs-…-immediately/` | `/blog/top-signs-…-immediately` | same | 2 |
| `/category/blog/` | `/blog` | same | 2 |
| `/careers/`, `/career/` | `https://careers.showmeelectrical.com/` | slash-strip, then middleware | 2 |
| `/careers/jobs/<slug>` | `https://careers.showmeelectrical.com/jobs/<slug>` | middleware | 1 |
| `/wp-sitemap.xml` + 4 sub-sitemaps | `/sitemap.xml` | `redirects.ts` | 1 |
| `/global-styles/` | **410 Gone** | slash-strip, then route handler | 1 + 410 |

The two-hop chains are Next.js behaviour: with `trailingSlash: false` it
strips the slash before `redirects()` runs, and a `/st-louis/` source entry
has no effect (tried and verified). Two permanent redirects consolidate fine;
the alternative — `skipTrailingSlashRedirect` plus hand-rolled slash handling
in middleware — would touch the live careers host's routing for no SEO gain.
All redirects are 308 (Next.js's permanent code), equivalent to 301 for
indexing.

**Careers host regression:** unchanged — `/` and `/jobs/<slug>` 200,
`/careers/*` 308 to the public form, every other path 404 (routing matrix in
the README re-run after this change).

## 5. Forms and integrations

| Item | Current | Needed |
|---|---|---|
| Homepage contact form | Elementor form (Name, Company, Phone, Email, Subject, Message) | **Replaced ✅** by the `/contact` inquiry form (`/api/inquiry`, Resend, same pattern as the careers form). Fields: name, email, phone, service (from the service registry), project details. The homepage links to `/contact` rather than embedding a second form. |
| Contact page form | Elementor form | **Replaced ✅** — see above. Recipient owner-confirmed: info@showmeelectrical.com (D-004). Delivery verified on the preview: see `docs/completion-checklist.md` A6. |
| Careers application | Live at careers.showmeelectrical.com, Resend-backed | **No change. Preserved as-is.** |

## 6. SEO findings from the existing site

Verified by `curl` against raw HTML, not a browser.

| Finding | Severity | Detail |
|---|---|---|
| **No meta descriptions anywhere** | High | Zero of 11 pages has `<meta name="description">`. |
| **No `<h1>` on primary pages** | High | Missing on `/`, `/about/`, `/services/`, `/contact/`, `/career/`. Present only on `/locations/`, `/st-louis/`, `/careers/` and the two legal pages. |
| **Bare title tags** | Medium | e.g. `About – Show Me Electrical`. No keyword or location. |
| **Duplicate careers pages** | Medium | `/careers/` and `/career/` both live and indexable. |
| **Elementor page in sitemap** | Medium | `/global-styles/` is public and indexable. |
| **Page weight** | Medium | 147KB–248KB of HTML per page before assets. |
| **Address inconsistency** | Low | Homepage said *"5602 Hegee Rd"*; other pages *"5602 Heege Rd"*; footer *"St. Louis MO"*, About *"Affton, MO"*. **Resolved (D-005):** 5602 Heege Rd, Affton, MO 63123 everywhere. |
| **Stale copyright** | Low | Footer reads "Show Me Electrical 2025". |

## 7. Media — retained photos mapped, retired assets listed

32 unique files under `/wp-content/uploads/` (plus Elementor CSS artifacts).
Image URLs are not redirected — nothing the rebuild controls links to them —
so each old URL will 404 after the move. The tables below are the record of
what became what.

### 7a. Retained — the client's own job-site photography (11)

Visually verified as genuine Show Me Electrical work, re-encoded to WebP at
up to 1600px wide (`public/photos/`; the 2026-10-13 addition is 2048px, the
width of its landscape original). Old paths are relative to
`https://showmeelectrical.com/wp-content/uploads/`.

| Old WordPress file | New file | Shows | Used on |
|---|---|---|---|
| `2025/10/10BF7BF3-A2B5-48E8-8859-44E5ABA87C19_4_5005_c.jpg` | `/photos/industrial-high-bay.webp` | High-bay warehouse lighting | Home, `/services/industrial` (hero) |
| `2025/10/B8048B09-5E7D-4030-935C-826FBC99AA97-1.jpg` | `/photos/commercial-checkout.webp` | Retail checkout build-out | Home, `/services/commercial` |
| `2025/10/IMG_0176.jpg` | `/photos/tray-ceiling-recessed-lighting.webp` | Recessed tray ceiling, eight downlights and two in-ceiling speakers, mid-renovation | Added 2026-10-13 as the home hero; **unplaced since 2026-10-15** (§7d). Retained and redirected. |
| `2025/07/IMG_6345.jpg` | `/photos/commercial-led-retrofit.webp` | Recessed LED panels in a commercial drop ceiling, brick wall, exit sign | Added 2026-10-13 as the hero's second frame; **unplaced since 2026-10-15** (§7d). Also on the live site's "Commercial Lighting" slide. Retained and redirected. |
| `2025/10/IMG_0179-1.jpg` | `/photos/finished-interior-lighting.webp` | Finished interior lighting | Home, `/services/residential` |
| `2025/10/IMG_0354-1.jpg` | `/photos/ceiling-fan-install.webp` | Ceiling fan installation | `/services/residential` |
| `2025/10/IMG_0488-1.jpg` | `/photos/roughin-attic.webp` | Recessed lighting rough-in, vaulted ceiling | Home, `/about`, `/blog`, `/services/residential` |
| `2025/10/IMG_1447-1.jpg` | `/photos/commercial-panels.webp` | Stainless wall units (not panels — alt corrected) | Home, `/services`, `/services/commercial` |
| `2025/10/IMG_2411-1.jpg` | `/photos/roughin-wall.webp` | Commercial wall rough-in | Home, `/services/commercial` |
| `2025/10/IMG_7032-1.jpg` | `/photos/roughin-framing.webp` | Rough-in in new framing | `/services/residential` |
| `2025/10/PHOTO-2025-04-15-22-41-56.jpg` | `/photos/service-entrance.webp` | Exterior service entrance, conduit risers | Home, `/about`, `/service-area`, `/services/commercial` |

Each of the nine old URLs above 301-redirects to its new file
(`config/redirects.ts`), so an inbound link or image-search result still
resolves. Scaled variants (`-1024x768` etc.) are not redirected.

Brand asset: `2024/08/Show-me-electric-white-logo-4.png` → `/logo-white.webp`
(cropped to the artwork). `2024/08/Show-me-electric-white-logo-2.png` is a
duplicate upload of the same logo and is retired.

### 7b. Retired — intentionally not carried over

| Group | Files | Why |
|---|---|---|
| **Stock photography** (never presented as client work) | `2025/06/vintage-electric-switch-…-utc.jpg` (+ `-scaled`), `2025/10/interior-of-a-lobby-hotel-reception-3d-illustratio-…-utc-1-1-1.jpg`, `2025/10/living-room-…-utc-4-1-1.jpg`, `2026/01/electrical-outlet-replacement-…-utc.jpg` (+ `-scaled`), `2026/01/worker-is-cutting-wires-…-utc.jpg` (+ `-scaled`) | `-utc` timestamp filenames are stock-library downloads; the brand board independently confirms two. The blog posts' featured images were these, so the posts now carry no image rather than a stock one. |
| **Additional client photos, unused for now** | `2025/10/66432045448__0F850129-…jpg`, `2025/10/7BD07746-…_4_5005_c.jpg`, `2025/10/87B73734-…_4_5005_c.jpg`, `2025/10/AD15139E-…_4_5005_c.jpg`, `2025/10/IMG_4323.jpg`, `2025/10/IMG_4659-1-1536x2048-1.jpg`, `2025/10/IMG_4815-1-1536x2048-1.jpg`, `2025/10/IMG_4886-1536x2048-1.jpg`, `2025/10/PHOTO-2025-04-15-23-37-49-1.jpg`, `2025/07/IMG_5571.jpeg` | Same job-site library, not needed by the current page set. Candidates for the individual service pages later; each must be visually verified before use, as the eleven above were. Not migrated = not lost: they stay in the WordPress media library until the site is retired, and should be exported with it. |
| **Facebook-sourced image** | `2025/06/499399452_2959955684207140_…_n.jpg` | Facebook CDN filename; provenance not verifiable, not used. |
| **Graphics of unknown provenance** | `2025/05/SHOW-ME-INVESTMENT-2.png`, `2025/05/unnamed.png`, `2025/05/unnamed-2.png`, `2025/05/unnamed-3.png` | Not photography; not referenced by any rebuilt page. Available in the WordPress library if the owner wants them. |
| **Site icon** | `2024/08/cropped-Untitled-design.png` | Replaced by `app/icon.svg`. |
| **Elementor CSS** | `elementor/css/post-*.css` | Build artifacts of the old theme. |

**Missing:** a portrait of Dan. The About page shows a job-site photo as a
stand-in; recorded in the reviewer notice, not captioned on the page.

### 7c. The library is larger than this inventory — corrected 2026-10-13

This section was built from the images the live pages reference (32). The
WordPress media library actually holds **282 items** (`/wp-json/wp/v2/media`,
three pages). The difference is not a migration gap — nothing referenced by a
rebuilt page was missed — but it changes what is available, and two things in
it are worth recording:

- **A much deeper job-site library than §7b implies**, including around thirty
  landscape frames. Most of the client's photography is portrait phone work
  (roughly 100 originals), which is why the retained nine were all 1536×2048
  and the hero cropped one of them. The genuine landscape frames are the
  scarce, useful ones: `IMG_0176` (now the home hero), `IMG_6345` (commercial
  LED troffer retrofit in a drop ceiling — now the hero's second frame), `31493461-…` (backlit onyx island; striking, but dim and
  an identifiable person is in frame, so it needs consent before use) and
  `6F134F3C-…` (built-in cabinetry with under-cabinet lighting).
- **A `DSC_*` set dated 2011–2012** (`DSC_0689-smaller.jpg` and similar,
  2500×1667) that is **not Show Me Electrical's work.** One was opened to
  check: a potted plant on a table — interior-decor imagery, no electrical
  content. Treat the whole set as unattributed and do not use it.

The stock group in §7b is also larger than listed: sixteen stock originals
carry the `-utc` signature, among them several 3D renders.

**Where the live site actually uses them**, read off the page on 2026-10-13 —
recorded precisely because an earlier note here said loosely that the hero
"rotates these", and the hero in fact uses two stock files that §7b never
listed:

| Live placement | File | Kind |
|---|---|---|
| Hero slide 1, "Powering Homes Across Missouri…" | `54218-glass-windows-and-doors-of-modern-house-…-utc` | stock photo |
| Hero slide 2, "Powering Businesses Across Missouri…" | `3d-rendering-business-meeting-room-on-high-rise-of-…-utc` | stock **3D render** |
| Service card, Residential | `living-room-…-utc` | stock photo |
| Service card, Commercial | `interior-of-a-lobby-hotel-reception-3d-illustratio-…-utc` | stock **3D render** |
| Service card, Industrial | `10BF7BF3-…` | the client's own — retained, §7a |
| Blog thumbnails (×3) | `worker-is-cutting-wires-…`, `electrical-outlet-replacement-…`, `vintage-electric-switch-…` | stock photos |

The live hero's *structure* — two slides alternating a homes message and a
businesses message — is kept by the rebuilt hero. Its two slide BACKGROUNDS
were carried over too, by the owner's decision on 2026-10-15; see §7d. The
rest of the stock above stays retired.

### 7d. Stock carried over by owner decision — 2026-10-15

Two stock images are published on the rebuilt site. They are recorded
separately from §7a so that section stays what it says it is: the client's
own photography.

| Old WordPress file | New file | What it is |
|---|---|---|
| `2025/07/54218-glass-windows-and-doors-of-modern-house-…-utc-scaled.jpg` | `/photos/modern-home-entrance.webp` | Stock photograph. Cedar-clad house entrance at dusk, glass door between two lit sconces. |
| `2025/07/3d-rendering-business-meeting-room-on-high-rise-of-…-utc-scaled.jpg` | `/photos/boardroom-cove-lighting.webp` | Stock **3D rendering**. Timber-panelled boardroom with cove lighting and recessed downlights. |

**Why they are here.** They are the live WordPress hero's own two slide
backgrounds, and the owner asked for the rebuilt hero to use them, after the
stock provenance was put to him twice. That is his call to make and it is
recorded as his, not as a finding of this inventory.

**What was decided against.** §7b's rule — the site does not present stock as
the client's work — is not weakened by this, and is the reason for the
handling below:

- Neither image is captioned, described or framed anywhere on the page as a
  Show Me Electrical job. They are illustrative only.
- The alt text describes what is actually in frame, and the second says
  "a rendering", because calling a 3D render a photograph would be untrue.
- They are not in §7a and are not counted among the retained job-site photos.

**Open item for the owner: the licence.** These came from the client's
WordPress library, but a stock licence does not transfer automatically to a
rebuild, a new domain or a new agency. Confirm the original licence covers
continued use on the relaunched site before launch. Nothing in this
repository can establish that.

**The alternative is still in the repository.** The client's own
`/photos/tray-ceiling-recessed-lighting.webp` (residential) and
`/photos/commercial-led-retrofit.webp` (commercial) were the hero's two
frames from 2026-10-13 to 2026-10-15 and remain retained and redirected,
ready to go back in.

## 8. Not yet inventoried / needs access

| Item | Why it matters |
|---|---|
| WordPress admin | Drafts, unpublished pages, form submission history, redirect plugins already in place. |
| Google Business Profile | The keyword map requires 24 GBP services in exact parity with site pages. |
| Google Search Console | Keyword map notes GSC was verified late Aug 2026 with ~30 days of data (7 clicks). Needed for a real baseline. |
| Google Analytics | No analytics tag identified in the page source. |
| Existing 301s | Any redirects already configured in WordPress. |

---

## 9. Emergency Electrical Service — plan

Owner-confirmed 2026-09-17 that the service **is** offered
(`docs/decisions.md` D-001), resolving the conflict between the approved
keyword map and the live FAQ.

**Page:** `/services/emergency-electrical-service` — service #2 in the approved
taxonomy, built in the service-page milestone alongside the rest.

**Keyword targets — retained, not struck:**

| Keyword | Role |
|---|---|
| `emergency electrician st louis` | **Money keyword #4** — "$47 CPC, highest-value term on the site" per keyword map v1.1 |
| *Emergency Electrical Service* | Service #2 in the 24-service taxonomy; needs matching Google Business Profile service entry for parity |

**Content that must be corrected, not migrated.** The live FAQ answer — *"No,
we do not offer emergency electrical services… we don't take emergency or
after-hours calls"* — is wrong and contradicts the service page. It must be
rewritten or dropped wherever the FAQ is rebuilt. It is **not** used anywhere
in the current rebuild.

**Copy constraint until hours are confirmed.** Hours and response times are
unconfirmed, so no page may claim 24/7 availability, after-hours or weekend
coverage, or a guaranteed arrival or response time. Name the service, give the
phone number, say nothing about when. Confirming hours is the top item in
`docs/open-questions.md` §6 and unblocks the availability wording — which
matters commercially, since the money keyword itself contains no time promise
but competing pages usually do.

**Homepage today:** an emergency block sits under the three service cards
naming the service with a call link, carrying a visible preview-only note that
availability wording is pending confirmed hours.

---

## 10. Migrated content — what was preserved and what is flagged

Posts and legal pages are reproduced **word for word** as data
(`content/blog/*.ts`, `content/legal/*.ts`) and rendered by the shared
`ArticleLayout` / `LegalLayout`. Nothing was rewritten or replaced with
generic text. Each file carries a `flags` array, shown only in the preview
reviewer notice, listing every claim or reference that needs an owner
decision. Stripped from every page: WordPress nav/footer chrome, the
"Related Posts" block, the county list and the "Show Me Electrical 2025"
footer line. The featured images were stock downloads and were not carried
over (no image is shown rather than a stock one).

| Page | Preserved | Flagged for decision |
|---|---|---|
| Rewiring post (2025-06-14, Tom Dombrowski) | Full body, date, byline | "serve homeowners throughout Missouri" (wider than listed area); unsourced fire statistic; "Increase property value"; closing lines with "home electrical inspection", `www.` address and "Where Safety Meets Service"; the byline is the WordPress author account (Compass), not the business |
| Hazards post (2026-01-22, Tom Dombrowski) | Full body incl. "TLDR" section, date, byline | "Missouri electrical code requires [GFCI]…" (code claim to confirm); "safety inspection" wording not in the taxonomy; byline |
| Call-immediately post (2026-01-22, Tom Dombrowski) | Full body, date, byline | "Need Help Fast?" / "fast" (response-time adjacent, no 24/7 or arrival promise); "across Missouri"; "request service online" (no form yet); byline |
| Privacy policy (Last Updated 2025-11-10) | All 11 sections verbatim | "St. Louis, MO" with no street address; `https://www.showmeelectrical.com` (www); cookies/analytics claim vs. no tags on the rebuild; Google Ads/Facebook/Instagram named; SMS opt-in applies once a form exists |
| Terms of service (Last Updated 2025-11-10) | All 14 sections verbatim | §2 lists residential and commercial only — no industrial; `www.` host; §14 contact is the bare `www.` address only; §5 SMS program preserved; §12 Missouri law vs. Illinois cities served |
