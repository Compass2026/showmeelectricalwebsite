import { site } from "@/config/site.config";
import type { Crumb, Faq, ServicePageContent } from "@/content/services/types";

/**
 * Structured data helpers — client-agnostic.
 *
 * Every client-specific value (schema type, description, service catalog,
 * logo, address, service area) comes from `config/site.config.ts`. Repointing
 * this at another client means editing that config, not this file.
 *
 * RULE: schema must describe content that is actually visible on the page and
 * facts we can verify from client-owned sources. No aggregateRating (we have
 * no verified review data), no openingHours and no priceRange.
 *
 * Emergency electrical repairs appear in the offer catalog because the owner
 * confirmed the service (docs/decisions.md D-001) and the homepage names it.
 * Availability is a separate claim: hours and response times are unconfirmed,
 * so no `openingHours`, `openingHoursSpecification` or 24-7 property is
 * emitted.
 */

export function localBusinessJsonLd(baseUrl: string = site.productionUrl) {
  return {
    "@context": "https://schema.org",
    "@type": site.schemaType,
    "@id": `${baseUrl}/#business`,
    name: site.legalName,
    alternateName: site.name,
    url: baseUrl,
    telephone: site.phone,
    email: site.email,
    description: site.businessDescription,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressRegion: site.address.state,
      postalCode: site.address.zip,
      addressCountry: site.address.country,
    },
    /**
     * Emitted only when real coordinates are configured. Approximate
     * coordinates presented as the business location are a false claim, so the
     * property is omitted rather than estimated. See site.config.ts.
     */
    ...(site.geo
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude: site.geo.lat,
            longitude: site.geo.lng,
          },
        }
      : {}),
    areaServed: site.counties.map((name) => ({
      "@type": "AdministrativeArea",
      name,
    })),
    ...(site.sameAs.length ? { sameAs: site.sameAs } : {}),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: site.serviceCatalogName,
      itemListElement: site.serviceCatalog.map((name) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name },
      })),
    },
  };
}

export function websiteJsonLd(baseUrl: string = site.productionUrl) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${baseUrl}/#website`,
    url: baseUrl,
    name: site.name,
    publisher: { "@id": `${baseUrl}/#business` },
  };
}

/* ------------------------------------------------------------------ *
 * Service pages
 * ------------------------------------------------------------------ */

/**
 * schema.org Service for a service page. `provider` references the business
 * node by @id, so the page must also emit `localBusinessJsonLd()` in the same
 * graph for that reference to resolve in a validator.
 */
export function serviceJsonLd(
  content: ServicePageContent,
  baseUrl: string = site.productionUrl
) {
  const url = `${baseUrl}${content.path}`;
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name: content.schema.name,
    serviceType: content.schema.serviceType,
    description: content.seo.description,
    url,
    provider: { "@id": `${baseUrl}/#business` },
    areaServed: site.counties.map((name) => ({
      "@type": "AdministrativeArea",
      name,
    })),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: content.services.heading,
      itemListElement: content.services.items.map((item) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: item.name },
      })),
    },
  };
}

/**
 * FAQPage. The question and answer strings are the same objects the page
 * renders, so the schema matches the visible text exactly (SOP §6.6).
 */
export function faqPageJsonLd(faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

/** BreadcrumbList from the same crumbs the visible breadcrumb renders. */
export function breadcrumbJsonLd(
  crumbs: Crumb[],
  currentPath: string,
  baseUrl: string = site.productionUrl
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      item: `${baseUrl}${c.href ?? currentPath}`,
    })),
  };
}

/**
 * schema.org AboutPage for /about. `about` points at the business node, so the
 * page must also emit `localBusinessJsonLd()` for the reference to resolve.
 */
export function aboutPageJsonLd(
  path: string,
  name: string,
  description: string,
  baseUrl: string = site.productionUrl
) {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${baseUrl}${path}#webpage`,
    url: `${baseUrl}${path}`,
    name,
    description,
    about: { "@id": `${baseUrl}/#business` },
    isPartOf: { "@id": `${baseUrl}/#website` },
  };
}
