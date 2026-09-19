import type { Metadata } from "next";
import ServicePage, { serviceMetadata } from "@/components/services/ServicePage";
import { commercial } from "@/content/services/commercial";

export const dynamic = "force-static";

export const metadata: Metadata = serviceMetadata(commercial);

/** /services/commercial — content in content/services/commercial.ts; this route only binds it. */
export default function CommercialPage() {
  return <ServicePage content={commercial} />;
}
