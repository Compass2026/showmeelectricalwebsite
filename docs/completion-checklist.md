# Completion Checklist

Three lists, kept separate on purpose. The first is the gate for replacing
WordPress with the Show Me site (client launch work). The second is the
gate for the Compass Website Foundation (the reusable template) and does
**not** depend on the first: the Foundation is verified on previews and
accepted on its own commit. The third is never a gate for anything — it is
built on demand, measured page by page.

Status as of the C1/C2 correction pass (2026-09-20). Foundation v1 is
**ready for final review**, not finally approved.

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

## B. Compass Website Foundation — independent of the client launch

| # | Item | Status | Notes |
|---|---|---|---|
| B1 | Semantic colour tokens | ✅ (Batch C) | Components use `primary`, `accent`, `surface`, `ink`; values per brand in `brands/<brand>/theme.css` |
| B2 | Remaining homepage content separation | ✅ (Batch C) | Every homepage, root-layout, chrome, 404, blog and contact string comes from the brand (`@brand/content/*`, `site.metadata`, `site.footer`, `site.notFound`); sections hide when a brand has no content for them |
| B3 | Optional careers support | ✅ (Batch C) | `site.careers = null` removes host rules, nav/footer entries, sitemap entries, `/careers*` routes and `/api/apply` (Harbor Lane proves it). Enabled careers remains a Show Me-specific adapter; reuse for another hiring client needs its own review |
| B4 | Sitemap fully from registries | ✅ | `lib/routes.ts` builds the published-route list from `content/pages.ts` + services + blog + legal; `app/sitemap.ts` emits it with truthful `lastModified` only (Batch A) |
| B5 | Enquiry-form route in the starter | ✅ (Batch C; C1; C1 recovery correction) | Per-brand `inquiry.config.ts` (`forceMock` for demos). C1: local idempotency store + provider `Idempotency-Key`, explicit `duplicate` / `submission_changed` / `in_progress` outcomes, content-bound submission ids, form captured before async work. Recovery correction: the local record is a 60 s lease with an owner token; abandoned, unreadable, expired and released claims are re-acquired atomically (one owner per send on every retry path) and completion/release are owner-checked; mocked delivery goes through `lib/mock-provider.ts`, which enforces the provider key contract. `scripts/qa/idempotency.test.mjs` (31 checks) covers abandoned-lease recovery, waiters after a release, atomic acquisition on every path and the mocked key contract; `scripts/qa/forms.test.mjs` (44 checks) covers simultaneous requests, lost responses, an abandoned claim, a fresh instance with **isolated** storage reaching the same mocked key, edited content on both instances and server-validation focus |
| B6 | Redirects as per-client data | ✅ (Batch C: `brands/<brand>/redirects.ts` incl. `gone`) | `config/redirects.ts` is the per-client map already; the starter ships it empty |
| B7 | Starter scaffolding | ✅ (Batch C: `brands/harbor-lane` as the neutral shape + `docs/starter-checklist.md`) | Empty typed `site.config.ts`, placeholder tokens, `content/` skeleton, the `docs/` templates, the §3 change list as a checklist |
| B8 | Validation gate script | ✅ (Batch C; C2) | `npm run verify` / `FRESH=1 npm run verify`: type checks for both brands, lint, crawl fixtures, per-brand build + manifest + crawl + mocked forms + browser suite on representative pages, and production guards that assert their own error messages. Chromium resolved through `CHROMIUM_PATH` (README "Browser setup") |
| B10 | Service-detail, city and branch templates | ✅ (Batch B/C) | Show Me: `/services/residential/electrical-panel-upgrades`, `/service-area/edwardsville-il`; Harbor Lane: a child page, Northgate, two branches and `/locations`. Show Me's fictional fixture stays behind `COMPASS_DEMO`. See `docs/template-inventory.md` |
| B9 | **Check with a different brand** | ✅ (Batch C) | Harbor Lane builds from the same framework with zero Show Me strings, tokens or asset paths in its output and careers disabled. The proof the starter is a starter. |

| B11 | Agent-compatibility evidence | ✅ one agent family (Batch C; inquiry task re-run after C1) | `docs/agent-compatibility.md`: actual Claude-agent trials in Chromium on both brands, scripted checks kept separate; other agents, other browsers and the enabled careers workflow remain unverified |
| B12 | Final review | 🟡 ready for final review | C2 accepted by the reviewer. The one remaining C1 recovery defect (abandoned pending claim unrecoverable for 24 h; waiters after a release not acquiring ownership atomically) is corrected in the C1 recovery commit with focused mocked results; not finally approved |

Detail and rationale for each: `docs/template-roadmap.md` §5 and the Batch A–C logs.

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
