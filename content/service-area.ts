/**
 * A county (or equivalent region) and the communities named within it.
 * Geography is data: each brand supplies its own groups and the
 * `CoverageGroups` component renders whatever it is given.
 */
export interface CoverageGroup {
  /** e.g. "St. Louis County" */
  name: string;
  /** Short qualifier shown under the name, e.g. "Home of our shop in Affton." */
  note?: string;
  /**
   * Named communities. May be empty when only the county is verified.
   * A community may reference its served-city page by slug; the hub links
   * it ONLY when that slug is registered in the brand's city registry
   * (publication-aware), otherwise the name stays plain text.
   */
  communities: Community[];
}

export type Community = string | { name: string; page: string };

/** Resolved from the active brand (COMPASS_BRAND → brands/<brand>). Client coverage content. */
export { serviceArea } from "@brand/content/service-area";
