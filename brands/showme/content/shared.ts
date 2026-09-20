/**
 * SHARED CLIENT FACTS — used by the homepage and by every service page.
 *
 * Kept out of content/home.ts so a service page does not import "homepage"
 * content, and out of the components so nothing client-specific is hard-coded
 * in a shared component.
 */
import type { TrustPoint, ProcessStep } from "@/content/services/types";

/**
 * Source: live /about/ page and live FAQ. No numbers invented.
 * The Master Electrician credential is owner-confirmed — see decisions D-002.
 */
export const trustPoints: TrustPoint[] = [
  {
    label: "Master Electrician",
    detail: "Owner-led by Dan — on the job himself, not behind a sales desk.",
  },
  {
    label: "20+ years",
    detail: "Across residential, commercial and industrial systems.",
  },
  {
    label: "Licensed, insured & bonded",
    detail: "Backed by proper certifications and liability coverage.",
  },
  {
    label: "Free consultations",
    detail: "We review the work and answer questions — no strings attached.",
  },
];

/**
 * Source: the three-step process published on the live homepage ("Request a
 * Quote", "Concepts & planning", "Install & Execution"), with the third
 * extended to completed work. The homepage renders these with photography as
 * the circuit scroll story; service pages render them as a compact strip.
 */
export const processSteps: ProcessStep[] = [
  {
    step: "01",
    title: "Plan",
    body: "Start with a free consultation. We review the project, answer your questions and map the electrical work against your space, its use and what you will need from it later — no strings attached.",
  },
  {
    step: "02",
    title: "Install",
    body: "Our electricians deliver clean, efficient installs — conduit run straight, boxes set true, everything on time and up to code. Rough-in is where quality is decided, long before anything is covered up.",
  },
  {
    step: "03",
    title: "Power on",
    body: "Final connections, testing and inspection. The work gets closed up and handed over finished — safe, labelled and built to last, from a single fixture to a full service.",
  },
];
