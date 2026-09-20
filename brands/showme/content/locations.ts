import type { BranchLocationContent } from "@/content/locations/types";

/**
 * Show Me Electrical operates from one shop and publishes no branch pages,
 * so the client location list is empty. The fictional demo fixture is
 * appended by the framework registry only under COMPASS_DEMO=true.
 */
export const clientLocations: readonly BranchLocationContent[] = [];

/** No /locations index for a single-shop client. */
export const locationsIndex: null | {
  seo: { title: string; description: string; image?: string };
  breadcrumbs: { label: string; href?: string }[];
  hero: { eyebrow: string; headline: string; intro: string; image: { src: string; alt: string } };
  heading: string;
  intro?: string;
  cta: { heading: string; body: string };
} = null;
