import type { ServicePageContent } from "@/content/services/types";
import { trustPoints, processSteps } from "@/content/shared";

/**
 * OUTLET & SWITCH INSTALLATION — individual service page (GFCI).
 *
 * Taxonomy entry #10 (residential), page plan §3. Built on the panel-upgrade
 * page's pattern. Route shape `/services/{hub}/{slug}` as recorded in the
 * Compass CRM (Foundation route), which differs from the page plan's
 * earlier proposed slug `outlet-and-switch-installation` — the plan now
 * records the built URL.
 *
 * Keywords (Compass CRM): "outlet installation st louis" (primary),
 * "what is a gfci outlet", "what is a dedicated circuit" (each answered as
 * a FAQ and in the explainer section).
 *
 * PROVENANCE — every sentence derives from:
 *  - copy already approved on the residential hub (content/services/
 *    residential.ts): the outlet-and-switch item, the GFCI and two-prong
 *    FAQs;
 *  - the client site's FAQ, recorded in the Compass CRM: residential
 *    services include outlet repairs and panel upgrades;
 *  - the owner claim recorded in the Compass CRM from the client's own site:
 *    "Dan is the owner and the Master Electrician on every job — no sales
 *    rep, no middle man" (Master Electrician also per decision D-002);
 *  - the copy guidance Compass reviewed for this page (outlets in the wrong
 *    places; GFCI where water is nearby — kitchens, bathrooms, garages,
 *    outdoors; dedicated circuits for appliances and equipment);
 *  - one public source, quoted verbatim and cited: the CPSC GFCI Fact Sheet.
 *
 * DELIBERATELY ABSENT — prices, timeframes, brands, code-section numbers,
 * amperage figures, years in business, and no new credential claims: the
 * trust strip carries only the Master Electrician (D-002) and
 * free-consultation points. The hero is the client's own rough-in photo
 * (electrical boxes set in open stud walls beside the plumbing lines —
 * outlets where water will be nearby), with its verified alt text.
 */
