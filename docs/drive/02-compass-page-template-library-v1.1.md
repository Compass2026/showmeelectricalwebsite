# Compass Page Template Library v1.1

Specification status: complete v1 catalog. **v1.1 (Sep 20, 2026)** records implementation status per template against `Compass2026/showmeelectricalwebsite`, branch `claude/template-completion`, commit d218f1a8444acf26a6b24d5c8cec7cc00ffb5787 (evidence commit; the branch head adds only this documentation and a Vercel build-directory fix), with a fictional second brand (`brands/harbor-lane`) proving reuse. This is a page and component library specification; the reusable framework plus one brand directory per client is the installable starter (see §14). Certification remains the reviewer's decision.

Reviewed: Sep 19, 2026 (v1). Updated: Sep 20, 2026 (v1.1).

Use the companion Build Standard for acceptance. Reference code: Compass2026/showmeelectricalwebsite at e2dba2757df08550422d9b719a564283cc45d9a3 (Show Me launch candidate) and d218f1a8444acf26a6b24d5c8cec7cc00ffb5787 (template completion). Client launch is not a dependency for implementing or testing this library.

# 1. Shared content contract

Each page record contains: ID, type, slug/path, parent, published/draft state, canonical origin, search intent, title, description, social image, content sections, CTA, relevant service/location/article IDs, incoming link source, source/provenance notes, and meaningful modification date when known. Do not expose private reviewer notes or draft assets in production output.

Shared client config contains business identity, public-address policy, branch/service-area records, approved contact details, real profile links, verified claims, services, media references, primary CTA, and optional feature flags. Delivery secrets and recipient configuration remain server-only.

Shared theme contains semantic color roles, fonts, spacing, type scale, border/radius treatment, image crops, motion intensity, and decoration selection. Page structure and visual style can vary without duplicating core components.

**v1.1 implementation.** Page records are the typed content files under `brands/<brand>/content/` (`ServicePageContent`, `CityPageContent`, `BranchLocationContent`, `Article`, `LegalDocument`, `CorePage`), registered in per-brand registries that `lib/routes.ts` turns into the single published-route list (sitemap, manifest, crawl). Client config is `brands/<brand>/site.config.ts` (with `careers` optional and `fictional` for demonstrations); delivery settings are `brands/<brand>/inquiry.config.ts` (server-only). Theme is the semantic roles in `app/globals.css` (`primary`, `accent`, `surface`, `ink`, fonts) with values in `brands/<brand>/theme.css`, fonts in `fonts.ts`, motion and decoration in `theme.config.ts`. The framework imports all of it through the `@brand` alias bound by `COMPASS_BRAND` at build time.

# 2. Homepage

Purpose: establish what the company does, where it serves, why it is credible, and the next action.

- Required: focused hero with service/market positioning, primary CTA, service pathways, verified trust evidence, coverage summary, and contact path.
- Optional: signature scroll story, project gallery, testimonials, FAQs, owner/team feature, emergency callout only when offered, careers link only when enabled.
- Links: priority service hubs, useful service detail pages, service-area hub, about, and contact. Avoid repeating the same main intent across homepage and a metro city page.
- Schema: appropriate business entity and WebSite, with only supported facts. Additional markup must describe rendered content.

Show Me status (v1): built. Hero imported content directly; root layout contained electrical copy.
**v1.1: brand-neutral.** Every string on the homepage and root layout comes from the brand (`content/home.ts` `homePage`, `site.metadata`); the testimonials section and the emergency callout render only when the brand provides them; the careers line renders only when `site.careers` is set. Proven on both brands.

# 3. Service directory and category hub

Purpose: help visitors choose the correct service or customer pathway.

- Directory: introduction, service groups and cards generated from published page records, clear links to hubs/detail pages, and contact fallback.
- Category hub: focused hero, problem/solution summaries, child services, optional project proof/process/trust, relevant FAQs, related pages, and CTA.
- Links: directory → hub; hub → built child pages; hub → relevant coverage/articles. No dead links to planned routes.

