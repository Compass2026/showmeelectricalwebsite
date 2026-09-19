# Launch checklist — Show Me Electrical

Concise, in order. Details for each line are in `docs/deployment-plan.md`
(§ numbers) and `docs/launch-audit.md`. Nothing here is executed until Tom
approves the release.

## Ready now

- [x] Release audited: PASS (`docs/launch-audit.md`), including the launch-configuration build and mobile performance.
- [x] Content decisions applied (D-001 to D-007); no open content flags; policies dated 2026-09-19.
- [x] Release pinned to tag `launch-2026-09-19` (hash in the review package).
- [x] Rollback deployment verified: `dpl_4q2JCghjVErahoK8FSigLr41F2dT` (READY, production, serving the careers domain today).
- [x] Delivery evidence on file: preview inquiry accepted; Resend reports delivered; inbox receipt unverified and not a blocker (D-007). No further test messages without authorization.
- [x] Current DNS captured; email records, nameservers and `careers` are keep-as-is.

## Before promotion (Tom / agency)

- [ ] Tom's visual review of the preview and launch approval.
- [ ] **WordPress backup at WP Engine completed** and its location recorded in the plan (§2.3). Not done yet.
- [ ] Confirm DKIM records in the GoDaddy zone (§2.4) and lower the apex/`www` TTLs to 300 s a day ahead.
- [ ] Vercel production environment: `NEXT_PUBLIC_ALLOW_INDEXING=true` and `NEXT_PUBLIC_SITE_URL=https://showmeelectrical.com` present **before** the build (§3). Without the first, the live careers site goes noindex.
- [ ] `INQUIRY_DELIVERY` absent in production; `RESEND_API_KEY` present (it is).

## Promotion (§4)

- [ ] `git rev-parse launch-2026-09-19^{commit}` equals the reviewed hash; fast-forward the production branch to it; push.
- [ ] Deployment READY.

## Immediately after (§5, non-sending)

- [ ] Careers host: `/` and `/jobs/*` 200, `/careers/*` 308, `/about` 404, robots `index, follow`, own sitemap, canonical; apply form present; `POST /api/apply` empty body → 400.
- [ ] Main site on the production URL: pages 200, robots `index, follow`, sitemap with 14 URLs, banner absent; `POST /api/inquiry` `{"name":"probe"}` → 400.
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
