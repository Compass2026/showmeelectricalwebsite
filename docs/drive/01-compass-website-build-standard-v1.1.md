# Compass Website Build Standard v1.1

Purpose: the reusable build and review standard for Compass client websites. Complete this standard on a protected preview before launch. Launch approval, DNS changes, search indexing results, and ongoing marketing are separate stages.

Reviewed: Sep 19, 2026 (v1). Updated: Sep 20, 2026 (v1.1 — implementation status recorded against `Compass2026/showmeelectricalwebsite`, branch `claude/template-completion`, commit d218f1a8444acf26a6b24d5c8cec7cc00ffb5787 (evidence commit; the branch head adds only this documentation and a Vercel build-directory fix)). This update keeps every v1 requirement and link; it adds what was implemented, what remains optional, and what is production-only. **Template certification is not granted by this document; it is the reviewer's decision after the Batch C review.**

Companion documents (identities unchanged): *02 Compass Page Template Library* and *03 Show Me Audit and Claude Template Completion Brief*.

# 1. What "gold standard" means

A gold-standard website is visually distinctive, useful, accessible, technically sound, and supported by repeatable evidence. Passing the build standard does not guarantee rankings, AI citations, leads, or legal compliance. A reusable template is certified only after it also works with a second brand and without Show Me Electrical-specific dependencies.

- Build complete: approved page scope implemented; content, links, forms, metadata, schema, accessibility, and performance checked against a pinned commit on preview.
- Template complete: shared components and required page types documented and tested; client identity, geography, claims, media, recipients, and credentials isolated; second-brand proof passed.
- Launch complete: client approval, backup, production settings, domain cutover, redirects, real-host checks, and search handoff completed.

**v1.1 status.** *Template complete* is now demonstrated in code: the framework (`app/`, `components/`, `lib/`, content type contracts, `scripts/qa/`) is separate from the brand layer (`brands/<brand>/`), the reference client (`brands/showme`) and a clearly fictional second brand (`brands/harbor-lane`) build from the same framework, and the careers property is optional. *Build complete* for Show Me remains the reviewed launch candidate (release commit e2dba27 on `claude/main-site-foundation-v1`). *Launch complete* is untouched and remains a separate checklist.

# 2. Required inputs and page planning

(unchanged from v1)

- Client source record: display and legal names, contact details, public-address policy, verified locations, service areas, hours, actual services, credentials, offers, claims, and approved sources. Unknown facts stay omitted or flagged.
- Brand record: logo assets and usage, palette, typography, tone, photography rights and provenance, visual references, primary conversion, and permitted motion.
- Search map: each proposed page's purpose, main query intent, supporting topics, service/location IDs, parent page, source evidence, CTA, related pages, and publication status. Record actual research sources and dates; never invent volume, competition, rankings, or CPC.
- Migration inventory: current pages, posts, media, important inbound destinations, canonical host, integrations, forms, existing verification tags, and old-to-new URL map. Preserve useful URLs where practical.
- Measurement/access record: GSC, analytics, GBP, Bing, and other required accounts marked connected, pending, not applicable, or explicitly deferred. Lack of data is not a zero result.

Publish pages because they answer a distinct customer need with verified content. A service can initially have a clearly identified hub section, with a dedicated page tracked as an explicit scope item. An approved client page plan cannot be silently reduced by this general rule.

**Where these inputs live (v1.1):** `brands/<brand>/site.config.ts` (client source record), `brands/<brand>/theme.css`, `fonts.ts`, `theme.config.ts` (brand record), `docs/page-plan.md` + the content registries (search map and publication status), `brands/<brand>/redirects.ts` + `docs/migration-inventory.md` (migration), `docs/decisions.md` + `docs/open-questions.md` (unknowns and access record). The next-client sequence is `docs/starter-checklist.md`.

# 3. Design, media, and motion

(unchanged from v1)

