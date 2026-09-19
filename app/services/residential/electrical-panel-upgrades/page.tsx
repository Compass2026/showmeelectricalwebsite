import type { Metadata } from "next";
import ServicePage, { serviceMetadata } from "@/components/services/ServicePage";
import { electricalPanelUpgrades } from "@/content/services/electrical-panel-upgrades";

export const dynamic = "force-static";

export const metadata: Metadata = serviceMetadata(electricalPanelUpgrades);

/**
 * /services/residential/electrical-panel-upgrades — an individual service
 * page beneath the residential hub. Same renderer as the hubs; the content
 * file decides the emphasis and which sections exist.
 */
export default function ElectricalPanelUpgradesPage() {
  return <ServicePage content={electricalPanelUpgrades} />;
}
