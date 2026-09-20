# Compass Website System — Template Roadmap

Show Me Electrical is the **first implementation** of a reusable Compass
Marketing website system. This document tracks what is already reusable, what
is still client-specific, what a second client would have to change, and what
stands between this repository and a neutral Compass starter.

The rule that governs every decision below: **template work depends on
validation against real pages, not on the client's production launch.** The
Show Me build is the reference implementation; the starter is extracted from
the validated code and proven with a second brand (Build Standard v1 §1, §10).
Nothing here is built speculatively for hypothetical frameworks.

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
| Long-form content | `content/blocks.ts` (`Block`, `Inline`, `RichText`), `components/site/Blocks` | Headings, paragraphs, lists, quote, line-block, semantic table, sources. Typed inline links/emphasis — client content never carries markup; every href is data the QA manifest checks. |
| Article + legal layouts | `components/site/ArticleLayout`, `components/site/LegalLayout` | Render an `Article` / `LegalDocument`. Date and byline only when present — never a placeholder. |
| Content models + registries | `content/blog/types.ts`, `content/legal/types.ts`; `content/blog/index.ts`, `content/legal/index.ts` | Registries drive the index page, static params, the sitemap and the reviewer notice. |
| Article / blog schema | `lib/seo.ts` — `blogPostingJsonLd`, `blogJsonLd` | `datePublished`, `dateModified` and `author` emitted only when the content carries them; image falls back to the owned share asset. |
| Page metadata | `lib/metadata.ts` — `pageMetadata`, `absoluteUrl` | Canonical, Open Graph and Twitter with the owned default share image on every route; article dates/authors when known. |
| Published-route registry | `lib/routes.ts`, `content/pages.ts` | One list for sitemap, route manifest, link and orphan checks; truthful `lastModified` only. |
| QA scripts | `scripts/qa/route-manifest.ts`, `scripts/qa/crawl.mjs` | Manifest + raw-HTML crawl (status, head tags, canonical, share images fetchable, internal links, JSON-LD references, sitemap parity, orphans, 404). |
| Launch redirects as data | `config/redirects.ts` → `next.config.ts` | Per-client map; the mechanism is client-agnostic. |
| Inquiry form | `components/site/InquiryForm`, `lib/inquiry.ts`, `app/api/inquiry/route.ts` | Labels, service groups, endpoint and fallback contacts are props; validation shared by form and route returns codes, not copy; the route reads recipients/sender from config + env. |
| Nav items may be external | `NavItem.external`; `SiteHeader`, `SiteFooter` | Renders a plain anchor for off-site links (used for the careers host here). |

## 2. Still specific to Show Me Electrical

Everything that is a **fact about the client** or a **choice made for them**:

| What | Where | Why it stays client-specific |
|---|---|---|
| Identity, NAP, service area, counties, domains, CTAs, nav, schema type, description, service catalog, logo URL, emergency flag, founder credential | `config/site.config.ts` | This file *is* the client. |
| Homepage copy, testimonials, emergency callout, About text | `content/home.ts` | Every string traces to the client's live site or an owner decision. |
| Trust points and process steps | `content/shared.ts` | Verified facts. Must never become defaults. |
| Residential hub content | `content/services/residential.ts` | Client services, client photos, client FAQs. |
| Reviewer notes | `content/reviewer-notes.ts` | This engagement's open items. Now also pulls the `flags` off every article and legal document. |
| Migrated posts and legal documents | `content/blog/*.ts`, `content/legal/*.ts` | Verbatim client content with provenance headers and `flags`. |
| Redirect map | `config/redirects.ts` | This client's WordPress URLs. |
| Inquiry recipients, sender, subject prefix | `config/inquiry.config.ts` | Client delivery settings (server-only). |
| Contact page copy + form labels | `content/contact.ts` | Every string the form shows. |
| Careers redirect on the main host | `middleware.ts` rule 4 | Reads `site.careersUrl`; part of the careers coupling (§5.3). |
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
9a. **`content/blog/<slug>.ts` + `content/blog/index.ts`**, **`content/legal/<slug>.ts` + `content/legal/index.ts`** — the client's articles and legal documents as `Block[]`, registered. The routes (`app/blog/…`, `app/privacy-policy`, `app/terms-of-service`) need no edit beyond the legal slugs.
9b. **`config/redirects.ts`** — the client's legacy URL map, or an empty array.
9c. **`config/inquiry.config.ts`** + **`content/contact.ts`** — recipients, sender, subject prefix; page copy and form labels. Set `RESEND_API_KEY` per environment.
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
`components/decor/index.tsx` or `lib/seo.ts` should need editing for steps
1–9c. **Step 10 is the exception**: until careers is a configuration flag
(§5.3, Batch C of the template completion), a client without careers still
requires the coordinated edits listed there in `middleware.ts`, `lib/host.ts`,
`app/sitemap.ts` and `app/robots.ts`. That is a known gap, not a claim.

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
5. **Contact form route.** ✅ Done — `/api/inquiry` + `InquiryForm` +
   `lib/inquiry.ts`. The careers `/api/apply` still has its own copies of the
   `readEnv`/`esc`/`row` helpers; fold them into a shared `lib/email.ts` at
   extraction (not touched now — the careers workflow is live).
