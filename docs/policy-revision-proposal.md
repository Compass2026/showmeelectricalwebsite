# Privacy policy and terms — revision (APPLIED 2026-09-19)

**Status:** Tom approved the factual website-policy updates; every edit
below is applied in `content/legal/privacy-policy.ts` and
`content/legal/terms-of-service.ts` (dated 2026-09-19), plus one further
correction Tom asked for — privacy §1's "Device & Browsing Data" bullet,
which claimed collection "through cookies and analytics tools", now
describes ordinary hosting logs, and §4 names the hosting and email
providers that process a submission. The full before/after is in the
review package (`git diff` of the two files at the release commit).

Prepared 2026-09-19. Scope: only what this website actually does with data,
and the services the site confirms. Nothing here assumes anything about the
business's off-site marketing or whether it runs a text-messaging programme
outside the website; where the current wording covers those, it is left in
place and only the website's own behaviour is clarified.

**Already applied (owner-confirmed facts, dates bumped to 2026-09-19):**
privacy §11 and terms §14 now carry the confirmed address, phone and email
(D-005; launch-review A4). Everything below is now applied; the "Last Updated" date is 2026-09-19.

What the website does, as built: the contact form collects name, email,
phone, a service choice and project details and emails them to the business
so it can reply. It sets no analytics or advertising cookies (D-006). It
presents no SMS or marketing opt-in and records none. It has no user
accounts and keeps no database of visitors; a submission exists as the email
delivered to the business (held by the email provider as a sent message)
and the hosting provider's ordinary request logs.

## Privacy policy — 6 edits (P1–P4 as proposed, plus P5–P6 requested by Tom)

| # | Section | Current | Proposed | Why |
|---|---|---|---|---|
| P1 | §1 (intro) and §11 (contact) | `https://www.showmeelectrical.com` | `https://showmeelectrical.com` | The rebuild's canonical host has no `www`; `www` will redirect to it. |
| P2 | §5 Opt-In and Communication | "By submitting your information through our forms, you expressly opt in to receive communications from Show Me Electrical via phone, email, or SMS. You can opt out at any time by following the unsubscribe instructions in our messages or by contacting us directly." | "By submitting the contact form on our Website, you agree that Show Me Electrical may contact you about your inquiry by phone or email. Submitting the form does not enrol you in any text-messaging programme; if you take part in one, it is governed by the Text Messaging Program terms in our Terms of Service. You can ask us to stop contacting you at any time by contacting us directly." | Describes the form as built (reply-only, no SMS enrolment) without denying that a separate programme may exist. |
| P3 | §7 Cookies and Tracking Technologies | "We use cookies and similar tracking tools to enhance your browsing experience, analyze traffic, and improve our services. You can control or disable cookies through your browser settings." | "Our Website does not currently set analytics or advertising cookies. If we add analytics in future, this section will be updated to describe it. You can control or disable cookies through your browser settings." | True for the launch build (D-006). When GA4 is added later, this paragraph is the one to revise. |
| P4 | §2, third bullet | "Use our Website or engage with our marketing campaigns (e.g., Google Ads, Facebook, or Instagram)." | **No change.** | This describes the business's own campaigns, which the website team cannot confirm or deny. Left as written. |
| P5 | §1, third bullet | "Device & Browsing Data such as IP address, browser type, referring URLs, and usage data collected through cookies and analytics tools." | "Technical Data such as your IP address, browser type and the pages you request, which our hosting provider records in ordinary server logs to operate and secure the Website. The Website does not currently use analytics tools." | Hosting logs exist and are not analytics; the policy must not claim analytics collection that does not happen, nor that nothing is stored. |
| P6 | §4, second bullet | "Third-party service providers who help operate our website, CRM systems, or marketing tools." | "Third-party service providers who help operate our Website — including our hosting provider and the email service that delivers your form submission to us — CRM systems, or marketing tools." | Names the two processors a submission actually passes through (Vercel hosting, Resend email); the business's own CRM/marketing tools are left as written. |

## Terms of service — 3 edits

| # | Section | Current | Proposed | Why |
|---|---|---|---|---|
| T1 | §1 Agreement to Terms | `https://www.showmeelectrical.com` | `https://showmeelectrical.com` | Same as P1. |
| T2 | §2 Services Provided, list | Residential and commercial installations and repairs; lighting upgrades and panel replacements; generator installations; EV charger and smart home; "additional services…" | Add one bullet after the first: "Industrial electrical installations, maintenance, and repairs." | Industrial is a core service on the site (`/services/industrial`); the terms should name it. |
| T3 | §5 Opt-In Communications, first paragraph | "By submitting a form or providing contact information, you consent to receiving communications from Show Me Electrical regarding electrical services, project updates, and related promotions." | "By submitting a form or providing contact information, you consent to Show Me Electrical contacting you about your inquiry and related electrical services. Submitting the Website contact form does not enrol you in the Text Messaging Program described below; enrolment in that program is separate." | Keeps the programme details intact for use elsewhere; makes clear the website form is not the enrolment path. |

Not changed and not proposed: terms §12 governing law (Missouri) — a legal
question, not a website one; terms §7 intellectual property — now accurate
(the rebuild uses only the client's own photography).

## Applied

`content/legal/privacy-policy.ts` and `content/legal/terms-of-service.ts`
edited, `lastUpdated` = 2026-09-19, flags cleared,
`python3 scripts/content-review.py` re-run, claim sweep clean
(`www.showmeelectrical.com` no longer appears anywhere).