- Every client receives deliberate art direction: recognizable identity, readable hierarchy, consistent spacing, useful imagery, clear primary action, and coherent desktop/mobile layouts. Shared components allow different section orders and emphasis.
- Use semantic theme roles such as surface, accent, ink, and muted text. Keep color and type values in the brand layer; electrical circuit decoration must be optional.
- Use authentic client work and team photos when available. Record permission/source, descriptive alt text, crop/focal point, dimensions, and caption. Licensed stock or generated illustration must not be presented as a real client project, person, or result.
- Serve responsive optimized images with reserved space. Prioritize the actual LCP image; lazy-load below-fold media. Video needs a lightweight poster, captions when relevant, reduced-motion behavior, and useful content when playback fails.
- Use GSAP/ScrollTrigger for intentional storytelling and CSS for simple hover/focus effects. Native scrolling remains the baseline. Every effect has a purpose, mobile simplification, cleanup on navigation, and a reduced-motion fallback.
- Critical text and calls to action remain visible without JavaScript. Entrance animation must not hide already-visible hero content on slow devices. Hover interactions have keyboard/touch equivalents.

**Implemented (v1.1):** semantic roles `primary`, `accent`, `surface`, `ink` in `app/globals.css`, values per brand in `theme.css`; decoration (`heroBackdrop`, `storyRail`) per brand — Show Me keeps the circuit motif, Harbor Lane has none. Motion safeguards: above-the-fold entrances play only if hydration completes within `immediateDeadlineMs` (1200 ms), otherwise server-rendered content stays as painted; `prefers-reduced-motion` disables reveals and circuit animation; GSAP-tweened elements carry no CSS transitions; `scripts/qa/browser.test.mjs` checks no-JS visibility, reduced-motion visibility and no leftover transforms on every tested page.

The previously mentioned additional photo/reference was not available in this audit. Record it as an optional design input to incorporate when supplied, not as a reason to delay the core template specification.

# 4. Page and technical SEO requirements

(unchanged from v1)

- Unique, useful title and description for every public page; one clear H1 and logical headings as the Compass editorial convention. Use the page's actual intent, not mechanically repeated keywords.
- Title length around 60 characters and description length around 155 are editorial checks, not Google hard limits or automatic critical failures. Review usefulness and likely truncation. See Google title guidance.
- One intentional canonical URL per page. Align metadata, schema, sitemap, redirects, and internal URLs with the canonical origin. Include working social-card metadata and an owned default image for pages without a bespoke image.
- Serve important content and metadata in the initial response through the platform's supported server/static rendering. Inspect raw HTML and browser output. Google can render JavaScript; raw-HTML availability is our portability and reliability standard, not a claim that Google never renders it.
- Production public pages return appropriate status codes; unknown URLs return 404; removed content has a deliberate redirect or removal response. Avoid redirect loops and unnecessary chains. A permanent 301 or 308 can be appropriate.
- Generate the sitemap from published canonical pages that resolve successfully. Exclude previews, drafts, redirected and noindex URLs. Set lastmod from a significant content change when known, never from every build. Google ignores priority and changefreq.
- Preview stays non-indexable; production indexing is an explicit setting verified at build and on the serving host. Robots blocking is not authentication and is not a substitute for noindex.
- Keep navigation and substantive content links crawlable as normal anchors. Check fragments, media URLs, tel/mail links, external links, and canonical host variants.

**Implemented (v1.1):** `lib/metadata.ts` (`pageMetadata`) gives every route an absolute canonical, OG and Twitter card with an owned default image; `lib/routes.ts` is the single published-route registry feeding the sitemap, manifest and crawl; `lastModified` only from recorded content dates. `scripts/qa/crawl.mjs` asserts exactly one canonical on the configured production origin, sitemap = manifest as full URLs, both share images on the production host (validated on the local build under an explicit `--assets remap` mode), fragments resolved cross-page, incoming links counted from rendered anchors only, JSON-LD references, 404 for unknown paths; `crawl.test.mjs` proves each failure is caught. Fictional brands force `noindex` and `Disallow: /` regardless of the indexing switch.

# 5. Services, cities, and real locations

(unchanged from v1)

Use three distinct concepts: a service-area hub summarizes coverage; a city page explains work available in a served city; a physical-location page describes an actual branch or customer-facing location. City pages do not imply offices or qualify a business for additional GBP listings.

- City publication gate: service coverage confirmed, distinct customer purpose, useful sourced local material, enough real information to answer the query, relevant service links, and no substantial duplication of another page.
- Local material can include real project evidence, relevant service constraints, verified permitting/utility information, or customer questions. Do not insert landmarks, fake jobs, invented regulations, or arbitrary word count just to appear local.
- Service-in-city pages are conditional. Build only when a distinct demand/use case and substantive local service content justify a separate page. Never generate the full service × city matrix automatically.
- Use one stable business entity for a service-area business. Reference the existing provider and appropriate areaServed on city pages. Create separate location entities only for verified real branches.
- Maps and directions should serve actual visitor needs and respect the client's public-address decision. Do not fabricate a local address or map pin for a served city.

