import { redirects as showmeRedirects } from "./showme/redirects";
import { redirects as harborLaneRedirects } from "./harbor-lane/redirects";

/**
 * BRAND REGISTRY — read by next.config.ts at build time (the only place
 * that cannot use the @brand alias). Everything else imports `@brand/...`,
 * which next.config maps to brands/<COMPASS_BRAND>/.
 *
 * `fictional` brands are demonstration content: a production build
 * (VERCEL_ENV=production) of one fails on purpose.
 */
export interface BrandEntry {
  dir: string;
  fictional: boolean;
  redirects: { source: string; destination: string; permanent: boolean }[];
}

export const brands: Record<string, BrandEntry> = {
  showme: { dir: "showme", fictional: false, redirects: showmeRedirects },
  "harbor-lane": { dir: "harbor-lane", fictional: true, redirects: harborLaneRedirects },
};

export const DEFAULT_BRAND = "showme";

export function activeBrand(): { name: string; entry: BrandEntry } {
  const name = process.env.COMPASS_BRAND ?? DEFAULT_BRAND;
  const entry = brands[name];
  if (!entry) throw new Error(`COMPASS_BRAND="${name}" is not a registered brand (brands/registry.ts). Known: ${Object.keys(brands).join(", ")}`);
  return { name, entry };
}
