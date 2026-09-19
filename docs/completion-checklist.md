# Completion Checklist

Three lists, kept separate on purpose. The first is the gate for replacing
WordPress. The second is the gate for the Compass starter. The third is
never a gate for anything — it is built on demand, measured page by page.

Status as of the contact-form milestone.

---

## A. Remaining launch work — replaces WordPress with nothing lost

| # | Item | Status | Notes |
|---|---|---|---|
| A1 | Homepage | ✅ | |
| A2 | `/services` directory | ✅ | Registry-driven cards and catalog |
| A3 | `/services/residential`, `/commercial`, `/industrial` | ✅ | |
| A4 | `/about` | ✅ | Portrait of Dan still needed |
| A5 | `/service-area` | ✅ | Missouri counties + approved communities + Edwardsville and Belleville, IL (D-003) |
| A6 | `/contact` + inquiry form | ✅ form · inbox receipt **unverified** (D-007) | `/api/inquiry` (Resend, same-origin check, per-instance rate limit, honeypot, server validation; no timing trap; submit disabled until hydrated). Success shown only on the server's `{ ok: true }`. Recipient info@showmeelectrical.com (D-004). Preview test: provider reports delivered; human inbox receipt unverified — Tom cannot check the inbox; no further tests sent. Sender on the agency's verified domain. |
| A7 | Retained blog content | ✅ | `/blog` + the 3 posts with dates and byline preserved; owner-approved wording edits applied 2026-09-19 (unsupported statistic, property-value claim, code claim, panel-age threshold, inspection CTAs, "fast", service area). No flags remain. |
| A8 | Legal pages | ✅ | Policy revision applied 2026-09-19 (canonical host, hosting-log wording, processors named, inquiry-only consent, no SMS enrolment via the form, no analytics cookies, industrial in terms §2). `docs/policy-revision-proposal.md` records the before/after. No flags remain. |
| A9 | Launch redirects | ✅ | `config/redirects.ts` + middleware rule 4 + `/global-styles` 410; `trailingSlash: false` settled; every legacy URL verified with `curl -I` (`docs/migration-inventory.md` §4). Re-verify on the real domain as part of A11 |
| A10 | Final content confirmation | ✅ | Address (D-005), analytics (D-006), blog wording and policy revision all applied. Still open but **not launch-blocking**: business hours (only gates availability wording), Dan's surname, founding year, photo of Dan. |
| A11 | Deployment checks | ⬜ | Production env (`NEXT_PUBLIC_ALLOW_INDEXING=true`, `NEXT_PUBLIC_SITE_URL`), robots/sitemap on the real domain, canonical host redirect, careers host regression (routing matrix in README), Search Console submission, GBP parity per SOP §3.4 |

**Not required for launch:** any individual service page, any city page,
new blog posts. The live site has none of these today.

## B. Compass starter extraction — after the client site is live

| # | Item | Status | Notes |
|---|---|---|---|
| B1 | Semantic colour tokens | ⬜ | `navy-*`/`lime-*` in component classes → `surface`, `accent`, `ink`, `paper`; done once against the finished page set |
| B2 | Remaining homepage content separation | ⬜ | `Hero` still imports `content/home.ts`; `AboutSection`, `Testimonials`, `ServicePathways`, `TrustBar` already take props |
| B3 | Optional careers support | ⬜ | Middleware, host resolution, sitemap and config assume a careers host — make its absence a config omission (roadmap §5.3) |
| B4 | Sitemap fully from registries | ✅ | `lib/routes.ts` builds the published-route list from `content/pages.ts` + services + blog + legal; `app/sitemap.ts` emits it with truthful `lastModified` only (Batch A) |
| B5 | Enquiry-form route in the starter | ✅ shape · ⬜ starter | `InquiryForm` + `lib/inquiry.ts` + `config/inquiry.config.ts` are already generic; the starter ships the config with empty recipients |
| B6 | Redirects as per-client data | ✅ shape · ⬜ starter | `config/redirects.ts` is the per-client map already; the starter ships it empty |
| B7 | Starter scaffolding | ⬜ | Empty typed `site.config.ts`, placeholder tokens, `content/` skeleton, the `docs/` templates, the §3 change list as a checklist |
| B8 | Validation gate script | 🟡 | `npm run qa:crawl:test` + `npm run qa:manifest` + `npm run qa:crawl` committed (negative fixtures; route manifest; raw-HTML crawl: single canonical on the production origin, sitemap as full URLs, rendered-only incoming links, fragment resolution, OG + Twitter images with explicit local asset validation, JSON-LD references, 404). Browser/form/agent checks follow in Batch C |
| B9 | **Check with a different brand** | ⬜ | Swap `site.config.ts`, `@theme` values, fonts, `decoration: "none"/"line"`, one service content file — and confirm nothing electrical, navy, lime or Show Me leaks through. The proof the starter is a starter. |

Detail and rationale for each: `docs/template-roadmap.md` §5.

## C. Later SEO expansion — on demand, never a gate

| Set | Count | Trigger |
|---|---|---|
| Individual residential service pages | 13 | Highest value first (emergency, panel upgrades, ceiling fans, EV chargers, rewiring, generators); the rest as Search Console shows hub impressions |
| Individual commercial service pages | 5 | Footprint pages; when sales needs one |
| Individual industrial service pages | 4 | Same |
| Tier-1 city pages | 8 | After launch, one at a time, genuinely local content each |
| Tier-2 city pages | 12 | Only once Tier-1 pages show impressions |
| New blog posts | 6 | One a month, per the keyword map |

URLs, keywords and volumes: `docs/page-plan.md` §3–5.
