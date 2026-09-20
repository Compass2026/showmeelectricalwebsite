# Compass website system — template inventory

Status of every page type in the *Compass Page Template Library v1*
against this codebase, on branch `claude/template-completion`. "Implemented"
means a typed content model, a renderer and at least one built route that
passes the raw-HTML crawl (`npm run qa`). "Optional" means the library lists
it as an extension that the base starter does not require. Nothing here is
marked done on the strength of a plan.

| § | Template | Status | Model → renderer → route | Proof in this tree | Not yet |
|---|---|---|---|---|---|
| 2 | Homepage | Implemented, brand-neutral (Batch C) | `@brand/content/home` → `components/home/*` → `app/page.tsx` (every string from the brand) | `/` on both brands | — |
| 3 | Service directory + category hub | Implemented | `ServicePageContent` → `components/services/ServicePage.tsx` → `app/services/[slug]` (registry-driven) | Show Me: 3 hubs; Harbor Lane: 2 hubs | — |
| 4 | Individual service page | **Implemented (Batch B)** | same model with `parent` → same renderer → `app/services/[slug]/[child]` (registry-driven) | `/services/residential/electrical-panel-upgrades`; hub item, directory catalog and two articles link it | 21 remaining child routes are the client's separate expansion plan |
| 5 | Service-area hub | Implemented; **publication-aware links (Batch B)** | `content/service-area.ts` (`Community` may reference a city page by slug) → `CoverageGroups` → `app/service-area/page.tsx` | `/service-area` links Edwardsville; every other community is text | — |
| 6 | Served-city page | **Implemented (Batch B)** | `CityPageContent` (`content/cities/types.ts`) → `components/site/CityPage.tsx` → `app/service-area/[city]` | `/service-area/edwardsville-il` — real business node with `areaServed`, no office, sourced facts (D-003, D-005, D-001) | 19 remaining planned cities are the client's separate expansion plan; each must pass the city gate |
| 7 | Physical branch / location page | **Implemented**; `/locations` index added (Batch C) | `BranchLocationContent` (`content/locations/types.ts`) → `components/site/LocationPage.tsx` → `app/locations/[slug]` | Fictional fixture `content/demo/harbor-lane-westfield.ts`, built only with `COMPASS_DEMO=true`; noindex, visible notice, excluded from sitemap/manifest; LocalBusiness subtype with `parentOrganization` | Harbor Lane publishes two locations plus the `/locations` index; Show Me (one shop) has neither, by registry |
| 8 | Service-in-city page | Not built (by design) | — | — | Opt-in composition only; never a batch generator |
| 9 | About and trust | Implemented, brand-neutral | `@brand/content/about` → `app/about/page.tsx` | `/about` on both brands; testimonials section hides when a brand has none | — |
| 10 | Blog index + article | Implemented | `Article` + typed `Block`/`Inline` → `ArticleLayout`/`Blocks` → `app/blog/*` | 3 articles with inline links, related services/articles, `modifiedAt` | — |
| 11 | Project / case study | Optional, not built | — | — | Reuse gallery + blocks when a client scope includes projects |
| 12 | Contact, policies, optional careers | **Implemented; careers optional (Batch C)** | `InquiryForm` + `/api/inquiry` (duplicate-safe ids); `app/[doc]` legal route from the registry; careers only when `site.careers` is set | Show Me: careers host live; Harbor Lane: no careers (routes 404, no nav/sitemap/host rule) | — |
| 13 | Visual variants | Two brands proven (Batch C) | semantic tokens in `app/globals.css`; values per brand in `theme.css`; `decoration` per brand | Show Me (navy/lime, circuit motif) and Harbor Lane (teal/amber, no motif) | The three named presets remain proposals |
| 15 | Agent-compatible contracts | Implemented + trialled (Batch C) | Labelled `<dl>` fact lists, semantic tables, labelled `<nav>` lists, real anchors, duplicate-safe form ids, `scripts/qa/forms.test.mjs`, `scripts/qa/browser.test.mjs` | Both brands; see `docs/agent-compatibility.md` for the actual agent trials | Trials cover one agent family only (see the report) |

## Added in Batch C

- `brands/` with `@brand` alias (`next.config.ts`, `brands/registry.ts`),
  semantic colour roles, per-brand fonts/theme/decoration/redirects/careers.
- `app/services/[slug]`, `app/services/[slug]/[child]`, `app/[doc]`,
  `app/locations/page.tsx` — registry-driven routes replacing per-client files.
- Optional careers (`site.careers`), fictional-brand protection
  (`site.fictional`, production build guard, `forceMock`).
- Duplicate-safe inquiry submissions (`submissionId`), skip link as the first
  tab stop, empty-state guards (no blog, no testimonials, no locations).
- QA: `lint`, `typecheck`, `typecheck-brand`, brand-aware `manifest`,
  `forms.test.mjs`, `browser.test.mjs`, `verify.sh`; `docs/gbp-parity.md`,
  `docs/starter-checklist.md`, `docs/agent-compatibility.md`.

## Shared building blocks added in Batch B

- `components/site/FactList.tsx` — semantic `<dl>` of labelled facts (the
  "extractable answer" a city or location page leads with).
- `components/site/DemoNotice.tsx` — non-dismissible notice for `fictional`
  content.
- `lib/seo.ts` `locationJsonLd()` — LocalBusiness subtype for one real
  place, with `parentOrganization`, hours only when confirmed; reads nothing
  from the client config.
- `lib/routes.ts` — route kinds `service-detail`, `city`, `location`;
  fictional/noindex locations are never published routes.
- `scripts/qa/route-manifest.ts` — content links from city bodies and
  service-detail relationships are checked like article links.

## Registries (publication gates)

| Registry | Gate | Consumers |
|---|---|---|
| `content/services/index.ts` `servicePages` / `serviceDetailPages` | content file + route exist | directory, inquiry form groups (hubs only), routes, blog related links, city service links |
| `content/cities/index.ts` `cityPages` | owner-confirmed coverage + sourced local facts + route | `CoverageGroups` links, routes |
| `content/locations/index.ts` `locationPages` | verified real location; fixtures only with `COMPASS_DEMO=true` | routes (non-fictional only) |
