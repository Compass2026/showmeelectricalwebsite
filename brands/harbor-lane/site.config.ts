/**
 * HARBOR LANE PLUMBING — FICTIONAL demonstration brand. See README.md.
 * Same shape as the reference client's site.config.ts; every value here is
 * invented and clearly non-real (reserved phone range, .example domain).
 */
export interface NavItem {
  label: string;
  href: string;
  external?: boolean;
}

export const site = {
  name: "Harbor Lane Plumbing",
  legalName: "Harbor Lane Plumbing LLC (fictional)",
  fictional: true,
  logo: {
    src: "/demo/harbor-lane-logo.svg",
    alt: "Harbor Lane Plumbing (fictional demo brand)",
    width: 700,
    height: 200,
    wordmark: ["Harbor Lane", "Plumbing"] as [string, string],
  },
  metadata: {
    defaultTitle: "Harbor Lane Plumbing — Plumber in Exampleton (Fictional Demo)",
    titleTemplate: "%s | Harbor Lane Plumbing",
    description:
      "Fictional demonstration brand for the Compass website system: a two-branch plumbing company serving Exampleton and Harbor County.",
  },
  header: { utilityLabel: "Two branches, one number" },
  footer: {
    blurb: "A fictional two-branch plumbing company used to demonstrate the Compass website system. Nothing here is real.",
    exploreHeading: "Explore",
    areasHeading: "Where we work",
    areasText: "Exampleton and Harbor County, from the Westfield and Eastgate branches.",
    contactHeading: "Contact",
  },
  notFound: {
    eyebrow: "404",
    heading: "No pipe leads here",
    body: "The page you're looking for doesn't exist. Try the homepage.",
    cta: { label: "Back to the homepage", href: "/" },
  },
  tagline: "Plumbing done properly, from two local branches",
  foundedBy: "Priya Example",
  yearsExperience: "15+",
  founderCredential: "Master Plumber (fictional)",

  phone: "(555) 010-0199",
  phoneHref: "tel:+15550100199",
  email: "hello@harbor-lane.example",
  /**
   * SERVICE-AREA BUSINESSES: `street` and `zip` are nullable. A business that
   * goes to the customer has no public street address, and inventing one is a
   * false claim. Leave them null and the footer, the contact page and the
   * LocalBusiness JSON-LD omit the street line and keep "City, ST" — the same
   * shape the locations registry already uses for its optional street.
   */
  address: {
    street: "100 Example Way" as string | null,
    city: "Exampleton",
    state: "XX",
    zip: "00000" as string | null,
    country: "US",
  },
  geo: null as { lat: number; lng: number } | null,

  serviceArea: "Exampleton and Harbor County",
  serviceAreaLong: "Exampleton, its townships and the rest of Harbor County",
  counties: ["Harbor County"],
  confirmedCities: ["Northgate"],

  productionUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://harbor-lane.example",
  /** No careers property: nothing careers-related exists in this build. */
  careers: null as { url: string; wordpressUrl: string } | null,

  schemaType: "Plumber",
  businessDescription:
    "Fictional demonstration: a two-branch plumbing company for homes and small businesses in Exampleton and Harbor County.",
  serviceCatalogName: "Plumbing services",
  serviceCatalog: ["Residential plumbing", "Commercial plumbing"],
  shareImage: "/demo/placeholder-1200x630.png",
  logoUrl: "/demo/harbor-lane-logo.svg",

  primaryCta: { label: "Book a free walkthrough", href: "/contact" },
  secondaryCta: { label: "Call (555) 010-0199", href: "tel:+15550100199" },

  nav: [
    { label: "Services", href: "/services" },
    { label: "About", href: "/about" },
    { label: "Where we work", href: "/service-area" },
    { label: "Locations", href: "/locations" },
    { label: "Contact", href: "/contact" },
  ] as NavItem[],
  footerLinks: [
    { label: "Services", href: "/services" },
    { label: "About", href: "/about" },
    { label: "Where we work", href: "/service-area" },
    { label: "Locations", href: "/locations" },
    { label: "Contact", href: "/contact" },
  ] as NavItem[],
  legalLinks: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of Service", href: "/terms-of-service" },
  ] as NavItem[],

  sameAs: [] as string[],
  /** Not offered — so no emergency callout renders and no availability is implied. */
  offersEmergencyService: false,
} as const;

export type Site = typeof site;
