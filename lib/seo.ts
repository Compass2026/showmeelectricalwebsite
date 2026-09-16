import { site } from "@/config/site.config";

/**
 * Structured data helpers.
 *
 * RULE: schema must describe content that is actually visible on the page and
 * facts we can verify from client-owned sources. No aggregateRating (we have
 * no verified review data), no openingHours, no priceRange, and no
 * emergency/24-7 availability.
 */

export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Electrician",
    "@id": `${site.productionUrl}/#business`,
    name: site.legalName,
    alternateName: site.name,
    url: site.productionUrl,
    telephone: site.phone,
    email: site.email,
    description:
      "Owner-led electrical contractor serving St. Louis City, St. Louis County and the Greater St. Louis area with residential, commercial and industrial electrical work.",
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressRegion: site.address.state,
      postalCode: site.address.zip,
      addressCountry: site.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: site.geo.lat,
      longitude: site.geo.lng,
    },
    areaServed: site.counties.map((name) => ({
      "@type": "AdministrativeArea",
      name,
    })),
    // Mirrors the three pathways shown on the page.
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Electrical services",
      itemListElement: [
        "Residential electrical services",
        "Commercial electrical services",
        "Industrial electrical services",
      ].map((n) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: n },
      })),
    },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.productionUrl}/#website`,
    url: site.productionUrl,
    name: site.name,
    publisher: { "@id": `${site.productionUrl}/#business` },
  };
}
