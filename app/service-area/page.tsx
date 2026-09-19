import type { Metadata } from "next";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import PreviewNotice from "@/components/site/PreviewNotice";
import Section from "@/components/site/Section";
import PageHero from "@/components/site/PageHero";
import CoverageGroups from "@/components/site/CoverageGroups";
import Reveal from "@/components/motion/Reveal";
import RelatedLinks from "@/components/services/RelatedLinks";
import Faq from "@/components/services/Faq";
import ClosingCta from "@/components/services/ClosingCta";
import { site } from "@/config/site.config";
import { serviceArea } from "@/content/service-area";
import {
  localBusinessJsonLd,
  websiteJsonLd,
  webPageJsonLd,
  breadcrumbJsonLd,
  faqPageJsonLd,
} from "@/lib/seo";

export const dynamic = "force-static";

const url = `${site.productionUrl}${serviceArea.path}`;
const image = `${site.productionUrl}${serviceArea.seo.image}`;

export const metadata: Metadata = {
  title: { absolute: serviceArea.seo.title },
  description: serviceArea.seo.description,
  alternates: { canonical: url },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: serviceArea.seo.title,
    description: serviceArea.seo.description,
    url,
    images: [{ url: image }],
  },
  twitter: {
    card: "summary_large_image",
    title: serviceArea.seo.title,
    description: serviceArea.seo.description,
    images: [image],
  },
};

/**
 * /service-area — coverage as data (content/service-area.ts) rendered by
 * shared sections. The LocalBusiness node already carries `areaServed` for
 * every county; this page is where a visitor reads the same facts.
 */
export default function ServiceAreaPage() {
  const { coverage, pathways, faqs, cta } = serviceArea;
  const jsonLd = [
    localBusinessJsonLd(),
    websiteJsonLd(),
    webPageJsonLd(serviceArea.path, serviceArea.seo.title, serviceArea.seo.description),
    breadcrumbJsonLd(serviceArea.breadcrumbs, serviceArea.path),
    ...(faqs.items.length ? [faqPageJsonLd(faqs.items)] : []),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PreviewNotice />
      <SiteHeader />

      <main id="main">
        <PageHero hero={serviceArea.hero} breadcrumbs={serviceArea.breadcrumbs} />

        <Section
          id="coverage"
          tone="cream"
          eyebrow={coverage.eyebrow}
          headingId="coverage-heading"
          heading={coverage.heading}
          intro={coverage.intro}
        >
          <CoverageGroups groups={coverage.groups} />
          <Reveal delay={0.2} className="mt-8">
            <p className="text-sm text-charcoal/60">
              {coverage.fallback.text}{" "}
              <a
                href={site.phoneHref}
                className="-my-1 inline-block py-1 font-semibold text-lime-700 underline underline-offset-2"
              >
                Call {site.phone}
              </a>{" "}
              — {coverage.fallback.action.charAt(0).toLowerCase()}
              {coverage.fallback.action.slice(1)}
            </p>
          </Reveal>
        </Section>

        <Section
          id="services"
          tone="light"
          eyebrow={pathways.eyebrow}
          headingId="services-heading"
          heading={pathways.heading}
        >
          <RelatedLinks links={pathways.links} />
        </Section>

        <Section
          id="faqs"
          tone="cream"
          eyebrow={faqs.eyebrow}
          headingId="faqs-heading"
          heading={faqs.heading}
        >
          <Faq items={faqs.items} />
        </Section>

        <ClosingCta heading={cta.heading} body={cta.body} />
      </main>

      <SiteFooter />
    </>
  );
}
