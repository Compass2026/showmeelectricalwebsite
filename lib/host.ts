import { headers } from "next/headers";
import { site } from "@/config/site.config";

/**
 * Which of the two properties a request is for, and the public origin to use
 * in its robots.txt, sitemap.xml and canonicals.
 *
 * `robots.txt` and `sitemap.xml` are single files in the app directory but are
 * served on BOTH hostnames. Without this, the careers site would advertise the
 * main site's sitemap, and one sitemap would list URLs across two domains —
 * which search engines ignore unless the domains are cross-verified.
 */
export type Property = "main" | "careers";

const CAREERS_HOST_PREFIX = "careers.";

export async function resolveProperty(): Promise<{
  property: Property;
  /** Public origin for this hostname, e.g. https://careers.showmeelectrical.com */
  origin: string;
}> {
  const host = (await headers()).get("host") ?? "";

  if (site.careers && host.startsWith(CAREERS_HOST_PREFIX)) {
    return { property: "careers", origin: site.careers.url };
  }
  return { property: "main", origin: site.productionUrl };
}

/**
 * Indexing is opt-in per environment and applies to BOTH hostnames.
 *
 * Preview deployments leave NEXT_PUBLIC_ALLOW_INDEXING unset, so the main site
 * and the careers routes are equally non-indexable. Production sets it to
 * "true", and both become indexable — which is correct, because the careers
 * site is a real, live property that should stay in the index.
 */
export const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";
