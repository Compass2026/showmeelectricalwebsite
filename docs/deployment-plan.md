# Deployment plan — Show Me Electrical main site launch

Prepared 2026-09-19, revised the same day for D-007 and the exact-record
rule, and revised **2026-10-13** to point at the re-audited release (§0).
**Nothing in this plan has been executed.** Production, DNS and the live
careers site stay unchanged until Tom approves the release.

## 0. What is being promoted

> **Changed 2026-10-13.** The release moved from the 2026-09-19 build to the
> re-audited current tip. What the promotion itself does is unchanged; only
> the commit differs. The route surface grew from 14 pages to 16 (two
> additions, nothing removed or renamed), so §5's post-promotion checks now
> expect a 16-URL sitemap. See `docs/launch-audit.md` §0 for the full
> change-by-change reading and §7a for the one check that was not repeated.

| Item | Value |
|---|---|
| Release | **Commit `9dde4e9b7426c7c6fc86ab99ece1c3b5b7dd8540`** — the head of `claude/template-completion`, the merge of PR #6 on 2026-10-15. It supersedes `a8e7a7c`, which this plan pinned earlier the same day: `a8e7a7c` predates the photography pass and would ship the withdrawn imagery, including the third party's trademark (`docs/migration-inventory.md` §7e). **Do not promote `a8e7a7c`.** The audit in `docs/launch-audit.md` §8b was run against `719ee71`; the two commits since are documentation only, so the audited tree is the shipping tree for every route and asset. `npm run verify` passed whole at `142e683`. **The commit hash written here is the authority, not a tag** — the previous plan keyed promotion to a tag that had never been pushed, so its own first check could never run. Tagging is optional: `git tag -a launch-2026-10-15 9dde4e9 -m "re-audited release" && git push origin launch-2026-10-15`. Nothing in §4 depends on it. |
| ~~Superseded~~ | ~~`f0eb073`~~ (carries the pre-2026-10-13 hero) and ~~`launch-2026-09-19` / `e2dba27`~~ on `claude/main-site-foundation-v1` (18 commits behind, tag never pushed). Do not promote either. |
| ~~Previous release~~ | ~~`launch-2026-09-19` on `claude/main-site-foundation-v1` @ `e2dba27`~~ — **superseded.** That tag was never pushed to the remote (`git ls-remote --tags origin` was empty on 2026-10-13), so the promotion check as originally written could not be run at all. The commit itself is still reachable as `origin/claude/main-site-foundation-v1`. Do not promote it: the code has moved 18 commits past it, and launching it would put the live site on a layout the CRM no longer builds from. |
| Vercel project | `showmeelectricalwebsite` — `prj_KHnKJNKpoEB6AjdC0rp1J86AyduC`, team `compassmarketin` (`team_JxUWGz1PjUP4jOAqXQqy3YFN`), Next.js, Node 24.x |
| Production branch (Git) | `claude/show-me-electrical-careers-k6km12` — the repository's default branch and the branch Vercel builds as **production** |
| Verified rollback deployment | **`dpl_4q2JCghjVErahoK8FSigLr41F2dT`** — commit `d819f02` (2026-08-29). **Re-verified 2026-10-15** via the Vercel API: still state READY, target `production`, still a rollback candidate. This is the build serving the live careers site right now. |
| Branch relationship | Re-confirmed **2026-10-15** against `9dde4e9`: the production branch (`d819f02`) is an ancestor, so **fast-forward is possible**, no merge commit. |
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
| `INQUIRY_FROM` | leave unset | Defaults to the verified agency sender. Change only after a client sending domain is verified in Resend — §3a.1. |
| `INQUIRY_DELIVERY` | must be absent | Mock/fail are ignored in production anyway. |
| `APPLICATION_RECIPIENT`, `RESEND_FROM` | unchanged | Careers defaults stay. |

## 3a. Email delivery (Resend) — verified 2026-10-15

**Delivery is ready as it stands; the switch needs no change here.** Both
forms send through Resend from the agency's verified
`send.compassmarketing.ai` domain — the same domain the live careers form
has been sending from in production since August.

Read back from the Vercel project (Production target) on 2026-10-15:

