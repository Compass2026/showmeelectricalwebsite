import type { Crumb, Faq, Photo, RelatedLink } from "./services/types";
import { site } from "@/config/site.config";

/**
 * A county (or equivalent region) and the communities named within it.
 * Geography is data: another Compass client replaces this file and the
 * `CoverageGroups` component renders whatever it is given.
 */
export interface CoverageGroup {
  /** e.g. "St. Louis County" */
  name: string;
  /** Short qualifier shown under the name, e.g. "Home of our shop in Affton." */
  note?: string;
  /** Named communities. May be empty when only the county is verified. */
  communities: string[];
}

/**
 * SERVICE AREA — /service-area
 *
 * PROVENANCE — every geographic claim below has a client-owned source:
 *  - The seven counties: the approved brand board and the live /st-louis/
 *    page's "Areas we serve" list (config/site.config.ts `counties`).
 *  - "Greater St. Louis area": Tom's direction, 2026-09.
 *  - The shop in Affton: config address (street spelling still to confirm).
 *  - Named communities: the client-approved Service Taxonomy, Keyword Map &
 *    Tracked List v1.1 — its Tier-1 and Tier-2 Missouri cities. Which county
 *    each sits in is public geography, not a client claim.
 *  - "and surrounding communities": the client's own live footer wording.
 *
 * DELIBERATELY ABSENT — not invented:
 *  - Edwardsville and Belleville, Illinois. The keyword map lists them as
 *    Tier-2 targets, but every coverage statement the client publishes is
 *    Missouri-only. Flagged in docs/open-questions.md; omitted until Tom
 *    confirms Metro East coverage.
 *  - Any second office, project example, travel charge, response time or
 *    hard boundary. Counties without named communities show the county only.
 *  - A map embed, until the street address is confirmed.
 */
export const serviceArea = {
  path: "/service-area",

  seo: {
    title: "Service Area | Show Me Electrical — Greater St. Louis, MO",
    description:
      "Show Me Electrical serves St. Louis City and County, St. Charles, Jefferson, Franklin, Warren and Lincoln Counties from Affton. Not sure? Call us.",
    image: "/photos/service-entrance.webp",
  },

  breadcrumbs: [{ label: "Home", href: "/" }, { label: "Service Area" }] as Crumb[],

  hero: {
    eyebrow: "Where we work",
    headline: `Serving the ${site.serviceArea}`,
    intro:
      `Based in ${site.address.city} and working across the metro — St. Louis City and County, out through St. Charles, Jefferson, Franklin, Warren and Lincoln Counties. Homes, businesses and industrial facilities alike.`,
    image: {
      src: "/photos/service-entrance.webp",
      alt: "New electrical service on the exterior of a block building: four conduit risers feeding a stainless-steel cabinet and a meter",
    } as Photo,
  },

  coverage: {
    eyebrow: "Counties and communities",
    heading: "Are we in your area?",
    intro:
      "Find your county below. If your community isn't named, that doesn't mean no — the list names the places we're asked about most, and we work across each county and its surrounding communities.",
    groups: [
      {
        name: "St. Louis City",
        note: "The city itself, every neighborhood.",
        communities: ["St. Louis"],
      },
      {
        name: "St. Louis County",
        note: `Home of our shop in ${site.address.city}.`,
        communities: [
          "Affton",
          "Chesterfield",
          "Kirkwood",
          "Florissant",
          "Webster Groves",
          "Ballwin",
          "Ellisville",
          "Manchester",
          "Creve Coeur",
          "Clayton",
          "University City",
          "Maplewood",
          "Fenton",
        ],
      },
      {
        name: "St. Charles County",
        communities: ["St. Charles", "O'Fallon", "Wentzville", "St. Peters"],
      },
      {
        name: "Jefferson County",
        communities: ["Arnold"],
      },
      {
        name: "Franklin County",
        note: "The county and its communities.",
        communities: [],
      },
      {
        name: "Warren County",
        note: "The county and its communities.",
        communities: [],
      },
      {
        name: "Lincoln County",
        note: "The county and its communities.",
        communities: [],
      },
    ] as CoverageGroup[],
    /** Shown after the groups. Verified wording from the live homepage. */
    fallback: {
      text: "Not sure if you're in range?",
      action: "Call and we'll tell you straight.",
    },
  },

  pathways: {
    eyebrow: "What we do here",
    heading: "The same three kinds of work, across the whole area",
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
        label: "All services",
        href: "/services",
        description: "The full directory, by pathway.",
      },
    ] as RelatedLink[],
  },

  faqs: {
    eyebrow: "Questions",
    heading: "Questions about where we work",
    items: [
      {
        q: "Which counties do you serve?",
        a: "St. Louis City and St. Louis County, plus St. Charles, Jefferson, Franklin, Warren and Lincoln Counties — the Greater St. Louis area.",
      },
      {
        q: "My town isn't on the list. Do you still come out?",
        a: "Very possibly. The list names the communities we're asked about most, not a boundary. Call and we'll tell you straight.",
      },
      {
        q: "Where is your shop?",
        a: `${site.address.street}, ${site.address.city}, ${site.address.state} ${site.address.zip} — in St. Louis County. Every job across the area is run from here.`,
      },
      {
        q: "Do you take residential, commercial and industrial work everywhere in the area?",
        a: "Yes. Homes, businesses and industrial facilities across all seven counties, and the same owner leads the work on every one.",
      },
    ] as Faq[],
  },

  cta: {
    heading: "In the area? Let's talk.",
    body: "Free consultation, straight answers and a clear scope before any work starts. Call, or send us the details and we'll get you on the schedule.",
  },
};
