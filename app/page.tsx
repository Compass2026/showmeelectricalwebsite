import type { Metadata } from "next";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import Section from "@/components/site/Section";
import Button from "@/components/site/Button";
import Reveal from "@/components/motion/Reveal";
import ScrollStory from "@/components/motion/ScrollStory";
import Hero from "@/components/home/Hero";
import TrustBar from "@/components/home/TrustBar";
import ServicePathways from "@/components/home/ServicePathways";
import AboutSection from "@/components/home/AboutSection";
import Testimonials from "@/components/home/Testimonials";
import { site } from "@/config/site.config";
import { pageMetadata } from "@/lib/metadata";
import {
  homePage,
  storyStages,
  emergencyCallout,
  about,
  testimonials,
  servicePathways,
} from "@/content/home";
import { trustPoints } from "@/content/shared";
import { localBusinessJsonLd, websiteJsonLd } from "@/lib/seo";

export const dynamic = "force-static";

/** Every string on this page comes from the brand's content/home.ts. */
export const metadata: Metadata = pageMetadata({
  title: homePage.seo.title,
  description: homePage.seo.description,
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([localBusinessJsonLd(), websiteJsonLd()]),
        }}
      />
      <SiteHeader />

      <main id="main">
        <Hero />
        <TrustBar points={trustPoints} />

        {/* ---------- Service pathways ---------- */}
        <Section
          id="services"
          tone="light"
          eyebrow={homePage.services.eyebrow}
          headingId="services-heading"
          heading={homePage.services.heading}
          intro={homePage.services.intro}
        >
          <ServicePathways items={servicePathways} />

          {/*
            Emergency repairs — owner-confirmed service (docs/decisions.md
            D-001), kept visually secondary to the three pathways: a quiet
            surface strip, not a banner. Hours and response times are
            unconfirmed, so there is deliberately no 24/7, after-hours or
            arrival-time wording here.
          */}
          {site.offersEmergencyService && (
            <Reveal delay={0.15} className="mt-8">
              <div className="flex flex-col gap-4 rounded-xl border border-primary-900/10 bg-surface px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-base font-bold text-primary-900">
                    {emergencyCallout.heading}
                  </h3>
                  <p className="mt-1 text-sm text-ink/70">
                    {emergencyCallout.body}
                  </p>
                </div>
                <Button
                  href={site.phoneHref}
                  variant="ghost"
                  className="shrink-0 self-start sm:self-auto"
                >
                  {homePage.services.callLabel} {site.phone}
                </Button>
              </div>
            </Reveal>
          )}

          <Reveal delay={0.2} className="mt-8">
            <Button href={homePage.services.more.href} variant="ghost">
              {homePage.services.more.label}
            </Button>
          </Reveal>
        </Section>

        {/* ---------- Signature scroll story ---------- */}
        <section
          id="process"
          className="relative overflow-hidden bg-primary-950 py-16 sm:py-20"
          aria-labelledby="process-heading"
        >
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-0 h-72 w-[800px] -translate-x-1/2 rounded-full bg-accent-500/10 blur-3xl"
          />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
            <Reveal className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-bold uppercase tracking-widest text-accent-500">
                {homePage.process.eyebrow}
              </p>
              <h2
                id="process-heading"
                className="mt-3 text-3xl font-extrabold text-white sm:text-4xl"
              >
                {homePage.process.heading}
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-white/70">
                {homePage.process.intro}
              </p>
            </Reveal>
            <ScrollStory stages={storyStages} />
          </div>
        </section>

        {/* ---------- About ---------- */}
        <Section id="about" tone="surface" headingId="about-heading">
          <AboutSection
            eyebrow={homePage.about.eyebrow}
            heading={about.heading}
            paragraphs={about.paragraphs}
            image={about.image}
            cta={homePage.about.cta}
          />
        </Section>

        {/* ---------- Testimonials ---------- */}
        {testimonials.length > 0 && (
          <Section
            id="testimonials"
            tone="primary"
            eyebrow={homePage.testimonials.eyebrow}
            headingId="testimonials-heading"
            heading={homePage.testimonials.heading}
            intro={homePage.testimonials.intro}
            center
          >
            <Testimonials items={testimonials} />
          </Section>
        )}

        {/* ---------- Service area ---------- */}
        <Section
          id="service-area"
          tone="light"
          eyebrow={homePage.area.eyebrow}
          headingId="area-heading"
          heading={homePage.area.heading}
          intro={homePage.area.intro}
        >
          <Reveal stagger className="mt-10 flex flex-wrap gap-3">
            {[...site.counties, ...site.confirmedCities].map((county) => (
              <span
                key={county}
                className="rounded-full border border-primary-900/15 bg-surface px-4 py-2 text-sm font-semibold text-primary-900"
              >
                {county}
              </span>
            ))}
          </Reveal>
          <Reveal delay={0.2} className="mt-8">
            <p className="text-sm text-ink/60">
              {homePage.area.fallback.text}{" "}
              <a
                href={site.phoneHref}
                className="-my-1 inline-block py-1 font-semibold text-accent-700 underline underline-offset-2"
              >
                {homePage.area.fallback.callLabel} {site.phone}
              </a>{" "}
              {homePage.area.fallback.action}
            </p>
            <div className="mt-6">
              <Button href={homePage.area.more.href} variant="ghost">
                {homePage.area.more.label}
              </Button>
            </div>
          </Reveal>
        </Section>

        {/* ---------- Final CTA ---------- */}
        <section
          className="bg-gradient-to-b from-primary-900 to-primary-950 py-20 sm:py-28"
          aria-labelledby="cta-heading"
        >
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <Reveal>
              <h2
                id="cta-heading"
                className="text-3xl font-extrabold text-white sm:text-4xl"
              >
                {homePage.finalCta.heading}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-white/70">
                {homePage.finalCta.body}
              </p>
              <div className="mt-9 flex flex-wrap justify-center gap-4">
                <Button href={site.primaryCta.href}>
                  {site.primaryCta.label}
                </Button>
                <Button href={site.phoneHref} variant="secondary">
                  {site.phone}
                </Button>
              </div>
              {site.careers && homePage.finalCta.careers && (
                <p className="mt-10 text-sm text-white/60">
                  {homePage.finalCta.careers.text}{" "}
                  <a
                    href={site.careers.url}
                    className="-my-1 inline-block py-1 font-semibold text-accent-400 underline underline-offset-2"
                  >
                    {homePage.finalCta.careers.label}
                  </a>
                </p>
              )}
            </Reveal>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
