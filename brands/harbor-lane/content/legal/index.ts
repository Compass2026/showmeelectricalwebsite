import type { LegalDocument } from "@/content/legal/types";
import type { Crumb } from "@/content/services/types";
import { doc as privacyPolicy } from "./privacy-policy";
import { doc as termsOfService } from "./terms-of-service";

export const legalDocuments: LegalDocument[] = [privacyPolicy, termsOfService];
export function findLegalDocument(slug: string): LegalDocument | undefined {
  return legalDocuments.find((d) => d.slug === slug);
}
export const legal = {
  breadcrumbs: (doc: LegalDocument): Crumb[] => [{ label: "Home", href: "/" }, { label: doc.title }],
  contact: { text: "Questions about this document?", label: "Contact Harbor Lane Plumbing", href: "/contact" },
};
