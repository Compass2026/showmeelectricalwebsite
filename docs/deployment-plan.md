# Deployment plan — Show Me Electrical main site launch

Prepared 2026-09-19. **Nothing in this plan has been executed.** Production,
DNS and the live careers site stay unchanged until Tom approves the release.

## 0. What is being promoted

| Item | Value |
|---|---|
| Release branch | `claude/main-site-foundation-v1` |
| Release commit | The branch tip named in the final review package. Verify before merging: `git rev-parse origin/claude/main-site-foundation-v1` must equal it. |
| Vercel project | `showmeelectricalwebsite` — `prj_KHnKJNKpoEB6AjdC0rp1J86AyduC`, team `compassmarketin` (`team_JxUWGz1PjUP4jOAqXQqy3YFN`), framework Next.js, Node 24.x |
| Production branch (Git) | `claude/show-me-electrical-careers-k6km12` — the repository's default branch and the branch Vercel builds as **production** |
| Current production deployment | `dpl_4q2JCghjVErahoK8FSigLr41F2dT` — commit `d819f02` (2026-08-29, "Say we invest in your training on the career path card"). This is the **rollback target**; Vercel lists it as a rollback candidate. |
| Branch relationship | The release branch contains the production branch's history plus 13 commits; **fast-forward is possible**, no merge commit needed. |
| Domains on the project today | `careers.showmeelectrical.com` (verified, live), `showmeelectricalwebsite.vercel.app`. **`showmeelectrical.com` and `www` are not on the project yet.** |
| Deployment protection | SSO protection is on for all deployments **except custom domains** — production on the custom domains is public; preview URLs need the share link. |

## 1. Existing careers impact — read first

The careers site is served by this same project from the production
deployment. Promoting the release replaces that deployment, so the careers
host is served by the new build **the moment the production build finishes,
before any DNS change for the main domain.**

What changes for the careers host: nothing in its routes, components or
`/api/apply`. Middleware rules 1–3 (careers host) are unchanged; rule 4
(main-host `/careers*` → careers host) never runs on the careers host.
Verified locally with the routing matrix on the release build.

**One thing that must be set before promotion:** the release build reads
`NEXT_PUBLIC_ALLOW_INDEXING`. The current production deployment predates
that switch and the live careers site is indexable today (no robots meta,
`robots.txt` allows). Production has **no** `NEXT_PUBLIC_ALLOW_INDEXING`
variable. If the release is promoted without it, the careers site becomes
`noindex` with `Disallow: /`. Step 3 sets it first.

Careers compatibility can only be fully proven on the real careers hostname
(Vercel routes by domain; previews cannot impersonate it). So: the routing
matrix and application validation run on the release build locally
**before** promotion (audit §5–6), and the same matrix plus one real
application run on `careers.showmeelectrical.com` **immediately after**
promotion, with rollback ready (step 5).

## 2. Pre-flight (no production change)

1. Tom approves the release commit and this plan.
2. Full-site audit on the release build reports pass (`docs/launch-audit.md`).
3. **WordPress backup** (the WordPress host stays online untouched throughout):
   - Full site backup from the hosting control panel (files + database),
     downloaded and stored off the host.
   - WordPress export (Tools → Export → All content) as a second copy of
     pages/posts.
   - Copy of `wp-content/uploads/` (the 32 images; the nine retained ones are
     already in this repository).
   - Record any redirect-plugin rules and the contact-form submission history
     if the plugin stored them.
   - Keep the WordPress hosting plan active for at least 30 days after launch.
