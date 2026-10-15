# Prelaunch audit — pass/fail report

Run **2026-10-13** against `claude/template-completion` @
`f0eb073d72114a337f3c5a9b7d12b91c05f0fbb4` — the current release candidate.
This supersedes the 2026-09-19 audit of `claude/main-site-foundation-v1` @
`e2dba27`, which is retained in git history. The re-audit was asked for
because the code moved 18 commits past the audited release: the brand
separation (`brands/showme` + the `@brand` alias), the second, fictional
brand, the durable inquiry idempotency work, and the service-area change
that made `address.street` optional.

Method: the repository's own suite (`npm run verify`, 202 checks) on a clean
`npm ci` checkout, then a separate audit harness over two full production
builds — the preview configuration and the launch configuration
(`NEXT_PUBLIC_ALLOW_INDEXING=true NEXT_PUBLIC_SITE_URL=https://showmeelectrical.com`)
— driving both hostnames with a `Host:` header. 52 audit checks in the
preview configuration, 55 in the launch configuration.

**Result: PASS. 107 audit checks and 202 suite checks, zero failures, zero
findings.** Nothing was fixed during this run because nothing failed. The
two items that can only be proven on the real hostnames after promotion
(P1–P2) are unchanged and still carried forward; see
`docs/deployment-plan.md` §5.

> Harness note, recorded because it nearly produced four false findings:
> Node's global `fetch` silently drops the `Host` header (a forbidden header
> name), which routes every careers-host check to the main site; and title
> and description limits must be measured on **decoded** text, since `&amp;`
> is one character to a search engine and five in the markup. Every
> host-dependent request in the harness goes through `curl`, and every
> length is measured after entity decoding.

## 0. What changed since the audited release, and what it means for launch

| Area | Change | Launch consequence |
|---|---|---|
| **URL surface** | 14 routes → **16**. Nothing was removed or renamed. The two additions are `/services/residential/electrical-panel-upgrades` (service detail) and `/service-area/edwardsville-il` (served city). | No redirect, canonical or legacy-URL consequence. The sitemap grows from 14 to 16. |
| Route implementation | The three service hubs and the two legal pages moved from static files to `app/services/[slug]`, `app/services/[slug]/[child]` and `app/[doc]`. | Same paths, same output — verified by the route matrix below. |
| `/locations` | New in the framework, **null for this brand** (`brands/showme/content/locations.ts`: one shop, no branch pages). | No `/locations` route is published. |
| `app/api/apply` (the **live** careers endpoint) | `FROM` and `TO` moved from literals to `brands/showme/careers.ts`, plus a 404 guard for brands with no careers property. | **Byte-identical values**: `Show Me Electrical Careers <careers@send.compassmarketing.ai>` and `["info@showmeelectrical.com", "thomas@compassmarketing.ai"]`. `site.careers` is non-null for this brand, so the guard never fires. No behaviour change for the live careers site. |
| `middleware.ts` | `site.careersUrl` → `site.careers.url`, plus a null guard. | Rules 1–4 unchanged for this brand; the careers host matrix below is identical to the 2026-09-19 run. |
| Legacy redirects | Moved from `config/redirects.ts` to `brands/showme/redirects.ts`. | Same table. Every entry verified behaviourally below, including all nine retained photos. |
| Indexing switch | `allowIndexing` is now `allowIndexing && !site.fictional`; `robots.ts` likewise. | No change for this brand (`fictional: false`). The switch still governs launch exactly as before. |
| `app/api/inquiry` | Rewritten onto a provider adapter with the provider's `Idempotency-Key` as the single authority for duplicate sends. | The largest functional change in the 18 commits. `INQUIRY_DELIVERY` is still ignored when `VERCEL_ENV=production` (`isProduction ? "" : …`), and `brands/showme/inquiry.config.ts` has `forceMock: false`, so production cannot be put into a mock mode. Covered by 50+ suite checks across two server instances. |

## 1. Pages, layout, content, motion — 16 routes

All 16 main-host routes answer 200 in both configurations.

| Check | Result |
|---|---|
| Horizontal overflow at 390px | 0 px |
| Stranded (invisible after scroll) elements, motion on | 0 hidden by opacity/visibility |
| Reduced motion | 0 elements left translated, 0 faded text after load |
| Single H1 per page | Pass on all 16 |
| Internal links and fragments | 0 unresolved (route manifest: 16 routes, 38 content links, 0 unresolved, 0 non-https external) |

Browser checks ran on the suite's five representative routes per brand
(home, a service detail, a served city, an article, contact), not on all 16.
Full-page visual review across every page remains Tom's, as before.

## 2. Keyboard, reduced motion, no JavaScript

