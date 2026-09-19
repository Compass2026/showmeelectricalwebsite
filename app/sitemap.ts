import type { MetadataRoute } from "next";
import { jobs } from "@/lib/jobs";
import { resolveProperty } from "@/lib/host";
import { servicePages } from "@/content/services";

/**
 * Host-aware sitemap.
 *
 * Each hostname gets only its own URLs. A single sitemap listing both
 * showmeelectrical.com and careers.showmeelectrical.com would be ignored for
 * the cross-domain entries unless the domains are cross-verified in Search
 * Console, so the two are kept separate.
 *
 * Only routes that actually exist are listed. Service and location pages from
 * the approved taxonomy are deliberately absent until those pages are built.
 */
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { property, origin } = await resolveProperty();

  if (property === "careers") {
    return [
      { url: `${origin}/`, changeFrequency: "weekly", priority: 1 },
      ...jobs.map((job) => ({
        url: `${origin}/jobs/${job.slug}`,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
    ];
  }

  return [
    { url: origin, changeFrequency: "weekly", priority: 1 },
    { url: `${origin}/about`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${origin}/contact`, changeFrequency: "monthly", priority: 0.8 },
    // Service pages come from the registry of IMPLEMENTED pages, never from
    // the page plan: a planned page is not listed until it exists.
    ...servicePages.map((page) => ({
      url: `${origin}${page.path}`,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    // The careers site has its own hostname and its own sitemap, so its URLs
    // are deliberately not listed here.
  ];
}
