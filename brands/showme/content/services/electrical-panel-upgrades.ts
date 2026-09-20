import type { ServicePageContent } from "@/content/services/types";
import { trustPoints, processSteps } from "@/content/shared";

/**
 * ELECTRICAL PANEL UPGRADES & REPLACEMENT — individual service page.
 *
 * Taxonomy entry #3 (residential), page plan §3. The representative
 * individual-service page for the Compass template (Batch B): it reuses the
 * `ServicePage` renderer with a child-page emphasis — direct answer first,
 * when the service helps and when it does not, process, questions, related
 * pages — and omits the sections it has no sourced content for (gallery).
 *
 * PROVENANCE — every sentence derives from copy already approved on the
 * residential hub (content/services/residential.ts): the panel-upgrade,
 * circuit-breaker, EV-charger and remodel service items and the hub FAQ.
 * Trust facts and process steps are the shared, sourced sets.
 *
 * DELIBERATELY ABSENT — not sourced, so not stated: prices, how long a
 * panel replacement takes, permit or utility specifics, amperage
 * recommendations, brand names, and any residential panel photograph (the
 * client's library has none; the hero reuses a residential remodel rough-in
 * photo with an alt text that describes exactly what is in frame).
 */
export const electricalPanelUpgrades: ServicePageContent = {
  slug: "electrical-panel-upgrades",
  path: "/services/residential/electrical-panel-upgrades",
  parent: "/services/residential",

  seo: {
    title: "Electrical Panel Upgrade St. Louis | Show Me Electrical",
    description:
      "Electrical panel upgrades in St. Louis: the cause assessed first, then undersized or worn panels and fuse boxes replaced where needed. Free consultation.",
    keyword: "electrical panel upgrade st louis",
    supporting: ["panel replacement st louis", "fuse box replacement st louis", "breaker panel upgrade"],
    image: "/photos/roughin-framing.webp",
  },

  schema: {
    name: "Electrical Panel Upgrades & Replacement",
    serviceType: "Electrical panel upgrade",
  },

  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Residential Electrical", href: "/services/residential" },
    { label: "Electrical Panel Upgrades" },
  ],

  directory: {
    title: "Electrical Panel Upgrades & Replacement",
    summary:
      "The cause assessed first; undersized or worn panels and fuse boxes replaced with modern breaker panels sized for today's loads where that is the right work.",
  },

  hero: {
    eyebrow: "Residential · Panel upgrades",
    headline: "Electrical Panel Upgrades & Replacement in St. Louis, MO",
    intro:
      "Breakers that trip when the microwave and a space heater run together, a panel that is an older model, or a house that still has a fuse box are the reasons homeowners call about panel upgrades. Show Me Electrical assesses the cause first and recommends the right work: where the panel is undersized or worn, that is a modern breaker panel sized for today's loads — HVAC, kitchen, home office, EV charging — so the house stops fighting itself.",
    image: {
      src: "/photos/roughin-framing.webp",
      alt: "New electrical boxes and wiring installed in the open stud walls of an older home during a remodel, with plaster lath visible",
    },
  },

  services: {
    eyebrow: "When it helps",
    heading: "When a panel upgrade is the answer — and when it isn't",
    intro:
      "Four situations homeowners call about. In each one we assess the cause before recommending the work, and we'll say plainly when a new panel isn't it.",
    items: [
      {
        name: "Breakers trip under everyday loads",
        problem:
          "Breakers trip when the microwave and a space heater run together, or when the air conditioner starts.",
        solution:
          "We find out whether the panel, a circuit or what's plugged in is the cause. Where the panel is undersized, we replace it with a modern breaker panel sized for today's loads.",
      },
      {
        name: "An older panel or a fuse box",
        problem:
          "The panel is an older model with worn components, or the house still has a fuse box.",
        solution:
          "We inspect what's there and recommend the appropriate work. Where replacement is the right call: a modern breaker panel, installed to current code, tested and inspected before it is handed over.",
      },
      {
        name: "Adding load: EV charger, addition, HVAC",
        problem:
          "A new electric vehicle, a kitchen or basement addition, or new HVAC that the existing panel may not have the capacity to carry.",
        solution:
          "We check first whether your existing panel has the capacity for the added load. If it doesn't, the panel upgrade comes first, then the new circuits tie into it.",
      },
      {
        name: "One breaker that keeps tripping",
        problem:
          "One breaker trips over and over, won't reset, or is warm to the touch — but the rest of the panel behaves.",
        solution:
          "That may not need a new panel. We work out whether it's the breaker, the circuit or what's plugged into it, and replace the failing part rather than the whole panel when that's the right call.",
      },
    ],
  },

  trust: {
    eyebrow: "Why us",
    heading: "Who does the work, and what backs it",
    points: trustPoints,
  },

  process: {
    eyebrow: "Our process",
    heading: "How a panel upgrade runs",
    intro:
      "Three steps, from the first free consultation to the moment the power comes back on.",
    steps: processSteps,
  },

  faqs: {
    eyebrow: "Questions",
    heading: "Questions about panel upgrades",
    intro:
      "Straight answers, based on what the company actually does. If yours isn't here, call — a free consultation is the fastest way to a real answer.",
    items: [
      {
        q: "My breaker keeps tripping. What does that mean?",
        a: "A breaker that trips once in a while is doing its job. One that trips regularly points to an overloaded circuit, faulty wiring or a failing breaker, and ignoring it risks overheating. We diagnose the cause and fix that, rather than just resetting it.",
      },
      {
        q: "Do you replace fuse boxes?",
        a: "Yes. A fuse box, or a panel that is an older model, is one of the common reasons homeowners call about panel upgrades. We inspect it first and, where replacement is the right work, install a modern breaker panel sized for today's loads.",
      },
      {
        q: "Will my panel handle an EV charger?",
        a: "We check first whether your existing panel has the capacity to carry the added load or needs an upgrade. If it needs one, we do the panel upgrade and then install the Level 2 charger circuit and the charger itself.",
      },
      {
        q: "Do you charge for a consultation or estimate?",
        a: "No. Every job starts with a free consultation. We review the project, answer your questions and give you a clear scope before any work starts — no strings attached.",
      },
      {
        q: "Are you licensed and insured for residential work?",
        a: "Yes — Show Me Electrical is fully licensed, insured and bonded to handle residential, commercial and industrial electrical projects, so the work is safe, code-compliant and backed by proper certifications and liability coverage.",
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
        label: "All residential services",
        href: "/services/residential",
        description: "The thirteen residential services, the problems they solve and the questions homeowners ask.",
      },
      {
        label: "Get a free quote",
        href: "/contact",
        description: "Call, email or send project details — we'll get you on the schedule.",
      },
      {
        label: "Service area",
        href: "/service-area",
        description: "St. Louis City and County, the surrounding counties, and two Illinois communities.",
      },
      {
        label: "Edwardsville, IL",
        href: "/service-area/edwardsville-il",
        description: "Across the river: what serving Edwardsville from our Affton shop means.",
      },
    ],
  },

  cta: {
    heading: "Think your panel is the problem?",
    body: "Free consultation, straight answers and a clear scope before any work starts. Call, or send us the details and we'll get you on the schedule.",
  },

  sections: ["hero", "services", "trust", "process", "faqs", "related", "cta"],
};
