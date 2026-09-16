/**
 * HOMEPAGE CONTENT — client copy, separated from presentation.
 *
 * PROVENANCE: every string below is either (a) lifted from the client's live
 * WordPress site, (b) taken from the approved brand board, or (c) a light
 * rewrite of one of those. Nothing is invented. Items needing client sign-off
 * are marked with a `note` that renders visibly in the preview.
 *
 * Deliberately ABSENT:
 *  - Any emergency / 24-7 / after-hours claim. The live FAQ states plainly:
 *    "No, we do not offer emergency electrical services." The approved keyword
 *    map lists "emergency electrician st louis" as a money keyword. Conflict
 *    is flagged for Tom and unresolved.
 *  - Any "Master Electrician" credential claim. Live /about/ and the brand
 *    board both use it, but Tom directed its removal from the careers site in
 *    September. Scope of that instruction needs confirming before it returns.
 *  - Review counts, star ratings, project counts, years-in-business figures
 *    beyond the "20+ years" stated on the live About page.
 */

import type { StoryStage } from "@/components/motion/ScrollStory";

export const hero = {
  eyebrow: "Residential · Commercial · Industrial",
  /** Source: live homepage hero headline. */
  headline: "Powering Missouri homes and businesses",
  headlineAccent: "with care and craftsmanship",
  /** Source: live homepage subhead. */
  body: "Show Me Electrical is an owner-led electrical contractor serving St. Louis City, St. Louis County and the Greater St. Louis area. Code-compliant wiring, panel upgrades, lighting and industrial power — done right the first time.",
  image: {
    src: "/photos/commercial-panels.webp",
    alt: "Electrical panels installed on a brick wall at a commercial job site",
  },
};

/** Source: live /about/ page and live FAQ. No numbers invented. */
export const trustPoints = [
  {
    label: "Owner-led",
    detail: "Dan is on the job, not behind a sales desk.",
  },
  {
    label: "20+ years",
    detail: "Across residential, commercial and industrial systems.",
  },
  {
    label: "Licensed, insured & bonded",
    detail: "Backed by proper certifications and liability coverage.",
  },
  {
    label: "Free consultations",
    detail: "We review the work and answer questions — no strings attached.",
  },
];

/** Source: live homepage service cards, lightly tightened. */
export const servicePathways = [
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
    href: "/services/commercial",
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
    href: "/services/industrial",
  },
];

/**
 * Signature scroll story. Stages mirror the three-step process published on
 * the live homepage ("Request a Quote", "Concepts & planning",
 * "Install & Execution"), with the third extended to completed work.
 */
export const storyStages: StoryStage[] = [
  {
    step: "01",
    title: "Plan",
    body: "Start with a free consultation. We review the project, answer your questions and map the electrical work against your space, its use and what you will need from it later — no strings attached.",
    image: {
      src: "/photos/roughin-wall.webp",
      alt: "Conduit and boxes laid out in a framed wall before drywall",
    },
  },
  {
    step: "02",
    title: "Install",
    body: "Our electricians deliver clean, efficient installs — conduit run straight, boxes set true, everything on time and up to code. Rough-in is where quality is decided, long before anything is covered up.",
    image: {
      src: "/photos/roughin-attic.webp",
      alt: "Wiring and fixture boxes installed through open roof framing",
    },
  },
  {
    step: "03",
    title: "Power on",
    body: "Final connections, testing and inspection. The work gets closed up and handed over finished — safe, labelled and built to last, from a single fixture to a full service.",
    image: {
      src: "/photos/finished-interior-lighting.webp",
      alt: "Completed interior with recessed lighting powered on",
    },
  },
];

/** Source: live /about/ page, condensed. */
export const about = {
  heading: "Your local experts. Your trusted team.",
  paragraphs: [
    "Dan isn't just the owner of Show Me Electrical — he's the hands behind the work and the heart behind the company. Born and raised in Missouri, he built this business from the ground up with a simple mission: honest, reliable electrical work that local families and businesses can count on.",
    "With over two decades of experience across residential, commercial and industrial systems, Dan leads every project with deep expertise and personal care. He's not a sales guy — he shows up, tools in hand, ready to get the job done right the first time.",
    "His reputation is built on word of mouth, earned by showing up on time, solving tough problems and treating every customer like a neighbor — because most of them are.",
  ],
  image: {
    src: "/photos/service-entrance.webp",
    alt: "Exterior electrical service equipment and conduit installed on a commercial building",
  },
  imageNote:
    "PLACEHOLDER — a portrait of Dan is needed here. The photo shown is a job-site image from the existing media library.",
};

/**
 * Source: testimonials published on the client's live homepage.
 * Reproduced verbatim; the third is unattributed on the live site and is
 * therefore shown without a name rather than given one.
 */
export const testimonials = [
  {
    quote:
      "Ryan and Patrick were awesome. They worked with us every step of the way to make sure we got exactly what we were looking for. We will definitely be using Show Me Electrical Services again.",
    name: "Adam",
  },
  {
    quote:
      "I've used Show Me Electric for two houses I've owned — light fixtures, dimmers, outlets and TV mounts. I love how practical they are. They worked around my schedule, were thorough, and professional. Zero call back means a job well done. I've also recommended them to many friends.",
    name: "Caroline",
  },
  {
    quote:
      "Show Me did a fantastic job updating the lighting throughout my house, which involved wiring new for new custom fans and lights. They were very knowledgeable to advise on options to manage cost and appearance. Professional outfit from quote through efficient installation.",
    name: null,
  },
];
