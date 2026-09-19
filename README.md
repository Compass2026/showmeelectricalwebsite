# Show Me Electrical — Website

Next.js (App Router) + TypeScript + Tailwind CSS v4. Two properties share this
codebase:

| Property | Routes | Status |
|---|---|---|
| **Careers site** | `/careers`, `/careers/jobs/[slug]`, `/api/apply` | **LIVE** at `careers.showmeelectrical.com` |
| **Main site** | `/`, `/about`, `/contact`, `/services`, `/services/{residential,commercial,industrial}`, `/service-area`, `/blog`, `/blog/[slug]`, `/privacy-policy`, `/terms-of-service` | **Prototype** — under review |

This repo is also the first implementation of the reusable **Compass
Marketing website system**. See "Reusing this for another client" below and
`docs/template-roadmap.md` for what is reusable today and what is not yet.

---

## Routing: how the two properties coexist

The careers site is live and serves its pages at `/` and `/jobs/<slug>` on
`careers.showmeelectrical.com`. The main-site rebuild needs `/` for its own
homepage, so the careers routes moved to `/careers/*` internally, and
`middleware.ts` rewrites the careers host back onto them:

```
careers.showmeelectrical.com/              → /careers
careers.showmeelectrical.com/jobs/<slug>   → /careers/jobs/<slug>
```

A **rewrite**, not a redirect — every existing public careers URL is unchanged
in the address bar, in search results and in any existing link.

Careers components link internally to `/careers/*`, which is the real path on
the main host but **not** a valid public URL on the careers host. Left alone,
those links would serve the same page at a second address
(`careers.showmeelectrical.com/careers/jobs/x`) competing with the canonical
`/jobs/x`. Middleware therefore also **308-redirects** `/careers/*` → `/*` on
the careers host, so no duplicate URL is reachable or indexable.

On the **main host** the same pages would be duplicate content at
`showmeelectrical.com/careers`, so middleware rule 4 308-redirects
`/careers*` (and the old WordPress `/career*`) to the careers host with the
path preserved. Nav, footer and About link to `site.careersUrl` directly.

### Legacy WordPress URLs

`config/redirects.ts` is the per-client redirect map, read by
`next.config.ts` (`trailingSlash: false` is settled). `/global-styles` is a
410 route handler. Every legacy URL and where it lands, with hop counts, is in
`docs/migration-inventory.md` §4; verify on the real domain before DNS moves:

```bash
for u in /locations/ /st-louis/ /career/ /category/blog/ /wp-sitemap.xml /global-styles; do
  curl -sI -o /dev/null -L -w "$u → %{url_effective} %{http_code}\n" https://showmeelectrical.com$u
done
```

### Verified routing + indexing matrix

Both hostnames were tested in both configurations, by building with the
production environment set and driving each host via a `Host:` header.

| | Preview (`ALLOW_INDEXING` unset) | Production (`ALLOW_INDEXING=true`) |
|---|---|---|
| `showmeelectrical.com/` | `noindex, nofollow` | `index, follow` |
| `careers.…/` and `/jobs/<slug>` | `noindex, nofollow` | `index, follow` |
| `robots.txt` (both hosts) | `Disallow: /` | `Allow: /`, own `Sitemap:` + `Host:` |
| `sitemap.xml` on main host | main URLs only | main URLs only |
| `sitemap.xml` on careers host | careers URLs only | careers URLs only |
| `careers.…/jobs/<slug>` | 200 | 200 |
| `careers.…/careers/jobs/<slug>` | 308 → `/jobs/<slug>` | 308 → `/jobs/<slug>` |
| Canonical, careers job page | `https://careers.showmeelectrical.com/jobs/<slug>` | same |

`robots.txt` and `sitemap.xml` are rendered **per request** (`force-dynamic`)
because one file is served on two hostnames and each must advertise only its
own URLs — a sitemap mixing both domains is ignored for the cross-domain
entries unless the domains are cross-verified in Search Console.

Reproduce locally:

```bash
npm run build && npm start                       # preview config
NEXT_PUBLIC_ALLOW_INDEXING=true \
  NEXT_PUBLIC_SITE_URL=https://showmeelectrical.com \
  npm run build && NEXT_PUBLIC_ALLOW_INDEXING=true npm start   # production config

curl -H 'Host: careers.showmeelectrical.com' localhost:3000/robots.txt
curl -H 'Host: showmeelectrical.com'         localhost:3000/sitemap.xml
```

`NEXT_PUBLIC_*` values are baked into statically generated metadata at build
time, so the production check requires a **rebuild**, not just a restart.

---

## Environment variables

Set in Vercel → Project → Settings → Environment Variables. **Paste raw values
with no surrounding quotes** — the Vercel UI stores quotes as part of the
value. Env vars are snapshotted per deployment, so redeploy after changing one.

