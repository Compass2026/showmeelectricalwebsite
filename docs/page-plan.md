# Site Structure & URL Map

**Sources:** `docs/migration-inventory.md` (crawl of the live site, 2026-09-16) ·
*Service Taxonomy, Keyword Map & Tracked List v1.1* (approved 2026-09-02) ·
*Compass Master SEO Audit Checklist v1.0* · *Compass SOP SEO-AEO-GEO v3.1*.

**Status:** proposed. One service page is built (marked ✅). Everything else
is planned and not yet routed — nothing in this document is a promise that a
URL resolves today.

---

## Principles applied

1. **One page per taxonomy entry.** The approved map gives 24 services; each
   gets one page, one primary keyword, and one matching Google Business
   Profile entry (map §"How this document works").
2. **Preserve URLs where the page survives.** WordPress URLs carry a trailing
   slash; Next.js routes do not. Every retained page gets a 301 from its old
   URL, listed in §6. Nothing that exists today 404s after launch.
3. **Hierarchy in the URL, because it feeds breadcrumbs.** Services nest under
   their pathway (`/services/residential/…`), cities under `/service-area/…`,
   posts under `/blog/…`. BreadcrumbList schema mirrors the path.
4. **Thin pages are a liability** (map §"What the data shows"). Tier-3 cities
   get no page; they live on the service-area page. Nothing is built to hold a
   keyword it cannot support with real content.
5. **Per-page standard** (checklist §2.1, §2.5; SOP §5.1.4–5.1.5): unique
   title ≤ 60 chars and description ≤ 155 chars, one H1 carrying the primary
   keyword, self-referencing canonical, OG tags, BreadcrumbList on every page,
   Service + FAQPage on service pages, FAQPage text matching visible text
   exactly, 10+ FAQs on service and location pages, everything in the initial
   HTML.

---

## 1. Core pages

| Page | Purpose | Primary keyword | Existing URL | Proposed URL | Status |
|---|---|---|---|---|---|
| Home | Business overview, three pathways, process, trust | electrician st louis (260/mo) | `/` | `/` | ✅ Prototype |
| About | Dan, the credential, the team, how the company works | *(supporting: st louis electrician)* | `/about/` | `/about` | Planned — content already on the homepage About section |
| Contact | Phone, email, address, enquiry form | — | `/contact/` | `/contact` | ✅ Built (form pending backend) |
| Services hub | Index of the three pathways and all 24 services | electrical contractor st louis | `/services/` | `/services` | Planned — the live page is empty chrome |
| Service area hub | Counties, Tier-1/2 city links, Tier-3 city list | electrician near me *(won via GBP, not this page)* | `/locations/` | `/service-area` | Planned |
| Blog index | Post listing | — | `/category/blog/` | `/blog` | Planned |
| Privacy policy | Legal | — | `/privacy-policy/` | `/privacy-policy` | Planned — copy carries over |
| Terms of service | Legal | — | `/terms-of-service/` | `/terms-of-service` | Planned — copy carries over |
| Careers | Recruiting | — | `/careers/`, `/career/` | `https://careers.showmeelectrical.com/` | ✅ Live (separate host, unchanged) |

## 2. Service pathway hubs (3)

