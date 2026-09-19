# Compass Website System — Template Roadmap

Show Me Electrical is the **first implementation** of a reusable Compass
Marketing website system. This document tracks what is already reusable, what
is still client-specific, what a second client would have to change, and what
stands between this repository and a neutral Compass starter.

The rule that governs every decision below: **the real client site is
completed and validated first; the starter is extracted from it afterwards.**
Nothing here is built speculatively for hypothetical clients or frameworks.

---

## 1. Already reusable (client-agnostic today)

| Layer | Where | Notes |
|---|---|---|
| Page chrome | `components/site/` — `SiteHeader`, `SiteFooter`, `Section`, `Button`, `PreviewNotice` | Read identity, nav and CTAs from `config/site.config.ts`. No client strings. |
| Motion system | `components/motion/` — `Reveal`, `StaggerText`, `Parallax`, `ScrollStory`, `useResponsiveGSAP`, `gsap.ts` | Timings from `config/theme.config.ts`. Reduced-motion, breakpoint and no-JS behaviour built in. `immediate` mode for above-the-fold content. |
| Service pages | `components/services/` — `ServicePage` + `ServiceHero`, `ServiceList`, `PhotoGallery`, `ProcessSteps`, `Faq`, `RelatedLinks`, `ClosingCta`, `Breadcrumbs` | Render a `ServicePageContent` object. Section order, copy, photos, eyebrows and emphasis come from the content file. No section knows which service it shows. |
| Content model | `content/services/types.ts` | `ServicePageContent` and its parts. |
| SEO utilities | `lib/seo.ts` — `localBusinessJsonLd`, `websiteJsonLd`, `serviceJsonLd`, `faqPageJsonLd`, `breadcrumbJsonLd` | Every value comes from config or the page's content. FAQPage and BreadcrumbList are generated from the same objects the page renders, so schema cannot drift from visible text. |
| Host-aware routing | `middleware.ts`, `lib/host.ts`, `app/robots.ts`, `app/sitemap.ts` | Two properties on one codebase; per-host robots/sitemap; indexing off by default. **Assumes a careers property exists** — see §2 and §5.3. |
| Service-page registry | `content/services/index.ts` | The list of implemented service pages. `app/sitemap.ts` emits service entries from it; planned pages are never listed. |
| Decoration registry | `components/decor/index.tsx` | Hero backdrop and scroll-story rail are chosen by `config/theme.config.ts`'s `decoration` block. The circuit motif is one entry. |
| Design tokens | `app/globals.css` `@theme` block | Colours and font variables. Utilities generate from these. |
| Trust strip | `components/home/TrustBar` | Takes `points` as a prop; carries no facts of its own. |
| Inner-page hero + breadcrumbs | `components/site/PageHero`, `components/site/Breadcrumbs` | Used by every service page and About. Content and crumbs are props; backdrop from the decoration registry. |
| Story, testimonials, values, pathways, coverage | `components/home/AboutSection`, `components/home/Testimonials`, `components/site/ValueGrid`, `components/home/ServicePathways`, `components/site/CoverageGroups` | All prop-driven; no copy or geography of their own. |

## 2. Still specific to Show Me Electrical

Everything that is a **fact about the client** or a **choice made for them**:

