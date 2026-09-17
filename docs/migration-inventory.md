# WordPress → Next.js Migration Inventory

**Source:** `https://showmeelectrical.com` · crawled 2026-09-16 from `wp-sitemap.xml`
**Status:** complete for pages, posts and categories. Media inventoried separately below.

The WordPress install publishes `wp-sitemap.xml` (the core sitemap — there is no
Yoast/RankMath `sitemap_index.xml`; that URL 404s). Everything below came from
that sitemap plus a fetch of each URL, not from a homepage crawl.

---

## 1. Pages (11)

| # | Existing URL | Purpose | Proposed URL | Action | Notes |
|---|---|---|---|---|---|
| 1 | `/` | Homepage | `/` | **Improve** | Rebuilt in this milestone. Keeps hero, 3 service pillars, 3-step process and testimonials as source material. **FAQ: do not reuse wholesale** — its emergency-service answer is factually wrong (see §9). |
| 2 | `/about/` | Owner story (Dan) | `/about` | **Improve** | Strong, usable copy. Reused on the homepage About section. Trailing-slash change needs a redirect. |
| 3 | `/services/` | Services hub | `/services` | **Rebuild** | **Currently near-empty** — renders only header/footer chrome, no service content. Becomes the hub for the 24-service taxonomy, including Emergency Electrical Service (see §9). |
| 4 | `/locations/` | Locations index | `/service-area` | **Consolidate + redirect** | Thin. Becomes the service-area page; Tier-3 cities live here per the keyword map. |
| 5 | `/st-louis/` | St. Louis city page | `/service-area/st-louis` | **Improve + redirect** | H1 is *"Industrial Electrical solutions for St. Louis, Missouri"* — narrower than a city page should be. Tier-1 city in the keyword map. |
| 6 | `/contact/` | Contact + form | `/contact` | **Improve** | Form backend must be replaced (see §5). |
| 7 | `/careers/` | Careers | `https://careers.showmeelectrical.com/` | **Redirect** | Superseded by the live careers site. |
| 8 | `/career/` | Careers (duplicate) | `https://careers.showmeelectrical.com/` | **Redirect** | **Duplicate of #7.** Two URLs for one purpose — a live duplicate-content issue. The main nav links to `/career/`. |
| 9 | `/global-styles/` | Elementor artifact | — | **Delete, do not migrate** | 248KB Elementor styles page, publicly reachable and in the sitemap. Should be `noindex` today. |
| 10 | `/terms-of-service/` | Legal | `/terms-of-service` | **Retain** | Copy carries over as-is. |
| 11 | `/privacy-policy/` | Legal | `/privacy-policy` | **Retain** | Copy carries over as-is. |

## 2. Posts (3)

| Existing URL | Proposed URL | Action |
|---|---|---|
| `/top-5-signs-your-home-needs-electrical-rewiring/` | `/blog/top-5-signs-your-home-needs-electrical-rewiring` | **Retain + redirect** — maps to keyword-map blog topic #1/#2 territory. |
| `/the-most-common-electrical-hazards-found-in-missouri-homes/` | `/blog/the-most-common-electrical-hazards-found-in-missouri-homes` | **Retain + redirect** |
| `/top-signs-you-need-to-call-an-electrician-immediately/` | `/blog/top-signs-you-need-to-call-an-electrician-immediately` | **Retain + redirect** — emergency service is now confirmed as offered (§9), so this post can link to the emergency service page. Still check it makes no availability or response-time promise. |

## 3. Taxonomy

| Existing URL | Proposed URL | Action |
|---|---|---|
| `/category/blog/` | `/blog` | **Consolidate** — single category, so a flat `/blog` index is enough. |
| `/wp-sitemap-users-1.xml` | — | **Drop** — author archives add nothing here. |

## 4. Redirect map

Posts and pages move from trailing-slash WordPress URLs to non-slash Next.js
routes, so every retained URL needs a 301. Recommended `next.config.ts`
redirects at launch:

| From | To | Code |
|---|---|---|
| `/about/` | `/about` | 301 |
| `/services/` | `/services` | 301 |
| `/locations/` | `/service-area` | 301 |
| `/st-louis/` | `/service-area/st-louis` | 301 |
| `/contact/` | `/contact` | 301 |
| `/careers/` | `https://careers.showmeelectrical.com/` | 301 |
| `/career/` | `https://careers.showmeelectrical.com/` | 301 |
| `/global-styles/` | `/` | 410 or 301 |
| `/<post-slug>/` | `/blog/<post-slug>` | 301 (×3) |
| `/category/blog/` | `/blog` | 301 |

Next.js `trailingSlash` behaviour should be settled before launch so the whole
set is consistent rather than handled case by case.

## 5. Forms and integrations

| Item | Current | Needed |
|---|---|---|
| Homepage contact form | Elementor form (Name, Company, Phone, Email, Subject, Message) | Rebuild as a route handler. The careers site already sends via Resend (`/api/apply`) — reuse that pattern. **Backend not yet built; the prototype uses `tel:` and `mailto:` links only and never shows a false success message.** |
| Contact page form | Elementor form | Same as above. |
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
| **Address inconsistency** | Low | Homepage says *"5602 Hegee Rd"*; other pages say *"5602 Heege Rd"*. Footer says *"St. Louis MO"*, About says *"Affton, MO"*. **Confirm the correct address** — it feeds NAP consistency and LocalBusiness schema. |
| **Stale copyright** | Low | Footer reads "Show Me Electrical 2025". |

## 7. Media

32 unique images in `/wp-content/uploads/`. Split into two groups:

**Real job-site photography (usable).** iPhone-style filenames (`IMG_*`,
`PHOTO-*`, UUID names from `2025/10`). Visually verified as genuine Show Me
Electrical work: panels, conduit rough-ins, high-bay lighting, retail
build-outs, finished interiors. Nine are optimised into `/public/photos` for
this prototype.

**Stock photography (do not present as client work).** Filenames ending in a
`-utc` timestamp are stock downloads — `worker-is-cutting-wires…`,
`electrical-outlet-replacement…`, `vintage-electric-switch…`,
`interior-of-a-lobby-hotel…`, `living-room…`. The brand board independently
confirms two of these as stock. **None are used in this prototype.**

**Missing:** a portrait of Dan. The About section currently shows a job-site
photo with a visible placeholder note.

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
