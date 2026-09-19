# Final content and launch review

Prepared 2026-09-19 against commit on `claude/main-site-foundation-v1`.
One document, four parts:

- **A. Editorial corrections** — wording changes that follow from decisions
  already made (D-001 to D-004) or that fix a plain defect. Each is written
  out as before → after. Nothing here changes a business fact. Apply on
  Tom's approval.
- **B. Business facts Tom must confirm** — claims only the owner can stand
  behind. A proposed edit is given for each, but the fact comes first.
- **C. Required launch work** — the exact remaining blockers.
- **D. Optional additions** — never a gate.

Repeated flags are grouped: one row per issue, with every place it occurs.
**Existing attribution is preserved** (post bylines, dates, "Last Updated"
dates) unless a change is explicitly approved — see A0.

Source of truth for every flag: the `flags` arrays in `content/blog/*.ts`
and `content/legal/*.ts`, listed verbatim in `docs/final-content-review.md`.

---

## A. Editorial corrections (before → after)

### A0. Attribution — no change proposed

| Where | Current | Action |
|---|---|---|
| Three blog posts | Byline "Tom Dombrowski" (the WordPress author account); dates 2025-06-14, 2026-01-22, 2026-01-22 | **Keep as published.** Emitted as BlogPosting `author`/`datePublished`. Changing the byline to the business or to Dan is available but only on explicit approval. |
| Privacy policy, terms | "Last Updated: November 10, 2025" | **Keep** until the wording itself is changed; then set the real date of that change. |

### A1. Service-area wording in posts (follows D-003) — 2 places

| # | File | Before | After |
|---|---|---|---|
| A1.1 | Rewiring post, closing paragraph | "Our licensed electricians serve homeowners throughout Missouri with safe, reliable, and code-compliant solutions." | "Our licensed electricians serve homeowners across the Greater St. Louis area, including Edwardsville and Belleville, Illinois, with safe, reliable, and code-compliant solutions." |
| A1.2 | Call-immediately post, "Need Help Fast?" paragraph | "…ready to help homeowners across Missouri with safe and reliable electrical repair." | "…ready to help homeowners across the Greater St. Louis area with safe and reliable electrical repair." |

Rationale: the listed service area is the seven counties plus the two Illinois
cities. "Throughout Missouri" is wider than anything confirmed.

### A2. Response-time wording (follows D-001) — 1 place, 2 strings

| # | File | Before | After |
|---|---|---|---|
| A2.1 | Call-immediately post, heading | "Need Help Fast? Contact Show Me Electrical" | "Need Help? Contact Show Me Electrical" |
| A2.2 | Same post, last line | "Call now or request service online to get fast, trusted electrical help for your home." | "Call now or send us the details online to get trusted electrical help for your home." |

Rationale: hours and response times are unconfirmed; "fast" implies one.
"Request service online" is now true (the contact form exists) and is kept
in substance.

### A3. Rewiring post sign-off lines — 1 place

| # | Before | After |
|---|---|---|
| A3.1 | "📞 Call us today to schedule a home electrical inspection or" / "📩 Request a free estimate www.showmeelectrical.com" | **Remove both lines.** The page's own call-to-action band (call / free quote) follows every article. |
| A3.2 | "Show Me Electrical — Where Safety Meets Service." | **Remove** with the lines above, unless Tom wants the tagline kept (it appears nowhere else on the rebuilt site). |

Note: "home electrical inspection" in A3.1 also belongs to B4 — removing the
line resolves it for this post.

### A4. Terms §14 contact block — 1 place

| Before | After |
|---|---|
| "www.showmeelectrical.com" (the whole section) | "Show Me Electrical" / "Phone: 314-571-9756" / "Email: info@showmeelectrical.com" / "Website: showmeelectrical.com" — the same block the privacy policy §11 uses, with the address line added once B6 is settled. |

### A5. Hazards post, "TLDR" heading — optional style

| Before | After |
|---|---|
| "TLDR" | "In short" — optional; the content is unchanged. Skip if Tom prefers the original. |

### A6. Homepage title tag — defect

| Before | After |
|---|---|
| "Electrician in St. Louis, MO \| Show Me Electrical — Residential, Commercial & Industrial" (88 characters) | "Electrician in St. Louis, MO \| Show Me Electrical" (48) |

