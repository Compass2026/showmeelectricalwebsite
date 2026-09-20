# Compass CRM onboarding review and foundation integration brief

Reviewed 2026-09-20 from Compass2026/CompassCRM- at `b847a086d88f6efa5773bee4c2de13ce794b67e1`. This is a source review, not a live Supabase, scheduled-worker or deployed-app audit. No CRM code, migrations or client rows were changed.

## Existing onboarding to retain

The source defines client intake, then Brand Build, Onboarding & Service Taxonomy, and Keyword Research. Website and SEO enrollments wait on Foundation completion. Stages, tasks, evidence, deliverables and change logs already provide tracking.

The intake action also supports a client keeping an existing website: it creates a client-controlled site record and removes the default Website enrollment. Keep this behavior. An existing-site upgrade must be an explicit work mode, not an accidental new build.

Sources:
- [Intake action](https://github.com/Compass2026/CompassCRM-/blob/b847a086d88f6efa5773bee4c2de13ce794b67e1/src/app/actions.ts)
- [Brand-first Foundation stages](https://github.com/Compass2026/CompassCRM-/blob/b847a086d88f6efa5773bee4c2de13ce794b67e1/supabase/migrations/0016_foundation_brand_first.sql)
- [Default Website enrollment](https://github.com/Compass2026/CompassCRM-/blob/b847a086d88f6efa5773bee4c2de13ce794b67e1/supabase/migrations/0018_website_default_and_reopen_fires.sql)

## Findings

| Priority | Source finding | Required integration |
|---|---|---|
| Before the next automated build | Worker Build to 70% still copies `templates/astro-site/`, sets `stack='astro'`, and runs an Astro dist gate. Newer repository documentation calls that starter retired. | Replace the executable worker instructions with the accepted Next.js foundation source and matching verification procedure. Make worker, AGENTS, documentation and stage wording agree. |
| Before automated updates on foundation sites | Monthly instructions assume Lucas-style JSON paths and `/service-areas/{slug}`; Foundation uses typed brand content and `/service-area/[city]`, with physical locations separate. | Select a versioned per-site content adapter. Do not write JSON into a typed brand registry or infer routes from another client's site. Unsupported sites retain the existing proposed-document fallback. |
| Before preview upgrades | Worker monthly payload hard-codes `main`. site-push creates a new side branch from main, bases PRs on main, and updates the branch of record for non-PR pushes. A missing site row is inserted as Astro. | Resolve the actual site branch and stack. A retrofit preview must branch from the recorded baseline, target the correct PR base, and leave the production branch of record unchanged. |
| Before claiming onboarding automatically uses v1 | The reviewed build instructions do not pin the accepted foundation or link a generated build brief to it. | Persist a build brief with version, source SHA, client inputs, adapter, evidence and preview result. Reuse existing tables where appropriate. |
| Before automatic city-page publication | Monthly candidate rules use keyword counts and nearby-place facts; these alone do not establish a useful local page. | Apply the governing standard's coverage and distinctive local-content gate. Keep served-city pages distinct from real physical locations and use links only to published routes. |

Primary sources:
- [Worker: Website Build and Website Updates](https://github.com/Compass2026/CompassCRM-/blob/b847a086d88f6efa5773bee4c2de13ce794b67e1/.claude/skills/foundation-worker/SKILL.md)
- [Current website-update documentation](https://github.com/Compass2026/CompassCRM-/blob/b847a086d88f6efa5773bee4c2de13ce794b67e1/docs/website-updates.md)
- [site-push implementation](https://github.com/Compass2026/CompassCRM-/blob/b847a086d88f6efa5773bee4c2de13ce794b67e1/supabase/functions/site-push/index.ts)
- [Site content-path migration](https://github.com/Compass2026/CompassCRM-/blob/b847a086d88f6efa5773bee4c2de13ce794b67e1/supabase/migrations/0035_website_updates.sql)

## Bounded implementation brief for Claude

Implement in a separate CompassCRM- development branch after reading that repository's current AGENTS.md and checking changes since the reviewed SHA. Use the accepted foundation code `94014af35316c94616dadb3f8d606a4b68577fb0` and the three [Drive originals](drive/README.md). Do not restart the completed foundation review.

1. Add an explicit website work mode: new build, upgrade existing Compass-managed site, or retain client-managed site. Preserve existing enrollment behavior and existing authorizations for routine content publication.
2. Generate a durable website build brief using the existing CRM workflow. Include client/site ID; work mode; accepted standard version and source SHA; repository, baseline and production branch; framework and content adapter; brand and factual sources; services and geographic coverage; keyword/page map; real locations versus served cities; proposed internal links; assets; contact configuration; missing inputs; preview and QA evidence.
3. Update the build worker and stage instructions to consume this brief and the accepted foundation. Retrieve source through an access path that works in the actual Routine environment. If source access fails, report that specific blocker; do not silently revert to Astro.
4. Add an explicit adapter for foundation brand content while preserving existing JSON/Markdown contracts. Reject unsupported mutations and use the existing proposed-document fallback. A template version is not evidence that an older site has already adopted it.
5. Correct branch-of-record, preview baseline and PR-base handling in site-push. Preview work must not relabel the site's production branch or cause a production deployment. Do not assume main or insert Astro metadata for a new Next.js site.
6. Store outcomes in existing stages, tasks, evidence and deliverables. Clearly distinguish builder checks, independent review, deferred checks and launch work. QA should verify actual HTML, routes, forms, accessibility, motion and machine-readable content. Do not claim guaranteed rankings, citations or universal agent compatibility.

Return a reviewable implementation with a brief example and targeted tests. Do not apply database migrations to production, enroll real clients, run recurring client work, publish sites, change DNS, send real messages, or expand into billing/portal/social features in this implementation pass.

## Acceptance examples

- A new-build fixture creates a v1-pinned brief and chooses the Next.js brand-content adapter, not Astro.
- A client-retains-site fixture continues to skip the Website build.
- An existing-site upgrade fixture preserves its source branch, framework and production configuration and produces a preview plan.
- A non-main production-branch fixture creates the preview and PR from the correct baseline without changing the branch of record.
- Legacy JSON, existing Markdown and Foundation typed-content fixtures each resolve to their own adapter; an unknown contract results in a proposed-document deliverable.
- A city without confirmed coverage and distinctive evidence remains a candidate rather than a published page.
- Verification results and preview links attach to the client's existing work records.

## BHG Safety Partners next session

First audit the current repository, deployment and CRM site record. Older CRM documentation identifies `Compass2026/BHGSafetyPartners` as a Next.js site with Markdown articles and service/city data; verify those details before relying on them.

Capture current routes, forms, integrations and mobile behavior; map relevant foundation improvements; implement a bounded preview upgrade; compare behavior and design before proposing deployment. Do not replace the site with the Show Me identity or copy fictional Harbor Lane content.

The CRM integration can proceed separately. The pilot can use a manually prepared version-pinned build brief if the CRM changes are not yet ready.
