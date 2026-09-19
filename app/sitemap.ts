import type { MetadataRoute } from "next";
import { jobs } from "@/lib/jobs";
import { resolveProperty } from "@/lib/host";
import { publishedRoutes } from "@/lib/routes";

/**
 * Host-aware sitemap, generated entirely from the registry of published
 * routes (lib/routes.ts). Nothing is listed unless it is registered and
 * therefore built; previews, drafts and redirected URLs never appear.
 *
 * `lastModified` is emitted only when a route records a significant content
 * change (article revision, policy update) — never the build time. Google
 * ignores priority and changefreq, so neither is emitted.
 *
 * Each hostname gets only its own URLs: a single sitemap spanning both
 * showmeelectrical.com and careers.showmeelectrical.com would be ignored for
 * the cross-domain entries unless both are verified together.
 */
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { property, origin } = await resolveProperty();

  if (property === "careers") {
    return [
      { url: `${origin}/` },
      ...jobs.map((job) => ({ url: `${origin}/jobs/${job.slug}` })),
    ];
  }

  return publishedRoutes().map((route) => ({
    url: route.path === "/" ? origin : `${origin}${route.path}`,
    ...(route.lastModified ? { lastModified: route.lastModified } : {}),
  }));
}