export const outletInstallation: ServicePageContent = {
  slug: "outlet-installation",
  path: "/services/residential/outlet-installation",
  parent: "/services/residential",
  modifiedAt: "2026-11-19",

  seo: {
    title: "Outlet Installation St. Louis | Show Me Electrical",
    description:
      "Outlet and switch installation in St. Louis: outlets where you need them, GFCI protection near water and dedicated circuits for appliances. Free quote.",
    keyword: "outlet installation st louis",
    supporting: ["what is a gfci outlet", "what is a dedicated circuit"],
    image: "/photos/roughin-framing.webp",
  },

  schema: {
    name: "Outlet & Switch Installation",
    serviceType: "Outlet installation",
  },

  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Residential Electrical", href: "/services/residential" },
    { label: "Outlet & Switch Installation" },
  ],

  directory: {
    title: "Outlet & Switch Installation",
    summary:
      "Outlets where you actually need them, GFCI protection where water is nearby, dedicated circuits for appliances and equipment, and switch and dimmer work.",
  },

  hero: {
    eyebrow: "Residential · Outlets & switches",
    headline: "Outlet & Switch Installation in St. Louis, MO",
    intro:
      "Outlets in the wrong places, too few of them, or no GFCI protection where water is nearby are the reasons homeowners call about outlet work. Show Me Electrical adds and replaces outlets and switches where you actually use power, fits GFCI protection in kitchens, bathrooms, garages and outdoors, and runs dedicated circuits for the appliances and equipment that shouldn't share one.",
    image: {
      src: "/photos/roughin-framing.webp",
      alt: "New electrical boxes and wiring installed in the open stud walls of an older home during a remodel, with plaster lath visible",
    },
  },

  services: {
    eyebrow: "When to call",
    heading: "What we do with outlets and switches",
    intro:
      "Five situations homeowners call about, and what we do about each one.",
    items: [
      {
        name: "Outlets in the wrong places — or not enough of them",
        problem:
          "Extension cords and power strips doing a permanent job, furniture arranged around the only outlet, or no outlet where you need one.",
        solution:
          "New outlets where you actually use power, wired back properly, plus repairs and replacements for outlets that are worn, loose or dead.",
      },
      {
        name: "No GFCI protection near water",
        problem:
          "Standard outlets in the kitchen, bathroom, garage or outside, where electrical equipment sits close to water.",
        solution:
          "GFCI outlets — or a GFCI breaker at the panel — so the power is cut when a ground fault occurs.",
      },
      {
        name: "An appliance that needs its own circuit",
        problem:
          "An appliance or piece of equipment that trips the breaker whenever something else on the same circuit is running.",
        solution:
          "A dedicated circuit: a new circuit from the panel that serves that appliance or equipment alone. We check first that your panel has the capacity for it.",
      },
      {
        name: "Two-prong outlets in an older home",
        problem:
          "Two-prong outlets with no grounding, often in exactly the rooms that need protection most.",
        solution:
          "We inspect the circuit and recommend the safest upgrade, whether that's grounded outlets, GFCI protection or a partial or full rewire.",
      },
      {
        name: "Switches and dimmers",
        problem:
          "A switch that is worn or in the wrong place, lights you'd like to dim, or a spot that would be handier with a USB outlet.",
        solution:
          "New and replacement switches, dimmers and USB outlets, installed and tested alongside the outlet work.",
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
    eyebrow: "Explained",
    heading: "GFCI outlets and dedicated circuits",
    body: [
      { type: "h3", text: "What a GFCI outlet is" },
      {
        type: "p",
        text: "A GFCI (ground-fault circuit interrupter) outlet cuts the power when a ground fault occurs, which is what protects you from shock near water. The U.S. Consumer Product Safety Commission describes where it belongs:",
      },
      {
        type: "quote",
        text: "Ground fault protection is integrated into GFCI receptacles and GFCI circuit breakers for installation into your electrical system, especially for circuit outlets in particularly vulnerable areas such as where electrical equipment is near water.",
        cite: "https://www.cpsc.gov/s3fs-public/099_0.pdf",
      },
      {
        type: "p",
        text: "In a house, that means the kitchen, bathrooms, garage and outdoor outlets first. Older homes very often still have standard outlets in those spots; we check, and where the protection is missing we add it — at the outlet, or with a GFCI breaker at the panel.",
      },
      { type: "h3", text: "What a dedicated circuit is" },
      {
        type: "p",
        text: [
          "A dedicated circuit runs from the panel to one appliance or piece of equipment and serves nothing else, so that load never shares a circuit with the rest of the room. If a breaker keeps tripping whenever one appliance runs, that is often the fix — see ",
          { type: "link", text: "circuit breaker repair", href: "/services/residential/circuit-breaker-repair" },
          ". And if the panel has no room left for a new circuit, a ",
          { type: "link", text: "panel upgrade", href: "/services/residential/electrical-panel-upgrades" },
          " comes first.",
        ],
      },
      {
        type: "sources",
        items: [
          {
            label: "U.S. Consumer Product Safety Commission — GFCI Fact Sheet (PDF)",
            href: "https://www.cpsc.gov/s3fs-public/099_0.pdf",
            note: "quoted above",
          },
        ],
      },
    ],
  },

  process: {
    eyebrow: "Our process",
    heading: "How outlet work runs",
    intro:
      "Three steps, from the first free consultation to the moment the power comes back on.",
    steps: processSteps,
  },

  faqs: {
    eyebrow: "Questions",
    heading: "Questions about outlets and switches",
    intro:
      "Straight answers, based on what the company actually does. If yours isn't here, call — a free consultation is the fastest way to a real answer.",
    items: [
      {
        q: "What is a GFCI outlet?",
        a: "A GFCI (ground-fault circuit interrupter) outlet cuts the power when a ground fault occurs, which is what protects you from shock near water. The same protection also comes as a GFCI breaker in the panel.",
      },
      {
        q: "Where do I need GFCI outlets?",
        a: "Wherever electrical equipment is near water — in a house, that means the kitchen, bathrooms, garage and outdoor outlets first. Older homes very often still have standard outlets in those spots; we check and add the protection where it's missing.",
      },
      {
        q: "What is a dedicated circuit?",
        a: "A circuit that runs from the panel to one appliance or piece of equipment and serves nothing else, so that load never shares a circuit with the rest of the room. We check first that your panel has the capacity for it.",
      },
      {
        q: "Do you repair outlets as well as install them?",
        a: "Yes. Outlet repairs are part of our residential work, along with new and replacement outlets, switches, dimmers and USB outlets.",
      },
      {
        q: "Do you replace two-prong outlets?",
        a: "Yes. Two-prong outlets have no grounding. We inspect the circuit and recommend the safest upgrade, whether that's grounded outlets, GFCI protection or a partial or full rewire.",
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
        label: "Circuit breaker repair",
        href: "/services/residential/circuit-breaker-repair",
        description: "A breaker that keeps tripping, won't reset or feels warm — the cause found first.",
      },
      {
        label: "Electrical panel upgrades",
        href: "/services/residential/electrical-panel-upgrades",
        description: "When the panel has no room or capacity left for the circuits you need.",
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
    heading: "Need outlets where you actually use them?",
    body: "Free consultation, straight answers and a clear scope before any work starts. Call, or send us the details and we'll get you on the schedule.",
  },

  sections: ["hero", "services", "trust", "context", "process", "faqs", "related", "cta"],
};