---

## B. Business facts Tom (or Dan) must confirm

| # | Fact to confirm | Where it appears | Proposed edit once confirmed |
|---|---|---|---|
| B1 | **Fire statistic.** "Faulty wiring is one of the leading causes of residential electrical fires in the U.S." has no source. | Rewiring post, first paragraph | If a source is supplied (e.g. a published NFPA/ESFI figure), keep the sentence and cite it. If not: "Outdated or damaged electrical wiring isn't just an inconvenience — it can be a serious safety hazard." and drop the statistic. |
| B2 | **"Increase property value."** An outcome the business has not substantiated. | Rewiring post, "Why Electrical Rewiring Matters" list | Remove the bullet. |
| B3 | **Electrical code claim.** "Missouri electrical code requires [GFCI outlets] in kitchens, bathrooms, basements, garages, outdoor areas, and anywhere water is present." Missouri adopts the NEC by local jurisdiction. Dan to confirm the wording he is comfortable with. | Hazards post, GFCI section | "Current electrical code requires GFCI protection in kitchens, bathrooms, basements, garages, outdoor areas and other locations near water." |
| B4 | **Do you offer residential electrical safety inspections?** The wording appears in two posts but "inspection" is only in the commercial taxonomy. | Hazards post ("Schedule your electrical safety inspection", "Call Show Me Electrical for a Safety Inspection"); rewiring post (A3.1) | **Yes:** add "Electrical Safety Inspections" to the residential service list and keep the wording. **No:** "Call Show Me Electrical to take a look" / "Have Show Me Electrical take a look" and heading "Call Show Me Electrical". |
| B5 | **Panel age rule of thumb.** "Panels older than 25–30 years may have worn components…" | Hazards post, panels section | Keep if Dan agrees; otherwise "Older panels may have worn components…". |
| B6 | **Street address spelling** — Hegee or Heege (open since the first milestone). Feeds NAP, LocalBusiness schema and the legal contact blocks. | Footer, contact page, schema, privacy §11 (currently "St. Louis, MO" only) | Privacy §11 line 2: "5602 Heege Rd, Affton, MO 63123" (or the confirmed spelling). |
| B7 | **Canonical host.** The rebuild's canonical is `showmeelectrical.com` (no www). Both legal documents cite `https://www.showmeelectrical.com`. | Privacy §1, §11; terms §1, §14 | Replace with `https://showmeelectrical.com` when the host is confirmed (www will redirect to it). |
| B8 | **Analytics and advertising.** Privacy §2 names Google Ads, Facebook and Instagram campaigns; §7 says cookies and analytics tools are used. The rebuild sets no tags today (C4). | Privacy §2, §7 | If analytics/ads are added before launch: keep. If not: §2 bullet 3 → "Use our Website."; §7 → "Our Website uses only the cookies needed for it to function. We do not use advertising cookies." |
| B9 | **SMS / text-messaging programme.** Privacy §5 and terms §5 describe an SMS opt-in. The contact form collects a phone number only to reply; it presents and records no opt-in. | Privacy §5; terms §5 | Keep both sections if an SMS programme runs outside the website (and say so: "…if you enrol in our text-messaging programme"). Otherwise narrow privacy §5 to "…to receive a reply from Show Me Electrical by phone or email" and remove terms §5's programme details. |
| B10 | **Industrial work in the terms.** Terms §2 lists residential and commercial only; industrial is a core service on the site. | Terms §2 | Add bullet: "Industrial electrical installations, maintenance and repairs." |
| B11 | **Governing law** — Missouri, while two Illinois cities are served. Not a website decision. | Terms §12 | Leave as-is unless counsel says otherwise. |

Everything in B is live on the preview exactly as it was on WordPress; none
of it has been changed.

---

## C. Required launch work — the exact remaining blockers

Status: ⬜ open · 🟡 partly done · ✅ done. Nothing below touches production
or DNS until Tom says go.

