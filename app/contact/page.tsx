import type { Metadata } from "next";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import Reveal from "@/components/motion/Reveal";
import InquiryForm from "@/components/site/InquiryForm";
import { site } from "@/config/site.config";
import { pageMetadata } from "@/lib/metadata";
import { contact } from "@/content/contact";
import { inquiryServiceGroups } from "@/lib/inquiry";
import {
  localBusinessJsonLd,
  websiteJsonLd,
  webPageJsonLd,
  breadcrumbJsonLd,
} from "@/lib/seo";

export const dynamic = "force-static";


export const metadata: Metadata = pageMetadata({
  title: contact.seo.title,
  description: contact.seo.description,
  path: contact.path,
});

/**
 * /contact — inquiry form delivered by /api/inquiry, with the phone, email
 * and address alongside so no visitor depends on the form alone.
 */
export default function ContactPage() {
  const breadcrumbs = [{ label: "Home", href: "/" }, { label: "Contact" }];
  const jsonLd = [
    localBusinessJsonLd(),
    websiteJsonLd(),
    webPageJsonLd(contact.path, contact.seo.title, contact.seo.description),
    breadcrumbJsonLd(breadcrumbs, contact.path),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />

      <main id="main">
        <section className="bg-primary-950 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <Reveal immediate>
              <p className="text-sm font-bold uppercase tracking-widest text-accent-500">
                {contact.hero.eyebrow}
              </p>
              <h1 className="mt-3 text-3xl font-extrabold text-white sm:text-5xl">
                {contact.hero.headline}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/75">
                {contact.hero.intro}
              </p>
            </Reveal>
          </div>
        </section>

        <section className="bg-surface py-16 sm:py-20" aria-labelledby="inquiry-heading">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
            <Reveal immediate className="rounded-2xl border border-primary-900/10 bg-white p-6 shadow-sm sm:p-10">
              <p className="text-sm font-bold uppercase tracking-widest text-accent-700">
                {contact.form.eyebrow}
              </p>
              <h2 id="inquiry-heading" className="mt-2 text-2xl font-extrabold text-primary-900 sm:text-3xl">
                {contact.form.heading}
              </h2>
              <p className="mt-3 max-w-xl leading-relaxed text-ink/75">{contact.form.intro}</p>
              <div className="mt-8">
                <InquiryForm
                  endpoint="/api/inquiry"
                  labels={contact.formLabels}
                  groups={inquiryServiceGroups}
                  fallback={{ phone: site.phone, phoneHref: site.phoneHref, email: site.email }}
                />
              </div>
            </Reveal>

            <div className="grid content-start gap-6">
              <Reveal immediate delay={0.1} className="rounded-xl border border-primary-900/10 bg-white p-8">
                <h2 className="text-lg font-bold text-primary-900">{contact.cards.call.heading}</h2>
                <p className="mt-2 text-sm leading-relaxed text-ink/70">{contact.cards.call.body}</p>
                <a
                  href={site.phoneHref}
                  className="mt-4 block text-2xl font-extrabold text-primary-900 hover:text-accent-700"
                >
                  {site.phone}
                </a>
              </Reveal>

              <Reveal immediate delay={0.15} className="rounded-xl border border-primary-900/10 bg-white p-8">
                <h2 className="text-lg font-bold text-primary-900">{contact.cards.email.heading}</h2>
                <p className="mt-2 text-sm leading-relaxed text-ink/70">{contact.cards.email.body}</p>
                <a
                  href={`mailto:${site.email}`}
                  className="mt-4 block break-words text-lg font-bold text-primary-900 hover:text-accent-700"
                >
                  {site.email}
                </a>
              </Reveal>

              <Reveal immediate delay={0.2} className="rounded-xl border border-primary-900/10 bg-white p-8">
                <h2 className="text-lg font-bold text-primary-900">{contact.cards.shop.heading}</h2>
                <address className="mt-3 not-italic leading-relaxed text-ink/75">
                  {/* No street for a service-area business: the area we serve
                      stands in its place rather than a blank line. */}
                  {site.address.street ? (
                    <>
                      {site.address.street}
                      <br />
                      {site.address.city}, {site.address.state}
                      {site.address.zip ? ` ${site.address.zip}` : ""}
                    </>
                  ) : (
                    <>
                      {site.address.city}, {site.address.state}
                      <br />
                      {site.serviceAreaLong}
                    </>
                  )}
                </address>
                <p className="mt-4 text-sm text-ink/70">{contact.cards.shop.note}</p>
              </Reveal>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
