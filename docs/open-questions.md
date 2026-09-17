# Open Questions & Conflicts — for Tom

Blocking items are marked **BLOCKING**. Everything else has a documented
assumption in place so work continued.

---

## 1. Emergency service — **BLOCKING for service pages**

*Flagged in the assignment; confirmed against both sources.*

- **Approved keyword map v1.1** lists *Emergency Electrical Service* as
  service #2 and `emergency electrician st louis` as **money keyword #4**,
  noted as "$47 CPC — highest-value term on the site".
- **The live website** answers the question directly:
  > "Do you offer 24/7 emergency electrical services?"
  > "**No, we do not offer emergency electrical services.** … While we don't
  > take emergency or after-hours calls, we strive to offer prompt scheduling
  > during regular business hours."

**Action taken:** every emergency, 24/7 and after-hours claim is excluded from
this prototype. Verified: zero occurrences in the rendered HTML.

**Decision needed:** does Dan want to start offering emergency service (making
the keyword valid), or should service #2 be struck from the approved taxonomy?
This blocks the service-page build — it is one of 24 planned pages and one of
6 money keywords.

---

## 2. "Master Electrician" — **BLOCKING for About page**

Three sources disagree:

| Source | Position |
|---|---|
| Live `/about/` page | "he's the **Master Electrician** behind the name… a **licensed Master Electrician** who shows up, tools in hand" |
| Brand board (2026-09-01) | Positioning line is "Owner-led, **licensed Master Electrician**". Lists "Master Electrician" under *Words we use*. Instructs: "Emphasize owner-operated Master Electrician". |
| Tom, Sept 2026 (careers site) | "remove any language about or pointing towards Master Electrician… **remove any language about master or foreman**" |

That instruction was given in a careers context and was about the *employee
career ladder*. It is genuinely ambiguous whether it also removes **Dan's own
credential** from the main site — which is a different claim, and one the
client publishes themselves.

**Action taken:** the credential is **not** used anywhere in this prototype.
The About section says "owner-led" and "over two decades of experience"
instead. This is the conservative reading — the brand board also says "never
invent licenses, certifications".

**Decision needed:** may Dan be described as a Master Electrician on the main
site? If yes it should return to the About section and the hero, because it is
the single strongest differentiator in the brand board. One-line change.

---

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
| **Business hours** | Omitted from LocalBusiness schema rather than guessed. |
| **Business coordinates (lat/lng)** | `geo` previously held *approximate* Affton coordinates that `lib/seo.ts` emitted as the business's exact location — a false precision that can misplace the business in local results. Now omitted entirely: `site.geo` is `null` and the `GeoCoordinates` block is only emitted when real values are set. **Read the true pin off the client's Google Business Profile** and set `geo: { lat, lng }` in `config/site.config.ts`. |
| **Licence numbers / bonding details** | The live FAQ claims "fully licensed, insured and bonded". Reproduced as-is, but schema-level credentials need real numbers. |
| **Photo of Dan** | About section shows a placeholder with a visible amber note. |
| **Real project case studies** | The live site has a "Previous Projects" heading with no project detail. No fabricated projects were added. Needs 3–4 real ones with permission to publish. |
| **Review data** | Testimonials were reproduced from the live site. No star ratings, review counts or `aggregateRating` schema — we have no verified source. |
| **Social profiles** | Footer links to Facebook and Twitter exist on WordPress but point nowhere useful. `sameAs` is empty. |
| **Google Analytics / GTM** | No tag found on the current site. |

---

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
`config/site.config.ts`. The three service cards are deliberately not links —
each carries a visible "Detailed page in the next milestone" note instead of
pointing at a page that does not exist.

`/contact` **is built** and is a real page: working `tel:` and `mailto:` links,
address, and a visible note that the enquiry form is pending a backend. No form
is rendered, so nothing can report a false success.
