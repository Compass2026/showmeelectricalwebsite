/**
 * CLIENT CONTENT — the only file a new Compass client build must rewrite.
 *
 * Everything here is business identity: who the client is, how to reach them,
 * where they work, and what the site links to. No design values, no copy that
 * belongs to a specific page section. Components read from this config so the
 * same component tree can be repointed at a different client.
 *
 * Sourcing rule: every claim in this file must be traceable to a client-owned
 * source (their live site, an approved brand document, or direct instruction).
 * Never invent credentials, review counts, guarantees, or statistics.
 */

export interface NavItem {
  label: string;
  href: string;
  /** External links leave the Next.js router. */
  external?: boolean;
}

export const site = {
  /* ---------------- Identity ---------------- */
  name: "Show Me Electrical",
  legalName: "Show Me Electrical Services",
  /** Source: live homepage hero (typo "Craftmanship" corrected). */
  tagline: "Powering Missouri homes and businesses with care and craftsmanship",
  /** Source: live /about/ page. */
  foundedBy: "Dan",
  yearsExperience: "20+",

  /* ---------------- Contact ---------------- */
  phone: "314-571-9756",
  phoneHref: "tel:+13145719756",
  email: "info@showmeelectrical.com",
  address: {
    street: "5602 Heege Rd",
    city: "Affton",
    state: "MO",
    zip: "63123",
    country: "US",
  },
  /**
   * MISSING FACT — business coordinates.
   * Previously held approximate Affton coordinates, which `lib/seo.ts` emitted
   * as the business's actual location. Approximate coordinates presented as
   * exact are a false claim and can misplace the business in local results, so
   * geo is omitted entirely until the real pin is read off the client's Google
   * Business Profile. Recorded in docs/open-questions.md.
   *
   * To restore: set `geo: { lat, lng }` here — lib/seo.ts emits the GeoCoordinates
   * block only when this is present.
   */
  geo: null as { lat: number; lng: number } | null,

  /* ---------------- Service area ---------------- */
  /**
   * Tom directed (2026-09) that the careers site say "Greater St. Louis area"
   * rather than list six counties. The same wording is used here for
   * consistency. The brand board's county list is retained below so a future
   * service-area page can still enumerate them.
   */
  serviceArea: "Greater St. Louis area",
  serviceAreaLong:
    "St. Louis City, St. Louis County and the Greater St. Louis area",
  counties: [
    "St. Louis City",
    "St. Louis County",
    "St. Charles County",
    "Jefferson County",
    "Franklin County",
    "Warren County",
    "Lincoln County",
  ],

  /* ---------------- Domains ---------------- */
  /**
   * Production domain is configurable so the preview can stay non-indexable
   * while the future launch domain is already wired into canonicals and
   * structured data. See README "Preview vs production indexing".
   */
  productionUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://showmeelectrical.com",
  careersUrl: "https://careers.showmeelectrical.com",
  /** Legacy WordPress origin, still live during the rebuild. */
  wordpressUrl: "https://showmeelectrical.com",

  /* ---------------- Business description & taxonomy ---------------- */
  /**
   * Schema.org type for the business. Change per client — e.g. "Plumber",
   * "HVACBusiness", "RoofingContractor", "GeneralContractor".
   */
  schemaType: "Electrician",
  /** One-line description reused in LocalBusiness structured data. */
  businessDescription:
    "Owner-led electrical contractor serving St. Louis City, St. Louis County and the Greater St. Louis area with residential, commercial and industrial electrical work.",
  /** Top-level service pathways, mirrored in the structured-data offer catalog. */
  serviceCatalogName: "Electrical services",
  serviceCatalog: [
    "Residential electrical services",
    "Commercial electrical services",
    "Industrial electrical services",
  ],
  /** Logo used for structured data and social cards. */
  logoUrl:
    "https://showmeelectrical.com/wp-content/uploads/2024/08/Show-me-electric-white-logo-4.png",

  /* ---------------- Calls to action ---------------- */
  primaryCta: { label: "Get a free quote", href: "/contact" },
  secondaryCta: { label: "Call 314-571-9756", href: "tel:+13145719756" },

  /* ---------------- Navigation ---------------- */
  /**
   * MILESTONE NOTE: service, about and service-area pages are the next
   * assignment. Until they exist these point at the matching homepage
   * sections so every link in the preview resolves — no 404s for reviewers.
   * Swap the hrefs to "/services", "/about", "/service-area" when those
   * routes are built; nothing else needs to change.
   */
  nav: [
    { label: "Services", href: "/#services" },
    { label: "Our Process", href: "/#process" },
    { label: "About", href: "/#about" },
    { label: "Service Area", href: "/#service-area" },
    { label: "Careers", href: "/careers" },
    { label: "Contact", href: "/contact" },
  ] as NavItem[],

  footerLinks: [
    { label: "Services", href: "/#services" },
    { label: "Our Process", href: "/#process" },
    { label: "About", href: "/#about" },
    { label: "Service Area", href: "/#service-area" },
    { label: "Careers", href: "/careers" },
    { label: "Contact", href: "/contact" },
  ] as NavItem[],

  /** Carried over from WordPress at launch; not rebuilt in this milestone. */
  legalLinks: [] as NavItem[],

  /* ---------------- Business facts for structured data ---------------- */
  /**
   * Only facts verifiable on the client's own published material.
   * `priceRange` and `openingHours` are intentionally omitted until confirmed.
   */
  sameAs: [] as string[],

  /**
   * The live site states plainly that emergency and after-hours service is NOT
   * offered. The approved keyword map lists "emergency electrician st louis"
   * as a money keyword. That conflict is unresolved and flagged for Tom, so no
   * emergency or 24/7 claim appears anywhere in this build.
   */
  offersEmergencyService: false,
} as const;

export type Site = typeof site;
