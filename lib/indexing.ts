/**
 * Indexing is opt-in per environment and applies to BOTH hostnames.
 *
 * Preview deployments leave NEXT_PUBLIC_ALLOW_INDEXING unset, so the main
 * site and the careers routes are equally non-indexable. Production sets it
 * to "true", and both become indexable. Read from here (no server-only
 * imports) so client components such as the review banner can use it.
 */
export const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";
