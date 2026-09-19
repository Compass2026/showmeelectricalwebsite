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
    note: "All three homepage cards link to their hub pages: /services/residential, /services/commercial and /services/industrial. The individual service names on those pages are not links until their own pages exist (later SEO expansion, see docs/page-plan.md).",
  },
  {
    where: "Industrial photography",
    note: "The client's library holds one authentic industrial image (the high-bay warehouse), used as the hero. The industrial page has no photo gallery until more industrial job photos are supplied.",
  },
  {
    where: "Emergency repairs",
    note: "Service confirmed by the owner (decisions D-001). Hours and response times are still unconfirmed, so the callout deliberately makes no availability or arrival-time promise.",
  },
  {
    where: "About",
    note: "/about is built from the live About page's three paragraphs. A portrait of Dan is still needed — the hero and story images are job-site photos from the client's own library, standing in, not stock. Dan's surname is unknown, so no Person schema is emitted yet.",
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
