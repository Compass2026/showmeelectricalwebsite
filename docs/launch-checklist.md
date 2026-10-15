# Launch checklist — Show Me Electrical

Concise, in order. Details for each line are in `docs/deployment-plan.md`
(§ numbers) and `docs/launch-audit.md`. Nothing here is executed until the
remaining blockers below are cleared and Tom gives the go.

**Revised 2026-10-15.** Release = commit **`a8e7a7c`**, the head of
`claude/template-completion` after PR #3 merged. 16 routes. Dan approved the
replacement on 2026-10-15. Both earlier releases (`f0eb073`, `e2dba27`) are
superseded — see `docs/deployment-plan.md` §0.

## Ready now

- [x] Release **re-audited 2026-10-13**: PASS, zero findings (`docs/launch-audit.md`) — 107 audit checks over the preview and launch configurations, plus the repository suite's 202 checks on a clean checkout.
- [x] Content decisions applied (D-001 to D-007); no open content flags; policies dated 2026-09-19. The `www.showmeelectrical.com` occurrences the previous audit left open are gone.
- [x] Two new routes reviewed for sourcing: `/services/residential/electrical-panel-upgrades` (derived from approved hub copy, omissions named) and `/service-area/edwardsville-il` (decision D-003 coverage).
- [x] Release pinned to the commit hash **`a8e7a7c9bcf3eb7266c56c277a4e1396e6fa9241`**, recorded in the plan rather than in a tag — the previous plan's tag was never pushed, so its promotion check could never run. Tagging is optional and §4 does not depend on it.
- [x] `npm run verify` re-run at the release commit itself (2026-10-15): passed whole. Its tree is byte-identical to the audited `dda1e12`.
- [x] Fast-forward re-confirmed 2026-10-15: production branch `d819f02` is an ancestor of `a8e7a7c`.
- [x] Rollback deployment **re-verified 2026-10-15**: `dpl_4q2JCghjVErahoK8FSigLr41F2dT` (READY, production, rollback candidate, serving the careers domain today).
- [x] Careers endpoint confirmed unchanged in behaviour: `/api/apply` sender and recipients are byte-identical to the live values after the brand refactor.
- [x] Delivery evidence on file: preview inquiry accepted; Resend reports delivered; inbox receipt unverified and not a blocker (D-007). No further test messages without authorization. **The 2026-10-13 re-audit sent nothing — delivery was mocked throughout.**
- [x] **Stock licence question closed for launch** — it was blocker 2 until the photography pass. Nothing stock is published: the hero now runs three of the client's own frames, one per segment. The two stock files and their redirects are retained so legacy upload URLs keep resolving, and the licence question returns only if either is used again (`docs/migration-inventory.md` §7d).
- [x] **Email delivery verified ready 2026-10-15** (plan §3a): production `RESEND_API_KEY` present; `INQUIRY_DELIVERY`, `INQUIRY_RECIPIENT`, `INQUIRY_FROM`, `RESEND_FROM` and `APPLICATION_RECIPIENT` all absent, so both forms use their reviewed defaults. Inquiries arrive from the verified agency sender with the visitor's address as Reply-To. Moving the sender onto `send.showmeelectrical.com` is optional and does not block the switch — steps in §3a.1.
- [x] Current DNS captured; email records, nameservers and `careers` are keep-as-is.

## Still blocking — in order

1. **WordPress backup at WP Engine.** Not done. Needs Dan's WP Engine access; nobody else can do it. The plan treats this as a hard stop and it is the only thing standing between a bad cutover and an unrecoverable one.
2. **DKIM confirmation in the GoDaddy zone, and apex/`www` TTLs down to 300s**, ideally a day before the switch.
3. **The DNS change itself** (§6) — apex A records and the `www` CNAME only. Cannot be done from a Claude session; there is no GoDaddy access.

## Audit — closed 2026-10-15

- [x] **Second re-audit run after the photography pass** (`docs/launch-audit.md` §8b), against `719ee71`: harness 52/52 preview and 55/55 launch, `npm run verify` whole, 16 routes × 2 widths with no overflow, no broken images, no missing alt and one `h1` each, and all 13 photo redirects resolving.
- [x] **Mobile performance measured** — the §7a gap is closed. Homepage under real throttling: perf 92, LCP 1.7 s, CLS 0. Accessibility 98/95/100, best practices 100, SEO 100. The simulated-throttling figure (perf 81, LCP 4.0 s) is an artefact of measuring a real-time hydration guard with a modelled clock; §8b explains it.
- [ ] **A1 — decide, does not block.** Section headings are hidden from the accessibility tree until scrolled, because the motion system uses GSAP `autoAlpha` (`visibility: hidden`). axe fails `heading-order`; it is the only accessibility failure on the site. It predates this work and belongs to the Foundation, affecting every brand built on it. Reduced-motion and no-JS users are unaffected. Three remedies and the trade-off are in `docs/launch-audit.md` §8b.

## Before promotion (Tom / agency)

- [x] **Owner approval — Dan approved the replacement, 2026-10-15.**
- [ ] **WordPress backup at WP Engine completed** and its location recorded in the plan (§2.3). Not done yet.
- [ ] Confirm DKIM records in the GoDaddy zone (§2.4) and lower the apex/`www` TTLs to 300 s a day ahead.
- [x] **Vercel production variables created 2026-10-15** (§3): `NEXT_PUBLIC_ALLOW_INDEXING=true` (id `i2PHn8aCDpmKGySy`) and `NEXT_PUBLIC_SITE_URL=https://showmeelectrical.com` (id `WLRtE9Ehcspx3uAt`). Both target `production` only; creating them deploys nothing, they apply to the next production build. **Read back independently from the Vercel API on 2026-10-15** — both rows present with the values above, so the earlier "confirm in the dashboard" caveat is discharged.
- [x] `INQUIRY_DELIVERY` absent in production; `RESEND_API_KEY` present for production (separate preview key exists, send-only).

## Promotion (§4)

- [ ] `git merge --ff-only a8e7a7c9bcf3eb7266c56c277a4e1396e6fa9241` on the production branch (aborts if it is not a fast-forward); push.
- [ ] Deployment READY.

## Immediately after (§5, non-sending)

- [ ] Careers host: `/` and `/jobs/*` 200, `/careers/*` 308, `/about` 404, robots `index, follow`, own sitemap, canonical; apply form present; `POST /api/apply` empty body → 400.
- [ ] Main site on the production URL: pages 200, robots `index, follow`, sitemap with 16 URLs, banner absent; `POST /api/inquiry` `{"name":"probe"}` → 400.
- [ ] Any failure → Instant Rollback to the verified deployment (§7).

## Domain and DNS (§6)

- [ ] Add `showmeelectrical.com` and `www` (redirect → apex, 308) to the Vercel project; copy the **exact records Vercel displays** into §6.1.
- [ ] Change only the apex A record(s) and `www` CNAME at GoDaddy; touch nothing else.
- [ ] Both domains verified, certificates issued; `www` → apex 308; legacy URL table and image redirects on the real domain; `/global-styles` 410.
- [ ] Search Console property verified via the existing TXT; sitemap submitted; GBP website field checked.
- [ ] Ordinary inbound mail to `info@showmeelectrical.com` still arrives (email records untouched).

## After launch (§8)

- [ ] Days 1–7: Search Console coverage/404s, Resend delivery statuses, routing matrix once.
- [ ] Follow-ups, not blockers: GA4 setup (then privacy §7), `send.showmeelectrical.com` sending domain (procedure written up, plan §3a.1 — needs Resend access), portrait of Dan, city and service pages, real-user performance review once field data exists.
