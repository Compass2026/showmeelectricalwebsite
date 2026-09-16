# Show Me Electrical — Website

Next.js (App Router) + TypeScript + Tailwind CSS v4. Two properties share this
codebase:

| Property | Routes | Status |
|---|---|---|
| **Careers site** | `/careers`, `/careers/jobs/[slug]`, `/api/apply` | **LIVE** at `careers.showmeelectrical.com` |
| **Main site** | `/`, `/contact` | **Prototype** — homepage under review |

This repo is also the first draft of the reusable **Compass Marketing website
template**. See "Reusing this for another client" below.

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
content/
  home.ts            Homepage copy, with provenance notes per block
components/
  motion/            gsap.ts, Reveal, StaggerText, Parallax, ScrollStory
  site/              SiteHeader, SiteFooter, Section, Button, PreviewNotice
  home/              Hero, TrustBar, ServicePathways, AboutSection, Testimonials
  (root)             Careers components — Header, Footer, JobCard, ApplicationForm
lib/
  seo.ts             Structured data helpers
  jobs.ts            Careers role data
docs/
  migration-inventory.md   WordPress → Next.js page-by-page plan
  open-questions.md        Conflicts and decisions needed from Tom
```

### Separation of concerns

- **Client content** lives in `config/site.config.ts` and `content/`.
- **Design tokens** live in the `@theme` block of `app/globals.css`.
- **Motion settings** live in `config/theme.config.ts`.
- **Components** read from those and hard-code nothing client-specific.

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
- **Mobile is simplified** — shorter travel and duration; parallax off below
  768px; the scroll story becomes a plain vertical sequence.
- **ScrollTrigger refreshes** on `load` and after fonts settle, so late-loading
  images cannot leave triggers measured against a stale document height.
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

---

## Reusing this for another client

1. Rewrite `config/site.config.ts` — identity, contact, service area, nav.
2. Replace the `@theme` values in `app/globals.css`.
3. Replace `content/home.ts` and `public/photos/`.
4. Adjust `config/theme.config.ts` if the motion feel should differ.

Components, the motion system, SEO helpers and the section primitives carry
over unchanged.
