# Deployment plan — Show Me Electrical main site launch

Prepared 2026-09-19, revised the same day for D-007 and the exact-record
rule. **Nothing in this plan has been executed.** Production, DNS and the
live careers site stay unchanged until Tom approves the release.

## 0. What is being promoted

| Item | Value |
|---|---|
| Release | Git tag **`launch-2026-09-19`**, an exact commit — not the branch tip. The hash is printed in the review package. Before promoting: `git rev-parse launch-2026-09-19^{commit}` must equal that hash, and `git rev-parse origin/claude/main-site-foundation-v1` should equal it too (if it does not, something was pushed after review — stop and re-review). |
| Vercel project | `showmeelectricalwebsite` — `prj_KHnKJNKpoEB6AjdC0rp1J86AyduC`, team `compassmarketin` (`team_JxUWGz1PjUP4jOAqXQqy3YFN`), Next.js, Node 24.x |
| Production branch (Git) | `claude/show-me-electrical-careers-k6km12` — the repository's default branch and the branch Vercel builds as **production** |
| Verified rollback deployment | **`dpl_4q2JCghjVErahoK8FSigLr41F2dT`** — verified 2026-09-19 via the Vercel API: state READY, target `production`, currently aliased to `careers.showmeelectrical.com` and `showmeelectricalwebsite.vercel.app`, commit `d819f02` (2026-08-29), listed as a rollback candidate. This is the build serving the live careers site right now. |
| Branch relationship | The release commit contains the production branch's history; **fast-forward is possible**, no merge commit. |
| Domains on the project today | `careers.showmeelectrical.com` (verified, live), `showmeelectricalwebsite.vercel.app`. **`showmeelectrical.com` and `www` are not on the project yet** — so Vercel has not yet displayed the DNS records it wants for them (§6). |
| WordPress backup | **NOT completed.** Requires WP Engine access, which the build team does not have. Owner/agency action in §2.3; the release must not be promoted until it is done and the backup location is written here. |
| Deployment protection | SSO protection on all deployments **except custom domains** — production on the custom domains is public; preview URLs need a share link. |

## 1. Existing careers impact — read first

The careers site is served by this same project from the production
deployment. Promoting the release replaces that deployment, so the careers
host is served by the new build **the moment the production build finishes,
before any DNS change for the main domain.**

What changes for the careers host: nothing in its routes, components or
`/api/apply` (the route file has no diff since the live deployment).
Middleware rules 1–3 (careers host) are unchanged; rule 4 (main-host
`/careers*` → careers host) never runs on the careers host. Verified on the
release build with the routing matrix, the application form after hydration
and the apply route's validation paths (`docs/launch-audit.md` §6).

**The indexing variable must exist before the production build.** The
release build reads `NEXT_PUBLIC_ALLOW_INDEXING` at build time. The current
production deployment predates that switch; the live careers site is
indexable today (no robots meta, `robots.txt` allows). Production has **no**
`NEXT_PUBLIC_ALLOW_INDEXING` variable. Promoting without it would make the
careers site `noindex` with `Disallow: /`. §3 sets it; §4 checks it before
the push.

## 2. Pre-flight (no production change)

1. Tom approves the release tag and this plan.
2. Full-site audit on the release build: PASS (`docs/launch-audit.md`).
3. **WordPress backup — not yet done.** At WP Engine (the host — see the
   records in §2.4): take a full backup point (files + database) from the
   WP Engine portal and download it; export all content from WordPress
   (Tools → Export); download `wp-content/uploads/`; note any redirect-plugin
   rules and any stored form submissions. Record here: date, who, where
   stored. Keep the WP Engine plan active for at least 30 days after launch.
