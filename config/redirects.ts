/**
 * LAUNCH REDIRECTS — the record shape; each brand supplies its own list and
 * its `gone` paths (see brands/<brand>/redirects.ts). Read by next.config.ts
 * through brands/registry.ts and by app/global-styles/route.ts.
 */
export interface Redirect {
  source: string;
  destination: string;
  permanent: boolean;
}

/** Resolved from the active brand (COMPASS_BRAND → brands/<brand>). */
export { redirects, gone } from "@brand/redirects";
