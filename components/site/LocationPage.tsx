import Image from "next/image";
import Breadcrumbs from "@/components/site/Breadcrumbs";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import DemoNotice from "@/components/site/DemoNotice";
import Section from "@/components/site/Section";
import Blocks from "@/components/site/Blocks";
import FactList from "@/components/site/FactList";
import Reveal from "@/components/motion/Reveal";
import Button from "@/components/site/Button";
import Faq from "@/components/services/Faq";
import RelatedLinks from "@/components/services/RelatedLinks";
import { pageMetadata } from "@/lib/metadata";
import { locationJsonLd, breadcrumbJsonLd, faqPageJsonLd } from "@/lib/seo";
import type { Block } from "@/content/blocks";
import type { BranchLocationContent, LocationSectionKey, OpeningHours } from "@/content/locations/types";
import type { LabeledFact } from "@/content/cities/types";

/**
 * Renders a physical-location page (Page Template Library §7) from its
 * content object. Sections appear in the order `content.sections` lists
 * them and are skipped when their content is absent.
 *
 * Hours and services-by-location render through the shared semantic
 * `table` block, so they get `<caption>` and header scopes for free and are
 * the same markup a reader, a screen reader or an agent meets in articles.
 *
 * Structured data: a LocalBusiness subtype for THIS location, with
 * `parentOrganization` from the content (never the reference client's
 * business node), BreadcrumbList, and FAQPage only when questions render.
 */
