import type { ServicePageContent } from "@/content/services/types";
import { trustPoints, processSteps } from "@/content/shared";

/**
 * CIRCUIT BREAKER REPAIR & REPLACEMENT — individual service page.
 *
 * Taxonomy entry #4 (residential), page plan §3. Built on the panel-upgrade
 * page's pattern: direct answer first, the situations people call about,
 * process, questions, related pages. Route shape `/services/{hub}/{slug}`
 * as recorded in the Compass CRM (Foundation route), which differs from the
 * page plan's earlier proposed slug `circuit-breaker-replacement` — the plan
 * now records the built URL.
 *
 * Keywords (Compass CRM): "circuit breaker repair st louis" (primary),
 * "circuit breaker replacement st louis", "why does my circuit breaker keep
 * tripping" (answered first in the hero and as the first FAQ).
 *
 * PROVENANCE — every sentence derives from:
 *  - copy already approved on the residential hub (content/services/
 *    residential.ts): the circuit-breaker and panel-upgrade items and the
 *    "My breaker keeps tripping" FAQ;
 *  - the owner claim recorded in the Compass CRM from the client's own site:
 *    "Dan is the owner and the Master Electrician on every job — no sales
 *    rep, no middle man" (Master Electrician also per decision D-002);
 *  - the copy guidance Compass reviewed for this page (a breaker that keeps
 *    tripping is doing its job; find the cause rather than resetting it;
 *    check the breaker's type and rating for its circuit);
 *  - two public sources, cited on the page: CPSC "Home Wiring Hazards"
 *    (quoted verbatim) and the NFPA Educational Messages Desk Reference
 *    (characterised, not quoted).
 *
 * DELIBERATELY ABSENT — prices, how long a repair takes, brands, amperage
 * figures, response times or hours (decision D-001), years in business,
 * and no new credential claims: the trust strip carries only the
 * Master Electrician (D-002) and free-consultation points, not the shared
 * "licensed, insured & bonded" or "20+ years" items, which stay where they
 * already are. The client's library has no photograph of a breaker or a
 * residential panel; the hero reuses the client's own finished-kitchen
 * photo (a kitchen's appliances are the everyday load this page talks
 * about) with alt text that describes exactly what is in frame.
 */