| Check | Result |
|---|---|
| First Tab lands on a visible skip link; it reaches `#main` | Pass |
| Tap targets ≥ 24px | Pass (only the visually-hidden skip link excepted) |
| JavaScript disabled | H1 and main text present on every probed route (1,086–6,075 characters); no content hidden by opacity or visibility; the inquiry submit button disabled so no native submission is possible |

## 3. Metadata, canonicals, structured data, sitemap, indexing

| Check | Result |
|---|---|
| Title ≤ 60 characters, one per page (decoded) | Pass on all 16 |
| Description ≤ 155 characters (decoded) | Pass on all 16 |
| Canonical on `https://showmeelectrical.com`, one per page | Pass |
| JSON-LD present and parsing on every page | Pass |
| Every `about` / `isPartOf` / `provider` / `publisher` `@id` resolves to a node on the same page | Pass |
| FAQPage questions identical to the visible text | Pass on every page that renders FAQs |
| Address | `5602 Heege Rd` present (D-005); no "Hegee" anywhere |
| Claim sweep — 24/7 or round-the-clock, after-hours / overnight / weekend coverage, guarantees, "licensed Master", Missouri-wide, property-value claims, response-time promises | **Clean on all 16 routes.** The `www.showmeelectrical.com` hits the previous audit left open (P1/T1) are gone: 0 occurrences. |
| Sitemap, main host | 16 URLs, `showmeelectrical.com` origin, every route present, no careers URLs |
| Sitemap, careers host | 5 URLs, careers origin only (unchanged) |
| Preview configuration | `noindex` meta on every page, `Disallow: /` on both hosts |
| Launch configuration | `index, follow` on every page; neither host disallows; each `robots.txt` names its own sitemap; the review banner is absent on every page |

The two new routes carry their provenance in source.
`electrical-panel-upgrades.ts` derives every sentence from already-approved
residential-hub copy and names what it deliberately omits for want of a
source (prices, duration, permit and utility specifics, amperage
recommendations, brand names, and any residential panel photograph).
`edwardsville-il.ts` rests on decision **D-003** (owner-confirmed
2026-09-19): those two Illinois cities only, not their counties and not the
wider Metro East.

## 4. Redirects — legacy pages and retained images

