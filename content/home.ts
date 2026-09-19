/**
 * HOMEPAGE CONTENT — client copy, separated from presentation.
 *
 * PROVENANCE: every string below is either (a) lifted from the client's live
 * WordPress site, (b) taken from the approved brand board, or (c) a light
 * rewrite of one of those. Nothing is invented. Items needing client sign-off
 * are marked with a `note` that renders visibly in the preview.
 *
 * OWNER-CONFIRMED 2026-09-17 (docs/decisions.md):
 *  - Emergency electrical service IS offered (D-001). Named below as a service.
 *    Hours and response times remain unconfirmed, so nothing here claims 24/7,
 *    after-hours or weekend coverage, or a guaranteed arrival time.
 *  - Dan MAY be described as a Master Electrician on the main site (D-002),
 *    restoring the client's own live /about/ wording. The careers site's
 *    career ladder still omits master and foreman levels — separate thing.
 *
 * Deliberately ABSENT:
 *  - Any claim about WHEN emergency service is available. See D-001's limits.
 *  - Review counts, star ratings, project counts, years-in-business figures
 *    beyond the "20+ years" stated on the live About page.
 */

import type { StoryStage } from "@/components/motion/ScrollStory";
import { processSteps } from "./shared";

export const hero = {
  eyebrow: "Residential · Commercial · Industrial",
  /**
   * Source: live homepage hero headline ("Powering Missouri homes and
   * businesses"), shortened and localised to St. Louis so the H1 carries the
   * primary keyword's location. The accent line is the client's own phrase
   * from the live /about/ page.
   */
  headline: "Powering St. Louis homes and businesses",
  headlineAccent: "done right the first time.",
  /** Source: live homepage subhead, condensed to two lines. */
  body: "Owner-led electrical contractor for residential, commercial and industrial work across the Greater St. Louis area. Free consultations, straight answers, code-compliant work.",
  image: {
    src: "/photos/commercial-panels.webp",
    alt: "Electrical panels installed on a brick wall at a commercial job site",
  },
};

/** Trust points are shared with the service pages — see content/shared.ts. */
export { trustPoints } from "./shared";

/** Source: live homepage service cards, lightly tightened. */
export const servicePathways: {
  slug: string;
  title: string;
  summary: string;
  examples: string[];
  image: { src: string; alt: string };
  href?: string;
}[] = [
  {
    slug: "residential",
    title: "Residential",
    summary:
      "Safe, code-compliant wiring for custom homes, remodels and additions. From panel upgrades to fixture installs, smart-home wiring to ceiling fans.",
    examples: [
      "Panel upgrades & replacement",
      "Home rewiring",
      "Lighting & ceiling fans",
      "EV charger installation",
    ],
    image: {
      src: "/photos/finished-interior-lighting.webp",
      alt: "Finished interior with recessed ceiling lighting installed",
    },
    /** Built — see content/services/residential.ts. */
    href: "/services/residential",
  },
  {
    slug: "commercial",
    title: "Commercial",
    summary:
      "Scalable electrical for Missouri businesses — retail fit-outs, warehouse lighting, office rewiring, and code compliance that plans for growth.",
    examples: [
      "Tenant build-outs",
      "Commercial lighting & LED retrofits",
      "Panel & service upgrades",
      "Code compliance & inspections",
    ],
    image: {
      src: "/photos/commercial-checkout.webp",
      alt: "Newly built retail checkout counter with electrical service installed",
    },
    /** No page yet — the card is not a link until /services/commercial exists. */
  },
  {
    slug: "industrial",
    title: "Industrial",
    summary:
      "High-voltage work for industrial and large-scale systems — transformers, switchgear and heavy equipment wiring, managed with safety at every step.",
    examples: [
      "Switchgear & transformers",
      "Machinery & equipment hookups",
      "Control panels & power distribution",
      "Preventative maintenance",
    ],
    image: {
      src: "/photos/industrial-high-bay.webp",
      alt: "High-bay lighting installation in an industrial warehouse, viewed from a lift",
    },
    /** No page yet — the card is not a link until /services/industrial exists. */
  },
];

