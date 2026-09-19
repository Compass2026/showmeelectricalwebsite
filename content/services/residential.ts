import type { ServicePageContent } from "./types";
import { trustPoints, processSteps } from "@/content/shared";

/**
 * RESIDENTIAL ELECTRICAL — hub page content.
 *
 * Primary keyword: "residential electrician st louis" — measured 2026-09-19
 * from the same DataForSEO source and location as the approved keyword map
 * (20/mo, HIGH competition). The 13 services are the approved taxonomy's
 * residential entries, numbered as in the map; each becomes its own page in a
 * later milestone and gets an `href` then.
 *
 * PROVENANCE:
 *  - Service names: approved taxonomy v1.1 (client-approved 2026-09-02).
 *  - Problems and warning signs: the client's own published blog posts
 *    ("Top 5 Signs Your Home Needs Electrical Rewiring", "The Most Common
 *    Electrical Hazards Found in Missouri Homes", "Top Signs You Need to Call
 *    an Electrician Immediately") and the live homepage FAQ.
 *  - Trust facts: live /about/ and FAQ; Master Electrician per decision D-002.
 *  - Emergency wording: decision D-001 and Tom's confirmed copy. No hours,
 *    no response times, no 24/7.
 *  - Photography: four images from the client's own library, each checked to
 *    be a residential job. The commercial fit-out photo (metal studs, ceiling
 *    grid) is deliberately not used here.
 *
 * Nothing below states a price, a timeframe, a guarantee or a credential the
 * client has not published.
 */
