import type { Block } from "../blocks";

/**
 * LEGAL DOCUMENT — privacy policy, terms, etc., as data.
 *
 * Wording is preserved from the source for review; nothing is replaced with
 * generic text. `lastUpdated` is rendered only when the source states it.
 */
export interface LegalDocument {
  slug: string;
  path: string;
  title: string;
  seo: { description: string };
  /** As stated at the source, e.g. "2025-03-01". Omit if the source has none. */
  lastUpdated?: string;
  body: Block[];
  /** Reviewer flags — references likely outdated after the move. Never rendered on the page. */
  flags?: string[];
}
