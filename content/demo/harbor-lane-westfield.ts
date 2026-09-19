import type { BranchLocationContent } from "@/content/locations/types";

/**
 * FICTIONAL FIXTURE — "Harbor Lane Plumbing, Westfield branch".
 *
 * Harbor Lane Plumbing does not exist. Westfield branch does not exist.
 * 200 Example Way, Exampleton does not exist. The people named do not
 * exist. Phone numbers use the reserved 555-01xx range and the domain is
 * a reserved `.example` name. This fixture exists only to render and
 * verify the physical-location template (Page Template Library §7) —
 * hours, access, services-by-location table, team without portraits,
 * LocalBusiness-subtype schema linked to a parent organization — without
 * inventing a second location for the reference client.
 *
 * Included in a build only when COMPASS_DEMO=true. See content/demo/README.md.
 */
export const harborLaneWestfield: BranchLocationContent = {
  slug: "westfield-demo",
  path: "/locations/westfield-demo",
  name: "Harbor Lane Plumbing — Westfield branch",
  schemaType: "Plumber",
  parent: { name: "Harbor Lane Plumbing (fictional demo brand)", url: "https://harbor-lane.example" },
  fictional: true,
  noindex: true,

  seo: {
    title: "Westfield Branch (Fictional Demo) | Harbor Lane Plumbing",
    description:
      "Fictional demonstration of a physical-location page: address, hours, access, services available at this branch and the team. Not a real business.",
    image: "/demo/placeholder-1200x630.png",
  },

  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Locations" },
    { label: "Westfield branch" },
  ],

  header: {
    eyebrow: "Location · fictional demo",
    headline: "Harbor Lane Plumbing — Westfield branch",
    intro:
      "The Westfield branch is a walk-in service counter and dispatch base for the north side of Exampleton. Bring a part to match, book a visit, or call the branch directly.",
    image: {
      src: "/demo/placeholder-hero.svg",
      alt: "Placeholder graphic labelled as a fictional demo fixture; no photograph exists for this location",
    },
  },

  address: {
    street: "200 Example Way",
    city: "Exampleton",
    region: "XX",
    postalCode: "00000",
    country: "US",
  },
  phone: "(555) 010-0100",
  phoneHref: "tel:+15550100100",
  email: "westfield@harbor-lane.example",
  visitable: true,
  access: [
    "Customer parking in front of the building; two accessible spaces by the entrance.",
    "Step-free entrance at street level; the service counter is on the ground floor.",
    "Parts counter accepts walk-ins during regular hours.",
  ],
  directionsUrl: "https://harbor-lane.example/directions/westfield",

  hours: {
    heading: "Regular hours",
    rules: [
      { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "07:30", closes: "17:00" },
      { days: ["Saturday"], opens: "08:00", closes: "12:00" },
      { days: ["Sunday"] },
    ],
    note: "Closed on public holidays. Holiday hours are posted at the branch a week ahead.",
  },

  services: {
    heading: "Services at this branch",
    intro: "Availability varies by branch. This table is the Westfield list.",
    columns: ["Service", "Available at Westfield", "Notes"],
    rows: [
      { service: "Water heater replacement", available: "Yes", note: "Tank and tankless." },
      { service: "Drain cleaning", available: "Yes", note: "Residential and light commercial." },
      { service: "Repiping", available: "Yes", note: "Estimated on site after a free walkthrough." },
      { service: "Backflow testing", available: "No", note: "Handled by the Eastgate branch." },
      { service: "Parts counter", available: "Yes", note: "Walk-in during regular hours." },
    ],
  },

  team: {
    heading: "Who's at Westfield",
    people: [
      { name: "Priya Example", role: "Branch manager" },
      { name: "Marcus Example", role: "Lead service plumber" },
    ],
  },

  body: {
    heading: "About this branch",
    blocks: [
      {
        type: "p",
        text: [
          "Westfield is the second of Harbor Lane Plumbing's two branches and the one that handles the north side of Exampleton. Jobs on the south side are dispatched from Eastgate. If you are not sure which branch covers you, ",
          { type: "link", text: "get in touch", href: "/contact" },
          " and the office will route you.",
        ],
      },
      {
        type: "table",
        caption: "Which branch covers which area",
        header: ["Area", "Branch", "Parts counter"],
        rowHeader: true,
        rows: [
          ["North Exampleton", "Westfield", "Walk-in during regular hours"],
          ["South Exampleton", "Eastgate", "Walk-in during regular hours"],
          ["Outlying townships", "Whichever is nearer", "Call the office first"],
        ],
      },
    ],
  },

  faqs: {
    heading: "Questions about the Westfield branch",
    items: [
      { q: "Can I walk in without an appointment?", a: "Yes, during regular hours — the parts counter takes walk-ins. Service visits are scheduled." },
      { q: "Is there parking?", a: "Yes: customer parking in front of the building, with two accessible spaces by the entrance." },
      { q: "Does Westfield do backflow testing?", a: "No. Backflow testing is handled by the Eastgate branch." },
    ],
  },

  related: {
    heading: "Related",
    links: [
      { label: "Contact", href: "/contact", description: "Send details or call — the office routes you to the right branch." },
    ],
  },

  cta: {
    heading: "Need a plumber on the north side?",
    body: "Call the Westfield branch, or send the details and we'll get you scheduled.",
  },

  areaServed: ["North Exampleton"],

  sections: ["header", "visit", "hours", "services", "team", "body", "faqs", "related", "cta"],
};