| What | Where | Why it stays client-specific |
|---|---|---|
| Identity, NAP, service area, counties, domains, CTAs, nav, schema type, description, service catalog, logo URL, emergency flag, founder credential | `config/site.config.ts` | This file *is* the client. |
| Homepage copy, testimonials, emergency callout, About text | `content/home.ts` | Every string traces to the client's live site or an owner decision. |
| Trust points and process steps | `content/shared.ts` | Verified facts. Must never become defaults. |
| Residential hub content | `content/services/residential.ts` | Client services, client photos, client FAQs. |
| Reviewer notes | `content/reviewer-notes.ts` | This engagement's open items. |
| Photography | `public/photos/` | Client's own job-site images. |
| Logo | `public/logo-white.webp` | |
| Palette values | `app/globals.css` | Navy/lime/cream are the client's brand; the *token names* are reusable, the *values* are not. |
| Typeface choice | `app/layout.tsx` (`next/font` imports) | Poppins/Inter is the client's pairing. `next/font` needs static imports, so this is a file edit per client, not a config value. |
| Circuit decoration | `components/decor/CircuitBackground.tsx`, `decoration: "circuit"` | Electrical-industry motif. Selected by config; not required. |
| Careers property | `app/careers/`, `lib/jobs.ts`, `components/{Header,Footer,JobCard,ApplicationForm,…}.tsx`, `/api/apply` | A second, **live** product for this client. Its components predate the system and are not generalised. |
| Careers coupling in shared files | `middleware.ts` (host rules 1–3), `lib/host.ts` (`resolveProperty`), `app/sitemap.ts` (careers branch imports `jobs`), `app/robots.ts` (per-host), `config/site.config.ts` (`careersUrl`, "Careers" nav + footer entries), `app/page.tsx` ("See our open roles" in the final CTA) | **Honest status: the shared routing and sitemap code assumes a careers host exists.** A client without careers needs a *coordinated* change across all of these — not a config flag today. Listed as §5.3. |
| Homepage hero | `components/home/Hero` | The one section still importing its block from `content/home.ts` directly — see §5.2. `AboutSection`, `Testimonials`, `ServicePathways` and `TrustBar` all take props now. |
| Brand reconciliation record | `config/theme.config.ts` header comment | History of this client's brand decisions. |

## 3. What must change to start a new client website

In order, with the file each step touches:

1. **`config/site.config.ts`** — rewrite in full: name, legal name, contact,
   address, service area and its list, domains, schema type
   (`"Plumber"`, `"RoofingContractor"`, …), description, service catalog,
   logo URL, CTAs, nav, `offersEmergencyService`, `founderCredential`.
   `geo` stays `null` until real coordinates are read off the client's Google
   Business Profile.
2. **`app/globals.css`** — replace the `@theme` colour values. Keep the token
   names (`navy-*`, `lime-*`, `cream`, `charcoal`) or rename them everywhere;
   do not mix.
3. **`app/layout.tsx`** — swap the two `next/font` imports and the
   `--font-*` variables.
4. **`config/theme.config.ts`** — set `decoration` (`"none"` and `"line"`
   until the client has a motif), adjust motion timings if the feel should
   differ.
5. **`content/shared.ts`** — the client's own trust points and process
   steps, each traceable to their published material.
6. **`content/home.ts`** — homepage copy, testimonials reproduced exactly
   from source, service pathways, emergency/hero copy.
7. **`content/services/<slug>.ts`** + **`app/services/<slug>/page.tsx`** —
   one content file and a three-line route per service page.
8. **`public/photos/`, `public/logo-*.webp`** — the client's images, verified
   real, with the stock-photo check from the migration inventory repeated.
9. **`content/reviewer-notes.ts`** — this engagement's open items.
10. **Careers — coordinated change, not a deletion.** If the client has no
    careers property: remove `app/careers/` and `/api/apply`; remove middleware
    rules 1–3 and the `careers.` host test in `lib/host.ts`; remove the
    careers branch and the `jobs` import from `app/sitemap.ts`; drop
    `careersUrl` and the Careers nav/footer entries from `site.config.ts`;
    remove the "open roles" line from the homepage CTA. Verify with the
    routing matrix in the README afterwards. **For Show Me Electrical, none of
    this changes: the careers site is live and stays live.**
11. **`docs/`** — new migration inventory, page plan, open questions and
    decisions log. The *structure* of those documents is reusable; the
    contents are not.

Nothing in `components/site/`, `components/motion/`, `components/services/`,
`components/decor/index.tsx`, `lib/`, `middleware.ts`, `app/robots.ts` or
`app/sitemap.ts` should need editing for step 1–11.

## 4. Adopting components in an existing compatible website

A "compatible" site is Next.js App Router with Tailwind v4. Components can be
adopted piecemeal:

- **Motion only:** copy `components/motion/` and the `motion`/`motionColors`
  blocks of `config/theme.config.ts`; install `gsap` + `@gsap/react`. `Reveal`
  and `StaggerText` have no other dependencies. Respect the rule in
  `Reveal.tsx`: no CSS `transition` on a tweened element.