Each hub introduces the pathway, lists its services with problem-led
summaries, shows authentic photography, carries FAQs, and links down to every
child page. The hub keyword for residential is not in the approved map; it was
measured for this plan from the same DataForSEO source and location as the map
(2026-09-19: 20/mo, HIGH competition, $9.77 CPC — "electrician st louis" in the
same call returned the map's 260/mo, confirming the location).

| Pathway | Primary keyword | Vol/mo | Existing URL | Proposed URL | Status |
|---|---|---|---|---|---|
| Residential | residential electrician st louis | 20 (measured) | — *(none; homepage card only)* | `/services/residential` | ✅ **Built this milestone** |
| Commercial | commercial electrician st louis (#14, hub) | 10 | — | `/services/commercial` | Planned |
| Industrial | industrial electrician st louis (#20, hub) | 10 | — | `/services/industrial` | Planned |

## 3. Service pages (24) — one per taxonomy entry

Numbers are the taxonomy's. Volumes are the map's. None exist on the live
site, so there are no existing URLs and no redirects.

### Residential (13) — under `/services/residential/`

| # | Service | Primary keyword | Vol/mo | Proposed URL |
|---|---|---|---|---|
| 1 | Electrical Repair & Troubleshooting | electrical repair st louis | low | `/services/residential/electrical-repair` |
| 2 | Emergency Electrical Service | emergency electrician st louis | 20 · **money kw #4** | `/services/residential/emergency-electrical-service` |
| 3 | Electrical Panel Upgrades & Replacement | electrical panel upgrade st louis | <10 · **money kw #5** | `/services/residential/electrical-panel-upgrades` |
| 4 | Circuit Breaker Repair & Replacement | circuit breaker replacement st louis | low | `/services/residential/circuit-breaker-replacement` |
| 5 | Home Rewiring | home rewiring st louis | 10 | `/services/residential/home-rewiring` |
| 6 | New Construction Wiring | new construction electrical st louis | low | `/services/residential/new-construction-wiring` |
| 7 | Remodel & Home Addition Electrical | remodel electrician st louis | low | `/services/residential/remodel-and-addition-electrical` |
| 8 | Lighting & Fixture Installation | light fixture installation st louis | low | `/services/residential/lighting-installation` |
| 9 | Ceiling Fan Installation | ceiling fan installation st louis | 40 · best service term | `/services/residential/ceiling-fan-installation` |
| 10 | Outlet & Switch Installation | outlet installation st louis | low | `/services/residential/outlet-and-switch-installation` |
| 11 | Smart Home & Security Wiring | smart home wiring st louis | low | `/services/residential/smart-home-wiring` |
| 12 | EV Charger Installation | ev charger installation st louis | 20 | `/services/residential/ev-charger-installation` |
| 13 | Generator Installation | generator installation st louis | 10 | `/services/residential/generator-installation` |

Emergency service (#2) sits under residential per the taxonomy, though it is
offered to every customer type. Its copy is bound by decision D-001: name the
service, give the number, claim nothing about hours or response times until
they are confirmed.

### Commercial (6) — under `/services/commercial/`

| # | Service | Primary keyword | Vol/mo | Proposed URL |
|---|---|---|---|---|
| 14 | Commercial Electrical Services | commercial electrician st louis | 10 · **money kw #6** | *(this is the hub, `/services/commercial`)* |
| 15 | Tenant Build-Outs | tenant build out electrical st louis | low | `/services/commercial/tenant-build-outs` |
| 16 | Commercial Lighting & LED Retrofits | commercial lighting st louis | low | `/services/commercial/commercial-lighting` |
| 17 | Commercial Panel & Service Upgrades | commercial electrical panel st louis | low | `/services/commercial/panel-and-service-upgrades` |
| 18 | Electrical Code Compliance & Inspections | electrical inspection st louis | low | `/services/commercial/code-compliance-and-inspections` |
| 19 | Commercial Electrical Maintenance | commercial electrical maintenance | ~10 · footprint page | `/services/commercial/electrical-maintenance` |

### Industrial (5) — under `/services/industrial/`

| # | Service | Primary keyword | Vol/mo | Proposed URL |
|---|---|---|---|---|
| 20 | Industrial Electrical Services | industrial electrician st louis | 10 | *(this is the hub, `/services/industrial`)* |
| 21 | Switchgear & Transformer Installation | switchgear installation st louis | low | `/services/industrial/switchgear-and-transformers` |
| 22 | Machinery & Equipment Hookups | machine wiring st louis | low | `/services/industrial/machinery-and-equipment-hookups` |
| 23 | Control Panels & Power Distribution | control panel wiring st louis | low | `/services/industrial/control-panels-and-power-distribution` |
| 24 | Preventative Industrial Maintenance | industrial electrical maintenance | ~10 · footprint page | `/services/industrial/preventative-maintenance` |

Pages 19 and 24 are measured on contracts signed, not rankings (map
§"Maintenance caveat").

## 4. City pages

Per the map: Tier 1 built full (Ameren specifics, county permitting,
communities served, local project examples), Tier 2 built lighter, Tier 3
listed on the hub only. City pages carry LocalBusiness-with-areaServed and
BreadcrumbList; unique content per city, never templated swaps (checklist
§2.3).

| Tier | City | Primary keyword | Existing URL | Proposed URL |
|---|---|---|---|---|
| 1 | St. Louis | electrician st louis | `/st-louis/` | `/service-area/st-louis` |
| 1 | St. Charles | electrician st charles mo | — | `/service-area/st-charles` |
| 1 | Chesterfield | electrician chesterfield mo | — | `/service-area/chesterfield` |
| 1 | O'Fallon, MO | electrician o'fallon mo | — | `/service-area/ofallon` |
| 1 | Kirkwood | electrician kirkwood mo | — | `/service-area/kirkwood` |
| 1 | Florissant | electrician florissant mo | — | `/service-area/florissant` |
| 1 | Wentzville | electrician wentzville mo | — | `/service-area/wentzville` |
| 1 | Webster Groves | electrician webster groves | — | `/service-area/webster-groves` |
| 2 | Ballwin · Ellisville · Manchester · Creve Coeur · Clayton · University City · Maplewood · Fenton · Arnold · St. Peters · Edwardsville IL · Belleville IL | electrician \<city\> | — | `/service-area/<city-slug>` (12) |
| 3 | ~50 remaining communities | — | — | listed on `/service-area`, no page |

The live `/st-louis/` page is titled *"Industrial Electrical solutions for
St. Louis"* — a narrow industrial page wearing a city URL. It becomes the
Tier-1 St. Louis city page and its industrial content moves to
`/services/industrial`.

## 5. Blog

| Existing URL | Proposed URL | Note |
|---|---|---|
| `/top-5-signs-your-home-needs-electrical-rewiring/` | `/blog/top-5-signs-your-home-needs-electrical-rewiring` | Retain; link to home-rewiring page |
| `/the-most-common-electrical-hazards-found-in-missouri-homes/` | `/blog/the-most-common-electrical-hazards-found-in-missouri-homes` | Retain; link to repair + panel pages |
| `/top-signs-you-need-to-call-an-electrician-immediately/` | `/blog/top-signs-you-need-to-call-an-electrician-immediately` | Retain; link to emergency page; check for availability promises |
| — | `/blog/<slug>` ×6 | Map's first six topics, one per month |

---

## 6. Redirects required at launch

301 unless noted. Implement in `next.config.ts` `redirects()`; verify each
with `curl -I` before DNS moves.

| From (live WordPress) | To | Why |
|---|---|---|
| `/about/` | `/about` | trailing slash |
| `/services/` | `/services` | trailing slash |
| `/contact/` | `/contact` | trailing slash |
| `/locations/` | `/service-area` | renamed |
| `/st-louis/` | `/service-area/st-louis` | moved under hub |
| `/careers/` | `https://careers.showmeelectrical.com/` | separate host |
| `/career/` | `https://careers.showmeelectrical.com/` | duplicate page, separate host |
| `/privacy-policy/` | `/privacy-policy` | trailing slash |
| `/terms-of-service/` | `/terms-of-service` | trailing slash |
| `/top-5-signs-your-home-needs-electrical-rewiring/` | `/blog/top-5-signs-your-home-needs-electrical-rewiring` | moved under `/blog` |
| `/the-most-common-electrical-hazards-found-in-missouri-homes/` | `/blog/the-most-common-electrical-hazards-found-in-missouri-homes` | moved under `/blog` |
| `/top-signs-you-need-to-call-an-electrician-immediately/` | `/blog/top-signs-you-need-to-call-an-electrician-immediately` | moved under `/blog` |
| `/category/blog/` | `/blog` | consolidated |
| `/global-styles/` | — | **410 Gone.** Elementor artifact, never content |
| `/wp-sitemap*.xml` | `/sitemap.xml` | sitemap moved |

Settle `trailingSlash` in `next.config.ts` once, before launch, so every rule
above behaves consistently.

---

## 7. What is not in the plan, and why

- **No page per service × city** (47 × 70 = 3,290 in the map's own arithmetic).
  Demand does not support it and thin pages are a liability.
- **No brand page.** "show me electrical" has ≤ 20/mo; the homepage carries it.
- **No emergency hours or response-time page content anywhere** until hours
  are confirmed (decision D-001, `docs/open-questions.md` §6).
- **No `/about` yet** — its content is on the homepage; the standalone page
  is a routing change, not a content change, and follows the service pages.

## 8. Build order proposed

1. ✅ Residential hub (this milestone) — proves the reusable structure.
2. Commercial + industrial hubs — same components, different section order
   and emphasis.
3. The six highest-value service pages: emergency (#2), panel upgrades (#3),
   ceiling fans (#9), EV chargers (#12), rewiring (#5), generators (#13).
4. Services hub `/services`, then the remaining 15 service pages.
5. Service-area hub + 8 Tier-1 cities, then 12 Tier-2.
6. About, blog, legal, redirects, launch prep.
