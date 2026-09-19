/**
 * LAUNCH REDIRECTS — every retained WordPress URL, mapped to a page that is
 * built. Client data, read by `next.config.ts`.
 *
 * Rules:
 *  - A redirect may only point at an implemented route. If the destination
 *    is not built yet, the source is left alone (it 404s honestly) and the
 *    mapping stays in docs/migration-inventory.md as a decision.
 *  - Trailing-slash variants are not listed: with `trailingSlash: false`
 *    Next.js strips the slash itself (308) BEFORE these rules run, so
 *    `/about/` reaches `/about` in one hop and a renamed path such as
 *    `/st-louis/` reaches its destination in two (`/st-louis/` → `/st-louis`
 *    → `/services/industrial`). Listing `/st-louis/` here would have no
 *    effect — verified with curl.
 *  - `/global-styles/` is a 410, served by `app/global-styles/route.ts`, not
 *    a redirect — it was never content.
 *  - `/careers` and `/career` on the main host go to the careers property;
 *    handled in `middleware.ts` (main-host branch) so the careers host's own
 *    rules are untouched.
 */
export interface Redirect {
  source: string;
  destination: string;
  permanent: boolean;
}

export const redirects: Redirect[] = [
  // Renamed / consolidated pages
  { source: "/locations", destination: "/service-area", permanent: true },
  // The old page was an industrial pitch for St. Louis (H1 "Industrial
  // Electrical solutions for St. Louis, Missouri") plus a county list, so
  // its content maps to the industrial hub. Decided on the old page's
  // content, not as a placeholder for a future city page (Tom, 2026-09-19).
  { source: "/st-louis", destination: "/services/industrial", permanent: true },

  // Posts moved under /blog
  {
    source: "/top-5-signs-your-home-needs-electrical-rewiring",
    destination: "/blog/top-5-signs-your-home-needs-electrical-rewiring",
    permanent: true,
  },
  {
    source: "/the-most-common-electrical-hazards-found-in-missouri-homes",
    destination: "/blog/the-most-common-electrical-hazards-found-in-missouri-homes",
    permanent: true,
  },
  {
    source: "/top-signs-you-need-to-call-an-electrician-immediately",
    destination: "/blog/top-signs-you-need-to-call-an-electrician-immediately",
    permanent: true,
  },
  { source: "/category/blog", destination: "/blog", permanent: true },

  // Retained job-site photos: the old upload URL → the re-encoded file, so an
  // inbound link or image-search result still resolves. Stock and unused
  // uploads are deliberately not redirected (migration inventory §7b).
  ...[
    ["2025/10/10BF7BF3-A2B5-48E8-8859-44E5ABA87C19_4_5005_c.jpg", "industrial-high-bay"],
    ["2025/10/B8048B09-5E7D-4030-935C-826FBC99AA97-1.jpg", "commercial-checkout"],
    ["2025/10/IMG_0179-1.jpg", "finished-interior-lighting"],
    ["2025/10/IMG_0354-1.jpg", "ceiling-fan-install"],
    ["2025/10/IMG_0488-1.jpg", "roughin-attic"],
    ["2025/10/IMG_1447-1.jpg", "commercial-panels"],
    ["2025/10/IMG_2411-1.jpg", "roughin-wall"],
    ["2025/10/IMG_7032-1.jpg", "roughin-framing"],
    ["2025/10/PHOTO-2025-04-15-22-41-56.jpg", "service-entrance"],
  ].map(([old, name]) => ({
    source: `/wp-content/uploads/${old}`,
    destination: `/photos/${name}.webp`,
    permanent: true,
  })),

  // WordPress sitemap index and its four sub-sitemaps → the Next.js sitemap.
  // Listed explicitly (from the live wp-sitemap.xml) rather than by pattern,
  // so nothing is appended to the destination as a query string.
  ...[
    "/wp-sitemap.xml",
    "/wp-sitemap-posts-post-1.xml",
    "/wp-sitemap-posts-page-1.xml",
    "/wp-sitemap-taxonomies-category-1.xml",
    "/wp-sitemap-users-1.xml",
  ].map((source) => ({ source, destination: "/sitemap.xml", permanent: true })),
];

