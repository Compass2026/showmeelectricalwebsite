import type { Metadata } from "next";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import PreviewNotice from "@/components/site/PreviewNotice";
import Reveal from "@/components/motion/Reveal";
import Button from "@/components/site/Button";
import { site } from "@/config/site.config";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Contact — Free Electrical Quotes in St. Louis, MO",
  description: `Contact ${site.legalName} for a free consultation. Call ${site.phone} or email ${site.email}. Serving the ${site.serviceArea}.`,
  alternates: { canonical: `${site.productionUrl}/contact` },
};

/**
 * Contact page.
 *
 * NO FORM. The WordPress contact form has no replacement backend yet, and a
 * form that cannot submit must never show a success message. Until the route
 * handler is built (mirroring the careers /api/apply Resend integration),
 * every action here is a real `tel:` or `mailto:` link that works today.
 */
export default function ContactPage() {
  return (
    <>
      <PreviewNotice />
      <SiteHeader />

      <main id="main">
        <section className="bg-navy-950 py-16 sm:py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <Reveal>
              <p className="text-sm font-bold uppercase tracking-widest text-lime-500">
                Contact
              </p>
              <h1 className="mt-3 text-3xl font-extrabold text-white sm:text-5xl">
                Let&apos;s talk about your project
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/75">
                Free consultation, straight answers and a clear scope before any
                work starts. Call or email and we&apos;ll get you on the
                schedule.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="bg-white py-16 sm:py-20">
          <div className="mx-auto grid max-w-4xl gap-8 px-4 sm:px-6 md:grid-cols-2">
            <Reveal className="rounded-xl border border-navy-900/10 bg-cream p-8">
              <h2 className="text-lg font-bold text-navy-900">Call us</h2>
              <p className="mt-2 text-sm leading-relaxed text-charcoal/70">
                Fastest way to reach us during business hours.
              </p>
              <a
                href={site.phoneHref}
                className="mt-4 block text-2xl font-extrabold text-navy-900 hover:text-lime-700"
              >
                {site.phone}
              </a>
            </Reveal>

            <Reveal delay={0.1} className="rounded-xl border border-navy-900/10 bg-cream p-8">
              <h2 className="text-lg font-bold text-navy-900">Email us</h2>
              <p className="mt-2 text-sm leading-relaxed text-charcoal/70">
                Send project details and we&apos;ll come back to you.
              </p>
              <a
                href={`mailto:${site.email}`}
                className="mt-4 block break-words text-lg font-bold text-navy-900 hover:text-lime-700"
              >
                {site.email}
              </a>
            </Reveal>

            <Reveal delay={0.15} className="rounded-xl border border-navy-900/10 p-8 md:col-span-2">
              <h2 className="text-lg font-bold text-navy-900">Our shop</h2>
              <address className="mt-3 not-italic leading-relaxed text-charcoal/75">
                {site.address.street}
                <br />
                {site.address.city}, {site.address.state} {site.address.zip}
              </address>
              <p className="mt-4 text-sm text-charcoal/70">
                Serving the {site.serviceArea}.
              </p>
            </Reveal>

            <Reveal
              delay={0.2}
              className="rounded-md border border-amber-300 bg-amber-50 p-4 md:col-span-2"
            >
              <p className="text-xs leading-relaxed text-amber-900">
                <strong>Prototype note:</strong> the enquiry form is not built
                yet — there is no submission backend, so no form is shown rather
                than one that silently fails. The integration will mirror the
                careers application route (Next.js route handler → Resend). The
                links above are live and working.
              </p>
            </Reveal>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
