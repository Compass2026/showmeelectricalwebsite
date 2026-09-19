import type { ServicePageContent } from "./types";
import { trustPoints, processSteps } from "@/content/shared";

/**
 * COMMERCIAL ELECTRICAL — hub page content.
 *
 * Primary keyword: "commercial electrician st louis" — taxonomy #14, the
 * commercial hub, 10/mo, $30 CPC, money keyword #6 (protected). The five
 * services are taxonomy #15–19; each becomes its own page later.
 *
 * Section order differs from the residential page on purpose: businesses
 * ask "how does the job run and will it be on time" before they ask for
 * photographs, so the process comes right after the services.
 *
 * PROVENANCE:
 *  - Service names: approved taxonomy v1.1.
 *  - Positioning and claims: live homepage commercial card ("scalable,
 *    efficient electrical solutions… retail fit-out, warehouse lighting,
 *    office rewiring… meets today's demands while planning for tomorrow's
 *    growth"), live "Previous projects" copy ("commitment to deadlines… from
 *    planning to final inspection"), and the live FAQ ("new construction
 *    wiring, tenant build-outs, lighting upgrades, breaker panels, and code
 *    compliance for businesses across St. Louis").
 *  - Trust facts: live /about/ and FAQ; Master Electrician per D-002.
 *  - Emergency wording: D-001. No hours, no response times.
 *  - Photography: four commercial images from the client's own library —
 *    a retail checkout build-out, a metal-stud fit-out rough-in, wall-mounted
 *    equipment wired in conduit, and a new exterior electrical service.
 */