Show Me status (v1): built. **v1.1:** hubs are the registry-driven route `app/services/[slug]`; the directory cards and catalog are generated from `servicePages`; hub items link a child page only through a registered `href`. Show Me: 3 hubs; Harbor Lane: 2 hubs.

# 4. Individual service page

Purpose: satisfy a specific buying intent and support an inquiry for that service.

- Inputs: verified offering, problem/use cases, scope and limitations, process, relevant photos/proof, service coverage, genuine customer questions, and next action. Pricing or timing only when sourced.
- Sequence: hero and direct answer → when the service helps → what is included → process/proof → relevant FAQs → related pages → CTA. Reorder for the client; omit unsupported blocks.
- Links: parent hub, alternatives/complementary services, relevant published city pages, articles, and contact. Schema: Service with the actual provider and service area; breadcrumbs; optional visible-FAQ markup.

Show Me status (v1): no child route. **v1.1: implemented.** `ServicePageContent.parent` + `serviceDetailPages` registry + `app/services/[slug]/[child]`. Show Me: `/services/residential/electrical-panel-upgrades` (copy corrected in Batch C to assess the cause first, no diagnosis or frequency claims); Harbor Lane: `/services/residential/water-heater-replacement`. The remaining 21 Show Me child pages are the client's separately tracked expansion.

# 5. Service-area hub

Purpose: describe verified coverage and help visitors find relevant city pages without implying offices.

- Inputs: approved regions, counties, cities, coverage limitations, inquiry guidance, and optional references to real branch locations.
- Show named coverage in readable groups. Link only cities with published pages. Keep unbuilt city names as text. Provide links to core services and contact.

Show Me status (v1): text-only badges. **v1.1: publication-aware.** A community may reference a city slug; `CoverageGroups` links it only when the brand's city registry has it. Show Me links Edwardsville; Harbor Lane links Northgate; every other name is text.

# 6. Served-city page

Purpose: explain relevant services in a city actually served. It is not an office listing.

- Inputs: city/state, confirmed coverage, distinct intent, services available, useful local evidence, approved photos or project references, locally relevant questions, source URLs for any regulatory/utility details, and contact CTA.
- Sequence: city/service hero and coverage answer → services offered → genuine local context/proof → how work is arranged → relevant FAQs if needed → related service links and CTA.
- Links: service-area hub, relevant services, local projects/guides, and contact. Neighboring city links only when useful. Use the real business entity with areaServed; do not create a fictional branch.
- Publish only after the Build Standard's city gate passes. Local facts must add value; a swapped city name, map, word count, or landmark list is insufficient.

Show Me status (v1): missing. **v1.1: implemented.** `CityPageContent` → `components/site/CityPage.tsx` → `app/service-area/[city]` (registered slugs only). Leads with a labelled `<dl>` of verified facts (served: yes; office: no; run from where; work types; emergency wording; phone), links only published service pages, typed-block local context, FAQ; schema is the real business node with `areaServed`, WebPage, breadcrumbs, FAQPage. Show Me: Edwardsville, IL (D-003/D-005; no landmarks, permits or projects — unsourced). Harbor Lane: Northgate. The 19 remaining Show Me cities stay planned; each must pass the gate. Out-of-state slugs carry the state code (`edwardsville-il`).

# 7. Physical branch/location page

Purpose: represent an actual business location with accurate visitor and contact information. This is a separate template from a served-city page.

- Inputs: verified location ID and real-world name, address/public visibility, direct contact, confirmed regular/holiday hours, access/directions, actual photos/team, location-specific services, and profile/map identity.
- Sequence: location overview → practical visit/contact information → services/team/proof → relevant questions → CTA. Show directions only where visiting is appropriate.
- Schema: genuine LocalBusiness subtype for that real location, linked to the parent organization as applicable. Location page and GBP should agree on approved facts.

