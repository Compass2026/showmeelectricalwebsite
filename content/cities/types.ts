import type { Block } from "../blocks";
import type { Crumb, Faq, Photo, ProcessStep, RelatedLink } from "../services/types";

/**
 * SERVED-CITY PAGE CONTENT MODEL (Page Template Library §6).
 *
 * A served-city page explains what the business does in a community it
 * actually serves. It is NOT an office listing: the page's structured data
 * is the real business entity with `areaServed`, never a fictional branch,
 * and the page says plainly where the work is run from.
 *
 * Publication gate (Build Standard): a city page exists only when coverage
 * is owner-confirmed AND the page carries local information that adds
 * value beyond a swapped city name. Every claim traces to a client-owned
 * source or public fact; unknown facts (travel charges, permits, utilities)
 * are omitted, not guessed.
 */
export type CitySectionKey =
  | "hero"
  | "facts"
  | "services"
  | "context"
  | "process"
  | "faqs"
  | "related"
  | "cta";

/** A labelled, verifiable fact — the extractable answer an agent or a hurried visitor wants. */
export interface LabeledFact {
  label: string;
  value: string;
}

export interface CityPageContent {
  /** Route segment under /service-area/, e.g. "edwardsville-il". */
  slug: string;
  path: string;
  city: string;
  /** Full state name and postal code, e.g. "Illinois" / "IL". */
  state: string;
  stateCode: string;
  /** ISO date of the last substantive content revision, when known. */
  modifiedAt?: string;

  seo: {
    title: string;
    description: string;
    keyword?: string;
    image: string;
  };

  breadcrumbs: Crumb[];

  hero: {
    eyebrow: string;
    /** The page's only H1. */
    headline: string;
    /** Direct answer first: served or not, and from where. */
    intro: string;
    image: Photo;
  };

  /** The coverage answer as a definition list of verified facts. */
  facts: {
    eyebrow?: string;
    heading: string;
    intro?: string;
    items: LabeledFact[];
  };

  /**
   * Services confirmed for this city. Paths only: the renderer resolves
   * them against the service registries and links only published pages,
   * so a planned service can never become a dead link here.
   */
  services: {
    eyebrow?: string;
    heading: string;
    intro?: string;
    paths: string[];
  };

  /** Genuine local context, as typed blocks (links checked by QA). */
  context?: {
    eyebrow?: string;
    heading: string;
    body: Block[];
  };

  process?: {
    eyebrow?: string;
    heading: string;
    intro?: string;
    steps: ProcessStep[];
  };

  faqs?: {
    eyebrow?: string;
    heading: string;
    intro?: string;
    items: Faq[];
  };

  related?: {
    heading: string;
    links: RelatedLink[];
  };

  cta: { heading: string; body: string };

  /** Render order. Sections not listed are not rendered. */
  sections: CitySectionKey[];
}