/**
 * Emergency electrical repairs.
 *
 * Owner-confirmed as a service offered (decisions D-001). Deliberately states
 * WHAT is offered and nothing about WHEN: hours and response times are
 * unconfirmed, so there is no 24/7 claim, no after-hours or weekend coverage,
 * and no guaranteed arrival time. Wording confirmed by Tom 2026-09-17. The
 * reviewer note about unconfirmed hours lives in content/reviewer-notes.ts.
 */
export const emergencyCallout = {
  heading: "Need emergency electrical repairs?",
  body: "Call to discuss the problem and current availability.",
};

/**
 * Signature scroll story. Stages mirror the three-step process published on
 * the live homepage ("Request a Quote", "Concepts & planning",
 * "Install & Execution"), with the third extended to completed work.
 */
export const storyStages: StoryStage[] = processSteps.map((step, i) => ({
  ...step,
  image: [
    {
      src: "/photos/roughin-wall.webp",
      alt: "Electrical boxes set in metal-stud framing beneath a suspended ceiling grid, before drywall",
    },
    {
      src: "/photos/roughin-attic.webp",
      alt: "Recessed light housings and wiring roughed in across a vaulted ceiling in new framing",
    },
    {
      src: "/photos/finished-interior-lighting.webp",
      alt: "Finished interior with recessed lighting powered on and a tray ceiling",
    },
  ][i],
}));

/**
 * Source: live /about/ page, condensed. The Master Electrician credential is
 * stated once (paragraph 1), per Tom's review; it is not expanded into any
 * individual licensing claim.
 */
export const about = {
  heading: "Your local experts. Your trusted team.",
  paragraphs: [
    "Dan isn't just the owner of Show Me Electrical — he's the Master Electrician behind the name, the hands behind the work and the heart behind the company. Born and raised in Missouri, he built this business from the ground up with a simple mission: honest, reliable electrical work that local families and businesses can count on.",
    "With over two decades of experience across residential, commercial and industrial systems, Dan leads every project with deep expertise and personal care. He's not a sales guy — he shows up, tools in hand, ready to get the job done right the first time.",
    "His reputation is built on word of mouth, earned by showing up on time, solving tough problems and treating every customer like a neighbor — because most of them are.",
  ],
  /**
   * Stand-in until a portrait of Dan is supplied — a job-site image from the
   * client's own library, so nothing here is stock. Recorded in
   * content/reviewer-notes.ts rather than captioned on the page.
   */
  image: {
    src: "/photos/service-entrance.webp",
    alt: "Exterior electrical service equipment and conduit installed on a commercial building",
  },
};

/**
 * Source: the three testimonials on the client's live homepage
 * (showmeelectrical.com, Elementor testimonial widgets), re-checked against
 * the raw HTML on 2026-09-17.
 *
 *  - Adam (1):  exact, complete quotation.
 *  - Caroline:  EXCERPT — the live review is nine sentences; four are omitted
 *               at the marked ellipses. Every sentence shown is verbatim,
 *               including the reviewer's own "ShowMe Electric" spelling and
 *               curly quotes. Marked as an excerpt on the page.
 *  - Adam (2):  exact, complete quotation. The live site attributes this
 *               review to a second "Adam"; an earlier draft here showed it
 *               unattributed, which was wrong. Reproduced as published.
 *
 * No star ratings, review counts or "verified" labels — no verification
 * process is documented, so none is claimed.
 */
export const testimonials: {
  quote: string;
  name: string;
  excerpt?: boolean;
}[] = [
  {
    quote:
      "Ryan and Patrick were awesome. They worked with us every step of the way to make sure we got exactly what we were looking for. We will definitely be using Show Me Electrical Services again.",
    name: "Adam",
  },
  {
    quote:
      "I\u2019ve used ShowMe Electric for two houses I\u2019ve owned. \u2026 I love how practical they are. \u2026 They worked around my schedule, were thorough, and professional. Zero call back means a job well done. I\u2019ve also recommended them to many friends.",
    name: "Caroline",
    excerpt: true,
  },
  {
    quote:
      "Show me did a fantastic job updating the lighting throughout my house, which involved wiring new for new custom fans and lights. They were very knowledgeable to advise on options to manage cost and appearance. Professional outfit from quote through efficient installation.",
    name: "Adam",
  },
];
