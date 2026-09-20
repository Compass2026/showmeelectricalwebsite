import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ServicePage, { serviceMetadata } from "@/components/services/ServicePage";
import { serviceDetailPages } from "@/content/services";

/**
 * /services/<hub>/<child> — an individual service page beneath a hub. Built
 * only for registered detail pages whose `parent` is that hub.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return serviceDetailPages.flatMap((p) => {
    const parent = p.parent?.split("/").pop();
    return parent ? [{ slug: parent, child: p.slug }] : [];
  });
}

type Props = { params: Promise<{ slug: string; child: string }> };

function find(slug: string, child: string) {
  return serviceDetailPages.find((p) => p.slug === child && p.parent === `/services/${slug}`);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, child } = await params;
  const page = find(slug, child);
  return page ? serviceMetadata(page) : {};
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug, child } = await params;
  const page = find(slug, child);
  if (!page) notFound();
  return <ServicePage content={page} />;
}
