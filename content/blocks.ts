/**
 * Long-form content blocks — the unit of an article or legal document.
 *
 * Typed, never raw HTML: client content carries no markup, so nothing in a
 * content file can inject script or unsafe attributes, and every link is a
 * data value the QA crawl can check against the registry of published routes.
 *
 * Inline content: a paragraph or list item is either a plain string or an
 * array of `Inline` runs — text, a typed link, or emphasis. Links are the
 * Build Standard's "typed contextual links": internal hrefs must be
 * root-relative paths to published pages; external hrefs must be https.
 */
export type Inline =
  | string
  | {
      type: "link";
      text: string;
      /** Root-relative published path ("/services/residential") or https URL. */
      href: string;
      /** Optional accessible name when the visible text is not descriptive on its own. */
      title?: string;
    }
  | { type: "strong"; text: string }
  | { type: "em"; text: string };

export type RichText = string | Inline[];

export type Block =
  | { type: "h2"; text: string; id?: string }
  | { type: "h3"; text: string; id?: string }
  | { type: "p"; text: RichText }
  | { type: "ul"; items: RichText[] }
  | { type: "ol"; items: RichText[] }
  | { type: "quote"; text: RichText; cite?: string }
  /** One paragraph rendered with a line break between each entry. */
  | { type: "lines"; lines: string[] }
  /**
   * Semantic comparison table. `header` becomes `<th scope="col">` cells;
   * an optional `rowHeader` makes each row's first cell a `<th scope="row">`.
   * Renders inside a horizontally scrollable region on narrow screens.
   */
  | {
      type: "table";
      caption: string;
      header: string[];
      rows: RichText[][];
      rowHeader?: boolean;
    }
  /** Numbered source references, rendered as a labelled list of links. */
  | { type: "sources"; heading?: string; items: { label: string; href: string; note?: string }[] };

/** Plain-text projection of rich text, for excerpts, schema and QA. */
export function richTextToString(rich: RichText): string {
  if (typeof rich === "string") return rich;
  return rich.map((run) => (typeof run === "string" ? run : run.text)).join("");
}

/** Every href a block carries, for link checking. */
export function blockHrefs(blocks: Block[]): string[] {
  const out: string[] = [];
  const fromRich = (r: RichText) => {
    if (typeof r === "string") return;
    for (const run of r) if (typeof run !== "string" && run.type === "link") out.push(run.href);
  };
  for (const b of blocks) {
    switch (b.type) {
      case "p":
      case "quote":
        fromRich(b.text);
        break;
      case "ul":
      case "ol":
        b.items.forEach(fromRich);
        break;
      case "table":
        b.rows.forEach((row) => row.forEach(fromRich));
        break;
      case "sources":
        b.items.forEach((i) => out.push(i.href));
        break;
    }
  }
  return out;
}

/** True for a root-relative internal path (no protocol, no protocol-relative form). */
export function isInternalHref(href: string): boolean {
  return href.startsWith("/") && !href.startsWith("//");
}
