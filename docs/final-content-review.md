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

### Top 5 Signs Your Home Needs Electrical Rewiring
Source: https://showmeelectrical.com/top-5-signs-your-home-needs-electrical-rewiring/ · file `content/blog/top-5-signs-your-home-needs-electrical-rewiring.ts`

| # | Flag | Decision |
|---|---|---|

### Top Signs You Need to Call an Electrician Immediately
Source: https://showmeelectrical.com/top-signs-you-need-to-call-an-electrician-immediately/ · file `content/blog/top-signs-you-need-to-call-an-electrician-immediately.ts`

| # | Flag | Decision |
|---|---|---|

## Legal documents

### Privacy Policy
Source: https://showmeelectrical.com/privacy-policy/ · file `content/legal/privacy-policy.ts`

| # | Flag | Decision |
|---|---|---|
| 1 | Website is cited as https://www.showmeelectrical.com (www) in §1 and §11. The rebuild's canonical host is showmeelectrical.com without www (www will redirect). Proposed edit in docs/policy-revision-proposal.md. | ⬜ |
| 2 | §7 says cookies and analytics tools are used. The rebuilt site sets no analytics or advertising cookies (analytics disabled for this review; GA4 is a separate follow-up). Proposed edit in docs/policy-revision-proposal.md. | ⬜ |
| 3 | §5 says submitting a form is an express opt-in to phone, email and SMS communications. The website form collects a phone number only so the business can reply; it presents and records no SMS enrolment. Any separate text-messaging programme the business runs is unaffected. Proposed edit in docs/policy-revision-proposal.md. | ⬜ |

### Terms of Service
Source: https://showmeelectrical.com/terms-of-service/ · file `content/legal/terms-of-service.ts`

| # | Flag | Decision |
|---|---|---|
| 1 | §2 "Services Provided" lists residential and commercial work only — industrial electrical is a core service on the site. Proposed edit in docs/policy-revision-proposal.md. | ⬜ |
| 2 | §1 cites https://www.showmeelectrical.com (www); the rebuild's canonical host has no www. Proposed edit in docs/policy-revision-proposal.md. | ⬜ |
| 3 | §5 text-messaging programme is preserved verbatim. The website contact form does not enrol anyone in it; a one-sentence clarification is proposed in docs/policy-revision-proposal.md. | ⬜ |
| 4 | §12 governing law: State of Missouri. Two Illinois cities are served; not a website decision — left as-is unless counsel says otherwise. | ⬜ |

## Cross-cutting

| Item | Where | Decision |
|---|---|---|
| Blog byline "Tom Dombrowski" (WordPress author account, Compass Marketing) | all three posts; emitted as BlogPosting `author` | ⬜ keep · byline to the business · byline to Dan |
| Canonical host `www` vs bare — both legal documents cite `https://www.showmeelectrical.com` | privacy §1, §11; terms §1, §14 | ⬜ |
| Cookies / analytics / ad-platform wording vs. a rebuild that sets no tags | privacy §2, §7 | ⬜ |
| Street address in legal contact blocks (Hegee/Heege still unconfirmed) | privacy §11 | ⬜ |
