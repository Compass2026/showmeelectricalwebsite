import type { ServicePageContent } from "@/content/services/types";
import { trustPoints, processSteps } from "../shared";

const img = { src: "/demo/placeholder-hero.svg", alt: "Placeholder graphic (residential plumbing); this fictional brand has no photography" };

/** RESIDENTIAL PLUMBING hub — Harbor Lane (fictional demo). */
export const residential: ServicePageContent = {
  slug: "residential",
  path: "/services/residential",
  seo: {
    title: "Residential Plumber Exampleton | Harbor Lane (Fictional Demo)",
    description: "Fictional demo: water heaters, drain cleaning, repiping and leak repair for Exampleton homes, from Harbor Lane's two branches.",
    keyword: "plumber exampleton",
    supporting: ["water heater replacement exampleton", "drain cleaning exampleton"],
    image: "/demo/placeholder-1200x630.png",
  },
  schema: { name: "Residential Plumbing Services", serviceType: "Residential plumber" },
  breadcrumbs: [{ label: "Home", href: "/" }, { label: "Residential Plumbing" }],
  directory: { title: "Residential", summary: "Water heaters, drains, repiping and leak repair for houses, condos and apartments." },
  hero: {
    eyebrow: "Residential plumbing",
    headline: "Residential Plumber in Exampleton",
    intro: "Water heaters, drains, repiping and the leaks that wake you at night — for houses, condos and apartments across Exampleton and Harbor County. A free walkthrough first.",
    image: img,
  },
  services: {
    eyebrow: "Services",
    heading: "What we do in homes — and the problems it solves",
    items: [
      { name: "Water Heater Replacement", problem: "No hot water, rusty water, or a tank that is older than the house's last paint job.", solution: "We assess the heater and the venting, then replace it with a tank or tankless unit sized for the household.", href: "/services/residential/water-heater-replacement" },
      { name: "Drain Cleaning", problem: "A slow sink, a shower that pools, or a main line that backs up when the washer drains.", solution: "We clear the line and, if it keeps recurring, find out why rather than clearing it again next month." },
      { name: "Repiping", problem: "Low pressure everywhere, discoloured water, or a house with the original galvanised pipe.", solution: "Partial or whole-house repiping, planned around your rooms and scheduled so you are never without water overnight." },
      { name: "Leak Repair", problem: "A stain on the ceiling, a meter that turns when everything is off, or a damp cabinet floor.", solution: "We find the leak — not just the wet spot — and repair the cause." },
    ],
  },
  trust: { eyebrow: "Why us", heading: "Who does the work, and what backs it", points: trustPoints },
  process: { eyebrow: "How a job runs", heading: "Look, fix, test", steps: processSteps },
  faqs: {
    eyebrow: "Questions",
    heading: "Questions homeowners ask",
    items: [
      { q: "Which branch will come out?", a: "Westfield for the north side of Exampleton and Northgate; Eastgate for the south side. The office routes your call." },
      { q: "Do you charge for a walkthrough?", a: "No. Every job starts with a free walkthrough and a written quote." },
      { q: "Do you offer emergency service?", a: "Not as a service line. During regular hours call the office; outside them, this fictional brand makes no availability promise." },
    ],
  },
  related: {
    heading: "Related",
    links: [
      { label: "Book a free walkthrough", href: "/contact", description: "Send the details or call the office." },
      { label: "Northgate", href: "/service-area/northgate", description: "Served from the Westfield branch; no Northgate office." },
      { label: "Our branches", href: "/locations", description: "Hours, access and parts counters." },
    ],
  },
  cta: { heading: "Ready to talk about your home?", body: "A free walkthrough, a written quote, then the work." },
  sections: ["hero", "services", "trust", "process", "faqs", "related", "cta"],
};