4. **DNS records as resolved on 2026-09-19** (public DNS-over-HTTPS lookup;
   confirm against the GoDaddy zone before launch, which also shows DKIM
   selector records that public lookups cannot enumerate):

   | Record | Value | TTL | At launch |
   |---|---|---|---|
   | NS | `ns43.domaincontrol.com`, `ns44.domaincontrol.com` (GoDaddy DNS) | 3600 | **Keep** |
   | `showmeelectrical.com` A | `141.193.213.10`, `141.193.213.11` (WP Engine) | 600 | **Change** — rollback value |
   | `www` CNAME | `wp.wpenginepowered.com` (WP Engine) | 3600 | **Change** — rollback value |
   | `careers` CNAME | `f62e1e9f2ce96bdb.vercel-dns-016.com` (Vercel) | 3600 | **Keep** |
   | MX | `0 showmeelectrical-com.mail.protection.outlook.com` (Microsoft 365) | 3600 | **Keep** |
   | TXT (SPF) | `v=spf1 include:spf.em.secureserver.net include:secureserver.net -all` | 3600 | **Keep** |
   | TXT | `NETORGFT7734273.onmicrosoft.com` (Microsoft 365 verification) | 3600 | **Keep** |
   | TXT | `google-site-verification=pphR9jPsJaYon6rCzcaOVoHXiYqlE9JrrrHAymdVNAc` | 3600 | **Keep** (Search Console) |
   | `_dmarc` TXT | `v=DMARC1; p=none; rua=mailto:dmarc_rua@onsecureserver.net` | 600 | **Keep** |
   | DKIM (`*._domainkey`) | read from the zone | — | **Keep** |

   Lower the apex A and `www` TTLs to 300 s at least a day before launch.
5. Email evidence on file (D-007): one labelled inquiry sent through the
   preview form on 2026-09-19 was accepted by the server and Resend reports
   it **delivered** to info@showmeelectrical.com; human inbox receipt is
   **unverified** and is **not a launch blocker**. **No further test
   messages are sent by anyone without Tom's explicit authorization.**

## 3. Environment (Vercel → Project → Settings → Environment Variables, target **Production**)

Set **before** §4. Paste raw values, no quotes. Preview-target variables
are untouched.

| Variable | Value | Why |
|---|---|---|
| `NEXT_PUBLIC_ALLOW_INDEXING` | `true` | Indexing on for both hosts; review banner hidden. Build-time. **Required before the production build** (§1). |
| `NEXT_PUBLIC_SITE_URL` | `https://showmeelectrical.com` | Canonicals, structured data, sitemap origin. Build-time. |
| `RESEND_API_KEY` | already set (careers) | Also used by `/api/inquiry`. No change. |
| `INQUIRY_RECIPIENT` | leave unset | Defaults to `info@showmeelectrical.com` (D-004). |
| `INQUIRY_FROM` | leave unset | Defaults to the verified agency sender. Change only after a `showmeelectrical.com` sending domain is verified in Resend. |
| `INQUIRY_DELIVERY` | must be absent | Mock/fail are ignored in production anyway. |
| `APPLICATION_RECIPIENT`, `RESEND_FROM` | unchanged | Careers defaults stay. |

## 4. Promotion (creates the production deployment)

```bash
# 0. confirm the variables from §3 exist for the Production target
vercel env ls production                      # or the dashboard: both NEXT_PUBLIC_* rows present

# 1. pin to the reviewed commit
git fetch origin --tags
REL=$(git rev-parse launch-2026-09-19^{commit})
echo "$REL"                                   # must match the hash in the review package

# 2. fast-forward the production branch to exactly that commit
git checkout claude/show-me-electrical-careers-k6km12
git merge --ff-only "$REL"                    # aborts if it is not a fast-forward
git push origin claude/show-me-electrical-careers-k6km12   # Vercel builds production
```

Wait for READY. A failed build changes nothing: the rollback deployment
keeps serving. Confirm in the deployment's details that it was built with
`NEXT_PUBLIC_ALLOW_INDEXING=true` (the `/` of the careers host must carry
`index, follow` — §5).

## 5. Immediately after promotion — careers first, main site second (no messages sent)

Careers host (live traffic, non-sending checks only):

- `curl -sI https://careers.showmeelectrical.com/` → 200; `/jobs/apprentice-electrician` → 200; `/careers/jobs/apprentice-electrician` → 308 to `/jobs/…`; `/about` → 404.
- `curl -s https://careers.showmeelectrical.com/ | grep robots` → `index, follow`; `robots.txt` allows and names its own sitemap; `sitemap.xml` lists careers URLs only; canonical `https://careers.showmeelectrical.com/…`.
- Application form present on `/?role=apprentice-electrician#apply`; `POST /api/apply` with an empty body → 400 (validation reached, nothing sent).
- **Any failure → §7 instant rollback before anything else.**

