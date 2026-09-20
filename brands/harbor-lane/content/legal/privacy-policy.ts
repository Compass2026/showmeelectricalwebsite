import type { LegalDocument } from "@/content/legal/types";

/** Fictional demo policy: describes what a policy must cover, not a real practice. */
export const doc: LegalDocument = {
  slug: "privacy-policy",
  path: "/privacy-policy",
  title: "Privacy Policy",
  seo: { description: "Fictional demo privacy policy for Harbor Lane Plumbing." },
  lastUpdated: "2026-09-20",
  body: [
    { type: "p", text: "This is a demonstration document for a fictional company. A real client's policy is written for that client, names its actual providers, and is reviewed by the client before publication." },
    { type: "h2", text: "What the form collects" },
    { type: "p", text: "The contact form asks for a name, an email address or phone number, an optional service and the job details. On this demonstration site nothing submitted is delivered or stored." },
    { type: "h2", text: "Tracking" },
    { type: "p", text: "No analytics or advertising scripts run on this site." },
  ],
};
