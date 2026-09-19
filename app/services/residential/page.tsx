import type { Metadata } from "next";
import ServicePage, { serviceMetadata } from "@/components/services/ServicePage";
import { residential } from "@/content/services/residential";

export const dynamic = "force-static";

export const metadata: Metadata = serviceMetadata(residential);

/**
 * /services/residential — the residential hub.
 * All content lives in content/services/residential.ts; this route only
 * binds it to the shared ServicePage renderer.
 */
export default function ResidentialPage() {
  return <ServicePage content={residential} />;
}
