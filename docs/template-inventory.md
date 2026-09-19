# Compass website system — template inventory

Status of every page type in the *Compass Page Template Library v1*
against this codebase, on branch `claude/template-completion`. "Implemented"
means a typed content model, a renderer and at least one built route that
passes the raw-HTML crawl (`npm run qa`). "Optional" means the library lists
it as an extension that the base starter does not require. Nothing here is
marked done on the strength of a plan.

| § | Template | Status | Model → renderer → route | Proof in this tree | Not yet |
|---|---|---|---|---|---|
| 2 | Homepage | Implemented (client) | `content/home.ts` → `components/home/*` → `app/page.tsx` | `/` | Hero still imports client content directly; neutral defaults (Batch C) |
| 3 | Service directory + category hub | Implemented | `ServicePageContent` → `components/services/ServicePage.tsx` → `app/services/*` | `/services`, `/services/{residential,commercial,industrial}` | — |
| 4 | Individual service page | **Implemented (Batch B)** | same model with `parent` → same renderer → `app/services/residential/electrical-panel-upgrades/page.tsx` | `/services/residential/electrical-panel-upgrades`; hub item, directory catalog and two articles link it | 21 remaining child routes are the client's separate expansion plan |
| 5 | Service-area hub | Implemented; **publication-aware links (Batch B)** | `content/service-area.ts` (`Community` may reference a city page by slug) → `CoverageGroups` → `app/service-area/page.tsx` | `/service-area` links Edwardsville; every other community is text | — |
| 6 | Served-city page | **Implemented (Batch B)** | `CityPageContent` (`content/cities/types.ts`) → `components/site/CityPage.tsx` → `app/service-area/[city]` | `/service-area/edwardsville-il` — real business node with `areaServed`, no office, sourced facts (D-003, D-005, D-001) | 19 remaining planned cities are the client's separate expansion plan; each must pass the city gate |
| 7 | Physical branch / location page | **Implemented (Batch B), demo-only** | `BranchLocationContent` (`content/locations/types.ts`) → `components/site/LocationPage.tsx` → `app/locations/[slug]` | Fictional fixture `content/demo/harbor-lane-westfield.ts`, built only with `COMPASS_DEMO=true`; noindex, visible notice, excluded from sitemap/manifest; LocalBusiness subtype with `parentOrganization` | A `/locations` index page (needed for a real multi-location client) is not built; optional for single-location clients |
| 8 | Service-in-city page | Not built (by design) | — | — | Opt-in composition only; never a batch generator |
| 9 | About and trust | Implemented (client) | `content/about.ts` → `app/about/page.tsx` | `/about` | Neutral starter must replace every client claim/photo (Batch C) |
| 10 | Blog index + article | Implemented | `Article` + typed `Block`/`Inline` → `ArticleLayout`/`Blocks` → `app/blog/*` | 3 articles with inline links, related services/articles, `modifiedAt` | — |
| 11 | Project / case study | Optional, not built | — | — | Reuse gallery + blocks when a client scope includes projects |
| 12 | Contact, policies, optional careers | Implemented (client); careers not yet optional | `InquiryForm` + `/api/inquiry`; `content/legal/*`; careers host routing | `/contact`, `/privacy-policy`, `/terms-of-service`, careers host | Careers-disabled configuration (Batch C) |
| 13 | Visual variants | Not built | — | — | Three presets are proposals; second-brand demo is Batch C |
| 15 | Agent-compatible contracts | Partly (semantic part) | Labelled `<dl>` fact lists, semantic tables, labelled `<nav>` lists, real anchors | City facts list; hub → child links; fixture hours/services tables | Mocked action tests, duplicate handling and an actual browser-agent trial (Batch C) |

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
