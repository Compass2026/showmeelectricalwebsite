import type { LegalDocument } from "@/content/legal/types";

/**
 * MIGRATED FROM WORDPRESS — privacy-policy
 *
 * Source: https://showmeelectrical.com/privacy-policy/ (fetched 2026-09-19).
 * "Last Updated: November 10, 2025" at the source. Revised 2026-09-19
 * (owner-approved, docs/policy-revision-proposal.md): confirmed street
 * address in §11 (D-005); canonical host without www (§1, §11); §1 technical
 * data described as hosting logs, not analytics; §4 names the hosting and
 * email providers that process a submission; §5 describes the contact form
 * as inquiry-only with no text-messaging enrolment; §7 states that no
 * analytics or advertising cookies are set (D-006). Business programmes run
 * outside the Website are left as written. Revised 2026-11-20 when GA4 went
 * live on the main site (D-008, Tom's authorization): §1 technical data, §4
 * providers and §7 now describe Google Analytics as built — usage data,
 * first-party cookies, the phone-click and form-submit events, no
 * advertising cookies.
 *
 * Wording is reproduced verbatim for review — nothing has been replaced with
 * generic legal text. Section headings were h3 under an h2 page title at the
 * source; they are h2 under the page's h1 here (structure only). References
 * that may be outdated after the move are listed in `flags` (reviewer notice
 * only). Any change to the wording itself is the owner's call.
 */
export const doc: LegalDocument = {
  slug: "privacy-policy",
  path: "/privacy-policy",
  title: "Privacy Policy",
  seo: {
    description: "How Show Me Electrical collects, uses, shares and protects the personal information you provide through our website, phone, email and SMS.",
  },
  lastUpdated: "2026-11-20",
  body: [
    { type: "p", text: "Show Me Electrical (“Company,” “we,” “our,” or “us”) respects your privacy and is committed to protecting it through this Privacy Policy. This policy describes the types of information we may collect from you or that you may provide when you visit our website https://showmeelectrical.com (the “Website”), and our practices for collecting, using, maintaining, protecting, and disclosing that information." },
    { type: "h2", text: "1. Information We Collect" },
    { type: "p", text: "We collect the following types of personal information when you submit a form or interact with our Website:" },
    { type: "ul", items: [
      "Contact Information such as your name, phone number, email address, and physical address.",
      "Service Information such as details about your electrical project, installation, repair, or maintenance needs.",
      "Technical Data such as your IP address, browser type and the pages you request, which our hosting provider records in ordinary server logs to operate and secure the Website, and usage data — the pages you visit, how you arrived at the Website, and whether you tap our phone number or send our contact form — collected through Google Analytics (see section 7).",
    ] },
    { type: "h2", text: "2. How We Collect Information" },
    { type: "p", text: "We collect your information when you:" },
    { type: "ul", items: [
      "Submit a contact or service request form on our Website.",
      "Communicate with us by phone, email, or other means.",
      "Use our Website or engage with our marketing campaigns (e.g., Google Ads, Facebook, or Instagram).",
    ] },
    { type: "h2", text: "3. Use of Your Information" },
    { type: "p", text: "We may use the information we collect for the following purposes:" },
    { type: "ul", items: [
      "To contact you regarding your inquiry about electrical services or project needs.",
      "To provide estimates, schedule consultations, and manage customer relationships.",
      "To improve our Website, services, and overall customer experience.",
      "To send promotional emails or text messages to users who have opted in.",
      "To comply with legal obligations or enforce our Terms of Service.",
    ] },
    { type: "h2", text: "4. Sharing of Your Information" },
    { type: "p", text: "We do not sell or rent your personal information. We may share your data only with:" },
    { type: "ul", items: [
      "Authorized employees and agents of Show Me Electrical.",
      "Third-party service providers who help operate our Website — including our hosting provider, the email service that delivers your form submission to us, and Google Analytics — CRM systems, or marketing tools.",
      "Government or legal authorities, if required by law.",
    ] },
    { type: "p", text: "Mobile information will not be shared with third parties or affiliates for marketing or promotional purposes." },
    { type: "p", text: "All categories exclude text messaging originator opt-in data and consent; this information will not be shared with any third parties." },
    { type: "h2", text: "5. Opt-In and Communication" },
    { type: "p", text: "By submitting the contact form on our Website, you agree that Show Me Electrical may contact you about your inquiry by phone or email. Submitting the form does not enrol you in any text-messaging program; if you take part in one, it is governed by the Text Messaging Program terms in our Terms of Service. You can ask us to stop contacting you at any time by contacting us directly." },
    { type: "h2", text: "6. Data Security" },
    { type: "p", text: "We implement reasonable administrative, technical, and physical security measures to protect your personal information from unauthorized access, disclosure, or misuse. However, no method of transmission over the internet is 100% secure." },
    { type: "h2", text: "7. Cookies and Tracking Technologies" },
    { type: "p", text: "Our Website uses Google Analytics, a web analytics service provided by Google, to understand how visitors use the Website — for example which pages are viewed, how visitors arrive, and whether a visitor taps our phone number or sends our contact form. Google Analytics sets first-party cookies (such as “_ga”) and sends this usage information, including your IP address and browser details, to Google. When you send the contact form, Google receives only that a form was sent and the service you chose — never your name, contact details or message. The Website does not set advertising cookies." },
    { type: "p", text: "You can learn how Google uses this information at https://policies.google.com/technologies/partner-sites and opt out of Google Analytics with Google’s browser add-on at https://tools.google.com/dlpage/gaoptout. You can also control or disable cookies through your browser settings." },
    { type: "h2", text: "8. Your Rights and Choices" },
    { type: "p", text: "You have the right to:" },
    { type: "ul", items: [
      "Access the personal information we hold about you.",
      "Request corrections or deletions of your personal data.",
      "Withdraw your consent to communications at any time.",
    ] },
    { type: "p", text: "To exercise these rights, please contact us at info@showmeelectrical.com" },
    { type: "h2", text: "9. Children’s Privacy" },
    { type: "p", text: "Our Website is not intended for children under 13 years of age. We do not knowingly collect personal information from children. If we learn that we have inadvertently collected such information, we will delete it promptly." },
    { type: "h2", text: "10. Changes to This Privacy Policy" },
    { type: "p", text: "We may update this Privacy Policy periodically. Any changes will be posted on this page with a revised “Last Updated” date. By continuing to use our Website after changes are posted, you agree to the updated policy." },
    { type: "h2", text: "11. Contact Us" },
    { type: "p", text: "If you have any questions about this Privacy Policy, please contact us:" },
    { type: "lines", lines: ["Show Me Electrical", "5602 Heege Rd, Affton, MO 63123", "📞 Phone: 314-571-9756", "✉️ Email: info@showmeelectrical.com", "🌐 Website: https://showmeelectrical.com"] },
  ],
  flags: [],
};
