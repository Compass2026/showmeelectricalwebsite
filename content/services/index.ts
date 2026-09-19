import type { ServicePageContent } from "./types";
import { residential } from "./residential";
import { commercial } from "./commercial";
import { industrial } from "./industrial";

/**
 * REGISTRY OF IMPLEMENTED SERVICE PAGES.
 *
 * The single list the rest of the site reads to know which service pages
 * exist: `app/sitemap.ts` emits one entry per item here, and nothing else.
 * Planned pages (see docs/page-plan.md) are not listed until their content
 * file and route exist, so the sitemap can never advertise a URL that 404s.
 *
 * Adding a page = a content file, a three-line route under app/services/,
 * and one entry below. Keep the three in step.
 */
export const servicePages: readonly ServicePageContent[] = [
  residential,
  commercial,
  industrial,
];
