import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ServicePage, { serviceMetadata } from "@/components/services/ServicePage";
import { servicePages } from "@/content/services";

/**
 * /services/<slug> — a service HUB from the brand's registry. Only registered
 * hubs build; anything else is a real 404. All content lives in the brand's
 * content files; this route only binds it to the shared renderer.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return servicePages.map((p) => ({ slug: p.slug }));
}

type Props = { params: Promise<{ slug: string }> };

function find(slug: string) {
  return servicePages.find((p) => p.slug === slug);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = find(slug);
  return page ? serviceMetadata(page) : {};
}

export default async function ServiceHubPage({ params }: Props) {
  const { slug } = await params;
  const page = find(slug);
  if (!page) notFound();
  return <ServicePage content={page} />;
}
