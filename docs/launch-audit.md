# Prelaunch audit — pass/fail report

Run 2026-09-19 against the release build of `claude/main-site-foundation-v1`
(local production build, preview configuration; then the launch
configuration with `NEXT_PUBLIC_ALLOW_INDEXING=true`; then spot checks on the
Vercel preview deployment). Method: raw HTML via `curl`, Playwright
(Chromium) for browser behaviour, both hostnames driven with a `Host:`
header locally. The full script and output are in the review package.

**Result: PASS**, with three findings fixed during the run and re-verified
(F1–F3) and two items that can only be proven on the real hostnames after
promotion (P1–P2, see `docs/deployment-plan.md` §5).

## 1. Pages, layout, content, motion — 14 pages

`/`, `/about`, `/services`, `/services/residential`, `/services/commercial`,
`/services/industrial`, `/service-area`, `/blog`, three posts,
`/privacy-policy`, `/terms-of-service`, `/contact`.

| Check | Result |
|---|---|
| Desktop (1440) and mobile (390) full-page screenshots, every page | Pass — no clipped sections, no overlapping text, address and phone consistent |
| Horizontal overflow at 390px | 0 px on every page |
| Fold at 1366×768 with motion on | H1 and first text visible on arrival on every page |
| Stranded (invisible after scroll) elements, motion on | 0 on every page, desktop and mobile |
| Reduced motion | 0 hidden elements on every page |
| Single H1, no skipped heading levels | Pass on every page |
| Navigation | Every nav/footer/breadcrumb link resolves; Careers links leave for the careers host by design |

## 2. Keyboard, reduced motion, no JavaScript

| Check | Result |
|---|---|
| Skip link, `main#main`, labelled sections, `aria-current` on breadcrumbs | Pass (home and contact have no breadcrumb by design) |
| Tab order through the inquiry form | name → email → phone → service → details → submit → phone link |
| FAQ disclosure by keyboard (Enter / Space) | Pass on hub pages |
| JavaScript disabled | All sections rendered; FAQ answers in the DOM; inquiry form rendered with the submit button disabled and a notice pointing at phone/email; no native submission possible |
| Tap targets under 24 px (mobile) | Only the visually-hidden skip link, on every page |

## 3. Metadata, canonicals, structured data, sitemap, indexing

| Check | Result |
|---|---|
| Title ≤ 60 chars, one per page | Pass (homepage title fixed this pass: 88 → 49) |
| Description ≤ 155 chars | Pass after F1 (homepage 235 → 155, service area 172 → 152) |
| Canonical = production URL, one per page | Pass |
| Open Graph / Twitter tags | Present; og:image on every page that has a hero photo |
| JSON-LD | Electrician + WebSite on every page; Service on hubs; AboutPage, WebPage, CollectionPage, Blog, BlogPosting, BreadcrumbList as appropriate; every `about` / `isPartOf` / `provider` reference resolves to a node on the same page |
| FAQPage = visible FAQ text | Identical on every page that renders FAQs (6, 5, 13, 9, 7, 4 questions) |
| Address in schema | `5602 Heege Rd, Affton, MO 63123` (D-005); no "Hegee" anywhere; no coordinates emitted (none confirmed) |
| Claim sweep (24/7, guarantees, "licensed Master", reviewer voice, Missouri-wide, fire ranking, property value, code claim, panel age, inspection CTA, "fast") | Clean on every page after F2. Only remaining hits: `www.showmeelectrical.com` ×3 in the legal documents — pending the policy revision (P1/T1) |
| Preview configuration | `noindex, nofollow` meta, `robots.txt` `Disallow: /`, review banner shown — on both hosts |
| Launch configuration (`NEXT_PUBLIC_ALLOW_INDEXING=true`) | see §7 |
| Sitemap, main host | 14 URLs, `showmeelectrical.com` origin, no careers URLs |
| Sitemap, careers host | 5 URLs, careers origin only |

## 4. Redirects — legacy pages and retained images

