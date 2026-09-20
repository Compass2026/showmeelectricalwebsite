import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import PreviewNotice from "@/components/site/PreviewNotice";
import Section from "@/components/site/Section";
import PageHero from "@/components/site/PageHero";
import FactList from "@/components/site/FactList";
import Blocks from "@/components/site/Blocks";
import Reveal from "@/components/motion/Reveal";
import ProcessSteps from "@/components/services/ProcessSteps";
import Faq from "@/components/services/Faq";
import RelatedLinks from "@/components/services/RelatedLinks";
import ClosingCta from "@/components/services/ClosingCta";
import { findServicePage } from "@/content/services";
import { pageMetadata } from "@/lib/metadata";
import {
  localBusinessJsonLd,
  websiteJsonLd,
  webPageJsonLd,
  breadcrumbJsonLd,
  faqPageJsonLd,
} from "@/lib/seo";
import type { CityPageContent, CitySectionKey } from "@/content/cities/types";
import type { RelatedLink } from "@/content/services/types";

/**
 * Renders a served-city page from its content object (Page Template
 * Library §6). Sections appear in the order `content.sections` lists them
 * and are skipped when absent.
 *
 * Structured data: the REAL business node (whose `areaServed` already names
 * this city), WebSite, a WebPage about that business, BreadcrumbList, and
 * FAQPage only when questions are rendered. No fictional branch, no
 * second address: a served city is not an office.
 *
 * The services section resolves paths against the service registries, so
 * only published hub and detail pages are ever linked.
 */
export default function CityPage({ content }: { content: CityPageContent }) {
  const faqs = content.sections.includes("faqs") && content.faqs?.items.length ? content.faqs : undefined;
  const serviceLinks: RelatedLink[] = content.services.paths.flatMap((path) => {
    const page = findServicePage(path);
    return page
      ? [{ label: page.directory?.title ?? page.schema.name, href: page.path, description: page.directory?.summary ?? page.seo.description }]
      : [];
  });

  const jsonLd = [
    localBusinessJsonLd(),
    websiteJsonLd(),
    webPageJsonLd(content.path, content.seo.title, content.seo.description),
    breadcrumbJsonLd(content.breadcrumbs, content.path),
    ...(faqs ? [faqPageJsonLd(faqs.items)] : []),
  ];

  const render = (key: CitySectionKey) => {
    switch (key) {
      case "hero":
        return <PageHero key={key} hero={content.hero} breadcrumbs={content.breadcrumbs} />;
      case "facts":
        return (
          <Section key={key} id="facts" tone="surface" eyebrow={content.facts.eyebrow} headingId="facts-heading" heading={content.facts.heading} intro={content.facts.intro}>
            <FactList items={content.facts.items} />
          </Section>
        );
      case "services":
        return serviceLinks.length ? (
          <Section key={key} id="services" tone="light" eyebrow={content.services.eyebrow} headingId="services-heading" heading={content.services.heading} intro={content.services.intro}>
            <RelatedLinks links={serviceLinks} />
          </Section>
        ) : null;
      case "context":
        return content.context ? (
          <Section key={key} id="context" tone="surface" eyebrow={content.context.eyebrow} headingId="context-heading" heading={content.context.heading}>
            <Reveal className="mt-8 max-w-3xl">
              <Blocks blocks={content.context.body} />
            </Reveal>
          </Section>
        ) : null;
      case "process":
        return content.process ? (
          <Section key={key} id="process" tone="deep" eyebrow={content.process.eyebrow} headingId="process-heading" heading={content.process.heading} intro={content.process.intro}>
            <ProcessSteps steps={content.process.steps} />
          </Section>
        ) : null;
      case "faqs":
        return faqs ? (
          <Section key={key} id="faqs" tone="light" eyebrow={faqs.eyebrow} headingId="faqs-heading" heading={faqs.heading} intro={faqs.intro}>
            <Faq items={faqs.items} />
          </Section>
        ) : null;
      case "related":
        return content.related ? (
          <Section key={key} id="related" tone="surface" headingId="related-heading" heading={content.related.heading}>
            <RelatedLinks links={content.related.links} />
          </Section>
        ) : null;
      case "cta":
        return <ClosingCta key={key} heading={content.cta.heading} body={content.cta.body} />;
    }
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PreviewNotice />
      <SiteHeader />
      <main id="main">{content.sections.map(render)}</main>
      <SiteFooter />
    </>
  );
}

/** Next.js metadata for a city page, from its content. */
export function cityMetadata(content: CityPageContent) {
  return pageMetadata({
    title: content.seo.title,
    description: content.seo.description,
    path: content.path,
    image: content.seo.image,
    imageAlt: content.hero.image.alt,
  });
}
