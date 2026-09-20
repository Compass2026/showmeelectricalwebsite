import type { ServicePageContent } from "@/content/services/types";
import { trustPoints, processSteps } from "../shared";

const img = { src: "/demo/placeholder-hero.svg", alt: "Placeholder graphic (commercial plumbing); this fictional brand has no photography" };

/** COMMERCIAL PLUMBING hub — Harbor Lane (fictional demo). */
export const commercial: ServicePageContent = {
  slug: "commercial",
  path: "/services/commercial",
  seo: {
    title: "Commercial Plumber Exampleton | Harbor Lane (Fictional Demo)",
    description: "Fictional demo: backflow testing, grease trap service and fixture installation for Exampleton restaurants, shops and offices.",
    keyword: "commercial plumber exampleton",
    supporting: ["backflow testing exampleton"],
    image: "/demo/placeholder-1200x630.png",
  },
  schema: { name: "Commercial Plumbing Services", serviceType: "Commercial plumber" },
  breadcrumbs: [{ label: "Home", href: "/" }, { label: "Commercial Plumbing" }],
  directory: { title: "Commercial", summary: "Backflow, grease traps and fixtures for restaurants, shops and small offices." },
  hero: {
    eyebrow: "Commercial plumbing",
    headline: "Commercial Plumber in Exampleton",
    intro: "Restaurants, shops and small offices: the tests the inspector asks for and the fixes that keep you open. Backflow testing is handled by the Eastgate branch.",
    image: img,
  },
  services: {
    eyebrow: "Services",
    heading: "What we do for small businesses",
    items: [
      { name: "Backflow Testing", problem: "The annual test notice arrived and the device has never been looked at.", solution: "Testing and certification by the Eastgate branch, with the paperwork filed." },
      { name: "Grease Trap Service", problem: "Slow kitchen drains and a trap nobody wants to open.", solution: "Scheduled service and repairs, timed around your opening hours." },
      { name: "Fixture Installation", problem: "A fit-out that needs sinks, toilets and drinking fountains where none exist.", solution: "Rough-in and finish plumbing coordinated with your contractor." },
    ],
  },
  trust: { eyebrow: "Why us", heading: "Who does the work, and what backs it", points: trustPoints },
  process: { eyebrow: "How a job runs", heading: "Look, fix, test", steps: processSteps },
  faqs: {
    eyebrow: "Questions",
    heading: "Questions businesses ask",
    items: [
      { q: "Does the Westfield branch do backflow testing?", a: "No. Backflow testing is handled by the Eastgate branch." },
      { q: "Can you work outside our opening hours?", a: "For scheduled service we try to. This fictional brand makes no round-the-clock promise." },
    ],
  },
  related: {
    heading: "Related",
    links: [
      { label: "Book a free walkthrough", href: "/contact", description: "Send the details or call the office." },
      { label: "Eastgate branch", href: "/locations/eastgate", description: "Head office and the backflow team." },
    ],
  },
  cta: { heading: "Ready to talk about your premises?", body: "A free walkthrough, a written quote, then the work." },
  sections: ["hero", "services", "trust", "process", "faqs", "related", "cta"],
};
