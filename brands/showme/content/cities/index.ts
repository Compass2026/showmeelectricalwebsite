import type { CityPageContent } from "@/content/cities/types";
import { edwardsvilleIl } from "./edwardsville-il";

/**
 * REGISTRY OF PUBLISHED SERVED-CITY PAGES.
 *
 * A city is listed here only once its content file passes the city gate
 * (owner-confirmed coverage, sourced local facts) and its route builds.
 * The service-area hub links a community only when its page is registered
 * here (`cityHref`); every other community stays plain text. The page plan
 * (docs/page-plan.md §4) tracks the cities still planned — they are not
 * routes until they appear in this list.
 */
export const cityPages: readonly CityPageContent[] = [edwardsvilleIl];

export function findCityPage(slug: string): CityPageContent | undefined {
  return cityPages.find((c) => c.slug === slug);
}

/** The published path for a city slug, or undefined when no page exists. */
export function cityHref(slug: string | undefined): string | undefined {
  return slug ? findCityPage(slug)?.path : undefined;
}