4. **DNS record capture.** Public records as resolved on 2026-09-19 (via
   DNS-over-HTTPS; confirm against the DNS host's zone before launch, which
   also shows the DKIM selector records that public lookups cannot list):

   | Record | Value | TTL | Touch at launch? |
   |---|---|---|---|
   | NS | `ns43.domaincontrol.com`, `ns44.domaincontrol.com` (GoDaddy DNS) | 3600 | **No** |
   | `showmeelectrical.com` A | `141.193.213.10`, `141.193.213.11` (WP Engine) | 600 | **Yes → Vercel** (this is the rollback value) |
   | `www` CNAME | `wp.wpenginepowered.com` (WP Engine) | 3600 | **Yes → `cname.vercel-dns.com`** (rollback value) |
   | `careers` CNAME | `f62e1e9f2ce96bdb.vercel-dns-016.com` (Vercel) | 3600 | **No** |
   | MX | `0 showmeelectrical-com.mail.protection.outlook.com` (Microsoft 365) | 3600 | **No** |
   | TXT (SPF) | `v=spf1 include:spf.em.secureserver.net include:secureserver.net -all` | 3600 | **No** |
   | TXT | `NETORGFT7734273.onmicrosoft.com` (Microsoft 365 verification) | 3600 | **No** |
   | TXT | `google-site-verification=pphR9jPsJaYon6rCzcaOVoHXiYqlE9JrrrHAymdVNAc` | 3600 | **No** (existing Search Console verification — reuse it) |
   | `_dmarc` TXT | `v=DMARC1; p=none; rua=mailto:dmarc_rua@onsecureserver.net` | 600 | **No** |
   | DKIM (`*._domainkey`) | not visible publicly — read from the zone | — | **No** |

   WordPress is hosted at WP Engine; the WP Engine backup tools cover step 3.
   Lower the apex A and `www` TTLs to 300 s at least a day before launch so
   both the cut-over and any rollback take effect within minutes.
5. Confirm who reads `info@showmeelectrical.com` and can check for the
   post-launch form test (inbox receipt of the preview test is unverified,
   D-007).

## 3. Environment changes (Vercel → Project → Settings → Environment Variables, target **Production**)

| Variable | Value | Why |
|---|---|---|
| `NEXT_PUBLIC_ALLOW_INDEXING` | `true` | Turns indexing on for both hosts and hides the review banner. **Set before promotion** (see §1). Baked in at build time. |
| `NEXT_PUBLIC_SITE_URL` | `https://showmeelectrical.com` | Canonicals, structured data, sitemap origin for the main host. |
| `RESEND_API_KEY` | already set (careers) | Also used by `/api/inquiry`. No change. |
| `INQUIRY_RECIPIENT` | optional | Defaults to `info@showmeelectrical.com` (D-004). |
| `INQUIRY_FROM` | optional | Defaults to `Show Me Electrical Website <inquiries@send.compassmarketing.ai>`; only change if a `showmeelectrical.com` sending domain is verified in Resend first. |
| `INQUIRY_DELIVERY` | **must be absent** | Mock/fail modes are ignored in production anyway; keep it absent. |
| `APPLICATION_RECIPIENT`, `RESEND_FROM` | unchanged | Careers defaults stay. |

Paste raw values, no quotes. Preview-target variables are untouched.

## 4. Promotion (creates the production deployment)

```bash
git fetch origin
git checkout claude/show-me-electrical-careers-k6km12
git merge --ff-only origin/claude/main-site-foundation-v1   # must fast-forward; abort if it does not
git push origin claude/show-me-electrical-careers-k6km12       # Vercel builds production
```

Wait for the deployment to reach READY. If the build fails, nothing changes:
the previous production deployment keeps serving.

## 5. Immediately after promotion — careers first, main site second

Careers host (live, real traffic):

- `curl -sI https://careers.showmeelectrical.com/` → 200; `/jobs/apprentice-electrician` → 200; `/careers/jobs/apprentice-electrician` → 308 to `/jobs/…`; `/about` → 404.
- `curl -s https://careers.showmeelectrical.com/ | grep robots` → `index, follow`; `robots.txt` allows and names its own sitemap; `sitemap.xml` lists careers URLs only; canonical `https://careers.showmeelectrical.com/…`.
- One real application through the live form (Tom or a colleague), receipt confirmed at the careers recipients.
- **Any failure → step 7 (instant rollback) before anything else.**

