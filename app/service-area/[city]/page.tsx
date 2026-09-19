import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CityPage, { cityMetadata } from "@/components/site/CityPage";
import { cityPages, findCityPage } from "@/content/cities";

/** Only registered city pages are built; anything else is a real 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return cityPages.map((c) => ({ city: c.slug }));
}

type Props = { params: Promise<{ city: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params;
  const content = findCityPage(city);
  return content ? cityMetadata(content) : {};
}

/**
 * /service-area/<city> — a served-city page from the city registry
 * (content/cities/index.ts). The registry is the publication gate: a city
 * without a passing content file has no route.
 */
export default async function ServedCityPage({ params }: Props) {
  const { city } = await params;
  const content = findCityPage(city);
  if (!content) notFound();
  return <CityPage content={content} />;
}
