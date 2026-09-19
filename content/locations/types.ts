import type { Block } from "../blocks";
import type { Crumb, Faq, Photo, RelatedLink } from "../services/types";

/**
 * PHYSICAL BRANCH / LOCATION PAGE CONTENT MODEL (Page Template Library §7).
 *
 * A location page represents a REAL place of business with accurate
 * visitor and contact information. It is a different template from a
 * served-city page (content/cities): a served city has no address, no
 * hours and no "visit us"; a location has all three, verified.
 *
 * Every field is a verified fact or omitted. Hours are rendered only when
 * confirmed; directions only where visiting is appropriate (`visitable`);
 * people only with real names and roles, never a stock portrait.
 *
 * Structured data: a genuine LocalBusiness subtype for THIS location,
 * linked to its parent organization. The `schemaType` and the parent are
 * part of the content, so a fixture can describe a fictional parent
 * without touching the client's business node.
 */
export type LocationSectionKey =
  | "header"
  | "visit"
  | "hours"
  | "services"
  | "team"
  | "body"
  | "faqs"
  | "related"
  | "cta";

export interface OpeningHours {
  /** Days this rule covers, schema.org day names: "Monday" … "Sunday". */
  days: string[];
  /** 24-hour "HH:MM", or omit both for closed. */
  opens?: string;
  closes?: string;
}

export interface BranchLocationContent {
  /** Route segment under /locations/, e.g. "westfield". */
  slug: string;
  path: string;
  /** The location's real-world name as customers know it. */
  name: string;
  /** schema.org LocalBusiness subtype for this location, e.g. "Plumber". */
  schemaType: string;
  /** The organization this location belongs to. */
  parent: { name: string; url: string };
  /**
   * TRUE ONLY ON A DEMONSTRATION FIXTURE. Renders a visible notice, forces
   * noindex, and keeps the page out of the route registry (sitemap, manifest)
   * and out of every client build without the demo flag.
   */
  fictional?: boolean;
  /** Keep the page out of the index and the sitemap (implied by `fictional`). */
  noindex?: boolean;
  /** ISO date of the last substantive content revision, when known. */
  modifiedAt?: string;

  seo: { title: string; description: string; image?: string };

  breadcrumbs: Crumb[];

  header: {
    eyebrow: string;
    /** The page's only H1: the location's name. */
    headline: string;
    intro: string;
    image?: Photo;
  };

  /** Public address; omit the street when the address is not public. */
  address: {
    street?: string;
    city: string;
    region: string;
    postalCode: string;
    country: string;
  };
  phone: string;
  phoneHref: string;
  email?: string;
  /** Whether customers visit. Directions and parking are shown only when true. */
  visitable: boolean;
  /** Access, parking, entrance — plain facts. */
  access?: string[];
  /** A directions URL (a maps link) — only when visiting is appropriate. */
  directionsUrl?: string;

  /** Confirmed regular hours; omit entirely when unconfirmed. */
  hours?: { heading: string; rules: OpeningHours[]; note?: string };

  /** Services available at this location — a table, since availability varies by place. */
  services?: {
    heading: string;
    intro?: string;
    columns: [string, string, string];
    rows: { service: string; available: string; note: string }[];
  };

  /** Real people at this location. No photo unless one exists — none is faked. */
  team?: { heading: string; people: { name: string; role: string; photo?: Photo }[] };

  /** Free-form verified detail, as typed blocks. */
  body?: { heading: string; blocks: Block[] };

  faqs?: { heading: string; items: Faq[] };

  related?: { heading: string; links: RelatedLink[] };

  cta: { heading: string; body: string };

  /** Areas this location serves, for `areaServed` — names only. */
  areaServed?: string[];

  /** Render order. Sections not listed are not rendered. */
  sections: LocationSectionKey[];
}
