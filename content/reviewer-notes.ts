/**
 * REVIEWER NOTES — shown only inside the preview banner, never in page copy.
 *
 * Anything a reviewer needs to know about content that is provisional lives
 * here, so the customer-facing page carries no implementation notes,
 * placeholders or "coming soon" labels. Delete this file with PreviewNotice
 * at launch.
 */
import { articles } from "./blog";
import { legalDocuments } from "./legal";

const flagged = (items: { title: string; flags?: string[] }[]) =>
  items
    .filter((i) => i.flags?.length)
    .map((i) => `${i.title}: ${i.flags!.join(" ")}`)
    .join(" | ");

export const reviewerNotes: { where: string; note: string }[] = [
  {
    where: "Services",
    note: "All three homepage cards link to their hub pages: /services/residential, /services/commercial and /services/industrial. The individual service names on those pages are not links until their own pages exist (later SEO expansion, see docs/page-plan.md).",
  },
  {
    where: "Service area",
    note: "Counties come from the brand board and the live site; named communities are the approved keyword map's Tier-1 and Tier-2 cities. Edwardsville and Belleville, Illinois were confirmed by Tom (decision D-003) — those two cities only, no wider Illinois coverage inferred. No map embed until the street address is confirmed.",
  },
  {
    where: "Services directory",
    note: "Pathway cards and the full catalog are generated from the registry of built pages. The 22 individual service names are plain text until their own pages exist.",
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
    where: "Blog",
    note: `The three WordPress posts are reproduced word for word with their published dates and byline; the stock featured images were not carried over. Claims to decide on — ${flagged(articles)}`,
  },
  {
    where: "Legal pages",
    note: `Privacy policy and terms carry over verbatim ("Last Updated: November 10, 2025"); no wording was replaced. References that may be outdated after the move — ${flagged(legalDocuments)}`,
  },
  {
    where: "Careers link",
    note: "Nav, footer and About now link straight to careers.showmeelectrical.com, and showmeelectrical.com/careers redirects there, so the careers pages exist at one address. On this preview the Careers link therefore leaves the preview for the live careers site.",
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