Main site on the Vercel production URL (`showmeelectricalwebsite.vercel.app`, public because custom-domain rule does not apply — check; if SSO-protected, use a share link):

- Every page 200; robots meta `index, follow`; `robots.txt` allows; sitemap lists main URLs with the `showmeelectrical.com` origin; review banner absent.
- One real inquiry through `/contact` with inbox receipt checked by whoever reads info@ (the first human-verified receipt).

## 6. Domain and DNS changes

1. Vercel → Project → Domains: add `showmeelectrical.com` and
   `www.showmeelectrical.com`; set `www` to **redirect to** the apex (308).
   Vercel shows the exact records it expects.
2. At the DNS host, change **only** these records:
   - apex `showmeelectrical.com`: A → the address Vercel shows (`76.76.21.21` today) — or an ALIAS/ANAME to `cname.vercel-dns.com` if the DNS host supports it.
   - `www`: CNAME → `cname.vercel-dns.com`.
   - `careers`: **unchanged** (already a CNAME to Vercel).
   - **MX, SPF/TXT, DKIM, DMARC, verification TXTs: unchanged.** Do not change nameservers; keeping DNS at the current host is what protects the email records.
3. Wait for Vercel to show both domains verified with certificates issued.
4. Verify on the real domain: the legacy URL table (`docs/migration-inventory.md` §4, plus the nine image redirects), `https://www.showmeelectrical.com/` → 308 → apex, `/global-styles` → 410, robots/sitemap, structured data on `/`.
5. Search Console: the domain already carries a `google-site-verification` TXT record, so the property should verify without a new record; submit `/sitemap.xml`. Update the website field on the Google Business Profile if it points at `www`.
6. Send `mail` a test from an external address to `info@showmeelectrical.com` and confirm it still arrives — proves the email records survived.

## 7. Rollback

Two independent levers; use the smallest that fixes the problem.

| Symptom | Action | Effect |
|---|---|---|
| Careers host broken after promotion (before DNS) | Vercel → Deployments → **Instant Rollback** to `dpl_4q2JCghjVErahoK8FSigLr41F2dT` (or `vercel rollback dpl_4q2JCghjVErahoK8FSigLr41F2dT`) | Careers back on the previous build in seconds. Main domain is not yet attached, so nothing else changes. Then fix forward on the release branch. |
| Main site broken after DNS | Put the apex A back to `141.193.213.10` + `141.193.213.11` and `www` CNAME back to `wp.wpenginepowered.com` | WordPress (WP Engine) serves again within the TTL. The careers host and Vercel production stay as they are; email records were never touched. |
| Both | Instant Rollback **and** DNS revert | Full return to the pre-launch state. Note: with DNS reverted and the old build restored, `showmeelectrical.com` is WordPress and `careers` is the old careers build — exactly today. |
| Content problem only | Fix on the release branch, fast-forward again | No rollback needed. |

Never roll back by force-pushing the production branch; use Vercel's
deployment rollback and Git fixes forward.

## 8. Repeat checks after launch

| When | Check |
|---|---|
| Day 0, after DNS | Everything in §5 and §6.4–6.6. |
| Days 1–7, daily | Search Console coverage and 404 report (unexpected legacy URLs → add to `config/redirects.ts`); one contact-form submission by the business; careers matrix (`curl` on both hosts); Resend dashboard for bounces. |
| Weekly, first month | Indexing status of the 14 main-site URLs; GBP website link; the legacy URL table once more. |
| After every deployment | The routing matrix on both hosts, robots meta on `/` of each host, one form validation probe (invalid body → 400). |
| When a `showmeelectrical.com` sending domain is verified | Set `INQUIRY_FROM`, send one inquiry, confirm receipt and that Reply-To works. |
| When GA4 is set up (separate follow-up, D-006) | Add the tag, update privacy §7 per `docs/policy-revision-proposal.md` P3, bump the policy date. |
