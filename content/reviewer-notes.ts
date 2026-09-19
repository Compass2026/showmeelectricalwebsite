/**
 * REVIEWER NOTES — shown only inside the preview banner, never in page copy.
 *
 * Anything a reviewer needs to know about content that is provisional lives
 * here, so the customer-facing page carries no implementation notes,
 * placeholders or "coming soon" labels. Delete this file with PreviewNotice
 * at launch.
 */
export const reviewerNotes: { where: string; note: string }[] = [
  {
    where: "Services",
    note: "The Residential card links to the completed /services/residential page. Commercial and industrial cards are not links yet — those hubs are next. The 13 residential service names on that page are not links either, until their individual pages exist.",
  },
  {
    where: "Emergency repairs",
    note: "Service confirmed by the owner (decisions D-001). Hours and response times are still unconfirmed, so the callout deliberately makes no availability or arrival-time promise.",
  },
  {
    where: "About",
    note: "A portrait of Dan is needed. The image shown is a job-site photo from the client's own library, standing in — not stock.",
  },
  {
    where: "Testimonials",
    note: "Reproduced from the live homepage. Caroline's is a marked excerpt; the other two are complete. The third is attributed to \"Adam\" on the live site, as shown.",
  },
  {
    where: "Contact",
    note: "No enquiry form yet — there is no submission backend, so none is shown rather than one that fails silently. Phone and email links are live.",
  },
  {
    where: "Headings typeface",
    note: "Poppins, matching the live careers site. The brand board specifies Spectral SC — unresolved, see docs/open-questions.md.",
  },
];