6. **Sitemap from registries throughout.** ✅ Done (Batch A) —
   `content/pages.ts` registers the core pages; `lib/routes.ts` merges every
   registry; `app/sitemap.ts` reads only that list.
7. **Redirect config.** ✅ Done — `config/redirects.ts` is the per-client
   map, read by `next.config.ts`. The starter ships it empty.
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

### Milestone: content preservation — blog, legal, redirects (2026-09-19)

Two new page renderers, both generic: `ArticleLayout` (header, optional lead
image, body, closing CTA) and `LegalLayout` (compact header, document,
contact line). Both render a `Block[]` through the new `Blocks` component, so
long-form client content is data with no markup. Three posts and two legal
documents were migrated verbatim into content files with provenance headers
and `flags`; two registries drive the index, static params, sitemap and the
reviewer notice. Redirects became per-client data.

**Shared components that required changes**, and why:

| Component | Change | Reason |
|---|---|---|
| `content/blocks.ts`, `components/site/Blocks` | **New** | Long-form content as data |
| `components/site/ArticleLayout`, `LegalLayout` | **New** | Article and legal renderers; date/byline conditional |
| `lib/seo.ts` | `blogPostingJsonLd`, `blogJsonLd` | Conditional `datePublished` / `author` |
| `app/sitemap.ts` | Blog and legal entries from registries | Same rule as services: only implemented pages |
| `config/redirects.ts` + `next.config.ts` | **New** — `redirects()` reads the data file; `trailingSlash: false` settled | Roadmap 5.7 |
| `components/site/SiteHeader`, `SiteFooter` | Honour `NavItem.external` | The careers property lives on its own host |
| `middleware.ts` | Rule 4 — main-host `/careers*` and `/career*` → careers host | Duplicate content across hosts; reads `site.careersUrl` |
| `content/reviewer-notes.ts` | Reads `flags` from the blog and legal registries | One place for migration flags |

**New hardcoded client dependencies:**

| Dependency | Where | Intentional? |
|---|---|---|
| Post and legal content, dates, byline, flags | `content/blog/*.ts`, `content/legal/*.ts` | **Yes** — content files with provenance |
| Blog index copy, hero photo, CTA | `content/blog/index.ts` | **Yes** — content |
| Legal contact line | `content/legal/index.ts` | **Yes** — content |
| Redirect map | `config/redirects.ts` | **Yes** — per-client data by design |
| Careers URL in nav/footer/About and middleware rule 4 | `config/site.config.ts`, `middleware.ts` | **Yes** — config-driven, but it deepens the careers coupling listed in §5.3: rule 4 must go with the rest when careers is made optional |
| `/global-styles` 410 route | `app/global-styles/route.ts` | **Yes, client-specific** — an Elementor artifact of this WordPress site; delete for a client without one |
| Blog nav/footer entries, legal footer links | `config/site.config.ts` | **Yes** — config |

No client string entered `components/`, `lib/` or `content/blocks.ts`. The
"Last updated" label, the "By" byline prefix and the "Blog" eyebrow default in
`ArticleLayout` are English UI strings, not client facts — the same class as
"Skip to content".

### Milestone: contact form (2026-09-19)

A reusable inquiry form and delivery route. The component owns behaviour
(validation, submit states, preserving input on failure); every string is a
prop from `content/contact.ts`; service choices are generated from the
service-page registry; recipients and sender live in a server-only config
overridable by environment.

