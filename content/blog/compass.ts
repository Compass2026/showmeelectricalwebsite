import type { Article } from "./types";

/**
 * COMPASS POSTS — articles the Compass CRM publishes (compass-blog.json at the
 * repository root is the contract). They live in a generated file per brand,
 * brands/<brand>/content/blog/compass-posts.ts, as a JSON array between
 * `compass:begin` / `compass:end` markers; the CRM rewrites only that array.
 *
 * This merge runs when the registry module loads, so `next build`, the type
 * check of the route manifest and `qa:manifest` all FAIL — rather than
 * silently shadow one article with another — when:
 *   - a slug appears twice (hand-written or Compass, in any combination);
 *   - a Compass post's path is not `/blog/<slug>`, or its seo.title is empty;
 *   - a Compass post has no `compass` provenance, or carries an author or a
 *     lead image (no byline until that is decided; images are only ever the
 *     client's own photography, added by hand).
 */
export function mergeCompassPosts(handWritten: Article[], compassPosts: Article[]): Article[] {
  const seen = new Map<string, string>();
  const claim = (slug: string, source: string) => {
    const prior = seen.get(slug);
    if (prior) throw new Error(`Duplicate blog slug "${slug}": ${prior} and ${source}. Every article needs its own slug.`);
    seen.set(slug, source);
  };
  for (const a of handWritten) claim(a.slug, "a hand-written post");
  for (const a of compassPosts) {
    if (a.path !== `/blog/${a.slug}`) throw new Error(`Compass post "${a.slug}" has path "${a.path}"; Compass posts are served at /blog/${a.slug}.`);
    if (!a.compass?.release_hash) throw new Error(`Compass post "${a.slug}" carries no compass.release_hash provenance.`);
    if (a.seo.title !== undefined && !a.seo.title.trim()) throw new Error(`Compass post "${a.slug}" has an empty seo.title; omit it or carry the approved meta title.`);
    if (a.author !== undefined) throw new Error(`Compass post "${a.slug}" carries an author; Compass posts have no byline.`);
    if (a.image !== undefined) throw new Error(`Compass post "${a.slug}" carries a lead image; only the client's own photography is added, by hand.`);
    claim(a.slug, "a Compass post");
  }
  return [...handWritten, ...compassPosts];
}
