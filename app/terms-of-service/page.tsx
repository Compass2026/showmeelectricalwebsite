import type { Metadata } from "next";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import PreviewNotice from "@/components/site/PreviewNotice";
import LegalLayout from "@/components/site/LegalLayout";
import { site } from "@/config/site.config";
import { doc } from "@/content/legal/terms-of-service";
import { legal } from "@/content/legal";
import {
  localBusinessJsonLd,
  websiteJsonLd,
  webPageJsonLd,
  breadcrumbJsonLd,
} from "@/lib/seo";

export const dynamic = "force-static";

const url = `${site.productionUrl}${doc.path}`;
const title = `${doc.title} | ${site.name}`;

export const metadata: Metadata = {
  title: { absolute: title },
  description: doc.seo.description,
  alternates: { canonical: url },
  openGraph: {
    type: "website",
    siteName: site.name,
    title,
    description: doc.seo.description,
    url,
  },
  twitter: { card: "summary", title, description: doc.seo.description },
};

/** Legal document as data (content/legal/terms-of-service.ts) in the shared LegalLayout. */
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