**Shared components that required changes**, and why:

| Component | Change | Reason |
|---|---|---|
| `components/site/InquiryForm` | **New**, generic | Form behaviour without copy |
| `lib/inquiry.ts` | **New** — limits, normalisation, validation (codes), service groups from the registry | One rule set for client and server |
| `app/api/inquiry/route.ts` | **New** — same-origin, per-instance rate limit, honeypot, validation, Resend, mock/fail modes outside production | Delivery |
| `app/contact/page.tsx` | Composes the form beside the phone/email/address cards | No visitor depends on the form alone |
| `content/reviewer-notes.ts` | Contact entry updated | |

**New hardcoded client dependencies:**

| Dependency | Where | Intentional? |
|---|---|---|
| Recipient, sender, subject prefix, source label | `config/inquiry.config.ts` | **Yes** — server-only client config, env-overridable |
| Page copy and form labels | `content/contact.ts` | **Yes** — content |
| Rate-limit numbers | `config/inquiry.config.ts` | **Yes** — tunable per client, not facts |
| Copies of `readEnv`/`esc`/`row` in the new route | `app/api/inquiry/route.ts` | **Accepted for now** — duplicated from `/api/apply` rather than refactoring the live careers route; fold into `lib/email.ts` at extraction (§5.5) |

No client string entered `components/site/InquiryForm.tsx` or
`lib/inquiry.ts`. The "Website" honeypot label and the spinner are UI
mechanics, not client facts.

### Milestone: release preparation (2026-09-19)

No new page or component. One shared-system change: `motion.immediateDeadlineMs`
in `config/theme.config.ts`, read by `Reveal` and `StaggerText` — immediate
entrances are skipped when hydration is late, so the motion system no longer
trades Largest Contentful Paint for a fade on slow devices. Generic; the
value is a per-client tuning knob, not a fact. Policy content edits are
client content. New docs (`launch-audit.md`, `launch-checklist.md`,
`deployment-plan.md`, `policy-revision-proposal.md`) are engagement
records; their structure is reusable for the starter's `docs/` templates.

### Template completion — Batch A (2026-09-19)

Governing documents: Compass Website Build Standard v1, Page Template
Library v1, Show Me Audit and Template Completion Brief (Drive). Branch
`claude/template-completion` from the reviewed commit `e2dba27`; the Show Me
launch candidate stays on `claude/main-site-foundation-v1`.

