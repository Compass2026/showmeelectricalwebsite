import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import PreviewNotice from "@/components/site/PreviewNotice";
import LegalLayout from "@/components/site/LegalLayout";
import { site } from "@/config/site.config";
import { pageMetadata } from "@/lib/metadata";
import { legal, legalDocuments, findLegalDocument } from "@/content/legal";
import {
  localBusinessJsonLd,
  websiteJsonLd,
  webPageJsonLd,
  breadcrumbJsonLd,
} from "@/lib/seo";

/**
 * /<doc> — legal documents (privacy policy, terms) at the root paths their
 * registry declares. Only registered slugs build; every other root path is
 * a real 404 (static routes such as /about take precedence over this one).
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return legalDocuments.map((d) => ({ doc: d.slug }));
}

type Props = { params: Promise<{ doc: string }> };

const titleOf = (t: string) => `${t} | ${site.name}`;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { doc: slug } = await params;
  const doc = findLegalDocument(slug);
  if (!doc) return {};
  return pageMetadata({ title: titleOf(doc.title), description: doc.seo.description, path: doc.path });
}

export default async function LegalPage({ params }: Props) {
  const { doc: slug } = await params;
  const doc = findLegalDocument(slug);
  if (!doc) notFound();
  const title = titleOf(doc.title);
  const breadcrumbs = legal.breadcrumbs(doc);
  const jsonLd = [
    localBusinessJsonLd(),
    websiteJsonLd(),
    webPageJsonLd(doc.path, title, doc.seo.description),
    breadcrumbJsonLd(breadcrumbs, doc.path),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PreviewNotice />
      <SiteHeader />
      <LegalLayout doc={doc} breadcrumbs={breadcrumbs} contact={legal.contact} />
      <SiteFooter />
    </>
  );
}
