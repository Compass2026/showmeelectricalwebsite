# Show Me Reference Audit and Template Completion Brief v1.1

Audit reviewed: Sep 19, 2026 (v1). **Completion recorded: Sep 20, 2026 (v1.1).** The v1 findings G1–G9 and the §5 brief are preserved verbatim below; each finding now carries its completion status against `Compass2026/showmeelectricalwebsite`, branch `claude/template-completion`, commit d218f1a8444acf26a6b24d5c8cec7cc00ffb5787 (evidence commit; the branch head adds only this documentation and a Vercel build-directory fix). The Show Me launch candidate (e2dba2757df08550422d9b719a564283cc45d9a3 on `claude/main-site-foundation-v1`) is unchanged. **The template is not marked certified; that decision follows the Batch C review.**

Reference: Compass2026/showmeelectricalwebsite, branch claude/main-site-foundation-v1, commit e2dba2757df08550422d9b719a564283cc45d9a3.

Conclusion (v1): the release is a useful reference implementation with reusable foundations. It is not yet a complete, neutral Compass starter. The build standard and page template catalog can be finalized now; the finite completion work below does not depend on Show Me going live.

# 1. Scope and confidence

(v1 text unchanged)

This review inspected the current GitHub tree, selected source files, repository plans/audit reports, and current contents of the Compass Drive SOP, master checklist, website playbook, approved Show Me keyword map, GBP specification, and GBP audit template. The release branch still resolves to the pinned commit above.

Source inspection establishes what exists in code. Claude's committed browser/crawl/performance report is reported evidence, not a new independent runtime pass. No fresh preview crawl, visual inspection, build execution, GSC/GBP account check, email send, production change, or DNS change was performed in this review. The old WordPress production site is not evidence of the replacement build.

No numerical SEO score or outcome claim is assigned from this source-only audit. Missing current platform data remains not verified. Client review and production readiness retain their separate statuses.

**v1.1 evidence basis:** the Batch A–C review packages (commits 254297e, 10494f8, d218f1a) with raw-HTML crawls, parity snapshots, scripted test output, screenshots, a clean-clone verification run and two actual agent trials. These are Claude's documented measurements; no independent reviewer pass has yet been recorded.

# 2. What already exists

(v1 text unchanged; see §3 for what was added)

- Fourteen main-site pages are represented in the route tree: home, about, services directory, three service hubs, service-area hub, contact, blog index, three articles, and two policies.
- Reusable ServicePage content model, optional sections/order, metadata generator, related-links component, and schema helpers.
- Prop-driven site chrome, content sections, article/legal layouts, inquiry form, GSAP motion components, and decoration selection.
- Service/blog/legal registries feed sitemaps; per-host sitemap/robots behavior; redirects are configuration data.
- Reported preview QA covers mobile/desktop, keyboard, no-JS, reduced motion, forms, raw HTML, schema, routing, and careers preservation.

Reported deployed mobile lab performance: home 85 (LCP 1.8 s, TBT 498 ms, CLS 0.055); residential 84 (LCP 1.8 s, TBT 557 ms, CLS 0.049); contact 98 (LCP 1.7 s, TBT 128 ms, CLS 0.001). These are Claude's documented measurements, not field Core Web Vitals or independently repeated results. Carry the two lower scores as explicit performance exceptions/follow-ups; do not claim a ≥90 pass.

# 3. Finite template gaps and acceptance

## G1. Contextual internal links and richer article content — **Complete (Batch A)**

Finding (v1): content/blocks.ts and components/site/Blocks.tsx accept plain-text paragraphs/lists with no inline links or tables. ArticleLayout renders the body and general CTA without related-service/article content.

Required change: typed inline links and safe reference handling; semantic comparison tables when used; optional relatedServices/relatedArticles and source references. Update representative existing articles to link relevant built service pages.

Acceptance: useful anchor links appear in raw HTML, resolve to built destinations, and are keyboard accessible; tables retain headers and remain readable on mobile; no unsafe content HTML or dead draft links.

**Status:** typed `Inline`/`Block` model incl. `table` and `sources`; three articles link built hubs and the panel child page in their bodies; related lists resolved from registries; 28 px inline hit areas; table rendering and accessibility demonstrated on the location template (captions, header scopes, wrapper scroll at 390 px).

