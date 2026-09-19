import type { Crumb, Faq, Photo, RelatedLink } from "./services/types";
import { processSteps } from "./shared";

/**
 * SERVICES DIRECTORY — /services
 *
 * The three pathway cards and the full list of offerings are NOT written
 * here: they are read from `content/services/index.ts`, the registry of
 * implemented service pages, so the directory can never link to a page that
 * does not exist and never lists a service the hub pages don't. What lives
 * here is only the page's own copy — hero, FAQs, CTA.
 *
 * Keyword: "electrical contractor st louis" (page plan §1, services hub;
 * supporting term for the homepage's "electrician st louis").
 */
export const servicesDirectory = {
  path: "/services",

  seo: {
    title: "Electrical Services in St. Louis, MO | Show Me Electrical",
    description:
      "Residential, commercial and industrial electrical services across the St. Louis area from one owner-led contractor. Free consultation.",
    image: "/photos/commercial-panels.webp",
  },

  breadcrumbs: [{ label: "Home", href: "/" }, { label: "Services" }] as Crumb[],

  hero: {
    eyebrow: "Services",
    headline: "Electrical Services in St. Louis, MO",
    intro:
      "Residential, commercial and industrial electrical work from one owner-led contractor. Pick the page that matches your space — each one lists the services, the problems they solve, and straight answers to the questions people ask.",
    image: {
      src: "/photos/commercial-panels.webp",
      alt: "Four wall-mounted stainless-steel units with flue pipes on a white brick wall in a commercial space, each wired through conduit to a junction box",
    } as Photo,
  },

  pathways: {
    eyebrow: "Three pathways",
    heading: "Which space are we working in?",
    intro:
      "Every service below belongs to one of these three. Each page goes into the detail.",
  },

  catalog: {
    eyebrow: "The full list",
    heading: "Every service, by pathway",
    intro:
      "Twenty-two services across the three pathways, each described on its pathway page.",
  },

  process: {
    eyebrow: "Our process",
    heading: "How every job runs",
    intro: "Plan, install, power on — the same three steps whatever the space.",
    steps: processSteps,
  },

  faqs: {
    eyebrow: "Questions",
    heading: "Questions about our services",
    items: [
      {
        q: "Do you handle residential, commercial and industrial work?",
        a: "Yes — all three. Each has its own page above describing the services, the problems they solve and the questions people ask, and the same owner leads the work on every one.",
      },
      {
        q: "I'm not sure which page I need.",
        a: "A house, condo or apartment is residential. A shop, office, restaurant or warehouse is commercial. A plant, facility or anything with switchgear, machinery hookups or power distribution is industrial. If it's still unclear, call — a free consultation sorts it out in minutes.",
      },
      {
        q: "Do you offer emergency electrical repairs?",
        a: "Yes. If you have an electrical emergency, call to discuss the problem and current availability.",
      },
      {
        q: "Are you licensed and insured?",
        a: "Yes — Show Me Electrical is fully licensed, insured and bonded to handle residential, commercial and industrial electrical projects, so the work is safe, code-compliant and backed by proper certifications and liability coverage.",
      },
      {
        q: "Is the consultation really free?",
        a: "Yes. Every job starts with a free consultation. We review the project, answer your questions and give you a clear scope before any work starts — no strings attached.",
      },
    ] as Faq[],
  },

  related: {
    heading: "Related",
    links: [
      {
        label: "Get a free quote",
        href: "/contact",
        description: "Call, email or send project details — we'll get you on the schedule.",
      },
      {
        label: "Service area",
        href: "/service-area",
        description: "The counties and communities we work in.",
      },
      {
        label: "Meet the owner",
        href: "/about",
        description: "Dan, the Master Electrician behind the name.",
      },
    ] as RelatedLink[],
  },

  cta: {
    heading: "Ready to talk about your project?",
    body: "Free consultation, straight answers and a clear scope before any work starts. Call, or send us the details and we'll get you on the schedule.",
  },
};
