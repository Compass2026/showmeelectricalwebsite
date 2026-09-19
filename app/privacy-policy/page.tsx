import type { Metadata } from "next";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import PreviewNotice from "@/components/site/PreviewNotice";
import LegalLayout from "@/components/site/LegalLayout";
import { site } from "@/config/site.config";
import { pageMetadata } from "@/lib/metadata";
import { doc } from "@/content/legal/privacy-policy";
import { legal } from "@/content/legal";
import {
  localBusinessJsonLd,
  websiteJsonLd,
  webPageJsonLd,
  breadcrumbJsonLd,
} from "@/lib/seo";

export const dynamic = "force-static";

const title = `${doc.title} | ${site.name}`;

export const metadata: Metadata = pageMetadata({
  title,
  description: doc.seo.description,
  path: doc.path,
});

/** Legal document as data (content/legal/privacy-policy.ts) in the shared LegalLayout. */
export default function LegalPage() {
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
