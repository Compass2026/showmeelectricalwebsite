import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LocationPage, { locationMetadata } from "@/components/site/LocationPage";
import { locationPages, findLocationPage } from "@/content/locations";

/**
 * /locations/<slug> — physical branch pages from the location registry.
 * Only registered locations are built; with an empty registry (the
 * reference client, and every build without COMPASS_DEMO) no page exists
 * and every URL under /locations is a real 404.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return locationPages.map((l) => ({ slug: l.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const content = findLocationPage(slug);
  return content ? locationMetadata(content) : {};
}

export default async function BranchLocationPage({ params }: Props) {
  const { slug } = await params;
  const content = findLocationPage(slug);
  if (!content) notFound();
  return <LocationPage content={content} />;
}