These gates apply even to a small batch. Large expansions need explicit scope review; a numeric threshold is a planning trigger, not permission to create thin pages below it. See Google spam policies and GBP business guidelines.

**Implemented (v1.1):** `CityPageContent` → `CityPage` → `/service-area/[city]` (registry-gated; Show Me: Edwardsville, IL with the real business node and `areaServed`, no office; Harbor Lane: Northgate). `BranchLocationContent` → `LocationPage` → `/locations/[slug]` plus a `/locations` index that exists only when a brand publishes locations (Harbor Lane: Westfield and Eastgate; Show Me: none). The service-area hub links a community only when its city page is registered. A served-city page leads with a labelled fact list that states "office: no" and where the work is run from; a location page carries address, visitability, confirmed hours (rendered as a semantic table), services-by-location and people without faked portraits. Show Me's fictional branch fixture builds only under `COMPASS_DEMO=true` and is never a published route.

# 6. Internal linking contract

(unchanged from v1)

- Homepage → priority service hubs, service-area hub, trust/about, and conversion.
- Service directory/hub → implemented child services; child service → parent, relevant alternatives, supported cities, useful guides/projects, and contact.
- Service-area hub → published city/branch pages; city page → services actually offered there, relevant local proof, parent hub, and contact. Unbuilt cities remain plain text.
- Article → the relevant commercial page and genuinely useful supporting articles or locations. Link in the body where it helps the reader; a footer link alone is insufficient for topical context.
- Project/case study → its service and supported city page. Add reciprocal links only where useful.
- No orphan published pages. Descriptive natural anchors, no boilerplate keyword stuffing, no links to drafts, and no irrelevant all-to-all city linking. Breadcrumbs express the logical hierarchy.

Record each page's incoming link source and intended outgoing relationships in the page manifest. Verify routes and fragments by crawl. The content system must support typed inline links and references, not raw HTML injection.

**Implemented (v1.1):** typed `Inline` links and `Block` types (`content/blocks.ts`), `relatedServices`/`relatedArticles` resolved from registries, hub items link child pages via `href`, city `services.paths` resolve only to published pages, `docs/route-manifest.md` records parent/related/incoming per route, and the crawl fails on any orphan counted from rendered anchors.

# 7. AEO, GEO, and structured data

(unchanged from v1)

AEO/GEO readiness means clear answers, accessible content, factual identity, original evidence, and useful references. Begin relevant sections with direct answers and then explain qualifications. Use lists or comparison tables when they clarify. There is no fixed FAQ count or universal answer length.

- Write specific claims only from approved evidence. Preserve genuine author attribution; identify qualified reviewers where relevant. Add real project detail and source citations rather than invented statistics, prices, reviews, or credentials.
- Use appropriate Schema.org types and stable IDs. JSON-LD must match visible facts. Validate syntax and references; separately check Google eligibility only for supported rich-result types. Valid Service markup is not a promise of a special Google result.
- Visible FAQs remain useful. FAQPage markup is optional semantic markup, not a guaranteed search feature. Google's current documentation records retirement of FAQ rich results; see Search documentation updates.
- Do not add self-serving LocalBusiness/Organization review stars as a default. Genuine testimonials can display, but Google's self-serving review restrictions still apply.
- SearchAction requires an actual working search feature; do not fabricate one. llms.txt is optional and is not a Google AI eligibility requirement. Special "AI schema" is not required for Google AI features.
- Record a client-approved crawler policy. Distinguish search/retrieval crawlers from training crawlers; do not require training access as a condition of search readiness. User-agent probes alone do not prove real crawler access or indexing.

AI visibility is measured separately with a fixed query set, engine, time, location/context, result, and cited sources. Results vary. No "AI ranking" score is invented from page structure. See Google AI features guidance.

**Implemented (v1.1):** every JSON-LD node is built from the same objects the page renders (`lib/seo.ts`); FAQPage only when an FAQ section is rendered and non-empty; `dateModified` only for recorded revisions; location schema is a LocalBusiness subtype with `parentOrganization` from the location's own content; no aggregateRating, no SearchAction, no openingHours unless confirmed. Crawler policy per client remains a recorded decision (Show Me: none yet — open question).