## G2. City, real-location, and individual-service proof — **Complete (Batch B, extended in C)**

Finding (v1): no city/physical-branch templates or child-service routes; CoverageGroups renders communities as strings.

Required change: CityPageContent and BranchLocationContent models/renderers, publication-aware registries and coverage links, plus one representative individual-service implementation. Prove a served-city sample with verified facts and a clearly fictional physical-branch fixture in the protected neutral demo.

Acceptance: all three representative types pass raw HTML, metadata/schema, linking, mobile, and accessibility checks. City page uses the actual provider and no fictional office. The branch fixture cannot leak into any client's production output.

**Status:** `/services/residential/electrical-panel-upgrades`, `/service-area/edwardsville-il` (real entity, no office), fictional branch fixture behind `COMPASS_DEMO` (noindex, labelled, never a published route, production build refused). Batch C added the `/locations` index and the Harbor Lane brand's two published locations and served city. Scope boundary kept: 21 child pages and 19 cities remain the client's separate plan; no service × city matrix.

## G3. Neutral branding, identity, and optional careers — **Complete (Batch C)**

Finding (v1): brand token names, Hero importing Show Me content, electrician defaults in the root layout, careers assumed.

Required change: semantic color roles; prop-driven Hero; explicit page/site metadata defaults; optional careers with coherent routing/nav/sitemap behavior; neutral starter content, redirects, photos, credentials, recipient config, and environment examples.

Acceptance: two brand configurations run without shared component edits; one has no careers; a domain/recipient/client-claim scan finds no Show Me leakage in neutral output.

**Status:** `brands/showme` and `brands/harbor-lane` build from the same framework via the `@brand` alias; semantic roles `primary/accent/surface/ink`; every homepage/chrome/404/blog/contact string comes from the brand; `site.careers = null` disables careers coherently (Harbor Lane: `/careers*` and `/api/apply` 404, no nav/sitemap/host rule); leak scan of every Harbor Lane page: zero Show Me strings, tokens or asset paths. Show Me parity proven by snapshot diff (careers markup identical; main-site visible text identical except the intended panel-copy correction).

## G4. Complete social metadata and owned media defaults — **Complete (Batch A)**

**Status:** `pageMetadata` on every route, owned `share-default.png` and `logo-512.png`, absolute URL handling; crawl requires both OG and Twitter images on the production host.

## G5. Truthful freshness and complete route registry — **Complete (Batch A)**

**Status:** `lib/routes.ts` registry, `modifiedAt` → visible "Updated", `dateModified`, sitemap lastmod; unknown dates omitted; ordinary deploys change no date.

## G6. Stale documentation and incomplete claim sweep — **Complete (Batch A; panel copy re-corrected in C)**

**Status:** page plan, roadmap and checklist corrected; the panel passage generalised in Batch A and, in Batch C, stripped of diagnosis and frequency claims ("probably undersized", "three usually end in a new panel") so the page says the cause is assessed first.

## G7. GBP parity is not yet proven — **Recorded (Batch C); live facts partly unverified**

**Status:** `docs/gbp-parity.md` matches the website, the publicly observable listing (2026-09-20) and the GBP Spec field by field. Name/address/phone/category/domain agree; hours, emergency availability, attributes and the pin are deliberately not adopted by the website until owner-confirmed; the rename proposal awaits verification of the registered business name; Business Profile Manager itself was not accessed. No live GBP change was made.

## G8. Repeatable audit and neutral starter release — **Complete (Batch C)**

**Status:** from a clean clone, `npm run verify` type-checks both brands, lints, runs the crawl fixtures, builds both brands, generates each manifest, crawls each, runs the mocked form suite on each, and proves both production guards — run once end-to-end on 2026-09-20 (ALL PASSED). Starter = framework + `brands/harbor-lane` as the neutral shape + `docs/starter-checklist.md`. GA4 remains disabled with a documented state.

## G9. Agent compatibility proof — **Verified for one agent family (Batch C)**

