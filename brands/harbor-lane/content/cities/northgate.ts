import type { CityPageContent } from "@/content/cities/types";
import { processSteps } from "../shared";

/** NORTHGATE — served-city page (fictional demo). A served city, not an office: the distinction the template exists to make. */
export const northgate: CityPageContent = {
  slug: "northgate",
  path: "/service-area/northgate",
  city: "Northgate",
  state: "Example State",
  stateCode: "XX",
  seo: {
    title: "Plumber in Northgate | Harbor Lane (Fictional Demo)",
    description: "Fictional demo: Harbor Lane serves Northgate from its Westfield branch — residential and commercial plumbing. No Northgate office.",
    image: "/demo/placeholder-1200x630.png",
  },
  breadcrumbs: [{ label: "Home", href: "/" }, { label: "Where we work", href: "/service-area" }, { label: "Northgate" }],
  hero: {
    eyebrow: "Where we work · Northgate",
    headline: "Plumber Serving Northgate",
    intro: "Yes — Northgate is served, from the Westfield branch about ten minutes down Example Way. There is no Northgate office. Homes and small businesses alike.",
    image: { src: "/demo/placeholder-hero.svg", alt: "Placeholder graphic (Northgate); this fictional brand has no photography" },
  },
  facts: {
    eyebrow: "The short version",
    heading: "Northgate, at a glance",
    items: [
      { label: "Served", value: "Yes — Northgate." },
      { label: "Office in Northgate", value: "No. Jobs are dispatched from the Westfield branch, 200 Example Way, Exampleton." },
      { label: "Work types", value: "Residential and commercial plumbing." },
      { label: "Backflow testing", value: "Handled by the Eastgate branch, which also covers Northgate for that service." },
      { label: "Phone", value: "(555) 010-0199 (office) or (555) 010-0100 (Westfield)" },
    ],
  },
  services: {
    eyebrow: "Services",
    heading: "What we do in Northgate",
    paths: ["/services/residential", "/services/residential/water-heater-replacement", "/services/commercial"],
  },
  context: {
    eyebrow: "From Westfield",
    heading: "What serving Northgate from Westfield means",
    body: [
      { type: "p", text: ["Northgate is the northern edge of the Westfield branch's patch. Parts come from the ", { type: "link", text: "Westfield counter", href: "/locations/westfield" }, ", and the same crew that covers North Exampleton covers Northgate."] },
      { type: "p", text: "This page is part of a fictional demonstration. It exists to show how a served city is presented differently from a physical branch: no address, no hours, no visit — just who serves it, from where, and which services are confirmed." },
    ],
  },
  process: { eyebrow: "How it's arranged", heading: "How a job in Northgate runs", steps: processSteps },
  faqs: {
    eyebrow: "Questions",
    heading: "Questions about Northgate",
    items: [
      { q: "Is there a Harbor Lane office in Northgate?", a: "No. Northgate is served from the Westfield branch at 200 Example Way, Exampleton." },
      { q: "Do you serve towns beyond Northgate?", a: "Harbor County townships, from whichever branch is nearer. Call and ask." },
    ],
  },
  related: {
    heading: "Related",
    links: [
      { label: "Westfield branch", href: "/locations/westfield", description: "The branch that serves Northgate: hours, access, parts counter." },
      { label: "Where we work", href: "/service-area", description: "The whole area, by branch." },
      { label: "Book a free walkthrough", href: "/contact", description: "Send the details or call the office." },
    ],
  },
  cta: { heading: "In Northgate? Let's talk.", body: "A free walkthrough, a written quote, then the work." },
  sections: ["hero", "facts", "services", "context", "process", "faqs", "related", "cta"],
};
