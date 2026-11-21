import type { Article } from "./types";

/**
 * COMPASS POSTS — articles the Compass CRM publishes (compass-blog.json at the
 * repository root is the contract). They live in a generated file per brand,
 * brands/<brand>/content/blog/compass-posts.ts, as a JSON array between
 * `compass:begin` / `compass:end` markers; the CRM rewrites only that array.
 *
 * This merge runs when the registry module loads, so `next build`, the type
 * check of the route manifest and `qa:manifest` all FAIL — rather than
 * silently shadow one article with another or render half an article — when:
 *   - a slug appears twice (hand-written or Compass, in any combination);
 *   - a Compass post is malformed: a slug that is not kebab-case, a path that
 *     is not `/blog/<slug>`, an empty title / description / excerpt / TL;DR /
 *     seo.title, a date that is not YYYY-MM-DD, an empty body, or no
 *     `compass` provenance;
 *   - a Compass post carries an author or a lead `image` (no byline until
 *     that is decided; `image` is only ever the client's own photography,
 *     added by hand);
 *   - a Compass hero is not a content-addressed file in the advertised
 *     folder (`/blog/images/<slug>-<12 hex>.<png|jpg|webp>`), or lacks alt
 *     text or whole-pixel dimensions;
 *   - a hand-written post carries `heroImage` or `tldr` (Compass-only fields).
 *
 * The hero's file itself is checked when the post pages are generated
 * (app/blog/[slug]/page.tsx): a missing file fails the build there.
 */

/** compass-blog.json `hero_image_url_prefix` (the public/ folder `hero_image_dir`). */
export const COMPASS_HERO_PREFIX = "/blog/images/";

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const filled = (v: unknown) => typeof v === "string" && v.trim().length > 0;

function checkCompassPost(a: Article): void {
  const bad = (why: string): never => {
    throw new Error(`Compass post "${a.slug}" is malformed: ${why}.`);
  };
  if (typeof a.slug !== "string" || !SLUG.test(a.slug)) bad("its slug is not lowercase kebab-case");
  if (a.path !== `/blog/${a.slug}`) bad(`its path is "${a.path}"; Compass posts are served at /blog/${a.slug}`);
  if (!filled(a.title)) bad("it has no title");
  if (!a.seo || !filled(a.seo.description)) bad("it has no seo.description");
  if (a.seo.title !== undefined && !filled(a.seo.title)) bad("it has an empty seo.title; omit it or carry the approved meta title");
  if (!filled(a.excerpt)) bad("it has no excerpt");
  if (a.publishedAt !== undefined && !DATE.test(a.publishedAt)) bad("publishedAt is not YYYY-MM-DD");
  if (!Array.isArray(a.body) || a.body.length === 0) bad("its body is empty");
  if (a.tldr !== undefined && !filled(a.tldr)) bad("it has an empty tldr; omit it or carry the approved summary");
  const c = a.compass;
  if (!c || !/^sha256:[0-9a-f]{64}$/.test(c.release_hash) || !filled(c.draft_id) || !Number.isInteger(c.draft_version)) {
    bad("it carries no complete compass provenance (release_hash, draft_id, draft_version)");
  }
  if (a.author !== undefined) bad("it carries an author; Compass posts have no byline");
  if (a.image !== undefined) bad("it carries a lead image; only the client's own photography is added, by hand (Compass heroes use heroImage)");
  const h = a.heroImage;
  if (h !== undefined) {
    const file = new RegExp(`^${COMPASS_HERO_PREFIX.replace(/\//g, "\\/")}${a.slug}-[0-9a-f]{12}\\.(?:png|jpg|webp)$`);
    if (typeof h.src !== "string" || !file.test(h.src)) bad(`its hero src "${h?.src}" is not ${COMPASS_HERO_PREFIX}${a.slug}-<12 hex>.<png|jpg|webp>`);
    if (!filled(h.alt)) bad("its hero has no alt text");
    if (!Number.isInteger(h.width) || !Number.isInteger(h.height) || h.width < 1 || h.height < 1) bad("its hero has no whole-pixel width and height");
    if (typeof h.illustrative !== "boolean") bad("its hero does not say whether it is illustrative");
  }
}

export function mergeCompassPosts(handWritten: Article[], compassPosts: Article[]): Article[] {
  const seen = new Map<string, string>();
  const claim = (slug: string, source: string) => {
    const prior = seen.get(slug);
    if (prior) throw new Error(`Duplicate blog slug "${slug}": ${prior} and ${source}. Every article needs its own slug.`);
    seen.set(slug, source);
  };
  for (const a of handWritten) {
    if (a.heroImage !== undefined || a.tldr !== undefined) {
      throw new Error(`Hand-written post "${a.slug}" carries heroImage or tldr; those are Compass-post fields (use image for the client's photography).`);
    }
    claim(a.slug, "a hand-written post");
  }
  for (const a of compassPosts) {
    checkCompassPost(a);
    claim(a.slug, "a Compass post");
  }
  return [...handWritten, ...compassPosts];
}