**Status:** semantic contracts (fact lists, semantic tables, labelled nav lists, duplicate-safe form ids); deterministic checks committed; actual Claude-agent trials in Chromium 141 on both brands passed every reading, navigation and mocked-action task, with the agent's own observations recorded and dispositioned (`docs/agent-compatibility.md`). Not verified: other agent families/browsers, the careers workflow under an agent, production crawler access. WebMCP/MCP/llms.txt not adopted (no demonstrated need).

# 4. Reconciliation with existing Compass material

(v1 text unchanged)

The Build Standard incorporates the useful foundation: source-backed facts, keyword mapping, raw-HTML verification, code/output comparison, GBP parity, original evidence, redirects, and measured reporting.

It corrects blanket rules in the older material: fixed FAQ/word counts; automatic service-by-city pages; SearchAction on sites without search; review stars merely because testimonials exist; FAQ rich-result expectations; all AI crawlers treated as training/search equivalents; Google described as unable to render JavaScript; exact text parity mistaken for verified entity identity; and every city represented as a physical branch.

The existing Drive originals were not overwritten. The new standard is the consolidated v1 build specification; approved client scope and ongoing package deliverables remain visible in their source documents. Existing sources are linked below for traceability.

# 5. Copy to Claude: finish the template system

(v1 brief, unchanged — executed in Batches A, B and C; see §3 for status)

We are completing the Compass reusable website system now, independently of Show Me Electrical's launch. Use the three Compass Website System v1 documents supplied with this message: Build Standard, Page Template Library, and this audit.

Start from e2dba2757df08550422d9b719a564283cc45d9a3 in Compass2026/showmeelectricalwebsite. Inspect the current branch first; if it differs, report the relevant differences. Work on an isolated template-completion branch/worktree and return a reviewable preview. Keep the existing Show Me launch candidate identifiable.

Implement G1–G6 and G8 in three reviewable batches: (A) typed content links, article relationships/freshness, metadata defaults, and source/doc reconciliation; (B) individual-service, city, and real-branch template examples with publication-aware linking; (C) neutral branding, optional careers, starter scaffolding, and reproducible QA. For G7, prepare the parity record and reconcile known conflicts; mark unavailable live facts unverified.

Use approved business facts only. Demonstrate city/branch capabilities without inventing Show Me offices or projects. A fictional second-brand demo must be clearly labeled and excluded from production. Do not generate the full service × city matrix. Keep the 22 child-service/20 city client expansion plan separate from template acceptance.

Preserve existing URLs and the confirmed /st-louis redirect. Keep client recipients, keys, claims, legal text, and photos out of neutral defaults. Do not merge to production, promote deployments, change DNS/GBP, or send real inquiries/applications during this work. Template validation does not wait for client visual approval or launch.

Return the branch and exact SHA, preview link, changed-file summary, template inventory with implemented/optional status, second-brand and no-careers proof, route/link report, raw-HTML checks, desktop/mobile screenshots, performance results, source-backed exceptions, and a concise remaining-items list. Commit the QA scripts and starter instructions. Do not claim template completion merely because the Show Me build passes.

Also implement G9 within the same three batches: semantic content and controls in A/B; mocked action tests, duplicate handling, and actual browser-agent evidence in C. Follow Build Standard section 12 and Page Template Library section 15. Return an agent-compatibility report with task prompts, expected facts, tool/model/browser versions, exact SHA, results, and exceptions. Do not describe scripted browser automation as an actual AI-agent trial or promise universal compatibility. Keep future WebMCP/API integration behind an optional adapter; do not add a protocol server merely to satisfy this requirement.

# 6. When this loop is closed

(v1 criteria unchanged; status appended)

Documentation complete: the standard, page catalog, and finite implementation brief are saved and readable. **v1.1: the three documents now carry implementation status (this update).**

Code/template complete: G1–G6 and G8 accepted with representative page and second-brand evidence; G7 unknown client facts clearly recorded; optional extensions separately listed. Reviewer signs off the exact starter commit. **v1.1: evidence delivered at d218f1a; reviewer sign-off pending.**

Agent compatibility is now an additional acceptance gate: G9 must be reviewed alongside G1–G8 before the starter is called complete. **v1.1: evidence delivered for one agent family; provisional beyond it.**