# 8. Website ↔ GBP handoff

(unchanged from v1)

Maintain a parity record for each real business/location: field; approved value and source; website path; schema field; GBP observed value and observation time; match/conflict/unknown; correction owner. Include names, address visibility, phone, hours, categories, services, areas, profile URLs, photos, and attributes.

- Use the business's verified real-world identity. Do not rename GBP merely to match a CRM label. Legal and trading names can be represented explicitly rather than treated as automatically conflicting.
- Map each real GBP service to a relevant page or clearly named section and track any promised dedicated page separately. Coverage can be represented accurately without a city page for every service area.
- Confirm profile links, map identity, hours, and any location-specific directions from current sources. Do not claim a parity pass using an old specification alone.
- Website readiness does not include automatic edits to live GBP, review requests, or social posting. Those remain separately authorized delivery work.

**Recorded (v1.1):** `docs/gbp-parity.md` — field-by-field for Show Me from the website, public listing data observed 2026-09-20 (listing name "Show Me Electrical Services", Mon–Fri 08:00–18:00, pin 38.565/−90.312, `is_claimed`), and the GBP Spec. Name/address/phone/category/domain match; the website is deliberately narrower on hours, emergency availability and attributes; the profile's pin and hours may be adopted only after owner confirmation; the proposed rename awaits verification of the registered name. Nothing on the live listing was changed.

# 9. Forms, measurement, and maintainability

(unchanged from v1)

- Validate on the server, preserve inputs on failure, make success/failure states understandable, and provide phone/email alternatives. Before hydration and with JavaScript disabled, never leak personal information into query strings or show false success.
- Keep secrets server-side. Every client/environment has explicit delivery settings; the neutral starter must not default to a previous client's recipient. Record spam controls and their limits. Test without sending messages unless authorized.
- Document analytics state. When enabled, verify page views and meaningful conversions such as accepted lead submissions and click-to-call intent without collecting form PII. A phone click is not proof of a completed call.
- Policies describe the deployed form, tracking, and actual business practices. Client-specific policy review is required; do not carry another client's legal text as approved boilerplate.
- Keep dependencies locked, document compatible versions, verify build/type checks and review relevant dependency alerts before release. Shared modules have explicit inputs and extension points.

**Implemented (v1.1):** per-brand `inquiry.config.ts` (recipients, sender, `forceMock` for demonstrations); `/api/inquiry` with same-origin check, per-instance rate limit, honeypot, server validation, and duplicate-safe `submissionId` handling (a retry after a network failure delivers once); the form disables submit until hydrated, keeps values on every non-success path, moves focus to the first invalid field or the failure notice, and shows success only on `{ok:true}`. Analytics: deferred by client decision (D-006), documented. Non-interactive `npm run lint`, `npm run typecheck`, per-brand typecheck, `npm run verify` (clean clone, both brands, guards).

# 10. Acceptance checklist and sign-off

(unchanged from v1)

For each check record status (pass, fail, not applicable, or not verified), evidence, exact commit/build, reviewer, and corrective action. Do not turn a missing measurement into a pass.

- Content: approved scope accounted for; source-backed claims; no placeholders or previous-client facts; page intent and linking reviewed.
- Rendering: raw HTML and hydrated output agree for each page type; metadata/schema are present and valid; preview controls confirmed.
- Crawl: all published routes resolve; sitemap matches manifest; canonical/redirect behavior correct; no orphans, broken links, or false-success 404s.
- UX: desktop, mobile, keyboard, focus, labels, contrast, reduced motion, no-JS content, zoom/reflow, menus, FAQs, and error states checked. Target WCAG 2.2 AA; automated checks alone do not certify accessibility.
- Forms: validation, fast/autofill submission, duplicate-submit prevention, failure recovery, and no-PII-in-URL checked. Distinguish provider acceptance, provider delivery, and human receipt.
- Performance: record representative mobile lab runs for home, service, location, article, and contact templates. Compass target: Lighthouse performance ≥90 with a documented exception if lower; prioritize actual delays over score chasing. This is an agency target, not a Google requirement.
- Field data when available: good Core Web Vitals at the 75th percentile are LCP ≤2.5 s, INP ≤200 ms, CLS ≤0.1. Lab TBT is not field INP. No field data means not measured, not failed or passed. See Web Vitals guidance.
- Reuse: second brand and no-careers configuration work; no Show Me content, URLs, credentials, images, recipients, or redirects remain in neutral outputs; optional sections work both present and absent.
- Handoff: template catalog, source manifest, commands, screenshots, findings, accepted exceptions, version, and exact commit recorded. Template acceptance is independent of production DNS and client launch scheduling.

