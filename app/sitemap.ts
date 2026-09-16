import type { MetadataRoute } from "next";
import { jobs, SITE_URL } from "@/lib/jobs";
import { site } from "@/config/site.config";

/**
 * Only routes that actually exist are listed. Service and location pages from
 * the approved taxonomy are deliberately absent until those pages are built.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site.productionUrl, changeFrequency: "weekly", priority: 1 },
    {
      url: `${SITE_URL}/`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...jobs.map((job) => ({
      url: `${SITE_URL}/jobs/${job.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
