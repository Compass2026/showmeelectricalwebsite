import type { MetadataRoute } from "next";
import { resolveProperty, allowIndexing } from "@/lib/host";

/**
 * Host-aware robots.txt.
 *
 * Served on both hostnames, so it must advertise the sitemap for whichever
 * property is being requested. Rendered per request rather than at build time
 * for that reason.
 *
 * Preview (NEXT_PUBLIC_ALLOW_INDEXING unset): Disallow: / on both hosts.
 * Production (NEXT_PUBLIC_ALLOW_INDEXING=true): both hosts allowed, each
 * pointing at its own sitemap.
 */
export const dynamic = "force-dynamic";

export default async function robots(): Promise<MetadataRoute.Robots> {
  if (!allowIndexing) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  const { origin } = await resolveProperty();

  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: `${origin}/sitemap.xml`,
    host: origin,
  };
}
