import type { BranchLocationContent } from "@/content/locations/types";
import { harborLaneWestfield } from "@/content/demo/harbor-lane-westfield";

/**
 * Harbor Lane's two branches. In THIS brand the branches are the client's
 * published locations (the whole brand is fictional and is protected at
 * brand level: site-wide notice, noindex, robots disallow, production build
 * guard), so the per-item `fictional` flag is off and they appear in the
 * brand's own sitemap and /locations index — exactly as a real
 * multi-location client's would.
 */
const westfield: BranchLocationContent = {
  ...harborLaneWestfield,
  slug: "westfield",
  path: "/locations/westfield",
  fictional: false,
  noindex: false,
  parent: { name: "Harbor Lane Plumbing", url: "https://harbor-lane.example" },
  header: { ...harborLaneWestfield.header, eyebrow: "Location · Westfield" },
  breadcrumbs: [{ label: "Home", href: "/" }, { label: "Locations", href: "/locations" }, { label: "Westfield branch" }],
  related: { heading: "Related", links: [
    { label: "All locations", href: "/locations", description: "Westfield and Eastgate." },
    { label: "Northgate", href: "/service-area/northgate", description: "Served from this branch; no Northgate office." },
    { label: "Contact", href: "/contact", description: "Send details or call — the office routes you." },
  ] },
  body: { heading: "About this branch", blocks: harborLaneWestfield.body!.blocks.map((b) => (b.type === "table" ? { ...b, rows: b.rows.map((r) => (typeof r[0] === "string" && r[0] === "North Exampleton" ? [r[0], [{ type: "link", text: "Westfield", href: "/locations/westfield" }], r[2]] : typeof r[0] === "string" && r[0] === "South Exampleton" ? [r[0], [{ type: "link", text: "Eastgate", href: "/locations/eastgate" }], r[2]] : r)) } : b)) },
};

const eastgate: BranchLocationContent = {
  slug: "eastgate",
  path: "/locations/eastgate",
  name: "Harbor Lane Plumbing — Eastgate branch (head office)",
  schemaType: "Plumber",
  parent: { name: "Harbor Lane Plumbing", url: "https://harbor-lane.example" },
  seo: { title: "Eastgate Branch (Head Office) | Harbor Lane (Fictional Demo)", description: "Fictional demo: Harbor Lane's Eastgate branch and head office — address, hours, access, and the backflow testing team.", image: "/demo/placeholder-1200x630.png" },
  breadcrumbs: [{ label: "Home", href: "/" }, { label: "Locations", href: "/locations" }, { label: "Eastgate branch" }],
  header: {
    eyebrow: "Location · Eastgate · Head office",
    headline: "Harbor Lane Plumbing — Eastgate branch",
    intro: "Head office, parts counter and dispatch base for the south side of Exampleton. Home of the backflow testing team.",
    image: { src: "/demo/placeholder-hero.svg", alt: "Placeholder graphic labelled as a fictional demo fixture; no photograph exists for this location" },
  },
  address: { street: "100 Example Way", city: "Exampleton", region: "XX", postalCode: "00000", country: "US" },
  phone: "(555) 010-0199",
  phoneHref: "tel:+15550100199",
  email: "eastgate@harbor-lane.example",
  visitable: true,
  access: ["Customer parking beside the building.", "Step-free entrance; parts counter on the ground floor."],
  directionsUrl: "https://harbor-lane.example/directions/eastgate",
  hours: { heading: "Regular hours", rules: [{ days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "07:30", closes: "17:00" }, { days: ["Saturday", "Sunday"] }], note: "Closed weekends and public holidays." },
  services: {
    heading: "Services at this branch",
    columns: ["Service", "Available at Eastgate", "Notes"],
    rows: [
      { service: "Backflow testing", available: "Yes", note: "The only branch that does it." },
      { service: "Water heater replacement", available: "Yes", note: "Tank and tankless." },
      { service: "Drain cleaning", available: "Yes", note: "" },
      { service: "Parts counter", available: "Yes", note: "Walk-in during regular hours." },
    ],
  },
  team: { heading: "Who's at Eastgate", people: [{ name: "Priya Example", role: "Owner" }, { name: "Theo Example", role: "Backflow tester" }] },
  faqs: { heading: "Questions about the Eastgate branch", items: [{ q: "Is this the head office?", a: "Yes. Post and invoices go here; service calls are routed by the office." }] },
  related: { heading: "Related", links: [{ label: "All locations", href: "/locations", description: "Westfield and Eastgate." }, { label: "Commercial plumbing", href: "/services/commercial", description: "Backflow, grease traps, fixtures." }] },
  cta: { heading: "Need the south-side branch?", body: "Call Eastgate, or send the details and we'll get you scheduled." },
  areaServed: ["South Exampleton"],
  sections: ["header", "visit", "hours", "services", "team", "faqs", "related", "cta"],
};

export const clientLocations: readonly BranchLocationContent[] = [westfield, eastgate];

export const locationsIndex = {
  seo: { title: "Our Branches | Harbor Lane Plumbing (Fictional Demo)", description: "Fictional demo: Harbor Lane's Westfield and Eastgate branches — addresses, hours, access and what each branch handles.", image: "/demo/placeholder-1200x630.png" },
  breadcrumbs: [{ label: "Home", href: "/" }, { label: "Locations" }],
  hero: { eyebrow: "Locations", headline: "Two branches, one standard", intro: "Westfield covers the north side of Exampleton, Eastgate the south. Both have a parts counter and regular hours.", image: { src: "/demo/placeholder-hero.svg", alt: "Placeholder graphic (locations); this fictional brand has no photography" } },
  heading: "Our branches",
  intro: "Pick the nearer one, or call the office and be routed.",
  cta: { heading: "Not sure which branch?", body: "Call the office and we'll route you." },
};