export default function LocationPage({ content }: { content: BranchLocationContent }) {
  const faqs = content.sections.includes("faqs") && content.faqs?.items.length ? content.faqs : undefined;
  const jsonLd = [
    locationJsonLd(content),
    breadcrumbJsonLd(content.breadcrumbs, content.path),
    ...(faqs ? [faqPageJsonLd(faqs.items)] : []),
  ];

  const addressLine = [content.address.street, `${content.address.city}, ${content.address.region} ${content.address.postalCode}`]
    .filter(Boolean)
    .join(", ");
  const visitFacts: LabeledFact[] = [
    { label: "Address", value: addressLine },
    { label: "Phone", value: content.phone },
    ...(content.email ? [{ label: "Email", value: content.email }] : []),
    { label: "Visiting", value: content.visitable ? "Customers welcome during regular hours." : "Not open to visitors — contact by phone or email." },
    ...(content.visitable && content.access ? content.access.map((a, i) => ({ label: i === 0 ? "Access" : `Access (${i + 1})`, value: a })) : []),
  ];

  const render = (key: LocationSectionKey) => {
    switch (key) {
      case "header":
        return (
          <header key={key} className="bg-primary-950 text-white">
            <div className="mx-auto grid max-w-7xl gap-10 px-4 pb-14 pt-6 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
              <div>
                <Reveal immediate>
                  <Breadcrumbs crumbs={content.breadcrumbs} />
                </Reveal>
                <Reveal immediate delay={0.08}>
                  <p className="mt-8 text-sm font-bold uppercase tracking-widest text-accent-500">{content.header.eyebrow}</p>
                  <h1 className="mt-3 text-4xl font-extrabold leading-[1.08] sm:text-5xl">{content.header.headline}</h1>
                  <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/75">{content.header.intro}</p>
                </Reveal>
                <Reveal immediate delay={0.2} className="mt-7 flex flex-wrap gap-4">
                  <Button href={content.phoneHref}>Call {content.phone}</Button>
                  {content.visitable && content.directionsUrl && (
                    <Button href={content.directionsUrl} variant="secondary">
                      Directions
                    </Button>
                  )}
                </Reveal>
              </div>
              {content.header.image && (
                <Reveal from="right" delay={0.2} immediate>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10">
                    <Image src={content.header.image.src} alt={content.header.image.alt} fill sizes="(max-width: 1024px) 100vw, 45vw" className="object-cover" />
                  </div>
                </Reveal>
              )}
            </div>
          </header>
        );
      case "visit":
        return (
          <Section key={key} id="visit" tone="surface" headingId="visit-heading" heading="Visit or contact this location">
            <FactList items={visitFacts} />
          </Section>
        );
      case "hours":
        return content.hours ? (
          <Section key={key} id="hours" tone="light" headingId="hours-heading" heading={content.hours.heading} intro={content.hours.note}>
            <div className="mt-8 max-w-2xl">
              <Blocks blocks={[hoursTable(content.hours.rules)]} />
            </div>
          </Section>
        ) : null;
      case "services":
        return content.services ? (
          <Section key={key} id="services" tone="surface" headingId="services-heading" heading={content.services.heading} intro={content.services.intro}>
            <div className="mt-8">
              <Blocks
                blocks={[
                  {
                    type: "table",
                    caption: content.services.heading,
                    header: [...content.services.columns],
                    rowHeader: true,
                    rows: content.services.rows.map((r) => [r.service, r.available, r.note]),
                  },
                ]}
              />
            </div>
          </Section>
        ) : null;
      case "team":
        return content.team ? (
          <Section key={key} id="team" tone="light" headingId="team-heading" heading={content.team.heading}>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {content.team.people.map((p) => (
                <li key={p.name} className="flex items-center gap-4 rounded-xl border border-primary-900/10 bg-white p-5">
                  {p.photo ? (
                    <Image src={p.photo.src} alt={p.photo.alt} width={64} height={64} className="h-16 w-16 rounded-full object-cover" />
                  ) : (
                    <span aria-hidden="true" className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-surface text-xl font-bold text-primary-900">
                      {p.name.charAt(0)}
                    </span>
                  )}
                  <div>
                    <p className="font-bold text-primary-900">{p.name}</p>
                    <p className="text-sm text-ink/70">{p.role}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Section>
        ) : null;
      case "body":
        return content.body ? (
          <Section key={key} id="about" tone="surface" headingId="about-heading" heading={content.body.heading}>
            <div className="mt-8 max-w-3xl">
              <Blocks blocks={content.body.blocks} />
            </div>
          </Section>
        ) : null;
      case "faqs":
        return faqs ? (
          <Section key={key} id="faqs" tone="light" headingId="faqs-heading" heading={faqs.heading}>
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
        return (
          <section key={key} className="bg-gradient-to-b from-primary-900 to-primary-950 py-20 sm:py-24" aria-labelledby="closing-cta-heading">
            <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
              <h2 id="closing-cta-heading" className="text-3xl font-extrabold text-white sm:text-4xl">{content.cta.heading}</h2>
              <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-white/70">{content.cta.body}</p>
              <div className="mt-9 flex flex-wrap justify-center gap-4">
                <Button href={content.phoneHref}>Call {content.phone}</Button>
              </div>
            </div>
          </section>
        );
    }
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {content.fictional && (
        <DemoNotice what={`${content.parent.name.replace(/ \(fictional demo brand\)$/, "")}, this branch, its address, hours and people do not exist.`} />
      )}
      <SiteHeader />
      <main id="main">{content.sections.map(render)}</main>
      <SiteFooter />
    </>
  );
}

/** Regular hours as a semantic table block: one row per rule, "Closed" when no times. */
function hoursTable(rules: OpeningHours[]): Block {
  return {
    type: "table",
    caption: "Regular opening hours",
    header: ["Days", "Opens", "Closes"],
    rowHeader: true,
    rows: rules.map((r) => [dayRange(r.days), r.opens ? clock(r.opens) : "Closed", r.closes ? clock(r.closes) : "Closed"]),
  };
}

function dayRange(days: string[]) {
  return days.length > 2 ? `${days[0]} – ${days[days.length - 1]}` : days.join(" and ");
}

function clock(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  const suffix = h >= 12 ? "pm" : "am";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return m ? `${hour}:${String(m).padStart(2, "0")} ${suffix}` : `${hour} ${suffix}`;
}

/** Next.js metadata for a location page. Fictional fixtures are always noindex. */
export function locationMetadata(content: BranchLocationContent) {
  return pageMetadata({
    title: content.seo.title,
    description: content.seo.description,
    path: content.path,
    image: content.seo.image,
    imageAlt: content.header.image?.alt,
    noindex: Boolean(content.noindex || content.fictional),
  });
}
