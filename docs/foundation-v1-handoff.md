# Compass Website Foundation v1: accepted handoff

Status: accepted on 2026-09-20. Accepted runtime code: `94014af35316c94616dadb3f8d606a4b68577fb0` in Compass2026/showmeelectricalwebsite. This documentation handoff adds no runtime changes.

## Starting point

- Use the accepted code SHA, not an unreviewed moving branch tip.
- Read the [three governing Drive originals](drive/README.md), then the [starter checklist](starter-checklist.md), [template inventory](template-inventory.md) and [completion checklist](completion-checklist.md).
- The current original documents in Drive already record acceptance. Copies labelled Superseded draft and the historical proposed-update file are not instructions to apply again.
- A client's repository records its foundation version and source SHA. Shared improvements reach existing sites through reviewed upgrades, not an automatic overwrite.

## What is accepted

The Next.js foundation provides shared page components, per-brand identity/content/theme separation, optional motion with reduced-motion and no-JavaScript treatment, registry-driven routes and sitemap, SEO helpers, representative service/detail/city/physical-location/blog pages, and inquiry forms with explicit retry and error recovery.

Show Me Electrical is the reference client. Harbor Lane is a fictional second-brand demonstration. Copy its structural shape when starting a new brand, then replace all demonstration facts, copy, assets and routes. A new brand requires its own factual, visual and functional verification.

C1 is closed: the email provider's idempotency key is authoritative. There is no custom filesystem claim/lease layer. C2 is closed: portable browser setup and the documented verification command cover representative pages and production guards.

## Evidence and limits

| Evidence | Status |
|---|---|
| Final provider suite at the accepted SHA | Reviewer independently ran 17 assertions, including independent worker handlers, on Node 24.19.0 |
| Full clean-checkout verification and 43 form checks per brand | Builder-reported passing; not independently reproduced in full |
| AI agent reading, navigation and mocked inquiry tasks | Builder-reported trials for one Claude agent family in Chromium; final backend-only simplification did not rerun those trials |
| Real Resend retry behavior | Documented provider contract, not exercised with real sends; duplicate protection has a documented 24-hour window |
| Enabled careers workflow | Still a Show Me-specific adapter; needs separate review for another hiring client |
| Other AI agents, production crawler access and AI citations | Not verified or guaranteed |
| Mobile performance | Reported homepage 85, residential 84 and contact 98; accepted limitations, not a guarantee for future sites |

Historical reports quoting 18 provider checks are corrected to 17 here. Acceptance is bounded by this evidence, not a claim of perfect behavior for every agent or browser.

## Three independent workstreams

1. **Reusable foundation:** accepted at the SHA above. Documentation handoff is complete.
2. **Show Me launch:** remains a separate client decision and deployment checklist. Its previously prepared launch candidate is `e2dba2757df08550422d9b719a564283cc45d9a3`. It does not automatically contain later template changes. Choose and verify the intended release before launch.
3. **CRM integration:** not implemented by this handoff. See [the source review and implementation brief](compass-crm-onboarding-review.md).

No production merge, DNS change, real inquiry, application or client-data change is part of this handoff.

## Existing-site adoption

Audit the actual repository and site first. Preserve the client's identity, content, working forms, useful URLs and integrations. Adopt compatible components and conventions on a preview branch; a wholesale rebuild is a separate decision. Record which foundation modules were adopted and which remain site-specific.

BHG Safety Partners is the next pilot, planned for the next working session. Inspect its current source before choosing changes. Do not confuse it with the separate forklift-training or heavy-equipment projects. No BHG code or deployment was changed for this handoff.

## Completion rule

This review is closed. Reopen it only for a reproducible defect or an agreed scope change. New client work follows the accepted standard and client-specific acceptance checks. New tools, additional page volumes, broader agent coverage, CRM billing and portals are separate work.
