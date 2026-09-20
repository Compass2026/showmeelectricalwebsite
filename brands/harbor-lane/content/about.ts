import type { Crumb, Faq, Photo, RelatedLink } from "@/content/services/types";

const placeholder = (what: string): Photo => ({ src: "/demo/placeholder-hero.svg", alt: `Placeholder graphic (${what}); this fictional brand has no photography` });

/** ABOUT — Harbor Lane (fictional demo). */
export const about = {
  path: "/about",
  seo: {
    title: "About Harbor Lane Plumbing (Fictional Demo)",
    description: "Fictional demo: Harbor Lane Plumbing is an owner-led, two-branch plumbing company serving Exampleton and Harbor County.",
    image: "/demo/placeholder-1200x630.png",
  },
  breadcrumbs: [{ label: "Home", href: "/" }, { label: "About" }] as Crumb[],
  hero: {
    eyebrow: "About",
    headline: "About Harbor Lane Plumbing",
    intro: "An owner-led plumbing company with two branches in Exampleton. Fictional — a demonstration of the Compass website system.",
    image: placeholder("about hero"),
  },
  story: {
    eyebrow: "Priya's story",
    heading: "One van, then a counter, then a second branch",
    paragraphs: [
      "Priya Example started Harbor Lane with one van and the Eastgate parts counter. Customers on the north side kept asking for a nearer base, so the Westfield branch opened with its own counter and dispatch.",
      "Every fact on this site is invented for demonstration. What is real is the structure: how an owner story, verified trust points, two branches and a served city are presented without inventing claims a real client could not back.",
    ],
    image: placeholder("owner at the counter"),
  },
  values: {
    eyebrow: "How we work",
    heading: "What working with Harbor Lane looks like",
    intro: "Four things every customer gets, whatever the size of the job.",
    items: [
      { title: "A walkthrough first", body: "We look before we quote. The quote is written, and it's free." },
      { title: "Parts from the counter", body: "Both branches keep a parts counter, so the fix rarely waits on a supplier." },
      { title: "Tested before we leave", body: "Pressure-tested and explained, with what to watch for written down." },
      { title: "The nearer branch", body: "North side from Westfield, south side from Eastgate. Same standard from both." },
    ],
  },
  trust: { eyebrow: "The facts", heading: "What backs the work" },
  testimonials: { eyebrow: "Client feedback", heading: "What customers say", intro: "" },
  pathways: {
    eyebrow: "What we do",
    heading: "Two pathways",
    links: [
      { label: "Residential plumbing", href: "/services/residential", description: "Water heaters, drains, repiping, leak repair." },
      { label: "Commercial plumbing", href: "/services/commercial", description: "Backflow, grease traps, fixtures for small businesses." },
      { label: "Our branches", href: "/locations", description: "Westfield and Eastgate: hours, access and parts counters." },
      { label: "Contact", href: "/contact", description: "Book a free walkthrough." },
    ] as RelatedLink[],
  },
  faqs: {
    eyebrow: "Questions",
    heading: "Questions people ask",
    items: [
      { q: "Is Harbor Lane Plumbing a real company?", a: "No. It is a fictional demonstration brand for the Compass website system. Nothing on this site is real." },
      { q: "Which branch should I contact?", a: "Westfield for the north side of Exampleton and Northgate; Eastgate for the south side. If you are not sure, call the main number and the office will route you." },
      { q: "Do you charge for a walkthrough?", a: "No. Every job starts with a free walkthrough and a written quote." },
    ] as Faq[],
  },
  cta: { heading: "Ready when you are", body: "Send the details or call either branch. A free walkthrough comes first." },
};