- **Service pages:** copy `components/services/`, `content/services/types.ts`,
  `lib/seo.ts`, and whatever `components/site/` pieces `ServicePage` imports
  (`Section`, `Button`, header/footer can be swapped for the host site's own).
  Provide a `site` config object with the fields `lib/seo.ts` reads.
- **SEO utilities alone:** `lib/seo.ts` depends only on `config/site.config.ts`
  and the content types.
- **Host-aware routing:** `middleware.ts` + `lib/host.ts` +
  `app/robots.ts` + `app/sitemap.ts` transfer as a set.

Tailwind token names (`navy-*`, `lime-*`, `cream`, `charcoal`) are baked into
component classes today; a host site must either define the same tokens or
rename them in the copied components. Making that mapping semantic
(`surface`, `accent`, `ink`) is item 5.1 below.

## 5. What remains before extracting the Compass starter

Not started, deliberately — each waits until the Show Me Electrical site is
complete and validated on real pages.

1. **Semantic colour tokens.** Rename `navy-*`/`lime-*` usages in components
   to role-based tokens (`surface`, `surface-deep`, `accent`, `accent-ink`,
   `ink`, `paper`) so a client palette is a value change, not a find-and-
   replace. Do this once the full page set exists, so it is done once.
2. **Homepage sections as content-driven components.** `AboutSection`,
   `Testimonials` and `ServicePathways` now take their content as props.
   Only `Hero` still imports from `content/home.ts`; convert it the same way
   against the final homepage.
3. **Make careers optional by configuration.** Today the routing, host
   resolution and sitemap assume a careers host (see §2). The starter should
   read `site.careersUrl` (or its absence) and skip every careers rule when
   it is not set, so a client without careers is a config omission rather
   than a coordinated edit. Its components predate the system; either fold
   `Header`/`Footer` into `SiteHeader`/`SiteFooter` with a variant, or ship
   the starter without them. **Not done now**: Show Me Electrical's careers
   site is live, and this change is only worth making against the starter.
4. **Location-page model.** A `LocationPageContent` type and renderer,
   mirroring the service-page model, once the Tier-1 city pages are built for
   this client and the pattern is proven.
5. **Contact form route.** The Resend pattern exists in `/api/apply`; a
   generic enquiry handler with the same honeypot and rate limiting belongs in
   the starter.
6. **Sitemap from registries throughout.** Service pages already come from
   `content/services/index.ts`. `/` and `/contact` are still literal entries
   in `app/sitemap.ts`, and future page types (locations, blog) should each
   register the same way so the sitemap is entirely data-driven.
7. **Redirect config.** `next.config.ts` `redirects()` driven by a per-client
   map (see `docs/page-plan.md` §6), so launch redirects are data.
8. **Starter scaffolding.** Empty `site.config.ts` with every field typed and
   commented, placeholder tokens, a `content/` skeleton, the four `docs/`
   templates, and a checklist that mirrors §3 above. No dashboard, no
   framework abstraction — a repository to clone.
9. **Validation gate.** The curl-based checks used in this engagement
   (routing matrix, head tags, schema parity, claim sweep, no-JS, motion,
   reduced-motion, keyboard) collected into one script so every client build
   runs the same proof before a review package goes out.

---

## Template readiness log

One entry per review package. Records every new hardcoded client dependency
introduced by that milestone and whether it is intentional.

### Milestone: residential service page (2026-09-19)

| New dependency | Where | Intentional? |
|---|---|---|
| Residential copy, FAQs, photos | `content/services/residential.ts` | **Yes** — client content, in a content file. |
| Route binding | `app/services/residential/page.tsx` | **Yes** — three lines, per client. |
| Trust points + process steps as shared client facts | `content/shared.ts` | **Yes** — content, not component. |
| `ServiceHero` imported `CircuitBackground` directly | `components/services/ServiceHero.tsx` | **No — fixed.** Now `HeroBackdrop` from the decoration registry, selected by config. |
| `TrustBar` defaulted `points` to the client's trust points | `components/home/TrustBar.tsx` | **No — fixed.** `points` is required; the homepage passes them explicitly. |
| Section eyebrow labels ("Services", "FAQ", …) hardcoded in `ServicePage` | `components/services/ServicePage.tsx` | **No — fixed.** Eyebrows come from content; absent = not rendered. |
| Colour token names in component classes | `components/services/*` | **Yes, for now** — same convention as the rest of the site; resolved by §5.1 at extraction. |
| Careers host now 404s non-careers paths | `middleware.ts` | **Yes** — behaviour, not a client fact. |

### Milestone: commercial + industrial hubs (2026-09-19)

Both pages are content objects rendered by the unchanged `ServicePage`
renderer, with different section order (commercial puts process before
photos; industrial leads with credentials and has no gallery), different
counts (5 and 4 services; 9 and 7 questions) and different photography.
No component was copied.

**Shared components that required changes**, and why:

| Component | Change | Reason |
|---|---|---|
| `content/services/types.ts` | `faqs` is now optional; length documented as a page choice | A page with no FAQ section must be expressible |
| `components/services/ServicePage.tsx` | FAQPage JSON-LD emitted only when `"faqs"` is in `sections` **and** has items; the FAQ section renders under the same condition | Template gap #2 — no schema for content the page does not show |
| `app/sitemap.ts` | Service entries come from `content/services/index.ts` | Template gap #1 — no hardcoded service paths; planned pages excluded |
| `content/services/index.ts` | **New** — registry of implemented service pages | Single source for the sitemap |

**New hardcoded client dependencies:**

| Dependency | Where | Intentional? |
|---|---|---|
| Commercial and industrial copy, FAQs, photos | `content/services/{commercial,industrial}.ts` | **Yes** — content files |
| Two three-line routes | `app/services/{commercial,industrial}/page.tsx` | **Yes** |
| Registry entries | `content/services/index.ts` | **Yes** — per client, by design |
| Homepage cards now link to all three hubs | `content/home.ts` | **Yes** — content |
| Corrected homepage hero alt (stainless wall units, not "electrical panels") | `content/home.ts` | **Yes** — accuracy fix |

Nothing in `components/site/`, `components/motion/`, `components/decor/`,
`lib/` or `middleware.ts` changed for this milestone.

### Milestone: About page (2026-09-19)

`/about` is composed in its route from existing sections; no new page
renderer was needed. Content is `content/about.ts` plus the shared trust
points and the homepage's testimonials.

**Shared components that required changes**, and why:

| Component | Change | Reason |
|---|---|---|
| `components/services/ServiceHero` → `components/site/PageHero` | Takes `hero` + `breadcrumbs` props instead of a `ServicePageContent` | The same hero serves About and any future inner page |
| `components/services/Breadcrumbs` → `components/site/Breadcrumbs` | Moved | Not service-specific |
| `components/home/AboutSection` | Prop-driven (`eyebrow`, `heading`, `paragraphs`, `image`, `cta`) | Was reading `content/home.ts` directly; roadmap 5.2 |
| `components/home/Testimonials` | Prop-driven (`items`) | Same |
| `components/site/ValueGrid` | **New**, generic | Short-statement grid |
| `lib/seo.ts` | `aboutPageJsonLd` | AboutPage node referencing the business |
| `app/sitemap.ts` | `/about` added as a core-page literal | Core pages are still literals (roadmap 5.6) |

**New hardcoded client dependencies:** `content/about.ts` and
`app/about/page.tsx` (intentional — content and composition). Nav and footer
"About" entries now point at `/about` (config). No client claim entered a
shared component.

### Milestone: service area + services directory (2026-09-19)

Both pages composed in their routes from existing sections. Geography lives
in `content/service-area.ts` (`CoverageGroup[]`) and is rendered by a new
generic `CoverageGroups`; the directory's cards and catalog are derived from
`content/services/index.ts`, so it can only ever link to built pages.

**Shared components that required changes**, and why:

| Component | Change | Reason |
|---|---|---|
| `components/home/ServicePathways` | Prop-driven (`items: PathwayCard[]`); example list optional | The directory builds cards from the registry; roadmap 5.2 |
| `components/site/CoverageGroups` | **New**, generic | Coverage as data |
| `content/services/types.ts` | Optional `directory: { title, summary }` | Directory blurb per page, with fallbacks |
| `lib/seo.ts` | `webPageJsonLd`, `collectionPageJsonLd` | Core-page and directory nodes; inline items, no dangling @ids |
| `app/sitemap.ts` | `/services`, `/service-area` as core-page literals | Still literals (5.6) |

**New hardcoded client dependencies:** `content/service-area.ts`,
`content/services-directory.ts`, the two routes, and `directory` blurbs in
the three hub content files — all content. Nav and footer now point at
`/services` and `/service-area` (config). No client fact or geography entered
a shared component.
