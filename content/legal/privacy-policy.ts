import type { LegalDocument } from "./types";

/**
 * MIGRATED FROM WORDPRESS — privacy-policy
 *
 * Source: https://showmeelectrical.com/privacy-policy/ (fetched 2026-09-19).
 * "Last Updated: November 10, 2025" at the source. Revised 2026-09-19: the
 * confirmed street address added to §11 (owner-confirmed, D-005). No other
 * wording changed; the remaining proposed edits are in
 * docs/policy-revision-proposal.md and wait for the owner.
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
  lastUpdated: "2026-09-19",
  body: [
    { type: "p", text: "Show Me Electrical (“Company,” “we,” “our,” or “us”) respects your privacy and is committed to protecting it through this Privacy Policy. This policy describes the types of information we may collect from you or that you may provide when you visit our website https://www.showmeelectrical.com (the “Website”), and our practices for collecting, using, maintaining, protecting, and disclosing that information." },
    { type: "h2", text: "1. Information We Collect" },
    { type: "p", text: "We collect the following types of personal information when you submit a form or interact with our Website:" },
    { type: "ul", items: [
      "Contact Information such as your name, phone number, email address, and physical address.",
      "Service Information such as details about your electrical project, installation, repair, or maintenance needs.",
      "Device & Browsing Data such as IP address, browser type, referring URLs, and usage data collected through cookies and analytics tools.",
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
      "Third-party service providers who help operate our website, CRM systems, or marketing tools.",
      "Government or legal authorities, if required by law.",
    ] },
    { type: "p", text: "Mobile information will not be shared with third parties or affiliates for marketing or promotional purposes." },
    { type: "p", text: "All categories exclude text messaging originator opt-in data and consent; this information will not be shared with any third parties." },
    { type: "h2", text: "5. Opt-In and Communication" },
    { type: "p", text: "By submitting your information through our forms, you expressly opt in to receive communications from Show Me Electrical via phone, email, or SMS. You can opt out at any time by following the unsubscribe instructions in our messages or by contacting us directly." },
    { type: "h2", text: "6. Data Security" },
    { type: "p", text: "We implement reasonable administrative, technical, and physical security measures to protect your personal information from unauthorized access, disclosure, or misuse. However, no method of transmission over the internet is 100% secure." },
    { type: "h2", text: "7. Cookies and Tracking Technologies" },
    { type: "p", text: "We use cookies and similar tracking tools to enhance your browsing experience, analyze traffic, and improve our services. You can control or disable cookies through your browser settings." },
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
    { type: "lines", lines: ["Show Me Electrical", "5602 Heege Rd, Affton, MO 63123", "📞 Phone: 314-571-9756", "✉️ Email: info@showmeelectrical.com", "🌐 Website: https://www.showmeelectrical.com"] },
  ],
  flags: [
    "Website is cited as https://www.showmeelectrical.com (www) in §1 and §11. The rebuild's canonical host is showmeelectrical.com without www (www will redirect). Proposed edit in docs/policy-revision-proposal.md.",
    "§7 says cookies and analytics tools are used. The rebuilt site sets no analytics or advertising cookies (analytics disabled for this review; GA4 is a separate follow-up). Proposed edit in docs/policy-revision-proposal.md.",
    "§5 says submitting a form is an express opt-in to phone, email and SMS communications. The website form collects a phone number only so the business can reply; it presents and records no SMS enrolment. Any separate text-messaging programme the business runs is unaffected. Proposed edit in docs/policy-revision-proposal.md.",
  ],
};
