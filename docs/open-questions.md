# Open Questions & Conflicts — for Tom

Blocking items are marked **BLOCKING**. Everything else has a documented
assumption in place so work continued.

Decisions the owner has confirmed move to `docs/decisions.md` and are marked
**RESOLVED** here, with the outcome, so the history of the conflict stays
readable. **No blocking items remain.**

---

## 1. Emergency service — **RESOLVED** (owner-confirmed 2026-09-17)

*Recorded as decision D-001 in `docs/decisions.md`.*

The conflict was:

- **Approved keyword map v1.1** lists *Emergency Electrical Service* as
  service #2 and `emergency electrician st louis` as **money keyword #4**,
  noted as "$47 CPC — highest-value term on the site".
- **The live website** answered the opposite:
  > "Do you offer 24/7 emergency electrical services?"
  > "**No, we do not offer emergency electrical services.** …"

**Outcome: the service IS offered.** The keyword map is correct and the live
FAQ answer is wrong. The service page and the money keyword are both retained,
and that FAQ answer is not carried into the rebuild — it is flagged for rewrite
in the migration inventory rather than reused as source copy.

**One limit carries forward.** Hours and response times are still unconfirmed,
so nothing may claim 24/7 or round-the-clock availability, after-hours,
overnight or weekend coverage, or a guaranteed arrival or response time. The
homepage names the service and gives the phone number; it says nothing about
when. Confirming real hours is tracked in §6.

## 2. "Master Electrician" — **RESOLVED** (owner-confirmed 2026-09-17)

*Recorded as decision D-002 in `docs/decisions.md`.*

The ambiguity was whether Tom's September instruction — "remove any language
about master or foreman" — reached Dan's own credential on the main site, or
only the employee career ladder on the careers site.

**Outcome: only the career ladder.** Dan **may** be described as a Master
Electrician on the main website, which is what the client already publishes on
their live `/about/` page and what the brand board's positioning line says.
The credential is now used in the About paragraphs, the trust bar and the meta
description.

**The careers instruction is unchanged and still in force.** Master and
foreman levels stay out of the careers progression. `lib/jobs.ts` and every
careers route were not touched by this decision.

| Property | Master Electrician |
|---|---|
| Main site — Dan's own credential | **Allowed** |
| Careers site — career ladder rungs | **Still removed** |

## 3. Typography — brand board vs live careers site

| Source | Headings | Body |
|---|---|---|
| Brand board | **Spectral SC** | Poppins |
| Careers site (live) | **Poppins** | Inter |

**Action taken:** kept the careers pairing, per the direction to treat the
careers site as the primary visual reference and not silently revert to the
older board. Recorded in `config/theme.config.ts`.

**Decision needed:** adopt Spectral SC for headings across both properties, or
update the brand board to match what is shipped? Changing it would alter the
live careers site's appearance, so it has not been done unilaterally.

---

## 4. Colour reconciliation — resolved, for the record

| Token | Brand board | Careers site | Resolution |
|---|---|---|---|
| Lime | `#BFD62D` | `#C0D634` | Kept `#C0D634` — sampled from the logo artwork; ≤7/255 per channel difference, visually identical. |
| Navy | `#04345C` | `#0A1B33` | **Both kept.** `#0A1B33` stays the deep surface; `#04345C` adopted as `navy-700`, the mid-tone, where it sits naturally. |
| Charcoal | `#121217` | (not used) | Adopted as `--color-charcoal` for body text on light surfaces. |

No decision needed unless you disagree with the navy split.

---

## 5. Service area wording

- **Brand board:** "St. Louis City, St. Louis County, St. Charles, Jefferson,
  Franklin, Warren and Lincoln Counties"
- **Tom, Sept 2026:** "change the 6 counties to Greater St. Louis area"

**Action taken:** "Greater St. Louis area" is the headline wording; the county
list is retained in `site.config.ts` and still rendered as chips on the
service-area section, since a service-area page needs the specifics for local
SEO. Confirm that split is what you want.

---

## 6. Business facts still needed

