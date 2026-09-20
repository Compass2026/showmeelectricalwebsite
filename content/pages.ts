/**
 * CORE PAGE — the record shape every brand's page registry uses (the
 * "page manifest" of Build Standard §6). The active brand supplies the list.
 */
export interface CorePage {
  path: string;
  title: string;
  parent?: string;
  /** Outgoing relationships the page renders as links. */
  related?: string[];
  /** Incoming link sources: paths, or "nav" / "footer" for site chrome (manifest only; the crawl counts rendered anchors). */
  incoming: string[];
  modifiedAt?: string;
}

/** Resolved from the active brand (COMPASS_BRAND → brands/<brand>). Client core pages. */
export { corePages } from "@brand/content/pages";
