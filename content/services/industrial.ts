import type { ServicePageContent } from "./types";
import { trustPoints, processSteps } from "@/content/shared";

/**
 * INDUSTRIAL ELECTRICAL — hub page content.
 *
 * Primary keyword: "industrial electrician st louis" — taxonomy #20, the
 * industrial hub, 10/mo. The four services are taxonomy #21–24. Per the
 * map, industrial pages "exist to hold the footprint, convert referral and
 * direct traffic, and support B2B credibility — not to chase volume."
 *
 * This page is deliberately SHORTER than the residential hub: four services,
 * seven questions, no photo gallery, credentials first. That is the right
 * shape for a facility manager, and it is also the proof that the shared
 * components carry a shorter page without empty sections or irrelevant
 * schema.
 *
 * No gallery because the client's library holds exactly one authentic
 * industrial image (the high-bay warehouse), which is the hero. The gap is
 * recorded in the reviewer notice.
 *
 * PROVENANCE:
 *  - Service names: approved taxonomy v1.1.
 *  - Positioning: live homepage industrial card ("Our certified technicians
 *    deliver expert high-voltage services for industrial and large-scale
 *    systems. From transformers to switchgear and heavy-duty equipment
 *    wiring, we manage complex infrastructure with safety and precision at
 *    every step."), live FAQ ("machinery hookups, power distribution
 *    systems, control panels, and preventative maintenance"), and the live
 *    /st-louis/ page ("Powering St. Charles, Lincoln & Warren Counties with
 *    Expert Industrial power").
 *  - Trust facts: live /about/ and FAQ; Master Electrician per D-002.
 *  - Emergency wording: D-001.
 */
export const industrial: ServicePageContent = {
  slug: "industrial",
  path: "/services/industrial",

  seo: {
    title: "Industrial Electrician St. Louis, MO | Show Me Electrical",
    description:
      "Industrial electrician in St. Louis: switchgear and transformers, machinery hookups, control panels, power distribution and preventative maintenance.",
    keyword: "industrial electrician st louis",
    supporting: [
      "switchgear installation st louis",
      "machine wiring st louis",
      "control panel wiring st louis",
      "industrial electrical maintenance",
    ],
    image: "/photos/industrial-high-bay.webp",
  },

  schema: {
    name: "Industrial Electrical Services",
    serviceType: "Industrial electrician",
  },

  breadcrumbs: [{ label: "Home", href: "/" }, { label: "Industrial Electrical" }],

  hero: {
    eyebrow: "Industrial electrical services",
    headline: "Industrial Electrician in St. Louis, MO",
    intro:
      "High-voltage work for industrial and large-scale systems — transformers, switchgear, heavy-duty equipment wiring and power distribution — managed with safety and precision at every step. Serving plants and facilities across St. Louis, St. Charles, Lincoln and Warren Counties.",
    image: {
      src: "/photos/industrial-high-bay.webp",
      alt: "High-bay LED lighting installed across the ceiling of an industrial warehouse, with a yellow gantry crane below, viewed from a lift",
    },
  },

  trust: {
    eyebrow: "Before anyone touches the switchgear",
    heading: "Credentials, experience, accountability",
    intro:
      "What a facility manager needs to know first.",
    points: trustPoints.slice(0, 3),
  },

  services: {
    eyebrow: "Services",
    heading: "Industrial electrical work — and what it keeps running",
    intro:
      "Four industrial services, each paired with the problem it solves on the floor.",
    items: [
      {
        name: "Switchgear & Transformer Installation",
        problem:
          "A larger service, a new line, or gear that is past its service life.",
        solution:
          "Switchgear and transformer installation, including high-voltage work — installed to specification and inspected.",
      },
      {
        name: "Machinery & Equipment Hookups",
        problem:
          "New machinery on the floor and nothing rated to feed it.",
        solution:
          "Heavy-duty equipment wiring and machinery hookups — disconnects, feeders and connections sized for the load.",
      },
      {
        name: "Control Panels & Power Distribution",
        problem:
          "Power that has to reach the right places at the right capacity, with the controls to run it.",
        solution:
          "Control panel wiring and power distribution systems for industrial facilities.",
      },
      {
        name: "Preventative Industrial Maintenance",
        problem:
          "Unplanned downtime from an electrical fault nobody saw coming.",
        solution:
          "Preventative maintenance on industrial electrical systems — inspection and correction before a failure stops the line.",
      },
    ],
  },

  process: {
    eyebrow: "Our process",
    heading: "How an industrial job runs",
    intro:
      "Plan, install, power on — with safety and precision at every step.",
    steps: processSteps,
  },

  faqs: {
    eyebrow: "Questions",
    heading: "Questions facility managers ask",
    items: [
      {
        q: "Can you help with industrial electrical installations in Missouri?",
        a: "Absolutely. Our licensed electricians are experienced in industrial settings — handling machinery hookups, power distribution systems, control panels, and preventative maintenance.",
      },
      {
        q: "Do you do high-voltage work?",
        a: "Yes. Our certified technicians deliver high-voltage services for industrial and large-scale systems — transformers, switchgear and heavy-duty equipment wiring — managed with safety and precision at every step.",
      },
      {
        q: "Are you licensed and insured for industrial projects?",
        a: "Yes — Show Me Electrical is fully licensed, insured and bonded to handle residential, commercial and industrial electrical projects, so the work is safe, code-compliant and backed by proper certifications and liability coverage.",
      },
      {
        q: "Who leads the work?",
        a: "Show Me Electrical is owner-led. Dan, the Master Electrician behind the name, leads every project with over two decades of experience across residential, commercial and industrial systems.",
      },
      {
        q: "Do you offer preventative maintenance for industrial systems?",
        a: "Yes. Preventative industrial maintenance — inspecting and correcting electrical systems before a fault causes downtime — is one of our core industrial services.",
      },
      {
        q: "Do you offer emergency service for industrial facilities?",
        a: "Yes. If your facility has an electrical emergency, call to discuss the problem and current availability.",
      },
      {
        q: "Which areas do you serve?",
        a: "Industrial facilities across the Greater St. Louis area — St. Louis City and St. Louis County, plus St. Charles, Jefferson, Franklin, Warren and Lincoln Counties.",
      },
    ],
  },

  related: {
    heading: "Related",
    links: [
      {
        label: "Talk to us about your facility",
        href: "/contact",
        description: "Call or send the details — we'll come back with a clear scope.",
      },
      {
        label: "Commercial electrical",
        href: "/services/commercial",
        description: "Build-outs, lighting retrofits, panel and service upgrades, inspections.",
      },
      {
        label: "Service area",
        href: "/#service-area",
        description: "St. Louis City and County and the surrounding counties.",
      },
    ],
  },

  cta: {
    heading: "Talk to us about your facility",
    body: "A free consultation, a clear scope, and work managed with safety and precision at every step. Call, or send us the details.",
  },

  sections: ["hero", "trust", "services", "process", "faqs", "related", "cta"],
};