Launch remains its own checklist: agency/client review, WordPress backup, production settings, cutover, and real-host checks. GA4 is deferred by user decision. Provider-reported delivery with human inbox receipt unverified remains an accepted Show Me exception; do not reopen it or send more messages.

# Remaining items after Batch C

- Reviewer's Batch C review and certification decision (not granted by Claude).
- Optional: the two other visual presets (§13 of the library), project/case-study template, WebMCP/API adapter, llms.txt — only with a demonstrated need.
- Show Me client work, separate from the template: 21 child service pages, 19 city pages (each gated), GA4 when approved, launch checklist.
- GBP-side actions from the GBP Spec (rename after name verification, categories, structured services, hours confirmation) — separately authorized.
- Agent trials with other agent families/browsers when available; re-run `scripts/qa/agent-tasks.md` after any navigation or form change.

# Repository evidence

[Pinned source tree (launch candidate)](https://github.com/Compass2026/showmeelectricalwebsite/tree/e2dba2757df08550422d9b719a564283cc45d9a3)

[Template completion tree (Batch C)](https://github.com/Compass2026/showmeelectricalwebsite/tree/d218f1a8444acf26a6b24d5c8cec7cc00ffb5787)

[Content block model](https://github.com/Compass2026/showmeelectricalwebsite/blob/e2dba2757df08550422d9b719a564283cc45d9a3/content/blocks.ts)

[Article layout](https://github.com/Compass2026/showmeelectricalwebsite/blob/e2dba2757df08550422d9b719a564283cc45d9a3/components/site/ArticleLayout.tsx)

[Template roadmap](https://github.com/Compass2026/showmeelectricalwebsite/blob/e2dba2757df08550422d9b719a564283cc45d9a3/docs/template-roadmap.md)

[Page plan](https://github.com/Compass2026/showmeelectricalwebsite/blob/e2dba2757df08550422d9b719a564283cc45d9a3/docs/page-plan.md)

[Reported launch audit](https://github.com/Compass2026/showmeelectricalwebsite/blob/e2dba2757df08550422d9b719a564283cc45d9a3/docs/launch-audit.md)

[Agent-compatibility report](https://github.com/Compass2026/showmeelectricalwebsite/blob/d218f1a8444acf26a6b24d5c8cec7cc00ffb5787/docs/agent-compatibility.md)

[GBP parity record](https://github.com/Compass2026/showmeelectricalwebsite/blob/d218f1a8444acf26a6b24d5c8cec7cc00ffb5787/docs/gbp-parity.md)

[Starter checklist](https://github.com/Compass2026/showmeelectricalwebsite/blob/d218f1a8444acf26a6b24d5c8cec7cc00ffb5787/docs/starter-checklist.md)

# Existing Drive sources reviewed

Compass SEO/AEO/GEO SOP v3.1: [Compass_SOP_SEO-AEO-GEO_V3.1](https://docs.google.com/document/d/1v6hZMvkMWDYtI6N-9vhGFL8MxtgSsn-h1uqcLM-DrdA/edit)

Compass master SEO checklist: [compass-master-seo-audit-checklist.md](https://docs.google.com/document/d/13xgVBOpsRLQe9zEyXEy828i5kRzHnwqA8upa7-ZuFXw/edit)

[Compass website playbook source (Word file)](https://drive.google.com/file/d/1HSICP7LHb8vA07e43zwq2tfXglnftLqX/view)

Approved Show Me taxonomy and keyword map: [2026-09-02 Show Me Electrical — Service Taxonomy, Keyword Map & Tracked List v1.1 (approved)](https://docs.google.com/document/d/102N4xhS8aGfjWGOG_A0k8IjG7m_3SyY9YDKkf7xfV9A/edit)

Show Me GBP specification: [GBP Spec — Show Me Electrical](https://docs.google.com/document/d/1HPJI_dsb9UUIqoZm-UigY4DNGrmdiD8b45VpfD7Zy94/edit)

GBP audit template: [gbpaudittemplate.md](https://docs.google.com/document/d/1jYk8P11iLOh5Fi4EqaB_PZ9wNOCC8hSZeNjrF02wXfI/edit)
