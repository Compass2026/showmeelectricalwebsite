import type { Crumb, Faq, Photo, RelatedLink } from "./services/types";

/**
 * ABOUT PAGE CONTENT — /about
 *
 * PROVENANCE:
 *  - Story paragraphs: the client's live /about/ page, reproduced with two
 *    edits only — the Master Electrician credential is stated once
 *    (paragraph 1, per Tom's review), and "licensed" is not attached to it
 *    (decision D-002: the confirmed credential, no added licensing claim).
 *    The third paragraph was never used on the homepage and appears here in
 *    full.
 *  - Values: drawn from the same live paragraphs ("straight answers, safe
 *    solutions, and a job done with pride"; "doesn't believe in shortcuts or
 *    one-size-fits-all solutions"; "treating every customer like a neighbor").
 *  - Facts in FAQs: live FAQ (licensed, insured and bonded), live /about/
 *    (over two decades of experience — Dan's experience, NOT years in
 *    business, which is unknown), config (address, service area).
 *  - Photography: the client's own job-site images. A portrait of Dan is
 *    still needed — recorded in the reviewer notice, not on the page.
 *
 * NOT stated: years in business, team size, licence numbers, Dan's surname
 * (unknown — see docs/open-questions.md), any review count or rating.
 */
export const about = {
  path: "/about",

  seo: {
    title: "About Show Me Electrical | Owner-Led St. Louis Electrician",
    description:
      "Meet Dan, the Master Electrician behind Show Me Electrical — an owner-led electrical contractor in Affton serving St. Louis homes, businesses and industry.",
    image: "/photos/roughin-attic.webp",
  },

  breadcrumbs: [{ label: "Home", href: "/" }, { label: "About" }] as Crumb[],

  hero: {
    eyebrow: "Meet the owner",
    headline: "About Show Me Electrical",
    intro:
      "Your local experts. Your trusted team. An owner-led electrical contractor based in Affton, working across the Greater St. Louis area for homes, businesses and industrial facilities.",
    image: {
      src: "/photos/roughin-attic.webp",
      alt: "Recessed light housings and wiring roughed in across a vaulted ceiling in new framing, with large windows below",
    } as Photo,
  },

  story: {
    eyebrow: "Dan's story",
    heading: "Your local experts. Your trusted team.",
    paragraphs: [
      "Dan isn't just the owner of Show Me Electrical — he's the Master Electrician behind the name, the hands behind the work, and the heart behind the company. Born and raised right here in Missouri, Dan built this business from the ground up with a simple mission: provide honest, reliable electrical work that local families and businesses can count on.",
      "With over two decades of experience in residential, commercial, and industrial electrical systems, Dan leads every project with deep expertise and personal care. He's not a sales guy — he shows up, tools in hand, ready to get the job done right the first time. His reputation is built on word of mouth, earned through years of showing up on time, solving tough problems, and treating every customer like a neighbor — because most of them are.",
      "At Show Me Electrical, Dan doesn't believe in shortcuts or one-size-fits-all solutions. Whether he's upgrading your home's outdated panel, wiring a new business from scratch, or troubleshooting a complex industrial system, you'll get straight answers, safe solutions, and a job done with pride. This isn't just his career — it's his calling. And when you work with Dan, you're not hiring a company. You're partnering with a neighbor who takes your safety and satisfaction personally.",
    ],
    /** Stand-in until a portrait of Dan is supplied — see reviewer notes. */
    image: {
      src: "/photos/service-entrance.webp",
      alt: "New electrical service on the exterior of a block building: four conduit risers feeding a stainless-steel cabinet and a meter",
    } as Photo,
  },

  values: {
    eyebrow: "How we work",
    heading: "What working with Dan looks like",
    intro:
      "Four things every customer gets, whatever the size of the job.",
    items: [
      {
        title: "Straight answers",
        body: "What actually needs fixing, what doesn't, and a clear scope before any work starts.",
      },
      {
        title: "Safe solutions",
        body: "Code-compliant work, backed by proper certifications and liability coverage.",
      },
      {
        title: "No shortcuts",
        body: "No one-size-fits-all fixes. The job gets done right the first time, with pride.",
      },
      {
        title: "A neighbor, not a company",
        body: "Born and raised in Missouri. Most customers are neighbors, and every one is treated like it.",
      },
    ],
  },

  trust: {
    eyebrow: "The facts",
    heading: "What backs the work",
  },

  testimonials: {
    eyebrow: "Client feedback",
    heading: "What our customers say",
    intro: "Reviews published by our customers on the Show Me Electrical website.",
  },

  pathways: {
    eyebrow: "What we do",
    heading: "Three kinds of work, one standard",
    links: [
      {
        label: "Residential electrical",
        href: "/services/residential",
        description: "Panel upgrades, rewiring, lighting, ceiling fans and repairs for homes.",
      },
      {
        label: "Commercial electrical",
        href: "/services/commercial",
        description: "Build-outs, lighting retrofits, panel and service upgrades, inspections.",
      },
      {
        label: "Industrial electrical",
        href: "/services/industrial",
        description: "Switchgear, transformers, machinery hookups and power distribution.",
      },
      {
        label: "Careers",
        href: "/careers",
        description: "Open roles for electricians and office staff.",
      },
    ] as RelatedLink[],
  },

  faqs: {
    eyebrow: "Questions",
    heading: "Questions people ask about us",
    items: [
      {
        q: "Who owns Show Me Electrical?",
        a: "Dan — the Master Electrician behind the name. He built the business from the ground up and still leads every project himself, tools in hand.",
      },
      {
        q: "How experienced is the team?",
        a: "Dan has over two decades of experience across residential, commercial and industrial electrical systems, and leads every project personally.",
      },
      {
        q: "Are you licensed and insured?",
        a: "Yes — Show Me Electrical is fully licensed, insured and bonded to handle residential, commercial and industrial electrical projects, so the work is safe, code-compliant and backed by proper certifications and liability coverage.",
      },
      {
        q: "Where are you based, and where do you work?",
        a: "Our shop is at 5602 Heege Rd in Affton, MO. We work across the Greater St. Louis area — St. Louis City and St. Louis County, plus St. Charles, Jefferson, Franklin, Warren and Lincoln Counties.",
      },
      {
        q: "Do you take on residential, commercial and industrial work?",
        a: "All three. Homes, businesses and industrial facilities each have their own page describing what we do and the problems it solves — and the same owner leads the work on every one.",
      },
      {
        q: "Are you hiring?",
        a: "Sometimes. Open roles for electricians and office staff are posted on our careers site, with a full description and an application form for each.",
      },
    ] as Faq[],
  },

  cta: {
    heading: "Let's talk about your project",
    body: "Free consultation, straight answers and a clear scope before any work starts. Call, or send us the details and we'll get you on the schedule.",
  },
};
