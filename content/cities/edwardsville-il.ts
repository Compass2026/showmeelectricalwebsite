import type { CityPageContent } from "./types";
import { site } from "@/config/site.config";
import { processSteps } from "@/content/shared";

/**
 * EDWARDSVILLE, ILLINOIS — served-city page (page plan §4, Tier 2).
 *
 * The representative served-city page for the Compass template (Batch B).
 * Chosen because its local facts are genuinely distinctive and fully
 * sourced: Edwardsville is one of exactly two Illinois communities the
 * owner confirmed (decision D-003, 2026-09-19), served across the river
 * from the shop in Affton, Missouri, with no Illinois office.
 *
 * PROVENANCE:
 *  - Coverage, "these two cities only", no wider Metro East: D-003.
 *  - Shop address: D-005 (config/site.config.ts).
 *  - Work types, owner-led, free consultation, process: live site / shared.
 *  - Emergency wording: D-001 (service named; no hours or response claims).
 *
 * DELIBERATELY ABSENT — not sourced, so not stated: an Edwardsville
 * office, travel charges, utility or permit specifics, project examples,
 * landmarks, response times. The hero photo is the client's own service
 * entrance job; its alt describes the frame and claims no location.
 */
const address = `${site.address.street}, ${site.address.city}, ${site.address.state} ${site.address.zip}`;

export const edwardsvilleIl: CityPageContent = {
  slug: "edwardsville-il",
  path: "/service-area/edwardsville-il",
  city: "Edwardsville",
  state: "Illinois",
  stateCode: "IL",

  seo: {
    title: "Electrician in Edwardsville, IL | Show Me Electrical",
    description:
      "Show Me Electrical serves Edwardsville, IL from its Affton, MO shop — residential, commercial and industrial electrical work. Free consultation.",
    keyword: "electrician edwardsville il",
    image: "/photos/service-entrance.webp",
  },

  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Service Area", href: "/service-area" },
    { label: "Edwardsville, IL" },
  ],

  hero: {
    eyebrow: "Service area · Illinois",
    headline: "Electrician Serving Edwardsville, IL",
    intro:
      "Yes — Edwardsville is one of two Illinois communities Show Me Electrical serves, along with Belleville. Every job is run from our shop in Affton, Missouri; there is no Edwardsville office. Homes, businesses and industrial facilities alike.",
    image: {
      src: "/photos/service-entrance.webp",
      alt: "New electrical service on the exterior of a block building: four conduit risers feeding a stainless-steel cabinet and a meter",
    },
  },

  facts: {
    eyebrow: "The short version",
    heading: "Edwardsville, at a glance",
    intro: "The facts a visitor — or an assistant working on their behalf — needs before calling.",
    items: [
      { label: "Served", value: "Yes — Edwardsville, Illinois." },
      { label: "Office in Edwardsville", value: `No. Every job is run from the shop at ${address}.` },
      { label: "Other Illinois coverage", value: "Belleville only. Elsewhere in Illinois: call and ask." },
      { label: "Work types", value: "Residential, commercial and industrial electrical work." },
      { label: "Emergency electrical repairs", value: "Offered. Call to discuss the problem and current availability." },
      { label: "Consultation", value: "Free. A clear scope before any work starts." },
      { label: "Phone", value: site.phone },
    ],
  },

  services: {
    eyebrow: "Services",
    heading: "What we do in Edwardsville",
    intro:
      "The same three kinds of work as everywhere else we serve. Each page lists the services, the problems they solve and the questions people ask.",
    paths: [
      "/services/residential",
      "/services/residential/electrical-panel-upgrades",
      "/services/commercial",
      "/services/industrial",
    ],
  },

  context: {
    eyebrow: "Across the river",
    heading: "What serving Edwardsville from Affton means",
    body: [
      {
        type: "p",
        text: [
          "Show Me Electrical is based in Affton, in St. Louis County, and crosses the river for work in Edwardsville and Belleville. Those are the only two Illinois communities we serve — not the wider Metro East. If you're elsewhere in Illinois, ",
          { type: "link", text: "call and we'll tell you straight", href: "/contact" },
          ".",
        ],
      },
      {
        type: "p",
        text: [
          "Everything else about the work is the same as on the Missouri side: the same owner leads every job, the same three steps from ",
          { type: "link", text: "free consultation to power-on", href: "/#process" },
          ", and the same standard of code-compliant work. See the full ",
          { type: "link", text: "service area", href: "/service-area" },
          " for the Missouri counties and communities.",
        ],
      },
    ],
  },

  process: {
    eyebrow: "How it's arranged",
    heading: "How a job in Edwardsville runs",
    intro: "Three steps, from the first free consultation to the moment the power comes on.",
    steps: processSteps,
  },

  faqs: {
    eyebrow: "Questions",
    heading: "Questions about Edwardsville",
    items: [
      {
        q: "Is there a Show Me Electrical office in Edwardsville?",
        a: `No. Our shop is at ${address}, in St. Louis County, and every Edwardsville job is run from there.`,
      },
      {
        q: "Do you serve other towns in Illinois?",
        a: "Belleville, and that's the list for now. If you're elsewhere in Illinois, call and we'll tell you straight.",
      },
      {
        q: "What kind of work do you do in Edwardsville?",
        a: "Residential, commercial and industrial electrical work — the same three pathways as everywhere we serve, led by the same owner.",
      },
      {
        q: "Do you offer emergency electrical repairs in Edwardsville?",
        a: "Yes. If you have an electrical emergency, call to discuss the problem and current availability.",
      },
    ],
  },

  related: {
    heading: "Related",
    links: [
      {
        label: "Full service area",
        href: "/service-area",
        description: "St. Louis City and County, five more Missouri counties, and two Illinois communities.",
      },
      {
        label: "All services",
        href: "/services",
        description: "The full directory, by pathway.",
      },
      {
        label: "Get a free quote",
        href: "/contact",
        description: "Call, email or send project details — we'll get you on the schedule.",
      },
    ],
  },

  cta: {
    heading: "In Edwardsville? Let's talk.",
    body: "Free consultation, straight answers and a clear scope before any work starts. Call, or send us the details and we'll get you on the schedule.",
  },

  sections: ["hero", "facts", "services", "context", "process", "faqs", "related", "cta"],
};