export const commercial: ServicePageContent = {
  slug: "commercial",
  path: "/services/commercial",

  seo: {
    title: "Commercial Electrician St. Louis, MO | Show Me Electrical",
    description:
      "Commercial electrician in St. Louis for tenant build-outs, LED retrofits, panel & service upgrades, code inspections and maintenance. Free consultation.",
    keyword: "commercial electrician st louis",
    supporting: [
      "electrical contractor st louis",
      "tenant build out electrical st louis",
      "commercial lighting st louis",
      "commercial electrical panel st louis",
      "electrical inspection st louis",
    ],
    image: "/photos/commercial-checkout.webp",
  },

  schema: {
    name: "Commercial Electrical Services",
    serviceType: "Commercial electrician",
  },

  breadcrumbs: [{ label: "Home", href: "/" }, { label: "Commercial Electrical" }],

  /** Source: live homepage service card, lightly tightened. */
  directory: {
    title: "Commercial",
    summary:
      "Scalable electrical for Missouri businesses — retail fit-outs, warehouse lighting, office rewiring, and code compliance that plans for growth.",
  },

  hero: {
    eyebrow: "Commercial electrical services",
    headline: "Commercial Electrician in St. Louis, MO",
    intro:
      "Scalable, efficient electrical for Missouri businesses — retail fit-outs, warehouse lighting, office rewiring and the panel and service upgrades behind them — so your space meets today's demands while planning for tomorrow's growth. Owner-led, on schedule, and up to code.",
    image: {
      src: "/photos/commercial-checkout.webp",
      alt: "Newly built retail checkout counter with point-of-sale equipment powered up, shelving stocked behind it",
    },
  },

  services: {
    eyebrow: "Services",
    heading: "Commercial electrical work — and what it fixes",
    intro:
      "Five commercial services. Each pairs the situation a business owner or property manager is actually in with what we do about it.",
    items: [
      {
        name: "Tenant Build-Outs",
        problem:
          "The lease is signed, the space is a shell or the last tenant's layout, and the opening date is already on the calendar.",
        solution:
          "Complete electrical for retail, office and warehouse build-outs — new circuits, lighting, receptacles and equipment connections — coordinated with your general contractor and inspected before you open.",
      },
      {
        name: "Commercial Lighting & LED Retrofits",
        problem:
          "A warehouse floor or showroom that is dim, costly to run, or losing a fixture every few weeks.",
        solution:
          "Lighting upgrades and LED retrofits for warehouses, showrooms and offices — brighter, more efficient, and fewer ladders.",
      },
      {
        name: "Commercial Panel & Service Upgrades",
        problem:
          "New equipment, a new tenant or an expansion has pushed the existing service past what it was sized for.",
        solution:
          "Breaker panel and electrical service upgrades sized for the load you have and the growth you are planning.",
      },
      {
        name: "Electrical Code Compliance & Inspections",
        problem:
          "An inspector, insurer or landlord wants documented, code-compliant electrical — and you are not certain the space is.",
        solution:
          "Code compliance work and inspections for businesses across St. Louis, with straight answers about what actually needs fixing and what doesn't.",
      },
      {
        name: "Commercial Electrical Maintenance",
        problem:
          "Small electrical faults turn into downtime because nobody is looking at them until something fails.",
        solution:
          "Scheduled maintenance for commercial spaces — panels, connections and lighting checked and corrected before they become an outage.",
      },
    ],
  },

  process: {
    eyebrow: "Our process",
    heading: "How a commercial job runs",
    intro:
      "From the first walkthrough to final inspection — scheduled work, delivered on time and up to code.",
    steps: processSteps,
  },

  gallery: {
    eyebrow: "On the job",
    heading: "Commercial work, photographed on site",
    intro:
      "Our own work on our own jobs — no stock images. Fit-out, equipment and service, before and after the walls closed.",
    photos: [
      {
        src: "/photos/roughin-wall.webp",
        alt: "Electrical boxes and conduit set in metal-stud framing beneath a suspended ceiling grid with troffer lights, during a commercial fit-out",
        caption: "Rough-in during a commercial fit-out, before drywall.",
      },
      {
        src: "/photos/commercial-panels.webp",
        alt: "Four wall-mounted stainless-steel units with flue pipes in a commercial space, each wired through conduit to a junction box",
        caption: "Wall-mounted equipment wired in conduit, commercial interior.",
      },
      {
        src: "/photos/service-entrance.webp",
        alt: "New electrical service on the exterior of a block building: four conduit risers feeding a stainless-steel cabinet and a meter",
        caption: "New electrical service on a commercial building.",
      },
    ],
  },

  trust: {
    eyebrow: "Why us",
    heading: "Why St. Louis businesses call us back",
    intro:
      "Who shows up, what backs the work, and how the schedule gets kept.",
    points: trustPoints,
  },

  faqs: {
    eyebrow: "Questions",
    heading: "Questions business owners ask",
    intro:
      "Straight answers. If yours isn't here, call — a free consultation is the fastest route to a real one.",
    items: [
      {
        q: "Do you handle commercial electrical projects in St. Louis?",
        a: "Yes. We specialize in commercial electrical work such as new construction wiring, tenant build-outs, lighting upgrades, breaker panels, and code compliance for businesses across St. Louis.",
      },
      {
        q: "Are you licensed and insured for commercial work?",
        a: "Yes — Show Me Electrical is fully licensed, insured and bonded to handle residential, commercial and industrial electrical projects, so the work is safe, code-compliant and backed by proper certifications and liability coverage.",
      },
      {
        q: "Who leads the work on a commercial job?",
        a: "Show Me Electrical is owner-led. Dan, the Master Electrician behind the name, leads every project, and our electricians deliver the install — clean, efficient, on time and up to code.",
      },
      {
        q: "Do you work with our general contractor on a build-out?",
        a: "Yes. On build-outs we work alongside the general contractor and the other trades, from rough-in through final inspection, so the electrical is ready when the space is.",
      },
      {
        q: "Can you upgrade our panel or service if we add equipment?",
        a: "Yes. Breaker panel and service upgrades are everyday commercial work for us. We size the new service for the load you have and the growth you are planning, rather than just the minimum that passes.",
      },
      {
        q: "Do you do LED retrofits?",
        a: "Yes. Lighting upgrades and LED retrofits for warehouses, showrooms and offices are a core commercial service — we handle the fixtures, the circuits and the controls.",
      },
      {
        q: "Do you offer emergency electrical service for businesses?",
        a: "Yes. If your business has an electrical emergency, call to discuss the problem and current availability.",
      },
      {
        q: "Do you offer ongoing maintenance for commercial properties?",
        a: "Yes. Scheduled commercial electrical maintenance — checking panels, connections and lighting before they fail — is one of our services. Call to discuss what your property needs.",
      },
      {
        q: "Which areas do you serve?",
        a: "Businesses across the Greater St. Louis area — St. Louis City and St. Louis County, plus St. Charles, Jefferson, Franklin, Warren and Lincoln Counties — and Edwardsville and Belleville in Illinois.",
      },
    ],
  },

  related: {
    heading: "Related",
    links: [
      {
        label: "Get a free quote",
        href: "/contact",
        description: "Call, email or send project details — we'll get you on the schedule.",
      },
      {
        label: "Industrial electrical",
        href: "/services/industrial",
        description: "Switchgear, transformers, machinery hookups and power distribution.",
      },
      {
        label: "Residential electrical",
        href: "/services/residential",
        description: "Panel upgrades, rewiring, lighting, ceiling fans and repairs for homes.",
      },
      {
        label: "Service area",
        href: "/service-area",
        description: "St. Louis City and County and the surrounding counties.",
      },
    ],
  },

  cta: {
    heading: "Let's talk about your space",
    body: "Free consultation, a clear scope and a schedule you can plan around. Call, or send us the details and we'll get back to you.",
  },

  sections: [
    "hero",
    "services",
    "process",
    "gallery",
    "trust",
    "faqs",
    "related",
    "cta",
  ],
};
