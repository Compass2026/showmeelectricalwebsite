/**
 * CLIENT CONTENT — the client identity record. A new Compass client build
 * rewrites this file first; the other client-owned inputs are listed in
 * docs/template-roadmap.md §3 (theme values, fonts, content/, photos,
 * redirects, delivery config).
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
  /**
   * TRUE ONLY FOR A FICTIONAL DEMONSTRATION BRAND. Renders a site-wide
   * notice, forces noindex on every page and robots.txt, and makes a
   * production build (VERCEL_ENV=production) fail. Show Me is a real client.
   */
  fictional: false,
  /** Wordmark asset and its fallback text, read by components/Logo. */
  logo: {
    src: "/logo-white.webp",
    alt: "Show Me Electrical Services — Residential, Commercial, Industrial",
    width: 700,
    height: 266,
    /** Two-part text wordmark shown only if the asset fails to load. */
    wordmark: ["Show Me", "Electrical"] as [string, string],
  },
  /** Root-layout defaults: the title for "/" and the template for the rest. */
  metadata: {
    defaultTitle: "Show Me Electrical — Electrician in St. Louis, MO",
    titleTemplate: "%s | Show Me Electrical",
    description:
      "Owner-led electrical contractor serving the Greater St. Louis area with residential, commercial and industrial electrical work.",
  },
  /** Site chrome copy. */
  header: { utilityLabel: "Contact Us Today" },
  footer: {
    blurb: "Owner-led electrical contractor serving the Greater St. Louis area with residential, commercial and industrial expertise.",
    exploreHeading: "Explore",
    areasHeading: "Areas Served",
    areasText: "Proudly serving the Greater St. Louis area and surrounding communities.",
    contactHeading: "Contact",
  },
  notFound: {
    eyebrow: "404",
    heading: "That page has gone dark",
    body: "The page you're looking for doesn't exist — but the careers do.",
    cta: { label: "View Open Roles", href: "/" },
  },
  /** Source: live homepage hero (typo "Craftmanship" corrected). */
  tagline: "Powering Missouri homes and businesses with care and craftsmanship",
  /** Source: live /about/ page. */
  foundedBy: "Dan",
  yearsExperience: "20+",
  /**
   * Owner's trade credential, used on the main site in About and trust copy.
   * Owner-confirmed 2026-09-17 — see docs/decisions.md D-002. Matches the
   * client's own live /about/ page and the brand board positioning line.
   *
   * SCOPE: main site only. The careers site's career ladder still omits master
   * and foreman levels per Tom's September instruction; that is a separate
   * thing (employee progression) and is unchanged.
   */
  founderCredential: "Master Electrician",

  /* ---------------- Contact ---------------- */
  phone: "314-571-9756",
  phoneHref: "tel:+13145719756",
  email: "info@showmeelectrical.com",
  /**
   * SERVICE-AREA BUSINESSES: `street` and `zip` are nullable. A business that
   * goes to the customer has no public street address, and inventing one is a
   * false claim. Leave them null and the footer, the contact page and the
   * LocalBusiness JSON-LD omit the street line and keep "City, ST" — the same
   * shape the locations registry already uses for its optional street.
   */
  address: {
    street: "5602 Heege Rd" as string | null,
    city: "Affton",
    state: "MO",
    zip: "63123" as string | null,
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
  /**
   * Individual communities confirmed as served outside the county list.
   * Owner-confirmed 2026-09-19 (decision D-003): these two Illinois cities
   * only — not their counties, not the wider Metro East.
   */
  confirmedCities: ["Edwardsville, IL", "Belleville, IL"],

  /* ---------------- Domains ---------------- */
  /**
   * Production domain is configurable so the preview can stay non-indexable
   * while the future launch domain is already wired into canonicals and
   * structured data. See README "Preview vs production indexing".
   */
  productionUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://showmeelectrical.com",
  /**
   * OPTIONAL careers property. When set, the careers pages are served on
   * this hostname (middleware host rules, host-aware sitemap/robots), nav
   * and footer may link to it, and the application route is live. When
   * `null`, no careers route, host rule, nav entry or sitemap entry exists —
   * the app/careers tree answers 404 and /api/apply is disabled.
   */
  careers: {
    url: "https://careers.showmeelectrical.com",
    /** Legacy WordPress origin the careers chrome still links to. */
    wordpressUrl: "https://showmeelectrical.com",
  } as { url: string; wordpressUrl: string } | null,

  /* ---------------- Business description & taxonomy ---------------- */
  /**
   * Schema.org type for the business. Change per client — e.g. "Plumber",
   * "HVACBusiness", "RoofingContractor", "GeneralContractor".
   */
  schemaType: "Electrician",
  /** One-line description reused in LocalBusiness structured data. */
  businessDescription:
    "Owner-led electrical contractor serving St. Louis City, St. Louis County and the Greater St. Louis area with residential, commercial and industrial electrical work and emergency electrical repairs.",
  /** Top-level service pathways, mirrored in the structured-data offer catalog. */
  serviceCatalogName: "Electrical services",
  serviceCatalog: [
    "Residential electrical services",
    "Commercial electrical services",
    "Industrial electrical services",
    "Emergency electrical repairs",
  ],
  /**
   * Owned brand assets, served by this site (never a retired WordPress
   * upload). `shareImage` is the default Open Graph / Twitter card for every
   * page without a bespoke image (1200×630, generated from the client's logo
   * on the brand surface — no photography, no claims). `logoUrl` is the
   * 512×512 tile referenced by structured data.
   */
  shareImage: "/share-default.png",
  logoUrl: "/brand/logo-512.png",

  /* ---------------- Calls to action ---------------- */
  primaryCta: { label: "Get a free quote", href: "/contact" },
  secondaryCta: { label: "Call 314-571-9756", href: "tel:+13145719756" },

  /* ---------------- Navigation ---------------- */
  /**
   * Entries point at real routes where they exist and at the matching
   * homepage section where the page is still planned (/#process), so every
   * link resolves. Swap an href to the real route when that page is built;
   * nothing else needs to change.
   */
  nav: [
    { label: "Services", href: "/services" },
    { label: "Our Process", href: "/#process" },
    { label: "About", href: "/about" },
    { label: "Service Area", href: "/service-area" },
    { label: "Blog", href: "/blog" },
    { label: "Careers", href: "https://careers.showmeelectrical.com", external: true },
    { label: "Contact", href: "/contact" },
  ] as NavItem[],

  footerLinks: [
    { label: "Services", href: "/services" },
    { label: "Our Process", href: "/#process" },
    { label: "About", href: "/about" },
    { label: "Service Area", href: "/service-area" },
    { label: "Blog", href: "/blog" },
    { label: "Careers", href: "https://careers.showmeelectrical.com", external: true },
    { label: "Contact", href: "/contact" },
  ] as NavItem[],

  /**
   * Legal documents carried over from WordPress verbatim (content/legal/).
   * Rendered in the footer's bottom bar.
   */
  legalLinks: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of Service", href: "/terms-of-service" },
  ] as NavItem[],

  /* ---------------- Business facts for structured data ---------------- */
  /**
   * Only facts verifiable on the client's own published material.
   * `priceRange` and `openingHours` are intentionally omitted until confirmed.
   */
  sameAs: [] as string[],

  /**
   * Owner-confirmed 2026-09-17: emergency electrical service IS offered.
   * See docs/decisions.md D-001. This resolves the conflict between the
   * approved keyword map (which targets "emergency electrician st louis") and
   * the live WordPress FAQ, whose "we do not offer emergency services" answer
   * is now known to be wrong and is not carried into the rebuild.
   *
   * HARD LIMIT — hours and response times are still unconfirmed. Emergency
   * service may be named as a service offered, with a phone number. Nothing
   * about WHEN it is available may be claimed: no 24/7, no after-hours or
   * weekend coverage, no guaranteed arrival or response times. Confirm real
   * hours before any availability wording ships.
   */
  offersEmergencyService: true,
} as const;

export type Site = typeof site;
