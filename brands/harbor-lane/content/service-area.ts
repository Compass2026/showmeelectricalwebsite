import type { Crumb, Faq, Photo, RelatedLink } from "@/content/services/types";
import type { CoverageGroup, Community } from "@/content/service-area";

export type { CoverageGroup, Community };

/** SERVICE AREA — Harbor Lane (fictional demo). Northgate links to its city page; other names stay text. */
export const serviceArea = {
  path: "/service-area",
  seo: {
    title: "Where We Work | Harbor Lane Plumbing (Fictional Demo)",
    description: "Fictional demo: Harbor Lane serves Exampleton and Harbor County from the Westfield (north) and Eastgate (south) branches.",
    image: "/demo/placeholder-1200x630.png",
  },
  breadcrumbs: [{ label: "Home", href: "/" }, { label: "Where we work" }] as Crumb[],
  hero: {
    eyebrow: "Where we work",
    headline: "Serving Exampleton and Harbor County",
    intro: "North side from Westfield, south side from Eastgate. Northgate is served from Westfield — there is no Northgate office.",
    image: { src: "/demo/placeholder-hero.svg", alt: "Placeholder graphic (service area); this fictional brand has no photography" } as Photo,
  },
  coverage: {
    eyebrow: "By branch",
    heading: "Are we in your area?",
    intro: "Find your area below. A community with its own page is linked; the rest are named so you know we come out.",
    groups: [
      { name: "North Exampleton", note: "Dispatched from the Westfield branch.", communities: ["Westfield", { name: "Northgate", page: "northgate" }, "Millbrook"] },
      { name: "South Exampleton", note: "Dispatched from the Eastgate branch (head office).", communities: ["Eastgate", "Riverside", "Old Town"] },
      { name: "Harbor County townships", note: "Whichever branch is nearer.", communities: [] },
    ] as CoverageGroup[],
    fallback: { text: "Not sure which branch covers you?", action: "Call and the office will route you." },
  },
  pathways: {
    eyebrow: "What we do here",
    heading: "The same two kinds of work, across the whole area",
    links: [
      { label: "Residential plumbing", href: "/services/residential", description: "Water heaters, drains, repiping, leak repair." },
      { label: "Commercial plumbing", href: "/services/commercial", description: "Backflow, grease traps, fixtures." },
      { label: "Our branches", href: "/locations", description: "Westfield and Eastgate: hours and access." },
    ] as RelatedLink[],
  },
  faqs: {
    eyebrow: "Questions",
    heading: "Questions about where we work",
    items: [
      { q: "Is there an office in Northgate?", a: "No. Northgate is served from the Westfield branch." },
      { q: "Where are the branches?", a: "Westfield at 200 Example Way and Eastgate (head office) at 100 Example Way, both in Exampleton. Fictional addresses." },
    ] as Faq[],
  },
  cta: { heading: "In the area? Let's talk.", body: "A free walkthrough, a written quote, then the work." },
};
