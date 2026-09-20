import type { Crumb, Faq, Photo, RelatedLink } from "@/content/services/types";
import { processSteps } from "./shared";

/** SERVICES DIRECTORY — Harbor Lane (fictional demo). Cards and catalog come from the registry. */
export const servicesDirectory = {
  path: "/services",
  seo: {
    title: "Plumbing Services in Exampleton | Harbor Lane (Fictional Demo)",
    description: "Fictional demo: residential and commercial plumbing from Harbor Lane's two Exampleton branches. Free walkthrough first.",
    image: "/demo/placeholder-1200x630.png",
  },
  breadcrumbs: [{ label: "Home", href: "/" }, { label: "Services" }] as Crumb[],
  hero: {
    eyebrow: "Services",
    headline: "Plumbing services in Exampleton",
    intro: "Residential and commercial work from two branches. Pick the pathway that matches your building; each page lists the services and the questions people ask.",
    image: { src: "/demo/placeholder-hero.svg", alt: "Placeholder graphic (services hero); this fictional brand has no photography" } as Photo,
  },
  pathways: { eyebrow: "Two pathways", heading: "Which building are we working in?", intro: "Every service below belongs to one of these two." },
  catalog: { eyebrow: "The full list", heading: "Every service, by pathway", intro: "Each described on its pathway page." },
  process: { eyebrow: "How a job runs", heading: "Look, fix, test", intro: "The same three steps whatever the building.", steps: processSteps },
  faqs: {
    eyebrow: "Questions",
    heading: "Questions about our services",
    items: [
      { q: "Do you do both residential and commercial work?", a: "Yes — both pathways, from both branches." },
      { q: "Is the walkthrough really free?", a: "Yes. We look, explain and quote in writing before any work starts." },
    ] as Faq[],
  },
  related: {
    heading: "Related",
    links: [
      { label: "Book a free walkthrough", href: "/contact", description: "Send the details or call the office." },
      { label: "Where we work", href: "/service-area", description: "Exampleton and Harbor County, by branch." },
      { label: "Our branches", href: "/locations", description: "Hours, access and parts counters." },
    ] as RelatedLink[],
  },
  cta: { heading: "Ready to talk about the job?", body: "A free walkthrough, a written quote, then the work." },
};