| Variable | State | Effect |
|---|---|---|
| `RESEND_API_KEY` | present, encrypted | Serves both `/api/inquiry` and `/api/apply`. A separate preview key exists, send-only. |
| `INQUIRY_DELIVERY` | absent | Ignored in production in any case: the route short-circuits on `isProduction` **before** reading it (`app/api/inquiry/route.ts:162`), so a mocked success can never be shown to a real visitor. |
| `INQUIRY_RECIPIENT` | absent | Falls back to `info@showmeelectrical.com` (D-004). |
| `INQUIRY_FROM` | absent | Falls back to `inquiries@send.compassmarketing.ai`. |
| `RESEND_FROM`, `APPLICATION_RECIPIENT` | absent | Careers keeps `careers@send.compassmarketing.ai` → `info@showmeelectrical.com`, `thomas@compassmarketing.ai`. |

`brands/showme/inquiry.config.ts` has `forceMock: false` (that flag is for
the fictional demonstration brand, which can never send).

What the office actually receives for a website inquiry: **From** `Show Me
Electrical Website <inquiries@send.compassmarketing.ai>`, **Reply-To** the
visitor's own address whenever they gave one — so hitting reply answers the
visitor, not the agency. Subject is `Website inquiry — <service> — <name>`.
When no email is given the footer says to reply by phone.

Rate limiting is **per serverless instance**, not per deployment: the
counter lives in one warm function's memory and a cold start begins empty.
It brakes a naive script against a single instance and nothing more. If the
form is ever abused at scale, the answer is Vercel's platform protection,
not this counter.

### 3a.1 Moving the sender to the client's own domain — optional, not a blocker

Nothing breaks today, but `inquiries@send.compassmarketing.ai` is an agency
address on a client's form. To put it on the client's own domain:

1. In Resend, add the sending domain **`send.showmeelectrical.com`** — the
   subdomain, never the apex. Resend then issues three DNS records scoped
   to that subdomain (an MX for bounce feedback, an SPF TXT, and a DKIM
   `TXT` under `resend._domainkey.send.showmeelectrical.com`).
2. Add **exactly the records Resend displays** at GoDaddy. Because every one
   of them sits under `send.`, the apex MX, SPF, DKIM, DMARC and the
   Microsoft 365 verification TXT listed in §2.4 are untouched — the office
   mailbox cannot be affected by this step. Do not "merge" Resend's SPF into
   the apex SPF record; it belongs on the subdomain only.
3. Wait for Resend to report the domain **verified**.
4. Confirm the production `RESEND_API_KEY` is permitted to send from the new
   domain. A Resend key can be restricted to one domain — the preview key
   here is restricted to `send.compassmarketing.ai` — and a restricted key
   answers a send from an unverified-for-it domain with a 403, which the
   form surfaces as a delivery failure. If the production key is restricted,
   issue a new key or widen it **before** step 5.
5. Set `INQUIRY_FROM` on the Production target to
   `Show Me Electrical Website <inquiries@send.showmeelectrical.com>` and
   redeploy. This is read at request time, so an existing deployment picks
   it up on the next request; no rebuild is needed.
6. One authorized inquiry to confirm the Reply-To still carries the
   visitor's address. **No test message without Tom's explicit
   authorization** (D-007).
7. Careers moves the same way, separately, with `RESEND_FROM`. Change one
   form at a time so a failure is unambiguous.

Rolling back is removing `INQUIRY_FROM`; the verified agency sender returns
on the next request.

**Not done in this session:** the Resend account itself was unreachable —
the Resend connector is not authorized for this workspace, so the sending
domains, the key's domain restriction and the delivery log could not be
inspected or changed from here. Everything above is the environment- and
code-side state, which was read directly.

## 4. Promotion (creates the production deployment)

```bash
# 0. confirm the variables from §3 exist for the Production target
vercel env ls production                      # or the dashboard: both NEXT_PUBLIC_* rows present

# 1. pin to the reviewed commit
git fetch origin --tags
REL=9dde4e9b7426c7c6fc86ab99ece1c3b5b7dd8540   # the release commit, from §0
git cat-file -e "$REL^{commit}"               # it exists locally after the fetch
git log -1 --format='%H %s' "$REL"            # confirm it is the merge of PR #6

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

- Every page 200; robots meta `index, follow`; `robots.txt` allows; sitemap lists the **16** main URLs with the `showmeelectrical.com` origin; review banner absent. (14 before the 2026-10-13 release; the additions are `/services/residential/electrical-panel-upgrades` and `/service-area/edwardsville-il`.)
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
| When a client sending domain is verified | Follow §3a.1: set `INQUIRY_FROM`, then one authorized inquiry to confirm Reply-To. |
| When GA4 is set up (D-006 follow-up) | Add the tag, update privacy §7, bump the policy date. |