| Variable | Required | Default | Purpose |
| --- | --- | --- | --- |
| `RESEND_API_KEY` | **Yes** | — | Careers application email via `/api/apply`. Server-side only. |
| `RESEND_FROM` | No | `Show Me Electrical Careers <careers@send.compassmarketing.ai>` | Verified sender. |
| `APPLICATION_RECIPIENT` | No | `info@showmeelectrical.com,thomas@compassmarketing.ai` | Comma-separated recipients. Reply-to is the applicant. |
| `NEXT_PUBLIC_SITE_URL` | No | `https://showmeelectrical.com` | Production domain for canonicals and structured data. |
| `NEXT_PUBLIC_ALLOW_INDEXING` | No | *(unset = noindex)* | See below. |

### Preview vs production indexing

Every build is **non-indexable by default**. `app/layout.tsx` emits
`noindex, nofollow` and `app/robots.ts` returns `Disallow: /` unless indexing
is explicitly enabled.

To enable indexing **at launch, on the production deployment only**:

```
NEXT_PUBLIC_ALLOW_INDEXING=true
NEXT_PUBLIC_SITE_URL=https://showmeelectrical.com
```

Then redeploy. Verify with `curl -s https://<domain>/ | grep robots` and
`curl -s https://<domain>/robots.txt` — never in a browser alone, per the SOP's
raw-HTML rule. Leave the variable unset on every preview environment.

---

## Architecture

```
config/
  site.config.ts     Client identity: name, contact, service area, nav, CTAs
  theme.config.ts    Motion settings + the brand reconciliation record
  redirects.ts       Legacy URL map → next.config.ts redirects()
content/
  blocks.ts          Block union — long-form content as data
  blog/              Article type, registry (index.ts) and the migrated posts
  legal/             LegalDocument type, registry and the migrated documents
  home.ts            Homepage copy, with provenance notes per block
  about.ts           About page copy — the live About page's three paragraphs
  service-area.ts    Coverage as data: counties + communities (CoverageGroup[])
  services-directory.ts  /services page copy; cards + catalog come from the registry
  shared.ts          Trust points + process steps used by home and service pages
  services/
    types.ts         ServicePageContent — the data model every service page is
    index.ts         Registry of IMPLEMENTED service pages; the sitemap reads it
    residential.ts   The residential hub, as data
    commercial.ts    The commercial hub — process before photos
    industrial.ts    The industrial hub — credentials first, no gallery
components/
  motion/            gsap.ts, Reveal, StaggerText, Parallax, ScrollStory
  site/              SiteHeader, SiteFooter, Section, Button, PreviewNotice,
                     PageHero, Breadcrumbs, ValueGrid, CoverageGroups,
                     Blocks, ArticleLayout, LegalLayout
content/
  reviewer-notes.ts  Provisional-content notes shown only in the preview banner
  decor/             Decoration registry (HeroBackdrop, storyRailPath) + the
                     client's motif (CircuitBackground) — selected by theme config
  home/              Hero, TrustBar, ServicePathways, AboutSection, Testimonials
  services/          ServicePage renderer + its sections: ServiceList,
                     PhotoGallery, ProcessSteps, Faq, RelatedLinks, ClosingCta
  (root)             Careers components — Header, Footer, JobCard, ApplicationForm
lib/
  seo.ts             Structured data helpers
  jobs.ts            Careers role data
docs/
  page-plan.md             Proposed site structure, URL map and redirects
  completion-checklist.md  Launch work · starter extraction · later SEO, kept separate
  template-roadmap.md      What is reusable, what is client-specific, what a new
                           client changes, what remains before the Compass starter
  migration-inventory.md   WordPress → Next.js page-by-page plan
  open-questions.md        Conflicts and decisions still needed from Tom
  decisions.md             Owner-confirmed decisions that override assumptions
```

### Separation of concerns

- **Client content** lives in `config/site.config.ts` and `content/`. This
  includes the schema.org business type, business description, service catalog
  and logo URL, so `lib/seo.ts` contains no client-specific strings.
- **Design tokens** live in the `@theme` block of `app/globals.css`. The one
  exception is `motionColors` in `config/theme.config.ts`: GSAP tweens colour
  properties directly and cannot resolve a Tailwind class, so the handful of
  literals it needs live there, mirrored from the same tokens.
- **Motion settings** live in `config/theme.config.ts`, and so does the
  `decoration` choice: the circuit motif behind heroes and on the scroll-story
  rail is one entry in `components/decor/`, selected by config. Another client
  sets `"none"`/`"line"` or adds their own entry; no component changes.
- **Verified facts are never component defaults.** `TrustBar` takes `points`;
  `ServicePage` takes content; nothing in `components/` carries a claim.
- **Careers constants** (`lib/jobs.ts`) re-export from `site.config.ts` rather
  than keeping a second copy of the phone, email, address and domains.
