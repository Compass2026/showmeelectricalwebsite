import type { ServicePageContent } from "@/content/services/types";
import { residential } from "./residential";
import { commercial } from "./commercial";
import { waterHeaterReplacement } from "./water-heater-replacement";

/** Harbor Lane (fictional demo) service registries — same contract as the reference client's. */
export const servicePages: readonly ServicePageContent[] = [residential, commercial];
export const serviceDetailPages: readonly ServicePageContent[] = [waterHeaterReplacement];
export const allServicePages: readonly ServicePageContent[] = [...servicePages, ...serviceDetailPages];
export function findServicePage(path: string): ServicePageContent | undefined {
  return allServicePages.find((p) => p.path === path);
}