| # | Blocker | Status | What "done" looks like |
|---|---|---|---|
| C1 | **Production email configuration** | 🟡 | `RESEND_API_KEY` already exists for the production target (used by the careers form). Decide the sender: keep `inquiries@send.compassmarketing.ai` (works today) or verify a `showmeelectrical.com` sending domain in Resend and set `INQUIRY_FROM`. `INQUIRY_RECIPIENT` is optional (defaults to info@showmeelectrical.com). Then **one labelled test through the production deployment's own URL before DNS moves**, with inbox receipt confirmed. The preview test's inbox receipt is still awaiting Tom's confirmation. |
| C2 | **Indexing switch-over** | ⬜ | Production env: `NEXT_PUBLIC_ALLOW_INDEXING=true`, `NEXT_PUBLIC_SITE_URL=https://showmeelectrical.com`. Remove `PreviewNotice` and `content/reviewer-notes.ts` from every page. Rebuild. Verify with curl on the production domain: `robots` meta = `index, follow`, `/robots.txt` allows and names the sitemap, `/sitemap.xml` lists only main-site URLs. Submit the sitemap in Search Console. |
| C3 | **Redirects on the real domain** | 🟡 | Rules are built and verified on the preview. Remaining: add `showmeelectrical.com` and `www.showmeelectrical.com` to the Vercel project with www redirecting to the apex; re-run the legacy URL table (`docs/migration-inventory.md` §4) with curl on the real domain; confirm `/global-styles` answers 410; check the WordPress admin for any redirect plugin rules not in the sitemap crawl. |
| C4 | **Analytics decision** | ⬜ | None is configured and none was found on WordPress. Decide: GA4 (and/or GTM) or nothing. The decision sets B8's wording. If a tag is added, it must load only after the indexing switch and must not add a consent banner requirement the site does not meet. |
| C5 | **Careers regression on real hostnames** | ⬜ | After DNS: run the routing matrix (README) against `https://careers.showmeelectrical.com` and `https://showmeelectrical.com`: careers `/` and `/jobs/<slug>` 200 and indexable, `/careers/*` 308 to the public form, main-site paths 404 on the careers host, per-host robots and sitemap, canonicals; submit one careers application and confirm receipt. The careers routing code is unchanged by the rebuild, but this is the first time both hosts serve from one production deployment. |
| C6 | **Content decisions** | ⬜ | Approve A1–A6 (editorial) and answer B1–B11 (facts). Apply, regenerate `docs/final-content-review.md`, re-run the claim sweeps. |
| C7 | **Business facts still missing** | ⬜ | Address spelling (B6) is the only one that blocks launch (NAP + schema). Business hours block only the emergency-availability wording, which is deliberately absent; they do not block launch. |
| C8 | **Deployment hygiene** | ⬜ | Revoke or keep the preview-only Resend key (send-only, agency domain) — it has no production role. Confirm production has no `INQUIRY_DELIVERY` variable. Confirm `APPLICATION_RECIPIENT` for careers is still what Tom wants. |
| C9 | **Google Business Profile parity** | ⬜ | Per the SOP: the 22 site services and the GBP service list must match; needs GBP access. Listed in checklist A11. |

Not blockers, already done: pages A1–A9 in `docs/completion-checklist.md`,
launch redirect rules, blog and legal migration, contact form.

---

## D. Optional additions — separate from launch

| Item | Why optional | Trigger |
|---|---|---|
| Portrait of Dan | About page works with a job-site photo; a portrait improves it | When Tom has one |
| Tier-1 city pages (8), Tier-2 (12) | Later SEO expansion, one at a time, real local content each | After launch, as Search Console shows impressions |
| Individual service pages (22) | Hubs cover launch; pages follow demand | Highest-value first (emergency, panels, EV, generators) |
| New blog posts (6 planned) | Keyword map topics | One a month |
| `showmeelectrical.com` sending domain in Resend | Agency domain is verified and works | Nicer From address; DNS records at the registrar |
| Person schema for Dan | Needs his surname | When supplied |
| Business coordinates in schema | Omitted rather than guessed | Read off the Google Business Profile pin |
| Social profile links (`sameAs`) | WordPress links pointed nowhere useful | When real profiles exist |
| Hours / emergency-availability wording | D-001 allows naming the service, not when | When real hours are confirmed |
| Headings typeface (Spectral SC vs Poppins) | Brand-board question, unresolved | Design decision |
| Real project case studies | "Previous Projects" on WordPress had none | 3–4 with permission |
| Deployment-wide rate limit for the form | Per-instance limit + platform DDoS mitigation is enough for a contact form | Only if abuse appears; WAF rule or a shared counter |
