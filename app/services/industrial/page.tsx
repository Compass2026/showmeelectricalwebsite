import type { Metadata } from "next";
import ServicePage, { serviceMetadata } from "@/components/services/ServicePage";
import { industrial } from "@/content/services/industrial";

export const dynamic = "force-static";

export const metadata: Metadata = serviceMetadata(industrial);

/** /services/industrial — content in content/services/industrial.ts; this route only binds it. */
export default function IndustrialPage() {
  return <ServicePage content={industrial} />;
}