- **Components** read from those and hard-code nothing client-specific.
- **Service pages are data.** `content/services/<slug>.ts` is a
  `ServicePageContent` object — copy, photos, FAQs, and a `sections` array
  giving the render order. `components/services/ServicePage.tsx` renders
  whatever it is given and emits Service, FAQPage, BreadcrumbList and
  LocalBusiness JSON-LD from the same objects, so a new service page is a new
  content file, a three-line route and a registry entry. No section component
  knows which service it is showing. FAQPage schema is emitted only when an
  FAQ section with questions is actually rendered.

---

## Motion system

GSAP + ScrollTrigger, via `@gsap/react`'s `useGSAP` so every animation is
scoped to a container ref and reverted on unmount.

| Component | Use |
|---|---|
| `Reveal` | Section and image reveals; `stagger` animates direct children in sequence |
| `StaggerText` | Word-by-word headline entrance |
| `Parallax` | Subtle image drift (desktop only) |
| `ScrollStory` | The signature "Powering your project" circuit sequence |

Rules the system follows:

- **Content never depends on JS to be visible.** Animations use `gsap.from()`,
  so the hidden start state is only ever applied by JavaScript. If GSAP fails
  to load, everything renders visible. Verified: with JS disabled, all 8
  homepage sections render with zero collapsed.
- **Reduced motion is respected** — `prefers-reduced-motion: reduce` disables
  decorative motion entirely.
- **In-page anchors clear the sticky header.** `html { scroll-padding-top }`
  in `globals.css` is set from `--header-h` (96px, 132px from `sm`), so every
  section link — nav, footer, skip link — lands with the heading fully visible
  below the header, without per-section scroll margins.
- **Mobile is simplified** — shorter travel and duration; parallax off below
  768px; the scroll story becomes a plain left-rail timeline. On desktop it is
  three rows on a central circuit rail, copy on one side and photograph on the
  other, alternating, with the line between nodes drawn in by scroll.
- **Viewport and preference changes are handled at runtime.** All motion runs
  through `useResponsiveGSAP`, a thin wrapper over `gsap.matchMedia()`. Reading
  `window.innerWidth` or the reduced-motion query once at mount would freeze
  the decision; matchMedia re-runs the setup when the breakpoint is crossed or
  the OS preference changes, and reverts the previous run first — and reverting
  a `gsap.from()` restores the element to its natural visible state, so a
  resize can never strand content at `autoAlpha: 0`.
- **ScrollTrigger refreshes** on `load`, after fonts settle, and after every
  matchMedia rebuild (coalesced into one refresh per frame), so late-loading
  images and layout changes cannot leave triggers measured against a stale
  document height.
- **Lenis smooth scrolling is deliberately not installed.** Native scrolling is
  the baseline. `motion.smoothScroll` in `theme.config.ts` is the switch if it
  is ever justified.

CSS handles simple hover and focus states; GSAP is only used for scroll work.

---

## Local development

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
```

To exercise the careers host rewrite locally:

```bash
curl -H 'Host: careers.showmeelectrical.com' http://localhost:3000/
```

---

## Brand notes

- **Colours** live in the `@theme` block of `app/globals.css`.
  `--color-lime-500: #c0d634` is sampled from the logo artwork. Only
  `lime-700` (`#667512`) meets 4.5:1 on white/cream — use `lime-500` on navy
  and `lime-700` on light backgrounds. The brand board's navy `#04345C` is
  carried as `navy-700`; see `config/theme.config.ts` for the full
  reconciliation record.
- **Logo**: `public/logo-white.webp` (700×266). Falls back to a text wordmark.
- **Fonts**: Poppins (headings) + Inter (body) via `next/font`. The brand board
  specifies Spectral SC for headings — unresolved, see `docs/open-questions.md`.
- **Photography**: `public/photos/` holds nine real job-site photos from the
  client's media library. Stock images in that library are catalogued in the
  migration inventory and deliberately unused.

### Claims the site may and may not make

`docs/decisions.md` is the record. Two owner-confirmed decisions bound the copy:

- **Emergency electrical service is offered** and may be named, with a phone
  number. **Availability may not be described** — no 24/7, after-hours or
  weekend coverage, no guaranteed arrival or response time — until real hours
  are confirmed. `site.offersEmergencyService` gates the homepage block.
- **Dan may be called a Master Electrician on the main site**
  (`site.founderCredential`). The **careers** site's career ladder still omits
  master and foreman levels; that instruction is unchanged and separate.

Nothing else may be claimed without a client-owned source: no review counts,
star ratings, project totals, guarantees or licence numbers.

---

## Reusing this for another client

1. Rewrite `config/site.config.ts` — identity, contact, service area, nav.
2. Replace the `@theme` values in `app/globals.css`.
3. Replace `content/home.ts` and `public/photos/`.
4. Adjust `config/theme.config.ts` if the motion feel should differ.
5. Replace `content/blog/`, `content/legal/` and `config/redirects.ts` with
   the client's own (or empty registries and an empty map).

Components, the motion system, SEO helpers and the section primitives carry
over unchanged.
