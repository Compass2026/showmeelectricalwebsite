import { site } from "@/config/site.config";
import { careers } from "@brand/careers";

export type RoleSlug =
  | "apprentice-electrician"
  | "journeyman-electrician"
  | "electrical-estimator"
  | "administrative-assistant";

export interface JobSection {
  heading: string;
  body?: string;
  items?: string[];
}

export interface Job {
  slug: RoleSlug;
  title: string;
  shortTitle: string;
  employmentType: "FULL_TIME";
  typeLabel: string;
  category: "Field" | "Office";
  overview: string;
  cardSummary: string;
  highlights: string[];
  sections: JobSection[];
  datePosted: string;
}

/**
 * Careers contact details and domains are re-exported from the single client
 * config rather than duplicated here. These aliases keep the existing careers
 * component imports working without a second copy of the business facts that
 * could drift out of sync.
 */
export const SITE_URL = site.careers?.url ?? site.productionUrl;
export const WP_URL = site.careers?.wordpressUrl ?? site.productionUrl;
export const PHONE = site.phone;
export const PHONE_HREF = site.phoneHref;
export const EMAIL = site.email;
export const ADDRESS = site.address;
export const SERVICE_AREA = site.serviceArea;

export const jobs: Job[] = careers.jobs;

export function getJob(slug: string): Job | undefined {
  return jobs.find((j) => j.slug === slug);
}

export function jobPostingJsonLd(job: Job) {
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: `<p>${job.overview}</p>${job.sections
      .map((s) => {
        const items = s.items
          ? `<ul>${s.items.map((i) => `<li>${i}</li>`).join("")}</ul>`
          : "";
        const body = s.body ? `<p>${s.body}</p>` : "";
        return `<h3>${s.heading}</h3>${body}${items}`;
      })
      .join("")}`,
    datePosted: job.datePosted,
    employmentType: job.employmentType,
    hiringOrganization: {
      "@type": "Organization",
      name: "Show Me Electrical Services",
      sameAs: WP_URL,
      logo: `${site.productionUrl}${site.logoUrl}`,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        ...(ADDRESS.street ? { streetAddress: ADDRESS.street } : {}),
        addressLocality: ADDRESS.city,
        addressRegion: ADDRESS.state,
        ...(ADDRESS.zip ? { postalCode: ADDRESS.zip } : {}),
        addressCountry: "US",
      },
    },
    applicantLocationRequirements: {
      "@type": "State",
      name: "Missouri",
    },
    directApply: true,
    url: `${SITE_URL}/jobs/${job.slug}`,
  };
}