| From | Result |
|---|---|
| `/about/`, `/services/`, `/contact/`, `/privacy-policy/`, `/terms-of-service/` | 1 hop → page, 200 |
| `/locations/` → `/service-area`; `/st-louis/` → `/services/industrial`; `/category/blog/` → `/blog` | 2 hops (Next's slash strip, then the rule), 200 |
| `/careers/`, `/career/` → careers host | 2 hops, 308, final `https://careers.showmeelectrical.com/` |
| `/careers/jobs/<slug>` → careers host `/jobs/<slug>` | 1 hop, 308 |
| `/wp-sitemap.xml` and its sub-sitemaps → `/sitemap.xml` | 1 hop, 200 |
| **All nine** retained photo URLs (`/wp-content/uploads/…`) → `/photos/<name>.webp` | 9 of 9: 200, `image/webp`, correct destination (the previous audit sampled three) |
| An unretained stock upload | 404 by design |
| `/global-styles/` | 410 Gone |

## 5. Contact form and production readiness

Covered by the suite rather than re-driven by hand: 50+ checks over server
validation (empty, name-only, no contact, bad email, bad phone, unknown
service), the honeypot, cross-origin POST, the per-instance rate limit,
provider failure and network failure, hydration and focus behaviour, and
the full duplicate-send contract across two independent server instances
(unchanged retry → the original provider id and exactly one send; edited
message under a used key → 409 `submission_changed` and nothing delivered;
simultaneous sends → one delivery and explicit `in_progress` conflicts for
the rest). Recipient `info@showmeelectrical.com`; sender
`Show Me Electrical Website <inquiries@send.compassmarketing.ai>`.

Delivery was **mocked throughout this audit — no message was sent.** The
2026-09-19 real-delivery evidence (provider reports delivered; human inbox
receipt unverified, D-007) still stands and is not re-tested; no test
messages without authorization.

## 6. Careers host and application workflow

| Check | Result |
|---|---|
| Careers host `/` and `/jobs/<slug>` | 200 |
| Careers host `/careers` | 308 → clean URL |
| Main-site paths on the careers host (`/about`, `/blog`, `/career`) | 404 |
| Main host `/careers*`, `/career*` | 308 → careers host |
| Canonical on the careers host | `https://careers.showmeelectrical.com` |
| `/api/apply` validation | GET 405; empty body 400; bad email 400; non-JSON 400. Probed against a server holding a deliberately invalid provider key, so validation is reachable and nothing past it could send. |

## 7. Launch configuration build

Built with `NEXT_PUBLIC_ALLOW_INDEXING=true NEXT_PUBLIC_SITE_URL=https://showmeelectrical.com`
and audited as its own server: 55 checks, all passing — see §3 for the
indexing, robots, sitemap and banner rows.

## 7a. Mobile loading performance — NOT re-measured

The 2026-09-19 audit recorded Lighthouse lab measurements (Lighthouse
12.8.2, Chromium 141, mobile form factor). **This run did not repeat them:**
Lighthouse is not installed in this environment and was not fetched. The 18
commits include layout-affecting work (brand separation, inline prose link
hit areas, per-brand build directories), so the earlier numbers should not
be assumed to carry over.

This is not a launch blocker on its own — it is lab data, not field data,
and the previous run's remaining performance items were already recorded as
non-blocking — but **re-measure before promotion if the earlier numbers are
going to be quoted as current.** Field Core Web Vitals remain a
post-launch item either way.

## 8. Findings

**None.** Nothing failed, so nothing was fixed during this run. For
contrast, the 2026-09-19 run carried three findings fixed in-flight
(F1–F3); all three remain fixed here, and the `www.showmeelectrical.com`
occurrences it left open in the legal documents are now gone.

## 8a. Addendum — hero change, 2026-10-13 (after the audit above)

The audit above was run against the tree at `f0eb073`. One change landed after
it, on the same branch, at the owner's request: the homepage hero became a
full-height photo panel, and its photo changed from
`/photos/commercial-panels.webp` to `/photos/tray-ceiling-recessed-lighting.webp`
(`2025/10/IMG_0176.jpg` from the client's WordPress library, newly retained —
§7a of the migration inventory now lists ten photos, not nine).

**It was not accepted on the strength of the earlier run.** Re-run against the
new build:

| Check | Result |
|---|---|
| `npm run verify`, whole | ALL PASSED |
| The audit harness, preview configuration | 52 / 52 |
| All ten retained photo redirects | 10 / 10 → 200, `image/webp`, correct destination |
| Horizontal overflow at 390, 1366 and 1920 | 0 px at every width |
| Primary CTA above the fold at 1366×768 | Visible on arrival — and it was **not**, at the first attempt. A straight `1fr/1fr` split narrowed the text column enough to wrap the headline to four lines and push the CTA onto the fold; the ratio is `1.12fr/0.88fr` because of that measurement. |
| Routes, sitemap, canonicals, redirects | Unchanged — the change touches one image and one component |

The release pin in `docs/deployment-plan.md` §0 therefore moves with this
branch; see the note there.

## 8b. Second re-audit — 2026-10-15, after the photography pass

Run against `claude/segment-photography` @ `719ee71`, which replaced the hero
and the service-page photography (§7a, §7e of the migration inventory). This
run closes the two gaps §7a and §8a left open: mobile performance was never
re-measured, and no run had ever looked at every page at every width.

**Result: PASS, with one accessibility finding (A1) that predates all of this
work and belongs to the Foundation, not to this brand.**

| What | Result |
|---|---|
| Audit harness, preview configuration | 52 / 52 |
| Audit harness, launch configuration | 55 / 55 |
| `npm run verify`, both brands | ALL PASSED |
| 16 routes × 2 widths (1366 and 390), rendered | 0 horizontal overflow, 0 broken images, 0 images without `alt`, exactly one `h1` each, no heading-level skip in the markup |
| All 13 retained-photo redirects | 200, `image/webp`, correct destination |

### Mobile performance — re-measured, and the headline number is a trap

Lighthouse 12.8.2, mobile form factor, launch-configuration build. The same
page measures very differently depending on the throttling method:

| Page | Simulated | Real (devtools) |
|---|---|---|
| `/` | perf **81**, LCP **4.0 s**, CLS 0, TBT 290 ms | perf **92**, LCP **1.7 s**, CLS 0, TBT 320 ms |
| `/services/residential` | perf 92, LCP 3.1 s, CLS 0 | — |
| `/contact` | perf 97, LCP 2.4 s, CLS 0 | — |

Accessibility 98 / 95 / 100, best practices 100 / 100 / 100, SEO 100 / 100 /
100.

**Why the two numbers differ, and which to believe.** The LCP element on the
homepage is the hero paragraph, not any image — the three hero photos are 28,
33 and 42 KB and are not the bottleneck. That paragraph is hidden by GSAP
(`autoAlpha`) until hydration, and `Reveal` has a guard for exactly this:
`immediateDeadlineMs: 1200` skips the hidden start state when hydration lands
late, so a slow device shows the text immediately. Lighthouse's *simulated*
throttling applies its penalty analytically — wall-clock `performance.now()`
still runs fast, the guard does not fire, and the simulation then charges for
text that a real slow phone would have been shown at once. Under real CPU and
network throttling the guard fires and LCP is **1.7 s**.

Treat **1.7 s / perf 92** as the honest lab figure and the simulated 4.0 s as
an artefact of measuring a real-time guard with a modelled clock. Neither is
field data; CrUX after launch is the only number that settles it.

### A1 — section headings are hidden from the accessibility tree until scrolled

**The only accessibility failure on the site, and it is a Foundation issue,
not a Show Me Electrical one.** It affects every brand built on this template.

`Reveal` and `StaggerText` hide their start state with GSAP `autoAlpha: 0`,
which sets `visibility: hidden` as well as `opacity: 0`. `visibility: hidden`
removes an element from the accessibility tree. So before a section has been
scrolled into view, its headings do not exist for assistive technology. The
exposed outline on the homepage at load is:

```
h1  Powering St. Louis homes and businesses…
h3  Plan            ← the h2 "Powering your project" above it is hidden
h3  Install
h3  Power on
h2  Explore / Areas Served / Contact   (footer, never animated)
```

axe therefore reports `heading-order` invalid — h1 followed by h3. Ten
headings on the homepage are hidden at load; the same pattern fails on
`/services/residential`.

**Not affected:** readers with `prefers-reduced-motion` (the animation is
removed outright — measured 0 faded, 0 translated), and anyone without
JavaScript (the server HTML renders everything visible; the no-JS suite
passes). In practice most screen readers scroll the viewport as the virtual
cursor moves, which fires the trigger — but the heading map is unreliable
until they do, and a crawler or tool that reads the tree once sees a broken
outline.

**It is a trade-off, not an oversight.** `autoAlpha` also prevents a keyboard
user tabbing into a link that is invisible on screen. Plain `opacity: 0`
would fix the heading outline and reintroduce that problem. Three ways out,
for the Foundation to decide rather than this release:

1. Animate an inner wrapper and leave headings out of the animated element —
   correct outline, keeps the effect, most work.
2. `opacity` instead of `autoAlpha`, plus `pointer-events: none` and
   `inert` on the un-revealed container — correct outline, no focus trap,
   `inert` also removes it from the tree, so the gain is partial.
3. Trigger reveals earlier so the hidden window is near zero in practice —
   cheapest, does not fix the outline at first paint.

**Not fixed in this release.** It predates the work Tom commissioned, it is
one rule on one tool, the two populations most at risk are explicitly
unaffected, and changing the motion system is a Foundation decision with its
own accessibility cost. Raised here so it is a choice rather than a surprise.

### Not findings, recorded so the next run does not re-investigate

- **The service-area chips take ~2 s to finish staggering in.** All eight
  reach full opacity by 2.5 s. Sampling earlier catches them mid-flight and
  looks like stranded content; it is not.
- **Scrolling back to the top re-arms the scroll reveals**, so below-fold
  elements correctly return to their hidden state. Measuring "is anything
  hidden after a full scroll" from the top of the page reports false
  positives. The question worth asking is whether anything is invisible
  *while in view*, and nothing is.
- `uses-responsive-images` offers ~150 ms on the homepage. Minor.

## 9. Carried forward

Unchanged from `docs/launch-checklist.md` and `docs/deployment-plan.md`:

- **P1** — the routing matrix and the non-sending apply probe on the real
  hostnames. Cannot be run against a preview: Vercel routes by domain.
  Post-promotion check, deployment plan §5.
- **P2** — a real application through the live form. Only if Tom authorizes
  it (D-007).
- **WordPress backup at WP Engine** — still not done, still a hard blocker.
  Needs WP Engine access the build team does not have.
- **The release is pinned by commit hash, not by a tag.** The previous plan
  keyed promotion to `launch-2026-09-19`, which was never pushed to the
  remote, so its own first promotion check could never have run. The hash is
  now written into `docs/deployment-plan.md` §0. Tagging is optional; this
  environment's git relay refuses refs outside `refs/heads/*`, so the tag
  could not be created from the audit session.
- **`NEXT_PUBLIC_ALLOW_INDEXING=true` and `NEXT_PUBLIC_SITE_URL` must exist
  on Vercel production before the build.** Without the first, promotion
  makes the live careers site `noindex` with `Disallow: /`. The sharpest
  risk in the plan, and this audit does not reduce it.
- **DKIM confirmation and the TTL reduction** in the GoDaddy zone.
- **Tom's visual review and launch approval.**

## 10. Repeat after launch

As before: the §4 and §6 matrices on the real hostnames, Search Console
coverage and 404s for days 1–7, provider delivery statuses, and field Core
Web Vitals once real-user data exists.
