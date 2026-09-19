import type { ServicePageContent } from "./types";
import { residential } from "./residential";
import { commercial } from "./commercial";
import { industrial } from "./industrial";
import { electricalPanelUpgrades } from "./electrical-panel-upgrades";

/**
 * REGISTRY OF IMPLEMENTED SERVICE PAGES.
 *
 * The single list the rest of the site reads to know which service pages
 * exist: `lib/routes.ts` (sitemap, manifest, crawl) reads both lists below,
 * and nothing else. Planned pages (see docs/page-plan.md) are not listed
 * until their content file and route exist, so the sitemap can never
 * advertise a URL that 404s.
 *
 * Two lists, one shape:
 *  - `servicePages` — the pathway HUBS. The /services directory cards, the
 *    inquiry form's service groups and the homepage pathways read this one.
 *  - `serviceDetailPages` — individual service pages beneath a hub. Each
 *    declares its `parent`, and the hub links it from the matching
 *    `services.items[].href`, so the hub → child link is always real.
 *
 * Adding a page = a content file, a three-line route under app/services/,
 * and one entry below. Keep the three in step.
 */
export const servicePages: readonly ServicePageContent[] = [
  residential,
  commercial,
  industrial,
];

export const serviceDetailPages: readonly ServicePageContent[] = [
  electricalPanelUpgrades,
];

export const allServicePages: readonly ServicePageContent[] = [
  ...servicePages,
  ...serviceDetailPages,
];

/** A hub or detail page by its path, or undefined if none is published. */
export function findServicePage(path: string): ServicePageContent | undefined {
  return allServicePages.find((p) => p.path === path);
}