| Item | Why |
|---|---|
| **Correct street address** | The live site says both "5602 **Hegee** Rd" (homepage) and "5602 **Heege** Rd" (elsewhere), and both "St. Louis MO" and "Affton, MO 63123". NAP consistency affects Map Pack ranking directly. Currently using *5602 Heege Rd, Affton, MO 63123*. |
| **Business hours + emergency response times** | **Now the highest-priority missing fact.** Emergency service is confirmed as offered (D-001), but every availability claim is blocked until real hours are known — no 24/7, after-hours or arrival-time wording can ship without them. Also still omitted from LocalBusiness schema rather than guessed. |
| **Business coordinates (lat/lng)** | `geo` previously held *approximate* Affton coordinates that `lib/seo.ts` emitted as the business's exact location — a false precision that can misplace the business in local results. Now omitted entirely: `site.geo` is `null` and the `GeoCoordinates` block is only emitted when real values are set. **Read the true pin off the client's Google Business Profile** and set `geo: { lat, lng }` in `config/site.config.ts`. |
| **Licence numbers / bonding details** | The live FAQ claims "fully licensed, insured and bonded" and the About copy now says "licensed Master Electrician" per D-002 — both reproduced from the client's own published wording. Schema-level credentials (`hasCredential`) still need the real licence number and issuing jurisdiction before they can be emitted. |
| **Photo of Dan** | The homepage About section and the /about page show job-site photos from the client's own library as stand-ins. Recorded in the reviewer notice (not captioned on the page). |
| **Blog byline** | All three WordPress posts are bylined "Tom Dombrowski" — the WordPress author account (Compass Marketing), not the business. Preserved as published and emitted as `author` in BlogPosting schema. Decide: keep, byline to the business, or byline to Dan. See §8. |
| **Dan's full name** | The live site only ever says "Dan". A `Person` schema node (founder, jobTitle Master Electrician) would strengthen the About page and the business entity, but not with a first name alone. Supply the surname and it is a two-line addition. |
| ~~**Illinois coverage**~~ | **RESOLVED 2026-09-19 (D-003).** Edwardsville and Belleville, IL are served — those two cities only. Added to `/service-area`, the area FAQs, schema `areaServed` and the homepage chips. Counties unchanged; no wider Illinois coverage inferred. |
| **Years in business** | The live About page gives Dan's experience ("over two decades") but never the company's founding year. Not stated anywhere in the rebuild; `foundingDate` omitted from schema. |
| **Real project case studies** | The live site has a "Previous Projects" heading with no project detail. No fabricated projects were added. Needs 3–4 real ones with permission to publish. |
| **Review data** | Testimonials were reproduced from the live site. No star ratings, review counts or `aggregateRating` schema — we have no verified source. |
| **Social profiles** | Footer links to Facebook and Twitter exist on WordPress but point nowhere useful. `sameAs` is empty. |
| **Google Analytics / GTM** | No tag found on the current site. |

---

## 8. Raised by the content-preservation milestone (2026-09-19)

Nothing below was rewritten; each item is preserved as published and shown in
the preview's reviewer notice. Owner decisions needed:

| Item | Where | Question |
|---|---|---|
| "throughout Missouri" / "across Missouri" | rewiring + call-immediately posts | Wider than the listed service area. Narrow to the listed area, or keep? |
| "Faulty wiring is one of the leading causes of residential electrical fires in the U.S." | rewiring post | Unsourced statistic — cite or remove? |
| "Increase property value" | rewiring post | Outcome claim — keep or remove? |
| "Missouri electrical code requires [GFCI]…" | hazards post | Code claim; Missouri adopts the NEC by jurisdiction — confirm wording. |
| "home electrical inspection" / "safety inspection" | rewiring + hazards posts | Not in the residential taxonomy (inspections are listed under commercial). Confirm the offer or reword. |
| "Need Help Fast?" / "fast, trusted electrical help" | call-immediately post | Stops short of a D-001 breach; soften to "prompt" or keep? |
| Closing sign-off lines ("📞 Call us today…", "Where Safety Meets Service", `www.` address) | rewiring post | The page's own CTA band now follows the article — drop these lines? |
| Blog byline | all three posts | See §6. |
| Privacy §11 address | privacy policy | "St. Louis, MO" only — add the street address once Hegee/Heege is settled? |
| `https://www.showmeelectrical.com` | privacy + terms | Canonical host on the rebuild has no `www`. Confirm the host and update both documents at launch. |
| Cookies / analytics / ad platforms | privacy §2, §7 | The rebuild sets no analytics or ad cookies today. Keep the wording only if tags are added before launch. |
| Terms §2 services list | terms of service | Residential and commercial only — add industrial? |
| Terms §14 contact | terms of service | Bare `www.` address, no phone or email — add them as the privacy policy does? |
| `/st-louis/` destination | redirects | Now `/services/industrial` (old page was an industrial pitch). Re-point to a St. Louis city page if one is built. Agree? |

## 7. Scope note — what exists in the preview

This milestone is the **homepage prototype and the reusable foundation**.
Service pages, city pages, projects and blog are deferred to the next
assignment.

**Routes that exist and work:** `/` (homepage), `/contact`, `/careers`,
`/careers/jobs/<slug>`, `/robots.txt`, `/sitemap.xml`.

**No link in the preview 404s.** Nav and footer entries for Services, Our
Process, About and Service Area point at the matching homepage sections
(`/#services`, `/#process`, `/#about`, `/#service-area`) until those pages are
built; swapping them to real routes is a one-line change per entry in
`config/site.config.ts`. The three service cards are deliberately not links
rather than pointing at pages that do not exist.

`/contact` **is built** and is a real page: working `tel:` and `mailto:` links
and the address. No form is rendered, so nothing can report a false success.

**Reviewer notes are kept out of customer copy.** Everything provisional —
the un-linked service cards, the unconfirmed emergency hours, the stand-in
About photo, the missing contact form, the typeface question — is listed in
the preview banner's "Reviewer notes" fold (`content/reviewer-notes.ts`), not
as captions or labels on the page. Delete that file with `PreviewNotice` at
launch.