| From | Result |
|---|---|
| `/about/`, `/services/`, `/contact/`, `/privacy-policy/`, `/terms-of-service/` | 1 hop → page, 200 |
| `/locations/` → `/service-area`; `/st-louis/` → `/services/industrial`; `/category/blog/` → `/blog`; three post URLs → `/blog/<slug>` | 2 hops (Next's slash strip, then the rule), 200 |
| `/careers/`, `/career/` → careers host; `/careers/jobs/<slug>` → careers host `/jobs/<slug>` | 308 |
| `/wp-sitemap.xml` + 4 sub-sitemaps → `/sitemap.xml` | 1 hop, 200 XML |
| `/global-styles/` | 410 Gone |
| 9 retained photo URLs (`/wp-content/uploads/…`) → `/photos/<name>.webp` | 1 hop, 200 `image/webp` (three sampled) |
| Stock upload URL | 404 by design |

## 5. Contact form and production readiness

| Check | Result |
|---|---|
| Server validation (empty, name only, no contact, bad email, bad phone, unknown service, 3,001-char details) | 400 with field codes; inline messages rendered |
| Valid submissions (phone only, email only, known service) | Accepted; mocked delivery logged with recipient `info@showmeelectrical.com`, Reply-To the visitor |
| Fast submission (autofill/paste, 388 ms after load) | Accepted — no timing trap |
| Honeypot | Silent 200, nothing delivered |
| Cross-origin POST / non-JSON / GET | 403 / 400 / 405 |
| Per-instance rate limit | 6th request from one IP in 10 min → 429 (per instance only, documented) |
| Provider failure (simulated) | 502; failure banner with phone + email; all five values preserved; focus moves to the banner |
| Network failure | Message shown, values preserved |
| Server 400 with client checks bypassed | Field error rendered, values preserved |
| Loading state | Button disabled, "Sending…", `aria-busy` |
| Success only on server `{ ok: true }` | Pass |
| Pre-hydration / no-JS | Submit disabled in served HTML, `method="post"`, no data in URL |
| Production configuration | `RESEND_API_KEY` present for production; `INQUIRY_*` defaults correct; `INQUIRY_DELIVERY` absent in production; mock/fail ignored when `VERCEL_ENV=production` (code). Real-delivery test on the preview: **provider reports delivered; human inbox receipt unverified** (D-007) |

## 6. Careers host and application workflow (release build, `Host:` header)

| Check | Result |
|---|---|
| `/` and the four `/jobs/<slug>` pages | 200 |
| `/careers`, `/careers/jobs/<slug>` on the careers host | 308 → clean URL |
| Main-site paths on the careers host (`/about`, `/blog`, `/career`) | 404 |
| Main host `/careers*`, `/career*` | 308 → careers host (rule 4) |
| Per-host robots and sitemap; canonical on job pages | Correct host in each |
| Careers home after hydration | H1 present, job cards present, no main-site nav |
| Application form (`/?role=<slug>#apply`, where job pages link) | In the served HTML and interactive after hydration; the job page's apply link 308s from `/careers?role=…` to `/?role=…` on the careers host |
| `/api/apply` validation | GET 405; missing fields 400; bad email 400; honeypot silent 200; valid body with a dummy key → 502 from the provider (no email sent). Route file unchanged since the live deployment (`git diff` empty). |

P1 — the same matrix and the non-sending apply-route probe on the real
hostnames — is the post-promotion check in the deployment plan; it cannot
be run against a preview because Vercel routes by domain. P2 — a real
application through the live form — happens only if Tom authorizes it
(D-007: no test messages without authorization).

## 7. Launch configuration build

Built with `NEXT_PUBLIC_ALLOW_INDEXING=true NEXT_PUBLIC_SITE_URL=https://showmeelectrical.com`:

| Check | Result |
|---|---|
| Robots meta, both hosts | `index, follow` |
| `robots.txt`, both hosts | Allow, own sitemap |
| Review banner | Hidden on every page (gated on the same switch) |
| Reviewer notes text in HTML | Absent |
| Canonicals and sitemap origin | `https://showmeelectrical.com`, careers host unchanged |

## 7a. Mobile loading performance (lab measurements, not real-user data)

**Environment.** Lighthouse 12.8.2, Chromium 141 headless, mobile form
factor (412×823, DPR 1.75), performance category only. Two throttling modes:
*simulated* (Lighthouse's default model: 150 ms RTT, 1.6 Mbps, 4× CPU) and
*applied* (`devtools`: 562 ms request latency, 1.5 Mbps, 4× CPU, actually
enforced in the browser). Local runs hit `next start` over HTTP/1.1 in the
sandbox; deployed runs hit the Vercel preview through the sandbox's HTTPS
proxy, which also negotiates HTTP/1.1 — so neither run benefits from the
HTTP/2 multiplexing real visitors get on Vercel, and both are pessimistic
for request queuing. These are lab numbers on one device profile; there is
no real-user (field) data yet — see the follow-up in §9.

**Finding (material) and fix.** Above-the-fold entrance animations
(`Reveal`/`StaggerText` with `immediate`) faded already-painted hero content
back in after hydration. On a slow device that pushed Largest Contentful
Paint out by the whole hydration time: LCP render delay of 2.4–3.0 s on
every page, with FCP under 1.1 s. Fix: `motion.immediateDeadlineMs` (1200)
in `config/theme.config.ts` — immediate entrances play only if hydration
happened within 1.2 s of navigation start; otherwise the server-rendered
content is left as is. Scroll-triggered entrances are unaffected; fast
devices still see the entrance (verified: hero words at opacity 0 at 266 ms,
1 after the animation).

| Page | Simulated, before → after | Applied throttling, local build | Applied throttling, **deployed preview** |
|---|---|---|---|
| `/` | score 82 → 92 · LCP 3.5 → 3.2 s · TBT 346 → 108 ms · SI 3.2 → 1.5 s | score 79 · FCP 1.8 s · LCP 3.2 s (hero image, queued behind 5 font preloads on HTTP/1.1) · TBT 477 ms · CLS 0.06 | **score 85 · FCP 1.8 s · LCP 1.8 s · TBT 498 ms · CLS 0.055 · SI 2.1 s · 516 KiB** |
| `/services/residential` | 94 → 96 · LCP 2.8 → 2.6 s · TBT 141 → 112 ms | 87 · FCP 1.8 s · LCP 1.8 s · TBT 425 ms · CLS 0.06 | **84 · FCP 1.8 s · LCP 1.8 s · TBT 557 ms · CLS 0.049 · SI 2.0 s · 363 KiB** |
| `/contact` | 96 → 96 · LCP 2.7 → 2.7 s · TBT 36 ms | 98 · FCP 1.7 s · LCP 1.7 s · TBT 119 ms · CLS 0.00 | **98 · FCP 1.7 s · LCP 1.7 s · TBT 128 ms · CLS 0.001 · SI 1.7 s · 321 KiB** |

The simulated mode cannot exercise the deadline (its trace runs unthrottled
and hydrates early), which is why simulated LCP barely moves; under applied
throttling LCP equals FCP on every page, which is the intended effect.

**Remaining, not launch-blocking.** Total Blocking Time of ~0.5 s on the
homepage and hubs under 4× CPU slowdown comes from hydration plus the GSAP
scroll-trigger setup (main-thread "Style & Layout" ~1 s). Score bands: LCP
and CLS "good", TBT "needs improvement" on those two pages. CLS 0.05 is font
swap. Cheap follow-ups after real-user data exists: drop the unused Poppins
500 weight preload, defer the scroll-story rail setup below the fold,
consider a lower `quality` for hero images. Not done now: no evidence yet
that real users on real devices are affected, and each change touches the
shared motion system that every page uses.

## 8. Findings fixed during the audit

| # | Finding | Fix |
|---|---|---|
| F1 | Homepage and service-area meta descriptions over 155 characters (235, 172) | Rewritten to 155 and 152 |
| F2 | Hazards post still said "Outdated wiring is one of the leading causes of electrical fires" (a second unsupported ranking, in the body) | "Outdated wiring can cause electrical fires." |
| F3 | README routing matrix predated rule 4 (main host `/careers` was listed as 200) | Matrix updated: 308 to the careers host, main-site paths 404 on the careers host, banner hidden in production |
| F4 | Entrance animations delayed LCP by the hydration time on slow devices (§7a) | Late-hydration deadline for immediate entrances |

## 9. Repeat after launch

See `docs/deployment-plan.md` §8. The audit script (`full-audit.sh` in the
review package) runs unchanged against any port; the same checks on the real
hostnames need only the host names swapped. Performance: once the site has
28 days of Chrome UX Report data (Search Console → Core Web Vitals, or
PageSpeed Insights "field data"), compare LCP/INP/CLS against the lab
numbers above and act on the follow-ups in §7a only if the field data
shows a problem.
