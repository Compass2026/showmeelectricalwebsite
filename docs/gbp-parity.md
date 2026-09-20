# Website ↔ Google Business Profile parity — Show Me Electrical

Finding G7 of the template completion brief. This record matches every
business fact the website publishes against the Google listing, using the
evidence available on 2026-09-20. **No change was made to the live listing.**

## Evidence used

| Source | What it is | Date |
|---|---|---|
| A | The website's own `brands/showme/site.config.ts` and `lib/seo.ts` (the LocalBusiness node every page emits) | commit under review |
| B | Public Google Maps listing data returned by a business-listings API query for "Show Me Electrical" within 30 km of Affton, MO (listing `cid 10879844751861019179`, `last_updated_time 2026-09-19`) | 2026-09-20 |
| C | *GBP Spec — Show Me Electrical* (Compass Drive, prepared 2026-09-13) — the agency's proposed profile content | 2026-09-13 |
| D | Owner decisions D-001 (emergency service offered; hours and response times unconfirmed), D-002 (Master Electrician), D-003 (Edwardsville and Belleville only), D-004 (inquiries to info@), D-005 (address) — `docs/decisions.md` | 2026-09-17/19 |

Source B is third-party scraped listing data, not Business Profile Manager.
Anything not visible in B is marked **unverified**, not assumed.

## Field-by-field

| Field | Website (A) | Google listing (B) | Status |
|---|---|---|---|
| Business name | `name` "Show Me Electrical"; `legalName` "Show Me Electrical Services" (schema `name` = legal name, `alternateName` = short name) | "Show Me Electrical Services" | **Matches the legal name.** C proposes renaming the listing to "Show Me Electrical"; that is a real-world naming decision for Tom, not a website change. Do not rename until the registered business name is verified. |
| Primary category | schema `@type` Electrician | Electrician | Match |
| Secondary categories | none emitted | none visible in B | Consistent. C's five proposed secondaries are a GBP-side change awaiting Tom. |
| Address | 5602 Heege Rd, Affton, MO 63123 (D-005) | 5602 Heege Rd, Affton, MO 63123 | Match. Whether the address should be public (storefront) or hidden (service-area business) is an open question in C; the website shows it. |
| Phone | 314-571-9756 | +1 314-571-9756 | Match. B also lists two other numbers "from backlinks" (618-971-9113, 636-459-9328) — not on the profile itself; **unverified**, likely unrelated citations. |
| Email | info@showmeelectrical.com (D-004) | not shown on the profile; B's backlink emails are unrelated third parties | Website only. |
| Website URL | https://showmeelectrical.com (canonical, no trailing slash) | http://showmeelectrical.com/ | Same domain. After launch, update the profile link to `https://` (GBP-side). |
| Coordinates | omitted (no verified pin) | 38.565, −90.312 | **Website omits deliberately.** B's pin can be adopted into `site.geo` once Tom confirms it is the real location pin, not a geocoded address. |
| Hours | none emitted (D-001: unconfirmed) | Mon–Fri 08:00–18:00, no weekend hours | **Website omits deliberately.** If Tom confirms these hours, add `openingHoursSpecification`; until then the website states nothing. |
| Emergency service | named as a service; no availability claim (D-001) | listing carries "Hour Emergency Service" and "Electrical Emergencies" as service entries | Website is narrower on purpose. C's "responds to emergency calls" wording is **not adopted** on the website. |
| Services | 3 hubs + 1 child page, 24-item approved taxonomy on hub pages | ~50 unstructured entries (duplicates: "Installation", "Clean Up", "Electrical Issue"…) | **Divergent.** C recommends replacing the listing's services with the 24 approved ones. Website already uses the taxonomy. GBP-side change. |
| Description | `businessDescription` (owner-led, three pathways, emergency repairs) | Older text ("full-service company… competitive with our pricing… fully licensed, bonded and insured") | Both true to the client's own material; B's mentions pricing competitiveness the website does not claim. C's 679-character description is the proposed replacement — GBP-side. |
| Attributes | website states licensed, insured, bonded; free consultations; owner-led | `is_owned_by_women`, `offers_online_estimates`, `has_onsite_services` | "Woman-owned" appears on the listing but **not on the website**; the website's About copy centres Dan. Whether the business is woman-owned is **unverified** here — ask Tom before adding it anywhere. |
| Reviews / rating | none emitted (no aggregateRating) | 4.5★, 19 ratings | Website omits deliberately; no review markup without a verified feed. |
| Service area | 7 counties + Edwardsville, Belleville (`areaServed`) | not visible in B | **Unverified** on the profile. |
| Profile links (`sameAs`) | empty | Maps URL `https://www.google.com/maps?cid=10879844751861019179` | Can be added to `sameAs` once Tom confirms this cid is the client's claimed profile (B says `is_claimed: true`). |
| Logo / photos | owned logo tile, 9 job photos | Google-hosted logo, 3 photos | Not comparable programmatically; C has a shot list. |

## Conclusions

- Nothing on the website contradicts the listing on name, address, phone,
  category or domain. The website is deliberately **narrower** than the
  listing on hours, emergency availability and attributes because those
  facts are unconfirmed by the owner (D-001) or unverified here.
- Two profile facts could be *adopted* by the website after owner
  confirmation: the map pin (→ `site.geo`) and the hours
  (→ `openingHoursSpecification`). Neither is added now.
- All GBP-side recommendations in the GBP Spec (rename, secondary
  categories, 24 structured services, description, attributes, hours note)
  remain **proposals**; none was applied. The rename in particular needs the
  registered business name verified first.
- Not verified in this pass: Business Profile Manager itself (no access),
  service-area settings, Q&A, posts, whether the listing is the only one
  for the business.
