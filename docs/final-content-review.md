# Final content review — flagged wording

Everything below is reproduced **as published on WordPress** and is live on
the preview exactly that way. Each line needs an owner decision (keep,
change, remove) before launch. The same flags are shown in the preview's
reviewer notice and stored in each content file's `flags` array — edit the
content file when a decision is made, delete the flag, and rerun
`python3 scripts/content-review.py`.

Generated from `content/blog/*.ts` and `content/legal/*.ts` on 2026-09-19.

## Blog posts

### The Most Common Electrical Hazards Found in Missouri Homes
Source: https://showmeelectrical.com/the-most-common-electrical-hazards-found-in-missouri-homes/ · file `content/blog/the-most-common-electrical-hazards-found-in-missouri-homes.ts`

| # | Flag | Decision |
|---|---|---|
| 1 | "Missouri electrical code requires [GFCI outlets] in kitchens, bathrooms, basements, garages, outdoor areas, and anywhere water is present" — a code claim. Missouri adopts the NEC by local jurisdiction, so wording should be confirmed by the owner before it stays. | ⬜ |
| 2 | "Panels older than 25–30 years may have worn components" — a general industry rule of thumb, not a business claim. Preserved; acceptable if the owner agrees. | ⬜ |
| 3 | "Schedule your electrical safety inspection" / "Call Show Me Electrical for a Safety Inspection" — inspection wording is not in the approved service taxonomy (electrical inspections appear only under the commercial hub). Preserved; confirm the residential offer or reword. | ⬜ |
| 4 | The post is framed around "Missouri homes" — consistent with a Missouri-based business, but the listed service area also includes two Illinois cities. No change needed unless the owner wants the framing widened. | ⬜ |
| 5 | Byline "Tom Dombrowski" is the WordPress author account (Compass Marketing), not the business owner. Preserved as published; decide whether posts should be bylined to the business instead. | ⬜ |

### Top 5 Signs Your Home Needs Electrical Rewiring
Source: https://showmeelectrical.com/top-5-signs-your-home-needs-electrical-rewiring/ · file `content/blog/top-5-signs-your-home-needs-electrical-rewiring.ts`

| # | Flag | Decision |
|---|---|---|
| 1 | "Our licensed electricians serve homeowners throughout Missouri" — broader than the listed service area (Greater St. Louis counties plus Edwardsville and Belleville, IL). Preserved as published; recommend narrowing to the listed area. | ⬜ |
| 2 | "Faulty wiring is one of the leading causes of residential electrical fires in the U.S." — an unsourced statistic. Preserved; needs a citation or removal. | ⬜ |
| 3 | "Increase property value" — an outcome claim the business has not substantiated. Preserved; recommend removal. | ⬜ |
| 4 | Closing lines reference "a home electrical inspection" and "www.showmeelectrical.com" and sign off "Where Safety Meets Service" — the inspection wording is not in the approved service taxonomy and the www address is the old host. The page's own CTA band below now carries the live call to action; recommend dropping these lines. | ⬜ |
| 5 | Byline "Tom Dombrowski" is the WordPress author account (Compass Marketing), not the business owner. Preserved as published; decide whether posts should be bylined to the business instead. | ⬜ |

### Top Signs You Need to Call an Electrician Immediately
Source: https://showmeelectrical.com/top-signs-you-need-to-call-an-electrician-immediately/ · file `content/blog/top-signs-you-need-to-call-an-electrician-immediately.ts`

| # | Flag | Decision |
|---|---|---|
| 1 | "Need Help Fast?" and "get fast, trusted electrical help" — response-time adjacent wording. It stops short of a 24/7, after-hours or arrival-time promise (decision D-001), so it is preserved; recommend softening to "prompt" or removing "fast" until hours are confirmed. | ⬜ |
| 2 | "ready to help homeowners across Missouri" — broader than the listed service area. Preserved as published; recommend narrowing to the listed area. | ⬜ |
| 3 | "request service online" — there is no enquiry form yet on the rebuilt site (contact page is phone and email until the form backend is built). Preserved; the page CTA band links to /contact. | ⬜ |
| 4 | Byline "Tom Dombrowski" is the WordPress author account (Compass Marketing), not the business owner. Preserved as published; decide whether posts should be bylined to the business instead. | ⬜ |

## Legal documents

### Privacy Policy
Source: https://showmeelectrical.com/privacy-policy/ · file `content/legal/privacy-policy.ts`

| # | Flag | Decision |
|---|---|---|
| 1 | §11 lists the business as "Show Me Electrical, St. Louis, MO" with no street address; the site's NAP is 5602 Heege Rd, Affton, MO 63123 (street spelling itself still unconfirmed — Hegee/Heege). Decide whether the policy should carry the full address. | ⬜ |
| 2 | Website is cited as https://www.showmeelectrical.com (www). The rebuild's canonical host is showmeelectrical.com without www; confirm the canonical host and update the policy to match at launch. | ⬜ |
| 3 | §7 says cookies and analytics tools are used. The rebuilt site currently sets no analytics or advertising cookies; keep the wording only if analytics/ads tags are added before launch. | ⬜ |
| 4 | §2 names Google Ads, Facebook and Instagram marketing campaigns. Confirm these are still in use. | ⬜ |
| 5 | §4–5 SMS/opt-in language matches the Terms §5 text-messaging program. The rebuilt site has no form yet, so no opt-in is collected until the contact form ships; the wording will apply once it does. | ⬜ |
| 6 | Contact section line "Show Me Electrical" is rendered as an address block; the phone, email and website lines are preserved with their original emoji markers. | ⬜ |

### Terms of Service
Source: https://showmeelectrical.com/terms-of-service/ · file `content/legal/terms-of-service.ts`

| # | Flag | Decision |
|---|---|---|
| 1 | §2 "Services Provided" lists residential and commercial work only — industrial electrical is not mentioned, although it is a core service on the rebuilt site. Owner to decide whether to add it. | ⬜ |
| 2 | §2 names generator installations, EV charger installations and smart home solutions; these match the residential taxonomy. Fine as is. | ⬜ |
| 3 | §1 cites https://www.showmeelectrical.com (www); §14 gives only "www.showmeelectrical.com" as contact — no phone or email. Confirm the canonical host and consider adding the phone number and email as the privacy policy does. | ⬜ |
| 4 | §5 text-messaging program (approximately one message per month, STOP to opt out) is preserved verbatim. The rebuilt site collects no phone numbers until the contact form ships. | ⬜ |
| 5 | §7 states all website content, including images, is the property of Show Me Electrical. The old site used some stock imagery; the rebuild uses only the client's own photography, so this is now accurate. | ⬜ |
| 6 | §12 governing law: State of Missouri. The listed service area now includes two Illinois cities; this does not change which law governs the website terms, but the owner may want counsel to confirm. | ⬜ |

## Cross-cutting

| Item | Where | Decision |
|---|---|---|
| Blog byline "Tom Dombrowski" (WordPress author account, Compass Marketing) | all three posts; emitted as BlogPosting `author` | ⬜ keep · byline to the business · byline to Dan |
| Canonical host `www` vs bare — both legal documents cite `https://www.showmeelectrical.com` | privacy §1, §11; terms §1, §14 | ⬜ |
| Cookies / analytics / ad-platform wording vs. a rebuild that sets no tags | privacy §2, §7 | ⬜ |
| Street address in legal contact blocks (Hegee/Heege still unconfirmed) | privacy §11 | ⬜ |
