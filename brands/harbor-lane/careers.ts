import type { Metadata } from "next";
import type { Job } from "@/lib/jobs";

/** No careers property for this brand: no jobs, no metadata, no delivery. */
export const careers = {
  jobs: [] as Job[],
  metadata: {} as Metadata,
  apply: { from: "", recipients: [] as string[] },
};
