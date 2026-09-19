/**
 * SERVICE PAGE CONTENT MODEL
 *
 * A service page is data. `components/services/ServicePage.tsx` renders
 * whatever sections a content file lists, in the order it lists them, so the
 * residential, commercial and industrial pages — and the 24 individual
 * service pages beneath them — share one component set while varying copy,
 * photography, section order and emphasis. No section component knows which
 * service it is rendering.
 *
 * Sourcing rule (same as everywhere): every string traces to the client's
 * own published material, the approved taxonomy, or an owner-confirmed
 * decision. Never invent credentials, statistics, guarantees or hours.
 *
 * Length is a page choice, not a template rule. A page may list four
 * services or thirteen, ask three questions or none, and omit any optional
 * section. `ServicePage` renders only the sections listed in `sections`
 * whose content is present, and emits FAQPage schema only when the FAQ
 * section is both rendered and non-empty — so a short page has no empty
 * areas and no schema describing content it does not show.
 */

export type ServiceSectionKey =
  | "hero"
  | "services"
  | "gallery"
  | "trust"
  | "process"
  | "faqs"
  | "related"
  | "cta";

export interface Photo {
  src: string;
  /** Describes what is actually in the frame — never a keyword string. */
  alt: string;
  /** Optional visible caption. */
  caption?: string;
}

export interface Crumb {
  label: string;
  /** Omit on the current page. */
  href?: string;
}

export interface ServiceItem {
  name: string;
  /** The homeowner's situation, in their words. */
  problem: string;
  /** What Show Me Electrical does about it. */
  solution: string;
  /** Dedicated page, once it exists. Absent = not a link. */
  href?: string;
}

export interface Faq {
  q: string;
  a: string;
}

export interface TrustPoint {
  label: string;
  detail: string;
}

export interface ProcessStep {
  step: string;
  title: string;
  body: string;
}

export interface RelatedLink {
  label: string;
  href: string;
  description: string;
}

export interface ServicePageContent {
  /** ISO date of the last substantive content revision, when known. */
  modifiedAt?: string;
  /** Route segment, e.g. "residential" or "electrical-panel-upgrades". */
  slug: string;
  /** Path from the site root, e.g. "/services/residential". */
  path: string;
  /**
   * For an individual service page: the path of the hub it belongs to
   * (e.g. "/services/residential"). Absent on a hub. The route registry
   * records it as the page's parent and the hub is expected to link the
   * page from its `services.items[].href`.
   */
  parent?: string;

  seo: {
    /** ≤ 60 characters, primary term forward. */
    title: string;
    /** ≤ 155 characters, service and location present. */
    description: string;
    /** Primary keyword this page targets — one per page, no cannibalisation. */
    keyword: string;
    supporting: string[];
    /** Absolute or root-relative image for og:image. */
    image: string;
  };

  schema: {
    /** schema.org Service `name`. */
    name: string;
    /** schema.org Service `serviceType`. */
    serviceType: string;
  };

  breadcrumbs: Crumb[];

  /**
   * How the page is presented in the /services directory and on pathway
   * cards. Optional; falls back to `schema.name` and `hero.intro`.
   */
  directory?: { title: string; summary: string };

  hero: {
    eyebrow: string;
    /** The page's only H1. Carries the primary keyword and the location. */
    headline: string;
    intro: string;
    image: Photo;
  };

  services: {
    /** Small label above the heading. Optional; nothing is shown if absent. */
    eyebrow?: string;
    heading: string;
    intro?: string;
    items: ServiceItem[];
  };

  gallery?: {
    /** Small label above the heading. Optional; nothing is shown if absent. */
    eyebrow?: string;
    heading: string;
    intro?: string;
    photos: Photo[];
  };

  trust?: {
    /** Small label above the heading. Optional; nothing is shown if absent. */
    eyebrow?: string;
    heading: string;
    intro?: string;
    points: TrustPoint[];
  };

  process?: {
    /** Small label above the heading. Optional; nothing is shown if absent. */
    eyebrow?: string;
    heading: string;
    intro?: string;
    steps: ProcessStep[];
  };

  faqs?: {
    /** Small label above the heading. Optional; nothing is shown if absent. */
    eyebrow?: string;
    heading: string;
    intro?: string;
    items: Faq[];
  };

  related?: {
    /** Small label above the heading. Optional; nothing is shown if absent. */
    eyebrow?: string;
    heading: string;
    links: RelatedLink[];
  };

  cta: {
    heading: string;
    body: string;
  };

  /** Render order. Sections not listed are not rendered. */
  sections: ServiceSectionKey[];
}
