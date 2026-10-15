# Launch checklist — Show Me Electrical

Concise, in order. Details for each line are in `docs/deployment-plan.md`
(§ numbers) and `docs/launch-audit.md`. Nothing here is executed until Tom
approves the release.

**Revised 2026-10-13** for the re-audited release: commit **`f0eb073`** on
`claude/template-completion`, 16 routes. The 2026-09-19 release is
superseded — see `docs/deployment-plan.md` §0.

## Ready now

- [x] Release **re-audited 2026-10-13**: PASS, zero findings (`docs/launch-audit.md`) — 107 audit checks over the preview and launch configurations, plus the repository suite's 202 checks on a clean checkout.
- [x] Content decisions applied (D-001 to D-007); no open content flags; policies dated 2026-09-19. The `www.showmeelectrical.com` occurrences the previous audit left open are gone.
- [x] Two new routes reviewed for sourcing: `/services/residential/electrical-panel-upgrades` (derived from approved hub copy, omissions named) and `/service-area/edwardsville-il` (decision D-003 coverage).
- [x] Release pinned to the commit hash **`f0eb073d72114a337f3c5a9b7d12b91c05f0fbb4`**, recorded in the plan rather than in a tag — the previous plan's tag was never pushed, so its promotion check could never run. Tagging is optional and §4 does not depend on it.
- [x] Rollback deployment **re-verified 2026-10-13**: `dpl_4q2JCghjVErahoK8FSigLr41F2dT` (READY, production, rollback candidate, serving the careers domain today).
- [x] Careers endpoint confirmed unchanged in behaviour: `/api/apply` sender and recipients are byte-identical to the live values after the brand refactor.
- [x] Delivery evidence on file: preview inquiry accepted; Resend reports delivered; inbox receipt unverified and not a blocker (D-007). No further test messages without authorization. **The 2026-10-13 re-audit sent nothing — delivery was mocked throughout.**
- [x] Current DNS captured; email records, nameservers and `careers` are keep-as-is.

## Re-audit gap — decide before promotion

- [ ] **Mobile loading performance was NOT re-measured** (`docs/launch-audit.md` §7a). Lighthouse is not installed in the audit environment. The 18 new commits include layout-affecting work, so the 2026-09-19 lab numbers should not be quoted as current. Either re-measure, or accept the earlier numbers as stale — it is lab data, not a blocker on its own.

## Before promotion (Tom / agency)

- [ ] Tom's visual review of the preview and launch approval.
- [ ] **WordPress backup at WP Engine completed** and its location recorded in the plan (§2.3). Not done yet.
- [ ] Confirm DKIM records in the GoDaddy zone (§2.4) and lower the apex/`www` TTLs to 300 s a day ahead.
- [ ] Vercel production environment: `NEXT_PUBLIC_ALLOW_INDEXING=true` and `NEXT_PUBLIC_SITE_URL=https://showmeelectrical.com` present **before** the build (§3). Without the first, the live careers site goes noindex.
- [ ] `INQUIRY_DELIVERY` absent in production; `RESEND_API_KEY` present (it is).

## Promotion (§4)

- [ ] `git merge --ff-only f0eb073d72114a337f3c5a9b7d12b91c05f0fbb4` on the production branch (aborts if it is not a fast-forward); push.
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
- [ ] Follow-ups, not blockers: GA4 setup (then privacy §7), `showmeelectrical.com` sending domain, portrait of Dan, city and service pages, real-user performance review once field data exists.
