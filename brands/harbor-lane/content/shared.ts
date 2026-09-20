import type { TrustPoint, ProcessStep } from "@/content/services/types";

/** Fictional trust points — kept modest and free of numbers we would need to source for a real client. */
export const trustPoints: TrustPoint[] = [
  { label: "Owner-led", detail: "Priya Example runs the company and still takes service calls." },
  { label: "Two local branches", detail: "Westfield for the north side, Eastgate for the south." },
  { label: "Licensed & insured", detail: "Fictional licence, fictional insurer — a demo of where these facts go." },
  { label: "Free walkthrough", detail: "We look, we explain, we quote. No obligation." },
];

export const processSteps: ProcessStep[] = [
  { step: "01", title: "Look", body: "A free walkthrough of the problem or the plan, with straight answers about what's needed and what isn't." },
  { step: "02", title: "Fix", body: "The work, done to code and cleaned up after. Parts from the branch counter, not a guess from the van." },
  { step: "03", title: "Test", body: "Pressure-tested, checked and explained before we leave, with what to watch for written down." },
];
