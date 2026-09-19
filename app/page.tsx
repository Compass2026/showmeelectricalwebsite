import type { Metadata } from "next";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import PreviewNotice from "@/components/site/PreviewNotice";
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
import { storyStages, emergencyCallout, about, testimonials } from "@/content/home";
import { trustPoints } from "@/content/shared";
import { localBusinessJsonLd, websiteJsonLd } from "@/lib/seo";

export const dynamic = "force-static";

/**
 * Primary keyword from the approved taxonomy: "electrician st louis" (260/mo).
 * Supporting: st louis electrician, electrical contractor st louis,
 * emergency electrician st louis (owner-confirmed as offered — decisions
 * D-001; no availability claim anywhere on the page).
 */
export const metadata: Metadata = {
  title:
    "Electrician in St. Louis, MO | Show Me Electrical — Residential, Commercial & Industrial",
  description:
    "Owner-led by a Master Electrician, serving St. Louis City, St. Louis County and the Greater St. Louis area. Panel upgrades, rewiring, lighting, commercial fit-outs, industrial power and emergency electrical repairs. Free consultations.",
  alternates: { canonical: site.productionUrl },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: "Electrician in St. Louis, MO | Show Me Electrical",
    description:
      "Owner-led by a Master Electrician, serving the Greater St. Louis area — residential, commercial, industrial and emergency electrical repairs. Free consultations.",
    url: site.productionUrl,
  },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([localBusinessJsonLd(), websiteJsonLd()]),
        }}
      />
      <PreviewNotice />
      <SiteHeader />

      <main id="main">
        <Hero />
        <TrustBar points={trustPoints} />

        {/* ---------- Service pathways ---------- */}
        <Section
          id="services"
          tone="light"
          eyebrow="What we do"
          headingId="services-heading"
          heading="Electrical work for every kind of space"
          intro={`Three pathways, one standard of work. Serving the ${site.serviceArea} from our shop in ${site.address.city}.`}
        >
          <ServicePathways />

          {/*
            Emergency repairs — owner-confirmed service (docs/decisions.md
            D-001), kept visually secondary to the three pathways: a quiet
            cream strip, not a banner. Hours and response times are
            unconfirmed, so there is deliberately no 24/7, after-hours or
            arrival-time wording here.
          */}
          {site.offersEmergencyService && (
            <Reveal delay={0.15} className="mt-8">
              <div className="flex flex-col gap-4 rounded-xl border border-navy-900/10 bg-cream px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-base font-bold text-navy-900">
                    {emergencyCallout.heading}
                  </h3>
                  <p className="mt-1 text-sm text-charcoal/70">
                    {emergencyCallout.body}
                  </p>
                </div>
                <Button
                  href={site.phoneHref}
                  variant="ghost"
                  className="shrink-0 self-start sm:self-auto"
                >
                  Call {site.phone}
                </Button>
              </div>
            </Reveal>
          )}
        </Section>

        {/* ---------- Signature scroll story ---------- */}
        <section
          id="process"
          className="relative overflow-hidden bg-navy-950 py-16 sm:py-20"
          aria-labelledby="process-heading"
        >
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-0 h-72 w-[800px] -translate-x-1/2 rounded-full bg-lime-500/10 blur-3xl"
          />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
            <Reveal className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-bold uppercase tracking-widest text-lime-500">
                Our process
              </p>
              <h2
                id="process-heading"
                className="mt-3 text-3xl font-extrabold text-white sm:text-4xl"
              >
                Powering your project
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-white/70">
                From the first free consultation to the moment the power comes
                on — here is how the work runs.
              </p>
            </Reveal>
            <ScrollStory stages={storyStages} />
          </div>
        </section>

        {/* ---------- About ---------- */}
        <Section id="about" tone="cream" headingId="about-heading">
          <AboutSection
            eyebrow="Meet the owner"
            heading={about.heading}
            paragraphs={about.paragraphs}
            image={about.image}
            cta={{ label: "More about Dan", href: "/about" }}
          />
        </Section>

        {/* ---------- Testimonials ---------- */}
        <Section
          id="testimonials"
          tone="navy"
          eyebrow="Client feedback"
          headingId="testimonials-heading"
          heading="What our customers say"
          intro="Reviews published by our customers on the Show Me Electrical website."
          center
        >
          <Testimonials items={testimonials} />
        </Section>

        {/* ---------- Service area ---------- */}
        <Section
          id="service-area"
          tone="light"
          eyebrow="Where we work"
          headingId="area-heading"
          heading={`Serving the ${site.serviceArea}`}
          intro="Based in Affton and working across the metro — from St. Louis City and County out through St. Charles, Jefferson and the surrounding communities."
        >
          <Reveal stagger className="mt-10 flex flex-wrap gap-3">
            {site.counties.map((county) => (
              <span
                key={county}
                className="rounded-full border border-navy-900/15 bg-cream px-4 py-2 text-sm font-semibold text-navy-900"
              >
                {county}
              </span>
            ))}
          </Reveal>
          <Reveal delay={0.2} className="mt-8">
            <p className="text-sm text-charcoal/60">
              Not sure if you&apos;re in range?{" "}
              <a
                href={site.phoneHref}
                className="font-semibold text-lime-700 underline underline-offset-2"
              >
                Call {site.phone}
              </a>{" "}
              and we&apos;ll tell you straight.
            </p>
          </Reveal>
        </Section>

        {/* ---------- Final CTA ---------- */}
        <section
          className="bg-gradient-to-b from-navy-900 to-navy-950 py-20 sm:py-28"
          aria-labelledby="cta-heading"
        >
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <Reveal>
              <h2
                id="cta-heading"
                className="text-3xl font-extrabold text-white sm:text-4xl"
              >
                Let&apos;s talk about your project
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-white/70">
                Free consultation, straight answers and a clear scope before any
                work starts. Tell us what you need and we&apos;ll get you on the
                schedule.
              </p>
              <div className="mt-9 flex flex-wrap justify-center gap-4">
                <Button href={site.primaryCta.href}>
                  {site.primaryCta.label}
                </Button>
                <Button href={site.phoneHref} variant="secondary">
                  {site.phone}
                </Button>
              </div>
              <p className="mt-10 text-sm text-white/60">
                Looking to join the team instead?{" "}
                <a
                  href="/careers"
                  className="font-semibold text-lime-400 underline underline-offset-2"
                >
                  See our open roles
                </a>
              </p>
            </Reveal>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
