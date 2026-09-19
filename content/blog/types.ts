import type { Block } from "../blocks";
import type { Photo } from "../services/types";

/**
 * ARTICLE — one blog post, as data.
 *
 * Attribution and dates are optional on purpose: they are rendered and put
 * into schema only when the source actually carries them. Nothing here is
 * ever invented to fill a gap.
 */
export interface Article {
  slug: string;
  /** Path from the site root, e.g. "/blog/<slug>". */
  path: string;
  title: string;
  seo: {
    /** ≤ 155 characters. */
    description: string;
  };
  /** ISO date (YYYY-MM-DD) as published at the source. Omit if unknown. */
  publishedAt?: string;
  /** Byline exactly as published at the source. Omit if unknown. */
  author?: string;
  /** One or two sentences for the index and for `description` fallbacks. */
  excerpt: string;
  /** Optional lead image — only ever the client's own photography. */
  image?: Photo;
  body: Block[];
  /**
   * Reviewer flags: claims in the source that conflict with confirmed
   * business facts or need confirmation. Shown in the reviewer notice, never
   * on the page.
   */
  flags?: string[];
}
