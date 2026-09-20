import type { ServicePageContent } from "@/content/services/types";
import { trustPoints, processSteps } from "../shared";

/** WATER HEATER REPLACEMENT — individual service page beneath the residential hub (fictional demo). */
export const waterHeaterReplacement: ServicePageContent = {
  slug: "water-heater-replacement",
  path: "/services/residential/water-heater-replacement",
  parent: "/services/residential",
  seo: {
    title: "Water Heater Replacement Exampleton | Harbor Lane (Demo)",
    description: "Fictional demo: tank and tankless water heater replacement in Exampleton, sized for the household after a free walkthrough.",
    keyword: "water heater replacement exampleton",
    supporting: [],
    image: "/demo/placeholder-1200x630.png",
  },
  schema: { name: "Water Heater Replacement", serviceType: "Water heater replacement" },
  breadcrumbs: [{ label: "Home", href: "/" }, { label: "Residential Plumbing", href: "/services/residential" }, { label: "Water Heater Replacement" }],
  directory: { title: "Water Heater Replacement", summary: "Tank and tankless units, sized for the household after a walkthrough." },
  hero: {
    eyebrow: "Residential · Water heaters",
    headline: "Water Heater Replacement in Exampleton",
    intro: "No hot water, rusty water or a tank past its useful life are the reasons people call. We assess the heater and the venting first, then recommend a tank or tankless unit sized for the household.",
    image: { src: "/demo/placeholder-hero.svg", alt: "Placeholder graphic (water heater); this fictional brand has no photography" },
  },
  services: {
    eyebrow: "When it helps",
    heading: "When replacement is the answer — and when it isn't",
    items: [
      { name: "No hot water, or not enough", problem: "The shower runs cold halfway through, or the tank cannot keep up with the household.", solution: "We check the element, thermostat and tank before recommending replacement; where the tank is undersized or failing, a correctly sized unit." },
      { name: "Rusty or smelly water", problem: "Discoloured hot water, or a rotten-egg smell from the hot taps only.", solution: "Often the anode rod, sometimes the tank. We tell you which." },
      { name: "A leak at the tank", problem: "Water pooling under the heater.", solution: "A leaking tank is replaced; a leaking fitting is repaired. We say which it is." },
    ],
  },
  trust: { eyebrow: "Why us", heading: "Who does the work, and what backs it", points: trustPoints },
  process: { eyebrow: "How a job runs", heading: "Look, fix, test", steps: processSteps },
  faqs: {
    eyebrow: "Questions",
    heading: "Questions about water heaters",
    items: [
      { q: "Tank or tankless?", a: "Depends on the household, the gas or electric supply and the venting. The walkthrough answers it; we do not pick before looking." },
      { q: "Which branch handles it?", a: "Either. The office routes you to the nearer one." },
    ],
  },
  related: {
    heading: "Related",
    links: [
      { label: "All residential services", href: "/services/residential", description: "Drains, repiping, leak repair." },
      { label: "Book a free walkthrough", href: "/contact", description: "Send the details or call the office." },
    ],
  },
  cta: { heading: "Think the heater is done?", body: "A free walkthrough, a written quote, then the work." },
  sections: ["hero", "services", "trust", "process", "faqs", "related", "cta"],
};
