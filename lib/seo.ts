import { site } from "@/config/site.config";

/**
 * Structured data helpers — client-agnostic.
 *
 * Every client-specific value (schema type, description, service catalog,
 * logo, address, service area) comes from `config/site.config.ts`. Repointing
 * this at another client means editing that config, not this file.
 *
 * RULE: schema must describe content that is actually visible on the page and
 * facts we can verify from client-owned sources. No aggregateRating (we have
 * no verified review data), no openingHours, no priceRange, and no
 * emergency/24-7 availability.
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