**Status at v1.1 (commit d218f1a):**

| Check | Status | Evidence |
|---|---|---|
| Content | pass (Show Me), pass (Harbor Lane, fictional by design) | panel-upgrade copy corrected; leak scan 0 matches |
| Rendering | pass | raw-HTML checks; parity snapshot diff before/after the brand separation |
| Crawl | pass | Show Me 16 routes, Harbor Lane 14 routes |
| UX | pass (automated), not certified (manual WCAG audit not performed) | `browser.test.mjs` 46 + 40 checks; screenshots |
| Forms | pass | `forms.test.mjs` 22 checks per brand; provider delivery for Show Me: accepted exception D-007 (delivered per provider, inbox receipt unverified) |
| Performance | recorded exception | Show Me mobile lab (Batch 4): home 85, residential 84, contact 98; Harbor Lane not measured (placeholder graphics) |
| Field data | not measured | pre-launch |
| Reuse | pass | Harbor Lane builds without careers; production guards refuse fictional builds |
| Handoff | pass | `docs/template-inventory.md`, `docs/route-manifest.md`, README commands, screenshots, this update |
| Agent compatibility (§12) | pass for the tested agent family; provisional beyond it | `docs/agent-compatibility.md` |

# 11. Source corrections and boundaries

(unchanged from v1)

This v1 build standard reconciles the existing Compass documents for new template work. It leaves those originals intact and does not silently change approved client scope or monthly package deliverables.

Corrections: replace mandatory 10+ FAQs/800-word drafts with usefulness; replace automatic service-in-city generation with the publication gate; treat Google title lengths as editorial guidance; remove SearchAction without search and self-serving review-star defaults; treat FAQ rich results as retired; distinguish city coverage from actual branches and GBP eligibility; retain raw-HTML checks without claiming Google cannot render JavaScript; use truthful lastmod; allow explicitly deferred analytics. AEO/GEO outcomes and backlinks are ongoing work, not template pass claims.

# 12. AI agent compatibility and acceptance

(unchanged from v1; status appended)

Required for every Compass template: agents must be able to discover the public site, understand verified business facts, navigate its pages, and use the available customer workflow. This is a tested compatibility standard, not a guarantee of perfect behavior across every model, browser, or future protocol. Keep the human experience fully usable.

## Read and understand

- Serve business identity, services, coverage, contact details, qualifications, and important answers in semantic HTML. JSON-LD and visible content must derive from the same approved records. Keep important facts out of image-only, canvas-only, hover-only, or animation-gated presentation.
- Use stable canonical URLs, descriptive headings, normal anchor links, and explicit relationships among services, cities, real branches, articles, and contact. Unknown hours, prices, availability, or credentials must stay unknown rather than become inferred promises.
- Review robots, indexing controls, CDN/WAF challenges, and crawler access separately. Record client choices for search discovery, user-initiated retrieval, and model training. OpenAI distinguishes OAI-SearchBot, ChatGPT-User, and GPTBot. Do not equate training access with search inclusion or treat a spoofed user-agent test as proof of real-agent access. Preview protection stays enabled.

## Navigate and act

- Use native links, buttons, inputs, selects, labels, field names, appropriate input types, and keyboard/focus behavior. Agents should identify controls through their accessible names and roles. Visual effects must not move or hide a target during interaction; reduced-motion mode must retain all capabilities.
- Forms expose required fields, valid choices, errors, progress, and the final result in readable text and accessible status messages. Distinguish request received from appointment booked, quote accepted, or email delivered. Keep entered values after recoverable failure, and prevent accidental duplicate processing.
- Separate validation and business logic from UI rendering so a future agent adapter can reuse the same rules. Any action interface needs explicit inputs, outputs, error states, authorization where applicable, and retry/duplicate handling. Credentials remain server-side. Do not expose CRM records or remove spam/access controls to improve agent compatibility.
- Sending an inquiry, booking, applying, paying, or changing a record must be a clearly identified action based on the user's intent. Where scope or consequences are ambiguous, require a review/confirmation step. Never silently enroll a visitor in marketing. A public action endpoint is not permission for unrestricted automation.

