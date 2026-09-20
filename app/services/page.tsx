import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import Section from "@/components/site/Section";
import PageHero from "@/components/site/PageHero";
import ServicePathways, { type PathwayCard } from "@/components/home/ServicePathways";
import ProcessSteps from "@/components/services/ProcessSteps";
import RelatedLinks from "@/components/services/RelatedLinks";
import Faq from "@/components/services/Faq";
import ClosingCta from "@/components/services/ClosingCta";
import Reveal from "@/components/motion/Reveal";
import { site } from "@/config/site.config";
import { pageMetadata } from "@/lib/metadata";
import { servicesDirectory } from "@/content/services-directory";
import { servicePages } from "@/content/services";
import {
  localBusinessJsonLd,
  websiteJsonLd,
  collectionPageJsonLd,
  breadcrumbJsonLd,
  faqPageJsonLd,
} from "@/lib/seo";

export const dynamic = "force-static";

const url = `${site.productionUrl}${servicesDirectory.path}`;
const image = `${site.productionUrl}${servicesDirectory.seo.image}`;

export const metadata: Metadata = pageMetadata({
  title: servicesDirectory.seo.title,
  description: servicesDirectory.seo.description,
  path: servicesDirectory.path,
  image: servicesDirectory.seo.image,
});

/**
 * /services — the directory. The pathway cards and the full catalog are
 * derived from the registry of IMPLEMENTED service pages, so every link here
 * resolves and every service listed is one a hub page describes. Individual
 * service names are plain text until their own pages exist.
 */
export default function ServicesDirectoryPage() {
  const { pathways, catalog, process, faqs, related, cta } = servicesDirectory;

  const cards: PathwayCard[] = servicePages.map((page) => ({
    slug: page.slug,
    title: page.directory?.title ?? page.schema.name,
    summary: page.directory?.summary ?? page.hero.intro,
    examples: page.services.items.slice(0, 4).map((s) => s.name),
    image: page.hero.image,
    href: page.path,
  }));

  const jsonLd = [
    localBusinessJsonLd(),
    websiteJsonLd(),
    collectionPageJsonLd(
      servicesDirectory.path,
      servicesDirectory.seo.title,
      servicesDirectory.seo.description,
      servicePages.map((page) => ({
        name: page.schema.name,
        url: `${site.productionUrl}${page.path}`,
      }))
    ),
    breadcrumbJsonLd(servicesDirectory.breadcrumbs, servicesDirectory.path),
    ...(faqs.items.length ? [faqPageJsonLd(faqs.items)] : []),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />

      <main id="main">
        <PageHero
          hero={servicesDirectory.hero}
          breadcrumbs={servicesDirectory.breadcrumbs}
        />

        <Section
          id="pathways"
          tone="light"
          eyebrow={pathways.eyebrow}
          headingId="pathways-heading"
          heading={pathways.heading}
          intro={pathways.intro}
        >
          <ServicePathways items={cards} />
        </Section>

        <Section
          id="catalog"
          tone="surface"
          eyebrow={catalog.eyebrow}
          headingId="catalog-heading"
          heading={catalog.heading}
          intro={catalog.intro}
        >
          <Reveal stagger className="mt-12 grid gap-8 lg:grid-cols-3">
            {servicePages.map((page) => (
              <div key={page.slug}>
                <h3 className="text-lg font-bold text-primary-900">
                  <Link href={page.path} className="hover:text-accent-700">
                    {page.directory?.title ?? page.schema.name}
                  </Link>
                </h3>
                <ol className="mt-4 space-y-2 border-t border-primary-900/10 pt-4">
                  {page.services.items.map((s) => (
                    <li
                      key={s.name}
                      className="flex items-start gap-2 text-sm text-ink/80"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-500"
                      />
                      {s.href ? (
                        <Link href={s.href} className="hover:text-accent-700">
                          {s.name}
                        </Link>
                      ) : (
                        s.name
                      )}
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </Reveal>
        </Section>

        <Section
          id="process"
          tone="deep"
          eyebrow={process.eyebrow}
          headingId="process-heading"
          heading={process.heading}
          intro={process.intro}
        >
          <ProcessSteps steps={process.steps} />
        </Section>

        <Section
          id="faqs"
          tone="light"
          eyebrow={faqs.eyebrow}
          headingId="faqs-heading"
          heading={faqs.heading}
        >
          <Faq items={faqs.items} />
        </Section>

        <Section
          id="related"
          tone="surface"
          headingId="related-heading"
          heading={related.heading}
        >
          <RelatedLinks links={related.links} />
        </Section>

        <ClosingCta heading={cta.heading} body={cta.body} />
      </main>

      <SiteFooter />
    </>
  );
}
