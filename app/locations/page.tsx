import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import PageHero from "@/components/site/PageHero";
import Section from "@/components/site/Section";
import RelatedLinks from "@/components/services/RelatedLinks";
import ClosingCta from "@/components/services/ClosingCta";
import { pageMetadata } from "@/lib/metadata";
import { locationPages } from "@/content/locations";
import { locationsIndex } from "@/content/locations/client";
import { localBusinessJsonLd, websiteJsonLd, collectionPageJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { site } from "@/config/site.config";

/**
 * /locations — index of a multi-location client's PUBLISHED branch pages.
 * A brand with no published locations (the reference client) has no index:
 * this route is a real 404 there. Fictional/noindex fixtures never list.
 */
export const dynamic = "force-static";

const published = locationPages.filter((l) => !l.fictional && !l.noindex);

export const metadata: Metadata = locationsIndex && published.length
  ? pageMetadata({ title: locationsIndex.seo.title, description: locationsIndex.seo.description, path: "/locations", image: locationsIndex.seo.image })
  : {};

export default function LocationsIndexPage() {
  if (!locationsIndex || published.length === 0) notFound();
  const links = published.map((l) => ({ label: l.name, href: l.path, description: `${l.address.city}, ${l.address.region} · ${l.phone}` }));
  const jsonLd = [
    localBusinessJsonLd(),
    websiteJsonLd(),
    collectionPageJsonLd("/locations", locationsIndex.seo.title, locationsIndex.seo.description, published.map((l) => ({ name: l.name, url: `${site.productionUrl}${l.path}` }))),
    breadcrumbJsonLd(locationsIndex.breadcrumbs, "/locations"),
  ];
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteHeader />
      <main id="main">
        <PageHero hero={locationsIndex.hero} breadcrumbs={locationsIndex.breadcrumbs} />
        <Section id="locations" tone="surface" headingId="locations-heading" heading={locationsIndex.heading} intro={locationsIndex.intro}>
          <RelatedLinks links={links} />
        </Section>
        <ClosingCta heading={locationsIndex.cta.heading} body={locationsIndex.cta.body} />
      </main>
      <SiteFooter />
    </>
  );
}
