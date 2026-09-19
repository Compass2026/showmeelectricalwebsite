# Completion Checklist

Three lists, kept separate on purpose. The first is the gate for replacing
WordPress. The second is the gate for the Compass starter. The third is
never a gate for anything — it is built on demand, measured page by page.

Status as of the service-area + services-directory milestone.

---

## A. Remaining launch work — replaces WordPress with nothing lost

| # | Item | Status | Notes |
|---|---|---|---|
| A1 | Homepage | ✅ | |
| A2 | `/services` directory | ✅ | Registry-driven cards and catalog |
| A3 | `/services/residential`, `/commercial`, `/industrial` | ✅ | |
| A4 | `/about` | ✅ | Portrait of Dan still needed |
| A5 | `/service-area` | ✅ | Missouri counties + approved communities; Illinois pending Tom |
| A6 | `/contact` | ✅ page · ⬜ form | Route handler mirroring `/api/apply` (Resend, honeypot, rate limit). Never a false success message. |
| A7 | Retained blog content | ⬜ | `/blog` index + the 3 existing posts at `/blog/<slug>`, copy reproduced, the "call immediately" post checked for availability promises |
| A8 | Legal pages | ⬜ | `/privacy-policy`, `/terms-of-service` — copy carries over as-is |
| A9 | Launch redirects | ⬜ | The 15 in `docs/page-plan.md` §6 as data in `next.config.ts`; settle `trailingSlash` once; verify each with `curl -I` |
| A10 | Final content confirmation | ⬜ | Street address (Hegee/Heege), business hours and emergency response times, Dan's surname, founding year, Illinois coverage, photo of Dan — `docs/open-questions.md` §6 |
| A11 | Deployment checks | ⬜ | Production env (`NEXT_PUBLIC_ALLOW_INDEXING=true`, `NEXT_PUBLIC_SITE_URL`), robots/sitemap on the real domain, canonical host redirect, careers host regression (routing matrix in README), Search Console submission, GBP parity per SOP §3.4 |

**Not required for launch:** any individual service page, any city page,
new blog posts. The live site has none of these today.

## B. Compass starter extraction — after the client site is live

| # | Item | Status | Notes |
|---|---|---|---|
| B1 | Semantic colour tokens | ⬜ | `navy-*`/`lime-*` in component classes → `surface`, `accent`, `ink`, `paper`; done once against the finished page set |
| B2 | Remaining homepage content separation | ⬜ | `Hero` still imports `content/home.ts`; `AboutSection`, `Testimonials`, `ServicePathways`, `TrustBar` already take props |
| B3 | Optional careers support | ⬜ | Middleware, host resolution, sitemap and config assume a careers host — make its absence a config omission (roadmap §5.3) |
| B4 | Sitemap fully from registries | ⬜ | Core pages are still literals in `app/sitemap.ts` |
| B5 | Enquiry-form route in the starter | ⬜ | Generalised from A6 |
| B6 | Redirects as per-client data | ⬜ | Generalised from A9 |
| B7 | Starter scaffolding | ⬜ | Empty typed `site.config.ts`, placeholder tokens, `content/` skeleton, the `docs/` templates, the §3 change list as a checklist |
| B8 | Validation gate script | ⬜ | The curl + browser checks used here, runnable on any client build |
| B9 | **Check with a different brand** | ⬜ | Swap `site.config.ts`, `@theme` values, fonts, `decoration: "none"/"line"`, one service content file — and confirm nothing electrical, navy, lime or Show Me leaks through. The proof the starter is a starter. |

Detail and rationale for each: `docs/template-roadmap.md` §5.

## C. Later SEO expansion — on demand, never a gate

| Set | Count | Trigger |
|---|---|---|
| Individual residential service pages | 13 | Highest value first (emergency, panel upgrades, ceiling fans, EV chargers, rewiring, generators); the rest as Search Console shows hub impressions |
| Individual commercial service pages | 5 | Footprint pages; when sales needs one |
| Individual industrial service pages | 4 | Same |
| Tier-1 city pages | 8 | After launch, one at a time, genuinely local content each |
| Tier-2 city pages | 12 | Only once Tier-1 pages show impressions |
| New blog posts | 6 | One a month, per the keyword map |

URLs, keywords and volumes: `docs/page-plan.md` §3–5.
