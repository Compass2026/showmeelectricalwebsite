import type { BranchLocationContent } from "./types";
import { demoLocations } from "@/content/demo";

/**
 * REGISTRY OF PHYSICAL LOCATION PAGES.
 *
 * Real client locations are registered here, one content file each, and
 * only when every field is verified against the client's own records.
 * Show Me Electrical operates from one shop and has no public branch pages,
 * so the client list is empty.
 *
 * The fictional demonstration fixture is appended ONLY when the build sets
 * COMPASS_DEMO=true (never in a client's production environment). Without
 * the flag, the /locations/[slug] route has no params and every URL under
 * it is a real 404. Fixtures are `fictional`, which also keeps them out of
 * `publishedRoutes()` — so out of the sitemap and the manifest — even in
 * a demo build.
 */
export const demoEnabled = process.env.COMPASS_DEMO === "true";

const clientLocations: readonly BranchLocationContent[] = [];

export const locationPages: readonly BranchLocationContent[] = [
  ...clientLocations,
  ...(demoEnabled ? demoLocations : []),
];

export function findLocationPage(slug: string): BranchLocationContent | undefined {
  return locationPages.find((l) => l.slug === slug);
}
