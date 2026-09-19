import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import PreviewNotice from "@/components/site/PreviewNotice";
import Section from "@/components/site/Section";
import TrustBar from "@/components/home/TrustBar";
import ServiceHero from "./ServiceHero";
import ServiceList from "./ServiceList";
import PhotoGallery from "./PhotoGallery";
import ProcessSteps from "./ProcessSteps";
import Faq from "./Faq";
import RelatedLinks from "./RelatedLinks";
import ClosingCta from "./ClosingCta";
import { site } from "@/config/site.config";
import {
  localBusinessJsonLd,
  serviceJsonLd,
  faqPageJsonLd,
  breadcrumbJsonLd,
} from "@/lib/seo";
import type {
  ServicePageContent,
  ServiceSectionKey,
} from "@/content/services/types";

/**
 * Renders any service page from its content object. Sections appear in the
 * order `content.sections` lists them and are skipped when their content is
 * absent, so residential, commercial, industrial and the individual service
 * pages all use this one component with different emphasis.
 *
 * Structured data emitted in the initial HTML: LocalBusiness (so the
 * Service's `provider` @id resolves on this page), Service, FAQPage and
 * BreadcrumbList — all from the same objects the visible sections render.
 */
export default function ServicePage({
  content,
}: {
  content: ServicePageContent;
}) {
  const jsonLd = [
    localBusinessJsonLd(),
    serviceJsonLd(content),
    breadcrumbJsonLd(content.breadcrumbs, content.path),
    ...(content.faqs.items.length ? [faqPageJsonLd(content.faqs.items)] : []),
  ];

  const render = (key: ServiceSectionKey) => {
    switch (key) {
      case "hero":
        return <ServiceHero key={key} content={content} />;

      case "services":
        return (
          <Section
            key={key}
            id="services"
            tone="cream"
            eyebrow={content.services.eyebrow}
            headingId="services-heading"
            heading={content.services.heading}
            intro={content.services.intro}
          >
            <ServiceList items={content.services.items} />
          </Section>
        );

      case "gallery":
        return content.gallery ? (
          <Section
            key={key}
            id="gallery"
            tone="light"
            eyebrow={content.gallery.eyebrow}
            headingId="gallery-heading"
            heading={content.gallery.heading}
            intro={content.gallery.intro}
          >
            <PhotoGallery photos={content.gallery.photos} />
          </Section>
        ) : null;

      case "trust":
        return content.trust ? (
          <Section
            key={key}
            id="trust"
            tone="cream"
            eyebrow={content.trust.eyebrow}
            headingId="trust-heading"
            heading={content.trust.heading}
            intro={content.trust.intro}
            className="pb-0!"
          >
            <div className="mt-4">
              <TrustBar points={content.trust.points} />
            </div>
          </Section>
        ) : null;

      case "process":
        return content.process ? (
          <Section
            key={key}
            id="process"
            tone="deep"
            eyebrow={content.process.eyebrow}
            headingId="process-heading"
            heading={content.process.heading}
            intro={content.process.intro}
          >
            <ProcessSteps steps={content.process.steps} />
          </Section>
        ) : null;

      case "faqs":
        return (
          <Section
            key={key}
            id="faqs"
            tone="light"
            eyebrow={content.faqs.eyebrow}
            headingId="faqs-heading"
            heading={content.faqs.heading}
            intro={content.faqs.intro}
          >
            <Faq items={content.faqs.items} />
          </Section>
        );

      case "related":
        return content.related ? (
          <Section
            key={key}
            id="related"
            tone="cream"
            headingId="related-heading"
            heading={content.related.heading}
          >
            <RelatedLinks links={content.related.links} />
          </Section>
        ) : null;

      case "cta":
        return (
          <ClosingCta
            key={key}
            heading={content.cta.heading}
            body={content.cta.body}
          />
        );
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PreviewNotice />
      <SiteHeader />
      <main id="main">{content.sections.map(render)}</main>
      <SiteFooter />
    </>
  );
}

/** Next.js metadata for a service page, from its content. */
export function serviceMetadata(content: ServicePageContent) {
  const url = `${site.productionUrl}${content.path}`;
  const image = content.seo.image.startsWith("http")
    ? content.seo.image
    : `${site.productionUrl}${content.seo.image}`;
  return {
    title: { absolute: content.seo.title },
    description: content.seo.description,
    alternates: { canonical: url },
    openGraph: {
      type: "website" as const,
      siteName: site.name,
      title: content.seo.title,
      description: content.seo.description,
      url,
      images: [{ url: image }],
    },
    twitter: {
      card: "summary_large_image" as const,
      title: content.seo.title,
      description: content.seo.description,
      images: [image],
    },
  };
}