Show Me status (v1): no template. **v1.1: implemented.** `BranchLocationContent` → `components/site/LocationPage.tsx` → `app/locations/[slug]`, plus `app/locations` index that exists only when a brand publishes locations. Hours (only when confirmed) and services-by-location render through the shared semantic `table` block (caption, column and row header scopes, horizontal scroll on narrow screens — demonstrated at 390px). People render without faked portraits. Schema: LocalBusiness subtype with `parentOrganization` from the location's own content. Harbor Lane publishes Westfield and Eastgate; Show Me publishes none (one shop). Show Me's fictional fixture builds only under `COMPASS_DEMO=true`, is `noindex`, visibly labelled, and never a published route.

# 8. Service-in-city page

Purpose: cover a distinct service/location need only when evidence supports a separate page.

- Combine verified service scope with substantive city-specific relevance and proof. It must add information beyond both the general service page and city page.
- Link to the parent service, city page, supporting proof, and contact. Check overlap with existing pages before publishing.

Show Me status: intentionally not built. **v1.1: unchanged** — opt-in composition, never a batch generator; not required to certify the starter.

# 9. About and trust

Purpose: make the actual business and people credible.

- Inputs: sourced company story, owner/team information, credential evidence, working process, approved photos, and genuine testimonials or project proof.
- Links: services, projects where available, contact, optional careers. Do not invent founding years, surnames, awards, review counts, or license numbers.

Show Me status (v1): built. **v1.1: brand-neutral** (`brands/<brand>/content/about.ts`); the testimonials section hides when a brand has none (Harbor Lane invents no reviews); a missing portrait shows a labelled placeholder, never a fake person.

# 10. Blog index and article

Purpose: answer useful customer questions and connect informational intent to appropriate services.

- Index: published articles with title, excerpt, actual date/byline where known, optional image, and useful topic grouping.
- Article: clear answer, logical headings, body links and source references, lists/tables when useful, original evidence, accurate authorship, meaningful update date, related service/article links, and relevant CTA.
- Use typed inline content for links/emphasis and typed blocks for tables, figures/captions, and references. Avoid raw HTML as the content interface. Sources and comparison claims must be accurate.
- Schema: BlogPosting with real author/date/image fields when known, stable publisher references, and breadcrumbs. Use modifiedAt for genuine revisions while preserving publishedAt.

Show Me status (v1): no inline links or tables, no modifiedAt. **v1.1: complete.** Typed `Inline` runs and `Block` types incl. `table` and `sources`; `modifiedAt` shown as "Updated", emitted as `dateModified`, used as sitemap lastmod; `relatedServices`/`relatedArticles` resolved from registries; articles link built hubs and the panel-upgrades child page in their bodies. A brand with no articles has no `/blog` (404) and no nav entry.

# 11. Project/case study

Purpose: provide original evidence of the work, with customer permission.

- Inputs: actual project type, permitted location detail, problem, scope, process, outcomes that can be substantiated, image rights, and relevant services. No fabricated before/after results.
- Links: related service, city when published, and contact. Protect private home addresses and customer details.

Show Me status: not implemented. **v1.1: unchanged** — optional extension; gallery and blocks are reusable now.

# 12. Contact, policies, and optional careers

- Contact: approved phone/email/address visibility, service inquiry form, accessible labels/statuses, failure recovery, no-JS alternatives, and accurate service choices.
- Policies: describe the actual client, data collection, providers, tracking, and business practices. Treat as per-client content subject to client review.
- Careers: optional module with its own host/routing/indexing policy when needed. Disabled means no nav entries, jobs imports, application route, or careers-host assumptions in the base output.

Show Me status (v1): careers assumed everywhere. **v1.1: careers optional.** `site.careers = null` removes the host rule, nav/footer entries, sitemap entries, `/careers*` routes (404) and `/api/apply` (404); Harbor Lane proves the disabled path, Show Me's live careers host is byte-for-byte unchanged (parity snapshot). The inquiry form is duplicate-safe (`submissionId`), keeps values on failure, moves focus to the first invalid field or the failure notice, disables submit until hydrated and shows success only on `{ok:true}`. Policies are per-brand legal documents rendered by `app/[doc]`.

# 13. Visual variants and adoption

Start with one neutral architecture and three styling presets to demonstrate range: trade/service (strong hierarchy and project proof), professional/health (calm reading and credentials), and design/showroom (larger imagery and portfolio emphasis). These are proposed presets, not three already-built themes. Client facts, requirements, and imagery remain unique.

