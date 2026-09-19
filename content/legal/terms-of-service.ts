import type { LegalDocument } from "./types";

/**
 * MIGRATED FROM WORDPRESS — terms-of-service
 *
 * Source: https://showmeelectrical.com/terms-of-service/ (fetched 2026-09-19).
 * "Last Updated: November 10, 2025" at the source. Revised 2026-09-19: §14
 * contact block completed with the confirmed address, phone and email
 * (owner-approved edit A4; address D-005). No other wording changed; the
 * remaining proposed edits are in docs/policy-revision-proposal.md.
 *
 * Wording is reproduced verbatim for review — nothing has been replaced with
 * generic legal text. Section headings were h3 under an h2 page title at the
 * source; they are h2 under the page's h1 here (structure only). References
 * that may be outdated after the move are listed in `flags` (reviewer notice
 * only). Any change to the wording itself is the owner's call.
 */
export const doc: LegalDocument = {
  slug: "terms-of-service",
  path: "/terms-of-service",
  title: "Terms of Service",
  seo: {
    description: "The terms that govern use of the Show Me Electrical website and services, including communications, pricing, liability and governing law.",
  },
  lastUpdated: "2026-09-19",
  body: [
    { type: "p", text: "Welcome to Show Me Electrical. By accessing or using our services, you agree to comply with and be bound by these Terms of Service (“Terms”). If you do not agree with these Terms, please do not use our Website or services." },
    { type: "h2", text: "1. Agreement to Terms" },
    { type: "lines", lines: ["These Terms govern your access to and use of the Website https://www.showmeelectrical.com and any services provided by Show Me Electrical, including but not limited to electrical installations, repairs, maintenance, and related contracting services.", "By submitting information or contacting us through our Website, you agree to these Terms."] },
    { type: "h2", text: "2. Services Provided" },
    { type: "p", text: "Show Me Electrical provides professional electrical services, including but not limited to:" },
    { type: "ul", items: [
      "Residential and commercial electrical installations and repairs.",
      "Lighting upgrades and electrical panel replacements.",
      "Generator installations and backup systems.",
      "EV charger installations and smart home electrical solutions.",
      "Additional services as may be offered from time to time.",
    ] },
    { type: "h2", text: "3. Use of Our Website" },
    { type: "p", text: "You may use our Website for lawful purposes and in accordance with these Terms. You agree not to:" },
    { type: "ul", items: [
      "Use the Website to violate any applicable laws or regulations.",
      "Upload or transmit harmful code (viruses, malware, etc.).",
      "Interfere with or disrupt the Website’s functionality or security.",
    ] },
    { type: "h2", text: "4. Privacy and Data Collection" },
    { type: "p", text: "By using our Website, you acknowledge that we collect personal information through forms and communications, as described in our Privacy Policy. You agree to provide accurate and complete information when interacting with our services and forms." },
    { type: "h2", text: "5. Opt-In Communications (SMS/Text Messaging Program)" },
    { type: "p", text: "By submitting a form or providing contact information, you consent to receiving communications from Show Me Electrical regarding electrical services, project updates, and related promotions." },
    { type: "p", text: "Text Messaging Program Details:" },
    { type: "ul", items: [
      "Brand Name: Show Me Electrical",
      "Types of Text Messages: Project updates, scheduling, service reminders, and promotional offers.",
      "Message Frequency: Approximately one text message per month.",
      "Message & Data Rates: Message and data rates may apply depending on your carrier and plan.",
      "STOP/Opt-Out: Text STOP to unsubscribe from text messages at any time.",
    ] },
    { type: "p", text: "Mobile information will not be shared with third parties or affiliates for marketing or promotional purposes. All categories exclude text messaging originator opt-in data and consent; this information will not be shared with any third parties." },
    { type: "h2", text: "6. Pricing and Payments" },
    { type: "p", text: "Prices for services will be provided as part of a quote or consultation. Any payment terms, including deposit requirements and payment schedules, will be outlined in a separate agreement or contract specific to the service provided." },
    { type: "p", text: "All payments are due in accordance with the agreed-upon terms. Late payments may be subject to additional charges or fees as specified in the agreement." },
    { type: "h2", text: "7. Intellectual Property" },
    { type: "p", text: "All content on our Website, including text, graphics, logos, and images, is the property of Show Me Electrical and is protected by intellectual property laws. You may not use, reproduce, or distribute any content from the Website without our express written permission." },
    { type: "h2", text: "8. Limitation of Liability" },
    { type: "p", text: "To the fullest extent permitted by law, Show Me Electrical is not liable for any damages arising from your use of the Website or our services, including, but not limited to, any loss of data, revenue, or profits, or any indirect, incidental, or consequential damages. Our total liability will be limited to the amount paid by you for the specific service in question." },
    { type: "h2", text: "9. Warranty Disclaimer" },
    { type: "p", text: "Show Me Electrical does not warrant that the services provided will meet your specific requirements or be uninterrupted or error-free. We make no representations or warranties of any kind, express or implied, regarding the operation of our services or the information, content, or materials included on the Website." },
    { type: "h2", text: "10. Indemnification" },
    { type: "p", text: "You agree to indemnify and hold harmless Show Me Electrical, its officers, employees, and agents from any claims, damages, or liabilities arising out of your use of the Website or services, including any violation of these Terms." },
    { type: "h2", text: "11. Termination of Services" },
    { type: "p", text: "We may suspend or terminate your access to the Website and services at any time for any reason, including if you violate these Terms. You may also terminate your relationship with us by contacting us and discontinuing the use of our Website and services." },
    { type: "h2", text: "12. Governing Law and Dispute Resolution" },
    { type: "p", text: "These Terms will be governed by and construed in accordance with the laws of the State of Missouri, without regard to its conflict of law principles. Any disputes arising under or in connection with these Terms shall be resolved in the courts located in St. Louis, Missouri." },
    { type: "h2", text: "13. Changes to These Terms" },
    { type: "p", text: "We reserve the right to modify or update these Terms at any time. Any changes will be posted on this page with a revised “Last Updated” date. By continuing to use our Website or services, you agree to be bound by the updated Terms." },
    { type: "h2", text: "14. Contact Us" },
    { type: "p", text: "If you have any questions or concerns about these Terms of Service, please contact us:" },
    { type: "lines", lines: ["Show Me Electrical", "5602 Heege Rd, Affton, MO 63123", "Phone: 314-571-9756", "Email: info@showmeelectrical.com", "Website: showmeelectrical.com"] },
  ],
  flags: [
    "§2 \"Services Provided\" lists residential and commercial work only — industrial electrical is a core service on the site. Proposed edit in docs/policy-revision-proposal.md.",
    "§1 cites https://www.showmeelectrical.com (www); the rebuild's canonical host has no www. Proposed edit in docs/policy-revision-proposal.md.",
    "§5 text-messaging programme is preserved verbatim. The website contact form does not enrol anyone in it; a one-sentence clarification is proposed in docs/policy-revision-proposal.md.",
    "§12 governing law: State of Missouri. Two Illinois cities are served; not a website decision — left as-is unless counsel says otherwise.",
  ],
};