| Finding | What changed | Where |
|---|---|---|
| G1 typed contextual links, richer content | `Inline`/`RichText` runs (text, typed link, strong, em), `table` and `sources` blocks; `Blocks` renders links as ordinary anchors, tables with `<caption>`/`<th scope>` in a scrollable region. Three articles now link relevant built hubs, the service-area page and contact in their body; `relatedServices`/`relatedArticles` resolved from registries and rendered as labelled `<nav>` lists. | `content/blocks.ts`, `components/site/Blocks.tsx`, `content/blog/*`, `ArticleLayout`, `app/blog/[slug]` |
| G4 complete metadata defaults | `lib/metadata.ts` (`pageMetadata`) used by every route incl. `serviceMetadata`; owned `public/share-default.png` (1200×630, generated from the client's logo, no photography) as the default card; `public/brand/logo-512.png` replaces the WordPress logo URL in `site.logoUrl`; root layout carries default OG/Twitter image; business schema emits `logo`/`image` from owned assets. | `lib/metadata.ts`, `config/site.config.ts`, `app/**/page.tsx`, `lib/seo.ts`, `lib/jobs.ts` (absolute logo) |
| G5 truthful freshness, complete route registry | `Article.modifiedAt` (set to 2026-09-19 on the three revised posts, bylines and `publishedAt` preserved) shown as "Updated", emitted as `dateModified`, used as sitemap lastmod; `content/pages.ts` + `lib/routes.ts`; sitemap without priority/changefreq; unknown dates omitted. | `content/blog/types.ts`, `lib/routes.ts`, `app/sitemap.ts` |
| G6 documentation/copy | Residential "25 to 30 years old" generalised; page plan: contact form status, FAQ-count rule, `/st-louis` final; roadmap: careers contradiction resolved (step 10 is the documented exception until Batch C), "only file" claim corrected, validation-not-launch rule. | `content/services/residential.ts`, `docs/page-plan.md`, this file, `config/site.config.ts` |
| G8 (started) | `npm run qa:manifest`, `npm run qa:crawl` committed; `docs/route-manifest.md` generated. Review correction (same day): the crawl now checks exactly one canonical against an explicit production origin, compares sitemap entries as full URLs on that origin, builds incoming links only from rendered anchors on other pages (self-links and registry "nav"/"footer" notes ignored), resolves cross-page and same-page fragments against destination ids, requires both `og:image` and `twitter:image` on the production host and validates owned assets on the local build only under an explicit `--assets remap` mode (reported as local asset validation, declared URLs never fetched or silently substituted). `npm run qa:crawl:test` runs negative fixtures proving each of those failures is caught. | `scripts/qa/crawl.mjs`, `scripts/qa/crawl.test.mjs`, `package.json`, README |
| G9 (semantic part) | Article relationships are real anchors under labelled headings; dates are `<time>` elements; tables are semantic. Unknown facts remain omitted (no invented dates). | as above |

New dependency: `tsx` (dev only) to run TypeScript QA scripts against the
registries. No runtime dependency added.

**Not in this batch:** the semantic-table block has no client article that
needs one; its rendering and accessibility remain **unverified** until a
fixture demonstrates them (scheduled for the fictional branch fixture in
Batch B and re-checked in the Batch C second-brand fixture). Actual AI-agent
trials remain outstanding (Batch C).

### Template completion — Batch B (2026-09-19)

Finding G2 and the library's §4–§7. One representative page per type,
built from approved facts; the client's 22-service / 20-city expansion
stays a separate plan (docs/page-plan.md §3–§4).

| Template | What changed | Where |
|---|---|---|
| §4 Individual service page | `ServicePageContent.parent`; `serviceDetailPages` registry beside the hubs (`allServicePages`, `findServicePage`); `/services/residential/electrical-panel-upgrades` built from the residential hub's own approved copy (panel, breaker, EV and remodel items and FAQ) — no prices, timings, permit or amperage claims; hub item `href` set, so hub, directory catalog and two articles link it. | `content/services/{types,index,electrical-panel-upgrades}.ts`, `app/services/residential/electrical-panel-upgrades/`, `content/blog/*` (panel passages now link the page) |
| §6 Served-city page | `CityPageContent` model, `CityPage` renderer, `cityPages` registry, `/service-area/[city]` route (only registered slugs build). Sample: **Edwardsville, IL** — chosen because its local facts are distinctive and sourced (one of exactly two Illinois communities, D-003; served from the Affton shop, D-005; no office). Leads with a `<dl>` fact list, links only published service pages, typed-block local context, FAQ. Schema: the real business node with `areaServed`, WebPage, breadcrumbs, FAQPage. | `content/cities/*`, `components/site/CityPage.tsx`, `components/site/FactList.tsx`, `app/service-area/[city]/` |
| §5 Publication-aware coverage | `Community` may carry a city-page slug; `CoverageGroups` renders it as a link only when `cityPages` has it. Edwardsville links; every other community stays text. | `content/service-area.ts`, `components/site/CoverageGroups.tsx` |
| §7 Physical location page | `BranchLocationContent` model (address, visitability, confirmed hours, services-by-location, team without faked portraits), `LocationPage` renderer (hours and services rendered through the shared semantic `table` block), `locationPages` registry, `/locations/[slug]`. Proven with a **clearly fictional fixture** (`content/demo/harbor-lane-westfield.ts`: fictional brand, `.example` domain, 555-01xx phone, "Exampleton") that is imported only when `COMPASS_DEMO=true` is set at build time, renders a non-dismissible notice, is `noindex`, and is never a published route (sitemap/manifest). Schema: `Plumber` with `parentOrganization` = the fictional org; the client's business node is not on the page. | `content/locations/*`, `content/demo/*`, `components/site/{LocationPage,DemoNotice}.tsx`, `lib/seo.ts` (`locationJsonLd`), `app/locations/[slug]/` |
| Registry / QA | `lib/routes.ts` kinds `service-detail`, `city`, `location`; manifest checks city and detail links; crawl passes on 16 routes. | `lib/routes.ts`, `scripts/qa/route-manifest.ts`, `docs/template-inventory.md` |

**Table rendering and accessibility — now demonstrated** on the fixture:
three tables (`Regular opening hours`, `Services at this branch`, `Which
branch covers which area`) with `<caption>`, `th scope="col"` and
`th scope="row"`, in a wrapper that scrolls horizontally at 390px while the
page itself does not overflow (mobile screenshot and DOM probe in the Batch
B review package).

**Deliberately not done:** no second Show Me branch or office; no
Edwardsville project examples, landmarks, permit or utility claims (unsourced);
no `/locations` index page (only needed for a real multi-location client);
no service × city pages. The Vercel preview for this branch carries
`COMPASS_DEMO=true` scoped to `claude/template-completion` only (preview
target) so reviewers can open the fixture; production has no such variable.

**Still outstanding for template sign-off:** neutral branding, optional
careers, starter, second brand, mocked action tests and an actual AI-agent
trial (Batch C); GBP parity record (G7).

### Template completion — Batch C (2026-09-20)

Findings G3, G7, G8 and the action/agent half of G9; library §13–§15.

| Item | What changed | Where |
|---|---|---|
| Panel-upgrade copy | Diagnosis and frequency claims removed ("probably undersized", "three usually end in a new panel"); the page now says the cause is assessed first and the appropriate work recommended; FAQ, directory summary and description made consistent. | `brands/showme/content/services/electrical-panel-upgrades.ts` |
| G3 brand separation | All client-owned inputs moved to `brands/showme/`; framework imports `@brand/…` bound by `next.config.ts` from `COMPASS_BRAND` (tsconfig `paths` repointed at build). Colour utilities renamed to semantic roles (`primary`/`accent`/`surface`/`ink`) with values per brand in `theme.css`; fonts, decoration and motion literals per brand. Homepage, header, footer, 404, blog and contact strings that were hard-coded in components now come from the brand. Service hubs, child pages and legal documents are registry-driven dynamic routes. **Parity proven:** every route on both hosts snapshotted before the refactor and diffed after — careers markup identical; main-site visible text identical except the three pages carrying the intended panel-copy correction. | `brands/`, `next.config.ts`, `app/globals.css`, `app/services/[slug]`, `app/[doc]`, `lib/routes.ts` |
| G3 optional careers | `site.careers` (`null` = no host rule, nav entry, sitemap entry, route or `/api/apply`). Verified on Harbor Lane: `/careers*` and `POST /api/apply` are 404. | `middleware.ts`, `lib/host.ts`, `lib/jobs.ts`, `app/careers/*`, `app/api/apply` |
| G3/G8 second brand | **Harbor Lane Plumbing** (fictional): own identity, teal/amber palette, Manrope/Source Sans, no motif, own nav/footer/metadata/`Plumber` schema/contact details, two hubs + one child page, one served city, two branches + `/locations` index, two policies, no blog, no careers. Leak scan of every rendered page: zero Show Me strings, tokens or asset paths. Crawl PASS (14 routes). | `brands/harbor-lane/` |
| Fictional protection | `site.fictional` → site-wide notice, `noindex` on every page, `Disallow: /`, `forceMock` delivery; `next.config.ts` throws on a production build of a fictional brand or with `COMPASS_DEMO=true` (demonstrated: both builds refused). Show Me's demo fixture stays behind `COMPASS_DEMO` and is never a published route. | `next.config.ts`, `app/layout.tsx`, `app/robots.ts`, `brands/harbor-lane/inquiry.config.ts` |
| G9 actions | Duplicate-safe inquiries: one `submissionId` per message, reused on retry, remembered server-side for 10 min → a retry after a network failure delivers once. Scripted tests (`forms.test.mjs`, 21 checks, both brands): validation codes, honeypot, cross-origin, rate limit, error focus and field association, input preserved on failure, retry succeeds once with the same id, double-click sends once, success only on `{ok:true}`. | `lib/inquiry.ts`, `app/api/inquiry/route.ts`, `components/site/InquiryForm.tsx`, `scripts/qa/forms.test.mjs` |
| G9 agent trials | Actual AI-agent trials (a Claude agent operating the bundled Chromium through Playwright, no source access) on both brands: business identity, service lookup, served city vs. physical office, unknown hours/availability, contact options, navigating to and submitting the mocked inquiry form, error recovery. Results, prompts, versions and exceptions: `docs/agent-compatibility.md`. Scripted automation is reported separately from the agent trials. | `docs/agent-compatibility.md` |
| G8 QA | `npm run lint` (ESLint, non-interactive, zero warnings), `npm run typecheck`, `typecheck-brand`, brand-aware `qa:manifest`, `browser.test.mjs` (no-JS content, reduced motion, keyboard/skip link, 390px overflow, touch targets, table captions/scopes/scroll — 46 checks Show Me, 40 Harbor Lane), `scripts/qa/verify.sh` (clean clone → both brands → guards). Skip link is now the first tab stop ahead of the review banner. | `scripts/qa/*`, `package.json`, `.eslintrc.json` |
| G7 GBP parity | Field-by-field record from the website, the public listing data and the GBP spec; unavailable facts marked unverified; nothing changed on the live listing. | `docs/gbp-parity.md` |
| Starter | `brands/harbor-lane` is the neutral shape to copy; `docs/starter-checklist.md` is the next-client checklist. | `docs/starter-checklist.md` |

**Not done / limits:** the three visual presets named in library §13 remain
proposals (two brands are proven, not three). Agent trials cover one agent
family (Claude) with one browser; they do not prove universal compatibility.
The template is **not marked certified** — that is the reviewer's call after
this batch.

### Correction pass C1/C2 (2026-09-20)

From the reviewer's *Review and Completion Brief* §5 (Drive), after the
Batch C review at `f9aec93`.

| Item | What changed | Where |
|---|---|---|
| C1 idempotency | The in-process map is gone. `lib/idempotency.ts` is a durable per-submission store (content fingerprint + completion, one JSON file per id under `INQUIRY_IDEMPOTENCY_DIR`, atomic `wx` claims, 24 h retention). The real send passes the id as Resend's `Idempotency-Key` (24 h at the provider) — the guard across serverless instances that share no disk. Outcomes are explicit: unchanged retry → `{ok:true, duplicate:true}`; same id + different content → 409 `submission_changed`; same id in flight → 409 `in_progress`; a provider idempotency error maps to the same codes. Success is only ever reported after a completed delivery. | `lib/idempotency.ts`, `lib/inquiry.ts`, `app/api/inquiry/route.ts` |
| C1 form | The form element is captured before any `await`, so server-reported validation errors focus the right field. The submission id is bound to content: an unchanged retry reuses it, an edited message mints a new one, and a 409 `submission_changed` re-mints for the next click. | `components/site/InquiryForm.tsx` |
| C1 tests | `scripts/qa/forms.test.mjs`: six simultaneous requests deliver once; delivery-accepted-but-response-lost retry is a duplicate; retry through a **fresh handler instance** (the script starts a second `next start` from the same build) is a duplicate and its own new message round-trips; edited content after an ambiguous network failure gets a new id and is delivered; the same id with edited content is refused; a server-returned validation error preserves input and focuses the reported field. Mocked delivery only. | `scripts/qa/forms.test.mjs` |
| C2 portability | `scripts/qa/browser-launch.mjs` resolves Chromium (`CHROMIUM_PATH` → bundled → system) for both suites and prints setup instructions when none exists; README "Browser setup". | `scripts/qa/browser-launch.mjs`, README |
| C2 verify | `verify.sh` runs the browser suite on representative pages for both brands, asserts each production guard's own error message (any other build failure fails the run), uses a clean idempotency store, and documents `FRESH=1` as the clean-checkout mode. | `scripts/qa/verify.sh` |
| C2 docs | Completion checklist reconciled (no launch dependency; B1/B2/B10 accurate; B11/B12 added). `docs/drive/` now mirrors the reviewer's current consolidated Drive documents and carries the exact proposed C1/C2 status updates. Template inventory and agent report updated; inquiry agent task re-run. | `docs/completion-checklist.md`, `docs/drive/*`, `docs/template-inventory.md`, `docs/agent-compatibility.md` |

Out of scope and untouched: production, DNS, live GBP, CRM integration,
additional page batches, GA4, extra visual presets. Result: **ready for final
review**, not finally approved. City,
branch and individual-service templates (G2) are Batch B; neutral branding,
optional careers, starter and agent trials (G3, G8 remainder, G9) are Batch C.
