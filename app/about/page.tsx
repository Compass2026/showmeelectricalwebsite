import type { Metadata } from "next";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import PreviewNotice from "@/components/site/PreviewNotice";
import Section from "@/components/site/Section";
import PageHero from "@/components/site/PageHero";
import ValueGrid from "@/components/site/ValueGrid";
import AboutSection from "@/components/home/AboutSection";
import TrustBar from "@/components/home/TrustBar";
import Testimonials from "@/components/home/Testimonials";
import RelatedLinks from "@/components/services/RelatedLinks";
import Faq from "@/components/services/Faq";
import ClosingCta from "@/components/services/ClosingCta";
import { site } from "@/config/site.config";
import { pageMetadata } from "@/lib/metadata";
import { about } from "@/content/about";
import { trustPoints } from "@/content/shared";
import { testimonials } from "@/content/home";
import {
  localBusinessJsonLd,
  websiteJsonLd,
  breadcrumbJsonLd,
  faqPageJsonLd,
  aboutPageJsonLd,
} from "@/lib/seo";

export const dynamic = "force-static";


export const metadata: Metadata = pageMetadata({
  title: about.seo.title,
  description: about.seo.description,
  path: about.path,
  image: about.seo.image,
  imageAlt: about.hero.image.alt,
});

/**
 * /about — composed from the same sections the homepage and service pages
 * use. Content lives in content/about.ts (plus the shared trust points and
 * the homepage's testimonials); this route only arranges it.
 */
export default function AboutPage() {
  // Business + WebSite nodes are emitted here so the AboutPage's `about` and
  // `isPartOf` @id references resolve on this page, not only on the homepage.
  const jsonLd = [
    localBusinessJsonLd(),
    websiteJsonLd(),
    aboutPageJsonLd(about.path, about.seo.title, about.seo.description),
    breadcrumbJsonLd(about.breadcrumbs, about.path),
    ...(about.faqs.items.length ? [faqPageJsonLd(about.faqs.items)] : []),
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
        <PageHero hero={about.hero} breadcrumbs={about.breadcrumbs} />

        <Section id="story" tone="surface" headingId="story-heading">
          <AboutSection
            eyebrow={about.story.eyebrow}
            heading={about.story.heading}
            headingId="story-heading"
            paragraphs={about.story.paragraphs}
            image={about.story.image}
          />
        </Section>

        <Section
          id="values"
          tone="light"
          eyebrow={about.values.eyebrow}
          headingId="values-heading"
          heading={about.values.heading}
          intro={about.values.intro}
        >
          <ValueGrid items={about.values.items} />
        </Section>

        <Section
          id="trust"
          tone="surface"
          eyebrow={about.trust.eyebrow}
          headingId="trust-heading"
          heading={about.trust.heading}
          className="pb-0!"
        >
          <div className="mt-4">
            <TrustBar points={trustPoints} />
          </div>
        </Section>

        {testimonials.length > 0 && (
          <Section
            id="testimonials"
            tone="primary"
            eyebrow={about.testimonials.eyebrow}
            headingId="testimonials-heading"
            heading={about.testimonials.heading}
            intro={about.testimonials.intro}
            center
          >
            <Testimonials items={testimonials} />
          </Section>
        )}

        <Section
          id="services"
          tone="light"
          eyebrow={about.pathways.eyebrow}
          headingId="services-heading"
          heading={about.pathways.heading}
        >
          <RelatedLinks links={about.pathways.links} />
        </Section>

        <Section
          id="faqs"
          tone="surface"
          eyebrow={about.faqs.eyebrow}
          headingId="faqs-heading"
          heading={about.faqs.heading}
        >
          <Faq items={about.faqs.items} />
        </Section>

        <ClosingCta heading={about.cta.heading} body={about.cta.body} />
      </main>

      <SiteFooter />
    </>
  );
}
