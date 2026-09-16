import type { MetadataRoute } from "next";
import { site } from "@/config/site.config";

/**
 * Preview builds are fully disallowed. Set NEXT_PUBLIC_ALLOW_INDEXING=true in
 * the production environment only — see README "Preview vs production
 * indexing".
 */
const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";

export default function robots(): MetadataRoute.Robots {
  if (!allowIndexing) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: `${site.productionUrl}/sitemap.xml`,
  };
}
