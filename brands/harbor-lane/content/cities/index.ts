import type { CityPageContent } from "@/content/cities/types";
import { northgate } from "./northgate";

export const cityPages: readonly CityPageContent[] = [northgate];
export function findCityPage(slug: string): CityPageContent | undefined {
  return cityPages.find((c) => c.slug === slug);
}
export function cityHref(slug: string | undefined): string | undefined {
  return slug ? findCityPage(slug)?.path : undefined;
}