export const circuitBreakerRepair: ServicePageContent = {
  slug: "circuit-breaker-repair",
  path: "/services/residential/circuit-breaker-repair",
  parent: "/services/residential",
  modifiedAt: "2026-11-19",

  seo: {
    title: "Circuit Breaker Repair St. Louis | Show Me Electrical",
    description:
      "Circuit breaker repair and replacement in St. Louis. A breaker that keeps tripping is doing its job: we find the cause and fix it. Get a free quote.",
    keyword: "circuit breaker repair st louis",
    supporting: ["circuit breaker replacement st louis", "why does my circuit breaker keep tripping"],
    image: "/photos/kitchen-pendant-lighting.webp",
  },

  schema: {
    name: "Circuit Breaker Repair & Replacement",
    serviceType: "Circuit breaker repair",
  },

  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Residential Electrical", href: "/services/residential" },
    { label: "Circuit Breaker Repair" },
  ],

  directory: {
    title: "Circuit Breaker Repair & Replacement",
    summary:
      "A breaker that keeps tripping, won't reset or feels warm: the cause found first, then the failing part repaired or replaced with the right breaker for its circuit.",
  },

  hero: {
    eyebrow: "Residential · Circuit breakers",
    headline: "Circuit Breaker Repair & Replacement in St. Louis, MO",
    intro:
      "A circuit breaker that keeps tripping is doing its job: it cuts the power when its circuit is overloaded or has a fault, and resetting it again and again only hides the reason. Show Me Electrical finds the cause — the breaker, the circuit or what's plugged into it — checks that the breaker is the right type and rating for its circuit, and repairs or replaces the part that is failing rather than the whole panel when that's the right call.",
    image: {
      src: "/photos/kitchen-pendant-lighting.webp",
      alt: "A finished kitchen with a brass-and-glass pendant hanging over a white marble waterfall island, recessed ceiling lights and a lit range hood",
    },
  },

  services: {
    eyebrow: "When to call",
    heading: "What we look at when a breaker keeps tripping",
    intro:
      "Five situations homeowners call about. In each one we find the cause before anything is replaced, and we'll say plainly when the breaker isn't the problem.",
    items: [
      {
        name: "A breaker that trips again and again",
        problem:
          "The same breaker trips over and over — when one appliance starts, or for no reason you can see.",
        solution:
          "We work out whether it's an overloaded circuit, faulty wiring, a failing breaker or something plugged into it, and fix that cause rather than resetting the breaker and hoping.",
      },
      {
        name: "A breaker that won't reset, or feels warm",
        problem:
          "A breaker won't stay on when you reset it, or it is warm to the touch.",
        solution:
          "We check the breaker and the circuit it protects. Where the breaker itself is failing, we replace it with one of the right type and rating for that circuit.",
      },
      {
        name: "A breaker that doesn't match its circuit",
        problem:
          "Breakers swapped over the years, and nobody is sure each one is the right type and rating for the circuit it protects.",
        solution:
          "We check each breaker we work on against the circuit it serves, and replace a mismatched one with the correct breaker: it is the proper rating that lets a breaker protect its circuit.",
      },
      {
        name: "An appliance that needs its own circuit",
        problem:
          "The breaker trips whenever a particular appliance or piece of equipment runs alongside everything else on the circuit.",
        solution:
          "The circuit may simply be carrying too much. A dedicated circuit for that appliance, run from the panel, takes it off the shared one.",
        href: "/services/residential/outlet-installation",
      },
      {
        name: "When the panel is the problem",
        problem:
          "Breakers across the panel trip under everyday loads, the panel is an older model, or the house still has a fuse box.",
        solution:
          "That points past a single breaker to the panel. We assess it and, where it is undersized or worn, recommend a panel upgrade — and say so plainly when it isn't needed.",
        href: "/services/residential/electrical-panel-upgrades",
      },
    ],
  },

  trust: {
    eyebrow: "Why us",
    heading: "Who does the work",
    intro:
      "Dan is the owner and the Master Electrician on every job — no sales rep, no middle man.",
    points: trustPoints.filter((p) => p.label === "Master Electrician" || p.label === "Free consultations"),
  },

  context: {
    eyebrow: "Why it matters",
    heading: "Why a breaker's rating matters",
    body: [
      {
        type: "p",
        text: "A circuit breaker is a safety device before it is anything else. The U.S. Consumer Product Safety Commission puts it this way:",
      },
      {
        type: "quote",
        text: "Fuses and circuit breakers with proper current ratings protect branch circuits from potential fire hazards.",
        cite: "https://www.cpsc.gov/s3fs-public/518.pdf",
      },
      {
        type: "p",
        text: [
          "That is why we check a breaker's type and rating against its circuit instead of matching whatever was there before, and why a breaker that keeps tripping gets a diagnosis rather than another reset. When the trips come from one appliance sharing a busy circuit, the fix is often a ",
          { type: "link", text: "dedicated circuit", href: "/services/residential/outlet-installation" },
          "; when breakers trip across the whole house, look at the ",
          { type: "link", text: "panel", href: "/services/residential/electrical-panel-upgrades" },
          ".",
        ],
      },
      {
        type: "p",
        text: "Other warning signs are worth the same attention. The National Fire Protection Association's home fire safety messages list flickering lights among the reasons to call a licensed electrician.",
      },
      {
        type: "sources",
        items: [
          {
            label: "U.S. Consumer Product Safety Commission — Home Wiring Hazards (PDF)",
            href: "https://www.cpsc.gov/s3fs-public/518.pdf",
            note: "quoted above",
          },
          {
            label: "NFPA — Educational Messages Desk Reference, 2026 (PDF)",
            href: "https://www.nfpa.org/-/media/project/storefront/catalog/files/home-fire-safety/emac/educationalmessagesdeskreference.pdf",
            note: "flickering lights listed among the reasons to call a licensed electrician",
          },
        ],
      },
    ],
  },

  process: {
    eyebrow: "Our process",
    heading: "How a breaker repair runs",
    intro:
      "Three steps, from the first free consultation to the moment the power comes back on.",
    steps: processSteps,
  },

  faqs: {
    eyebrow: "Questions",
    heading: "Questions about circuit breakers",
    intro:
      "Straight answers, based on what the company actually does. If yours isn't here, call — a free consultation is the fastest way to a real answer.",
    items: [
      {
        q: "Why does my circuit breaker keep tripping?",
        a: "Because it is doing its job. A breaker cuts the power when its circuit is overloaded or has a fault. One that trips regularly points to an overloaded circuit, faulty wiring or a failing breaker, and ignoring it risks overheating. We find the cause and fix that, rather than just resetting it.",
      },
      {
        q: "Should I keep resetting a breaker that trips?",
        a: "A breaker that trips again after you reset it is telling you something on that circuit needs attention, so resetting it over and over isn't a fix. If it keeps tripping, won't reset or feels warm to the touch, call and have the cause found.",
      },
      {
        q: "Do you repair and replace circuit breakers?",
        a: "Yes. When the breaker itself is failing, we replace it with one of the right type and rating for its circuit. When the breaker is fine and the circuit or what's plugged into it is the problem, we fix that instead.",
      },
      {
        q: "Who will do the work?",
        a: "Dan is the owner and the Master Electrician on every job — no sales rep, no middle man.",
      },
      {
        q: "Do you charge for a consultation or estimate?",
        a: "No. Every job starts with a free consultation. We review the project, answer your questions and give you a clear scope before any work starts — no strings attached.",
      },
      {
        q: "Which areas do you serve?",
        a: "Homes across the Greater St. Louis area — St. Louis City and St. Louis County, plus St. Charles, Jefferson, Franklin, Warren and Lincoln Counties, and Edwardsville and Belleville in Illinois. Not sure you're in range? Call and we'll tell you straight.",
      },
    ],
  },

  related: {
    heading: "Related",
    links: [
      {
        label: "Electrical panel upgrades",
        href: "/services/residential/electrical-panel-upgrades",
        description: "When breakers trip across the house, or the panel is an older model or a fuse box.",
      },
      {
        label: "Outlet & switch installation",
        href: "/services/residential/outlet-installation",
        description: "Outlets where you need them, GFCI protection near water, and dedicated circuits.",
      },
      {
        label: "All residential services",
        href: "/services/residential",
        description: "The thirteen residential services, the problems they solve and the questions homeowners ask.",
      },
      {
        label: "Get a free quote",
        href: "/contact",
        description: "Call, email or send project details — we'll get you on the schedule.",
      },
    ],
  },

  cta: {
    heading: "Breaker keeps tripping?",
    body: "Free consultation, straight answers and a clear scope before any work starts. Call, or send us the details and we'll get you on the schedule.",
  },

  sections: ["hero", "services", "trust", "context", "process", "faqs", "related", "cta"],
};
