import type { LegalDocument } from "./types";
import type { Crumb } from "../services/types";
import { doc as privacyPolicy } from "./privacy-policy";
import { doc as termsOfService } from "./terms-of-service";

/**
 * REGISTRY of legal documents — read by the routes, the footer's legal links
 * (via site.config) and the sitemap.
 */
export const legalDocuments: LegalDocument[] = [privacyPolicy, termsOfService];

export function findLegalDocument(slug: string): LegalDocument | undefined {
  return legalDocuments.find((d) => d.slug === slug);
}

export const legal = {
  breadcrumbs: (doc: LegalDocument): Crumb[] => [
    { label: "Home", href: "/" },
    { label: doc.title },
  ],
  /** Line under every legal document, pointing at the live contact page. */
  contact: {
    text: "Questions about this document?",
    label: "Contact Show Me Electrical",
    href: "/contact",
  },
};