## Proof required before template sign-off

- Reading test: using fetched HTML, correctly identify the business, a supported service, a confirmed coverage area, and contact route; link to evidence and report an intentionally unavailable fact as unknown. Check structured data against those same visible facts.
- Browser task test: from the homepage, find a service, check city coverage, follow a relevant article link, and reach contact. Use semantic controls rather than coordinates or custom test-only hooks. Repeat critical interactions on mobile and with reduced motion; verify no-JS content and clear form alternatives.
- Action test in an isolated preview with a mocked delivery adapter: fill by field labels, recover from invalid input and a network/server failure, submit once, and verify the accepted state. Retry and double-click must not create duplicate side effects. Include the careers workflow only when enabled. Do not send real email, applications, bookings, or payments as part of this test.
- Commit deterministic browser regression checks and also record at least one actual browser-agent task trial. Record tool/model and browser versions, task wording, build SHA, results, and reproducible failures. Automated browser scripts alone are not proof that an AI agent completed a task. If an actual agent is unavailable, mark the trial not verified and keep agent compatibility provisional.

All required representative tasks must pass or have an explicitly accepted, bounded exception. Apply the tests to Show Me and the second-brand demo before starter approval. Production crawler access and third-party search inclusion remain separate post-launch observations. Re-run affected tasks after navigation/form changes and before a new template release.

**Status (v1.1):** reading, browser-task and action tests were run on both brands by an actual Claude agent (claude-fable-5-1) in Chromium 141 via Playwright with no source access; all tasks passed; the deterministic checks are committed (`forms.test.mjs`, `browser.test.mjs`); prompts, expected facts, versions, results and the agent's own observations with dispositions are in `docs/agent-compatibility.md`. Bounded exceptions: only one agent family and browser were tested; the careers workflow was not agent-tested (live property); the "article link" step was covered on Show Me (articles link built service pages) and is not applicable to Harbor Lane (no articles). Compatibility beyond the tested agent remains provisional.

## Emerging interfaces

(unchanged from v1)

Keep an extension point for browser tool interfaces such as WebMCP. Its official materials describe structured declarative form actions and imperative JavaScript tools. Evaluate current browser/agent support and feature-detect before adopting it; retain standard HTML/form behavior when unsupported. A WebMCP pilot, separate MCP server, public API, llms.txt, or Markdown mirror is optional unless a specific supported workflow justifies it. None substitutes for real task tests. If an alternate machine-readable surface is added, generate it from the same content source and keep access rules consistent.

Google's AI Search guidance does not require special AI files or schema. Search visibility and agent task completion are separate measurements. **v1.1:** no protocol server or extra dependency was added; the reusable surface for a future adapter is `lib/inquiry.ts` (validation, limits, duplicate ids) and the API route contract.

## Agent compatibility references

[OpenAI crawler roles and controls](https://developers.openai.com/api/docs/bots)

[W3C accessible form guidance](https://www.w3.org/WAI/tutorials/forms/)

[Chrome WebMCP structured interaction proposal](https://developer.chrome.com/blog/webmcp-epp)

# 13. Launch checklist (production-only; unchanged in substance)

These checks are performed only at launch and are not part of template acceptance: client visual approval; WordPress backup; production environment (`COMPASS_BRAND`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_ALLOW_INDEXING=true`, `RESEND_API_KEY`, recipient overrides; never `COMPASS_DEMO` or a fictional brand — the build refuses); DNS cutover with the exact records Vercel displays; redirects verified on the real host; GBP link and parity re-check on the live listing; search handoff. Reference: `docs/launch-checklist.md`, `docs/deployment-plan.md`.

# Official references

[Google AI features guidance](https://developers.google.com/search/docs/appearance/ai-features)

[Google spam policies](https://developers.google.com/search/docs/essentials/spam-policies)

[Google title guidance](https://developers.google.com/search/docs/appearance/title-link)

[Google JavaScript rendering guidance](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)

[Google sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)

[Search documentation updates](https://developers.google.com/search/updates)

[Google review snippet restrictions](https://developers.google.com/search/docs/appearance/structured-data/review-snippet)

[GBP business guidelines](https://support.google.com/business/answer/3038177)

[Web Vitals guidance](https://web.dev/articles/vitals)