Main site on the Vercel production URL (`showmeelectricalwebsite.vercel.app`; if SSO-protected, use a share link):

- Every page 200; robots meta `index, follow`; `robots.txt` allows; sitemap lists the 14 main URLs with the `showmeelectrical.com` origin; review banner absent.
- `POST /api/inquiry` with `{"name":"probe"}` → 400 with field codes (validation reached, nothing sent). Resend dashboard shows no new sends.
- A real inquiry is sent **only if Tom authorizes it**, and then once.

## 6. Domain and DNS changes — use the records Vercel displays, nothing else

1. Vercel → Project → Settings → Domains: add `showmeelectrical.com`, then
   `www.showmeelectrical.com` with **Redirect to `showmeelectrical.com`
   (308)**. Adding a domain changes no traffic; it makes Vercel display the
   **exact records it expects for this project** (the project already uses a
   project-specific CNAME target for `careers`, so do not assume the generic
   values from the Vercel docs). Copy those values into the table below
   before touching DNS.

   | Record to set | Value shown by Vercel (fill in) |
   |---|---|
   | `showmeelectrical.com` A (or ALIAS) | _______________ |
   | `www` CNAME | _______________ |
   | `_vercel` TXT (only if Vercel asks for verification) | _______________ |

2. At GoDaddy DNS, change **only** the apex A record(s) and the `www` CNAME
   to the values above (delete the two WP Engine A records, add Vercel's).
   **Do not change** nameservers, `careers`, MX, SPF, DKIM, DMARC, the
   Microsoft or Google verification TXTs, or anything else.
3. Wait for both domains to show verified with certificates issued.
4. Verify on the real domain (non-sending): the legacy URL table
   (`docs/migration-inventory.md` §4) plus the nine image redirects;
   `https://www.showmeelectrical.com/` → 308 → apex; `/global-styles` → 410;
   robots and sitemap; structured data on `/`; `POST /api/inquiry` with an
   invalid body → 400.
5. Search Console: the domain already carries a `google-site-verification`
   TXT, so the property should verify without a new record; submit
   `/sitemap.xml`. Update the Google Business Profile website field if it
   points at `www`.
6. Confirm email still flows: an inbound message from any outside mailbox
   to `info@showmeelectrical.com` (this is ordinary mail to the business,
   not a form test) — proves the MX/SPF/DMARC records survived.

## 7. Rollback

| Symptom | Action | Effect |
|---|---|---|
| Careers host broken after promotion (before DNS) | Vercel → Deployments → **Instant Rollback** to `dpl_4q2JCghjVErahoK8FSigLr41F2dT` | Careers back on the verified previous build in seconds; main domain not yet attached, nothing else changes. Fix forward on the release branch. |
| Main site broken after DNS | Apex A back to `141.193.213.10` + `141.193.213.11`, `www` CNAME back to `wp.wpenginepowered.com` | WordPress (WP Engine) serves again within the TTL. Careers and email untouched. |
| Both | Instant Rollback **and** DNS revert | Exactly today's state. |
| Content problem only | Fix on the release branch, tag, fast-forward again | No rollback. |

Never force-push the production branch; roll back with Vercel and fix
forward in Git.

## 8. Repeat checks after launch (all non-sending unless authorized)

| When | Check |
|---|---|
| Day 0, after DNS | Everything in §5 and §6.4–6.6. |
| Days 1–7 | Search Console coverage and 404 report (unexpected legacy URLs → `config/redirects.ts`); Resend dashboard for sends, bounces and complaints from `inquiries@send.compassmarketing.ai`; routing matrix on both hosts once. |
| Weekly, first month | Indexing status of the 14 main-site URLs; GBP website link; the legacy URL table once. |
| After every deployment | Routing matrix on both hosts; robots meta on `/` of each host; `POST /api/inquiry` invalid body → 400. |
| Delivery monitoring | Resend shows every accepted inquiry with its delivery status; a `delivered` status is the provider's evidence, inbox receipt is the business's. No scheduled test submissions. |
| When a `showmeelectrical.com` sending domain is verified | Set `INQUIRY_FROM`; one authorized inquiry to confirm Reply-To. |
| When GA4 is set up (D-006 follow-up) | Add the tag, update privacy §7, bump the policy date. |
