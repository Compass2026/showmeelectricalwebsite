import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import Section from "@/components/site/Section";
import TrustBar from "@/components/home/TrustBar";
import PageHero from "@/components/site/PageHero";
import ServiceList from "./ServiceList";
import PhotoGallery from "./PhotoGallery";
import ProcessSteps from "./ProcessSteps";
import Faq from "./Faq";
import RelatedLinks from "./RelatedLinks";
import ClosingCta from "./ClosingCta";
import { site } from "@/config/site.config";
import { pageMetadata } from "@/lib/metadata";
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
 * Service's `provider` @id resolves on this page), Service, BreadcrumbList,
 * and FAQPage only when an FAQ section with questions is rendered — all from
 * the same objects the visible sections render.
 */
export default function ServicePage({
  content,
}: {
  content: ServicePageContent;
}) {
  // FAQPage is emitted only when the FAQ section is actually rendered on
  // this page (listed in `sections`) AND has questions — and it is built from
  // the very same items the <Faq> renders, so schema text equals visible text.
  const faqs =
    content.sections.includes("faqs") && content.faqs?.items.length
      ? content.faqs
      : undefined;

  const jsonLd = [
    localBusinessJsonLd(),
    serviceJsonLd(content),
    breadcrumbJsonLd(content.breadcrumbs, content.path),
    ...(faqs ? [faqPageJsonLd(faqs.items)] : []),
  ];

  const render = (key: ServiceSectionKey) => {
    switch (key) {
      case "hero":
        return (
          <PageHero
            key={key}
            hero={content.hero}
            breadcrumbs={content.breadcrumbs}
          />
        );

      case "services":
        return (
          <Section
            key={key}
            id="services"
            tone="surface"
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
            tone="surface"
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
        return faqs ? (
          <Section
            key={key}
            id="faqs"
            tone="light"
            eyebrow={faqs.eyebrow}
            headingId="faqs-heading"
            heading={faqs.heading}
            intro={faqs.intro}
          >
            <Faq items={faqs.items} />
          </Section>
        ) : null;

      case "related":
        return content.related ? (
          <Section
            key={key}
            id="related"
            tone="surface"
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
      <SiteHeader />
      <main id="main">{content.sections.map(render)}</main>
      <SiteFooter />
    </>
  );
}

/** Next.js metadata for a service page, from its content. */
export function serviceMetadata(content: ServicePageContent) {
  return pageMetadata({
    title: content.seo.title,
    description: content.seo.description,
    path: content.path,
    image: content.seo.image,
    imageAlt: content.hero.image.alt,
  });
}