export const residential: ServicePageContent = {
  slug: "residential",
  path: "/services/residential",

  seo: {
    title: "Residential Electrician St. Louis, MO | Show Me Electrical",
    description:
      "Residential electrician in St. Louis for panel upgrades, rewiring, lighting, ceiling fans & repairs. Owner-led by a Master Electrician. Free consultation.",
    keyword: "residential electrician st louis",
    supporting: [
      "st louis residential electrician",
      "electrician st louis",
      "home rewiring st louis",
      "electrical panel upgrade st louis",
      "ceiling fan installation st louis",
    ],
    image: "/photos/finished-interior-lighting.webp",
  },

  schema: {
    name: "Residential Electrical Services",
    serviceType: "Residential electrician",
  },

  breadcrumbs: [{ label: "Home", href: "/" }, { label: "Residential Electrical" }],

  hero: {
    eyebrow: "Residential electrical services",
    headline: "Residential Electrician in St. Louis, MO",
    intro:
      "From a single outlet to a whole-home rewire, Show Me Electrical handles the electrical work in St. Louis homes — panel upgrades, lighting, ceiling fans, EV chargers and the repairs that keep a house safe. Owner-led, code-compliant, and done right the first time.",
    image: {
      src: "/photos/finished-interior-lighting.webp",
      alt: "Finished lower level of a home with recessed ceiling lights on, a tray ceiling and island cabinetry being installed",
    },
  },

  services: {
    eyebrow: "Services",
    heading: "What we do in homes — and the problems it solves",
    intro:
      "Thirteen residential services, one standard of work. If you recognise your house in the left-hand column, the right-hand column is what we do about it.",
    items: [
      {
        name: "Electrical Repair & Troubleshooting",
        problem:
          "Something isn't right — a dead outlet, a switch that feels warm, lights that flicker when the air conditioner starts — and you can't tell whether it's a nuisance or a hazard.",
        solution:
          "We find the cause, not just the symptom, and fix it so it stays fixed. If it's a warning sign of something bigger, we'll tell you straight.",
      },
      {
        name: "Emergency Electrical Service",
        problem:
          "A burning smell with no source, a panel that has gone dead, sparks from an outlet, water near live wiring.",
        solution:
          "Need emergency electrical repairs? Call to discuss the problem and current availability.",
      },
      {
        name: "Electrical Panel Upgrades & Replacement",
        problem:
          "Breakers trip when the microwave and a space heater run together, the panel is 25 to 30 years old, or the house still has a fuse box.",
        solution:
          "We replace undersized or worn panels with modern breaker panels sized for today's loads — HVAC, kitchen, home office, EV charging — so the house stops fighting itself.",
      },
      {
        name: "Circuit Breaker Repair & Replacement",
        problem:
          "One breaker trips over and over, won't reset, or is warm to the touch.",
        solution:
          "We work out whether it's the breaker, the circuit or what's plugged into it, and replace the failing part rather than the whole panel when that's the right call.",
      },
      {
        name: "Home Rewiring",
        problem:
          "An older home with two-prong outlets, aluminum wiring, buzzing switches, or lights that dim under load.",
        solution:
          "Full or partial rewiring, brought up to current code and inspected, so the house can safely carry what you plug into it.",
      },
      {
        name: "New Construction Wiring",
        problem:
          "You're building a custom home and the electrical needs to be planned before the walls close.",
        solution:
          "Complete wiring for new builds, coordinated with your builder from rough-in to final inspection.",
      },
      {
        name: "Remodel & Home Addition Electrical",
        problem:
          "A kitchen, basement or addition that needs new circuits, more outlets and lighting where none existed.",
        solution:
          "New circuits and rough-in for the remodel, tied into your existing panel — or a panel upgrade first, if the addition needs one.",
      },
      {
        name: "Lighting & Fixture Installation",
        problem:
          "Dated fixtures, dark rooms, a dining room that needs a heavy chandelier hung properly.",
        solution:
          "Recessed, pendant, under-cabinet and exterior lighting, plus fixture swaps — with straight advice on options that manage cost and appearance.",
      },
      {
        name: "Ceiling Fan Installation",
        problem:
          "A room that needs air moving, a fan that wobbles, or a ceiling with no box rated to hold one.",
        solution:
          "Fan-rated boxes, new switch legs where needed, and fans hung level and quiet — indoors or on a covered patio.",
      },
      {
        name: "Outlet & Switch Installation",
        problem:
          "Not enough outlets, two-prong outlets, no GFCI protection near water, or extension cords doing a permanent job.",
        solution:
          "New and replacement outlets and switches, GFCI protection where code requires it, dimmers and USB outlets.",
      },
      {
        name: "Smart Home & Security Wiring",
        problem:
          "Smart switches, cameras and a security system that need proper wiring, not a tangle of adapters.",
        solution:
          "Line-voltage and low-voltage wiring for smart home and home security systems, installed cleanly and labelled.",
      },
      {
        name: "EV Charger Installation",
        problem:
          "A new electric vehicle and a garage with a standard outlet that takes all night to charge it.",
        solution:
          "Level 2 charger circuits and installation, with a look at whether your panel has the capacity to carry it.",
      },
      {
        name: "Generator Installation",
        problem:
          "Storms take the power out and you want the house to keep running.",
        solution:
          "Standby generator wiring and transfer switch installation, so the essential circuits carry on when the grid doesn't.",
      },
    ],
  },

  gallery: {
    eyebrow: "On the job",
    heading: "Residential work, photographed on the job",
    intro:
      "Our own work, photographed on our own jobs — no stock images. Rough-in is where quality is decided, so two of these show the work before the walls closed.",
    photos: [
      {
        src: "/photos/ceiling-fan-install.webp",
        alt: "Large black ceiling fan installed on the underside of a timber-frame covered patio roof",
        caption: "Ceiling fan on a timber-frame covered patio.",
      },
      {
        src: "/photos/roughin-attic.webp",
        alt: "Recessed light housings and wiring roughed in across a vaulted ceiling in new framing, with large windows below",
        caption: "Recessed lighting roughed in on a vaulted ceiling, new construction.",
      },
      {
        src: "/photos/roughin-framing.webp",
        alt: "New electrical boxes and wiring installed in the open stud walls of an older home during a remodel, with plaster lath visible",
        caption: "Rough-in during the remodel of an older home.",
      },
    ],
  },

  trust: {
    eyebrow: "Why us",
    heading: "Why St. Louis homeowners call us back",
    intro:
      "Who shows up, what backs the work, and what it costs to find out — the short version.",
    points: trustPoints,
  },

  process: {
    eyebrow: "Our process",
    heading: "How a residential job runs",
    intro:
      "Three steps, from the first free consultation to the moment the power comes on.",
    steps: processSteps,
  },

  faqs: {
    eyebrow: "Questions",
    heading: "Questions homeowners ask",
    intro:
      "Straight answers, based on what the company actually does. If yours isn't here, call — a free consultation is the fastest way to a real answer.",
    items: [
      {
        q: "What residential electrical services do you offer in St. Louis?",
        a: "A full range of residential electrical services, including panel upgrades, wiring and rewiring, lighting and ceiling fan installation, outlet and switch work, whole-home surge protection, smart home and security wiring, EV charger installation and generator installation, throughout the St. Louis area.",
      },
      {
        q: "Do you offer emergency electrical repairs?",
        a: "Yes. If you have an electrical emergency, call to discuss the problem and current availability.",
      },
      {
        q: "Are you licensed and insured for residential work?",
        a: "Yes — Show Me Electrical is fully licensed, insured and bonded to handle residential, commercial and industrial electrical projects, so the work is safe, code-compliant and backed by proper certifications and liability coverage.",
      },
      {
        q: "Who will actually be doing the work in my home?",
        a: "Show Me Electrical is owner-led. Dan, the Master Electrician behind the name, leads every project and shows up tools in hand. He's not a sales guy — the person you talk to is the person responsible for the work.",
      },
      {
        q: "Do you charge for a consultation or estimate?",
        a: "No. Every job starts with a free consultation. We review the project, answer your questions and give you a clear scope before any work starts — no strings attached.",
      },
      {
        q: "How do I know if my home needs rewiring?",
        a: "The common signs are lights that flicker or dim when appliances turn on, breakers that trip often or a fuse box instead of a breaker panel, a burning smell or discoloured outlets, two-prong outlets with no grounding, and buzzing sounds or mild shocks from outlets and switches. Homes built before the 1970s with original wiring are the most likely to need it. Any of these is worth an inspection.",
      },
      {
        q: "My breaker keeps tripping. What does that mean?",
        a: "A breaker that trips once in a while is doing its job. One that trips regularly points to an overloaded circuit, faulty wiring or a failing breaker, and ignoring it risks overheating. We diagnose the cause and fix that, rather than just resetting it.",
      },
      {
        q: "Do you work on older homes with two-prong outlets or aluminum wiring?",
        a: "Yes, and it's some of the most important work we do. Two-prong outlets have no grounding, and aluminum wiring is known to loosen over time and increase fire risk. We inspect the system and recommend the safest upgrades, whether that's grounded outlets, GFCI protection or a partial or full rewire.",
      },
      {
        q: "Where do you need GFCI outlets?",
        a: "GFCI outlets cut the power instantly when a ground fault occurs, which is what protects you from shock near water. Electrical code requires them in kitchens, bathrooms, basements, garages, outdoor areas and anywhere water is present. Older homes very often still have standard outlets in those spots.",
      },
      {
        q: "Do you install ceiling fans and light fixtures?",
        a: "Yes. Ceiling fans, recessed lighting, pendants, chandeliers, dimmers and fixture swaps are everyday work for us — including outdoor fans on covered patios. We'll advise on options that manage cost and appearance before anything is bought.",
      },
      {
        q: "Can you install an EV charger at my house?",
        a: "Yes. We install Level 2 EV charger circuits and the charger itself, and we check first whether your existing panel has the capacity to carry the added load or needs an upgrade.",
      },
      {
        q: "Do you handle smart home and security system wiring?",
        a: "Yes. We wire smart home installations and home security systems, along with the outlets, switches and low-voltage runs they depend on.",
      },
      {
        q: "Which areas do you serve?",
        a: "Homes across the Greater St. Louis area — St. Louis City and St. Louis County, plus St. Charles, Jefferson, Franklin, Warren and Lincoln Counties. Not sure you're in range? Call and we'll tell you straight.",
      },
    ],
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
        label: "How the work runs",
        href: "/#process",
        description: "Plan, install, power on — the three steps of every job.",
      },
      {
        label: "Meet the owner",
        href: "/about",
        description: "Dan, the Master Electrician behind the name.",
      },
      {
        label: "Service area",
        href: "/#service-area",
        description: "St. Louis City and County and the surrounding counties.",
      },
    ],
  },

  cta: {
    heading: "Ready to talk about your home?",
    body: "Free consultation, straight answers and a clear scope before any work starts. Call, or send us the details and we'll get you on the schedule.",
  },

  sections: [
    "hero",
    "services",
    "gallery",
    "trust",
    "process",
    "faqs",
    "related",
    "cta",
  ],
};
