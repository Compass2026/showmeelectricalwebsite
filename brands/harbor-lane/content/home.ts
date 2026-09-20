import type { StoryStage } from "@/components/motion/ScrollStory";
import { processSteps } from "./shared";

/** HOMEPAGE — Harbor Lane (fictional demo). Placeholder graphics stand in for photography. */
const placeholder = (what: string) => ({ src: "/demo/placeholder-hero.svg", alt: `Placeholder graphic (${what}); this fictional brand has no photography` });

export const homePage = {
  seo: {
    title: "Plumber in Exampleton | Harbor Lane Plumbing (Fictional Demo)",
    description: "Fictional demo: Harbor Lane Plumbing serves Exampleton and Harbor County from two branches — water heaters, drains, repiping and leak repair for homes and small businesses.",
  },
  services: {
    eyebrow: "What we do",
    heading: "Plumbing for homes and small businesses",
    intro: "Two pathways, one standard. Dispatched from whichever branch is nearer.",
    more: { label: "See every service", href: "/services" },
    callLabel: "Call",
  },
  process: { eyebrow: "How a job runs", heading: "Look, fix, test", intro: "From the free walkthrough to the pressure test — here is how the work runs." },
  about: { eyebrow: "Meet the owner", cta: { label: "More about Priya", href: "/about" } },
  testimonials: { eyebrow: "Client feedback", heading: "What customers say", intro: "" },
  area: {
    eyebrow: "Where we work",
    heading: "Serving Exampleton and Harbor County",
    intro: "Two branches: Westfield covers the north side, Eastgate the south. Northgate is served from Westfield; there is no Northgate office.",
    fallback: { text: "Not sure which branch covers you?", callLabel: "Call", action: "and the office will route you." },
    more: { label: "Full service area", href: "/service-area" },
  },
  finalCta: {
    heading: "Got a plumbing problem, or a plan?",
    body: "A free walkthrough, a clear quote, and the work done to code. Send the details or call either branch.",
    careers: null as { text: string; label: string } | null,
  },
};

export const hero = {
  eyebrow: "Residential · Commercial",
  headline: "Plumbing done properly,",
  headlineAccent: "from two local branches.",
  body: "Fictional demonstration brand. Water heaters, drains, repiping and leak repair for Exampleton homes and small businesses — a free walkthrough first, a clear quote, then the work.",
  image: placeholder("hero"),
};

export { trustPoints } from "./shared";

export const servicePathways: { slug: string; title: string; summary: string; examples: string[]; image: { src: string; alt: string }; href?: string }[] = [
  {
    slug: "residential",
    title: "Residential",
    summary: "Water heaters, drains, repiping and the leaks that wake you at night — for houses, condos and apartments.",
    examples: ["Water heater replacement", "Drain cleaning", "Repiping", "Leak repair"],
    image: placeholder("residential pathway"),
    href: "/services/residential",
  },
  {
    slug: "commercial",
    title: "Commercial",
    summary: "Restaurants, shops and small offices: grease traps, backflow, fixture counts and the fixes that keep you open.",
    examples: ["Backflow testing", "Grease trap service", "Fixture installation"],
    image: placeholder("commercial pathway"),
    href: "/services/commercial",
  },
];

/** Not offered by this brand (site.offersEmergencyService = false), so never rendered. */
export const emergencyCallout = { heading: "", body: "" };

export const storyStages: StoryStage[] = processSteps.map((step, i) => ({ ...step, image: placeholder(`process step ${i + 1}`) }));

export const about = {
  heading: "Run by a plumber, not a call centre",
  paragraphs: [
    "Priya Example started Harbor Lane with one van and the Eastgate counter. The Westfield branch came later, when the north side of Exampleton needed a nearer base. She still takes service calls.",
    "This is a fictional demonstration brand: the people, branches and facts here exist only to show how the Compass website system presents a real multi-location company.",
  ],
  image: placeholder("owner portrait"),
};

/** No testimonials: a fictional brand invents no reviews, and the section hides when empty. */
export const testimonials: { quote: string; name: string; role?: string; source?: string }[] = [];
