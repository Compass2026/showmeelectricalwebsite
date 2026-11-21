import type { Block } from "../blocks";
import type { Photo } from "../services/types";

/** A Compass post's approved hero (see `Article.heroImage`). */
export interface CompassHeroImage {
  /** Root-relative, e.g. "/blog/images/<slug>-<hash12>.webp". */
  src: string;
  alt: string;
  width: number;
  height: number;
  illustrative: boolean;
}

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
    /**
     * The approved SEO title, when it differs from the on-page title (H1).
     * Used for the document <title>, og:title and twitter:title, with the
     * brand suffix only while the whole stays within 60 characters. Omit it
     * and `title` is used, exactly as before.
     */
    title?: string;
    /** ≤ 155 characters. */
    description: string;
  };
  /** ISO date (YYYY-MM-DD) as published at the source. Omit if unknown. */
  publishedAt?: string;
  /** Byline exactly as published at the source. Omit if unknown. */
  author?: string;
  /**
   * ISO date of the last SUBSTANTIVE revision, when one has happened. Shown
   * as "Updated", emitted as `dateModified`, used as the sitemap lastmod.
   * Never set by a build or a cosmetic change; omit when unknown.
   */
  modifiedAt?: string;
  /** Published service pages this article supports (root-relative paths). */
  relatedServices?: string[];
  /** Slugs of other published articles worth reading next. */
  relatedArticles?: string[];
  /** One or two sentences for the index and for `description` fallbacks. */
  excerpt: string;
  /** Optional lead image — only ever the client's own photography. */
  image?: Photo;
  /**
   * The approved summary, on Compass posts only (compass-blog.json
   * `tldr: true`). Rendered once, labelled, between the H1 and the hero.
   */
  tldr?: string;
  /**
   * The approved hero image of a Compass post (compass-blog.json
   * `hero_image: true`): a content-addressed file the CRM commits under
   * public/blog/images/ in the same commit as the post. `illustrative` marks
   * a generated graphic; it is kept for provenance and NEVER rendered as a
   * caption — the alt text describes the image. Hand-written posts use `image`.
   */
  heroImage?: CompassHeroImage;
  body: Block[];
  /**
   * Provenance of an article published by the Compass CRM (compass-blog.json).
   * Present only on entries in brands/<brand>/content/blog/compass-posts.ts;
   * the post page renders `data-compass-release` from it so the CRM can verify
   * the exact approved release is live. Hand-written posts never carry it.
   */
  compass?: {
    release_hash: string;
    draft_id: string;
    draft_version: number;
    keyword_id: string | null;
  };
  /**
   * Reviewer flags: claims in the source that conflict with confirmed
   * business facts or need confirmation. Shown in the reviewer notice, never
   * on the page.
   */
  flags?: string[];
}