Use the existing Next.js App Router/Tailwind/GSAP components as the initial implementation baseline. For compatible existing sites, adopt motion, page sections, or SEO helpers in small batches with regression checks. For other frameworks or WordPress, use this specification as guidance; copied components are not automatically compatible.

**v1.1:** two brands are proven on the one architecture (Show Me: navy/lime, Poppins/Inter, circuit motif; Harbor Lane: teal/amber, Manrope/Source Sans 3, no motif). The three named presets remain proposals.

# 14. Build recipe for the next client

- Duplicate the versioned neutral starter, not Show Me's production configuration.
- Load approved client and brand records; establish domains, delivery settings, feature flags, and search/page map.
- Select page types and visual treatment. Populate verified content and authorized images. Mark unavailable facts internally.
- Register only real published routes; generate menus, sitemap entries, breadcrumbs, and relationships from their records.
- Run the Build Standard checks on preview and return the commit, preview, screenshots, scope reconciliation, exceptions, and launch handoff.

**v1.1:** the starter is the framework plus a new `brands/<client>/` directory copied from `brands/harbor-lane` (the neutral shape; every value replaced), registered in `brands/registry.ts`. The step-by-step list is `docs/starter-checklist.md`; the commands are in the README ("QA commands") and `npm run verify` runs everything for both brands from a clean clone.

Gold-standard template completion requires all core types plus a proven service-detail, city, and branch fixture; a second brand; optional careers; typed content links; truthful metadata defaults; and a reproducible QA command. **v1.1 status:** all of these exist in the tree and are verified; sign-off is pending the reviewer's Batch C review. Actual client pages and production launch remain separate deliverables.

# 15. Agent-compatible page and action contracts

Apply Build Standard section 12 to every page type. Every template has a human-readable purpose, canonical route, semantic heading hierarchy, real links, accessible controls, and source-backed facts shared with its structured data.

- Home/service pages: an agent can identify who provides the service, what is offered, any known constraints, and the next action. Do not infer quotes, appointment availability, or response times.
- Coverage/city/branch pages: distinguish a served area from a real office. Link only published destinations and identify which services are confirmed for that area.
- Articles: preserve extractable answers, actual authorship and sources, contextual service links, and truthful update dates. Human copy and any optional machine-readable representation come from one source.
- Contact/careers: labeled fields and explicit intent, stable choices, readable errors and results, preserved inputs, and duplicate-safe handling. Careers remains optional. An accepted inquiry is not a confirmed appointment.

Add a representative task fixture for each core template and mocked action path, plus an actual browser-agent trial on the reference site and second-brand demo. Record tool versions and exact build. These checks are required for template sign-off; they are not yet verified in the existing Show Me audit. Future WebMCP/API adapters are optional extensions around the shared business logic, with ordinary browser operation preserved.

**v1.1: verified for one agent family.** Task fixtures (`scripts/qa/agent-tasks.md`), deterministic checks (`scripts/qa/forms.test.mjs`, `scripts/qa/browser.test.mjs`) and an actual Claude-agent trial in Chromium on both brands are recorded in `docs/agent-compatibility.md` with versions, build, results and exceptions. Compatibility beyond the tested agent and browser is provisional; no protocol server was added.

# Reference implementation

[Pinned Show Me source tree (launch candidate)](https://github.com/Compass2026/showmeelectricalwebsite/tree/e2dba2757df08550422d9b719a564283cc45d9a3)

[Template completion tree (Batch C)](https://github.com/Compass2026/showmeelectricalwebsite/tree/d218f1a8444acf26a6b24d5c8cec7cc00ffb5787)

[Existing template roadmap](https://github.com/Compass2026/showmeelectricalwebsite/blob/e2dba2757df08550422d9b719a564283cc45d9a3/docs/template-roadmap.md)

[Template inventory (Batch C)](https://github.com/Compass2026/showmeelectricalwebsite/blob/d218f1a8444acf26a6b24d5c8cec7cc00ffb5787/docs/template-inventory.md)
