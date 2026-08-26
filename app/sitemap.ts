import type { MetadataRoute } from "next";
import { jobs, SITE_URL } from "@/lib/jobs";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...jobs.map((job) => ({
      url: `${SITE_URL}/jobs/${job.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
