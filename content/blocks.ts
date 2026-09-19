/**
 * Long-form content blocks — the unit of an article or legal document.
 *
 * Deliberately small: headings, paragraphs, lists, a quotation and a block
 * of short lines (an address, a sign-off) that belong in one paragraph with
 * line breaks. Anything richer (images, embeds) is a page decision, not a
 * block, so client content never carries markup.
 */
export type Block =
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "quote"; text: string }
  /** One paragraph rendered with a line break between each entry. */
  | { type: "lines"; lines: string[] };
