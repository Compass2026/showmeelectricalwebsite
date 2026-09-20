import type { LegalDocument } from "@/content/legal/types";

export const doc: LegalDocument = {
  slug: "terms-of-service",
  path: "/terms-of-service",
  title: "Terms of Service",
  seo: { description: "Fictional demo terms for Harbor Lane Plumbing." },
  lastUpdated: "2026-09-20",
  body: [
    { type: "p", text: "Demonstration document for a fictional company. Nothing here creates an obligation for anyone." },
    { type: "h2", text: "Quotes" },
    { type: "p", text: "A written quote follows a free walkthrough. Work starts only after the quote is accepted." },
  ],
};
