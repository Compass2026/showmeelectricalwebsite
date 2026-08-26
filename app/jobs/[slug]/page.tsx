import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import {
  ADDRESS,
  getJob,
  jobs,
  jobPostingJsonLd,
  SITE_URL,
} from "@/lib/jobs";

export const dynamicParams = false;

export function generateStaticParams() {
  return jobs.map((job) => ({ slug: job.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const job = getJob(slug);
  if (!job) return {};
  return {
    title: `${job.title} — St. Louis, MO`,
    description: job.cardSummary,
    alternates: { canonical: `${SITE_URL}/jobs/${job.slug}` },
    openGraph: {
      title: `${job.title} | Show Me Electrical Careers`,
      description: job.cardSummary,
      url: `${SITE_URL}/jobs/${job.slug}`,
      type: "website",
    },
  };
}

export default async function JobPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const job = getJob(slug);
  if (!job) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jobPostingJsonLd(job)),
        }}
      />
      <Header />
      <main id="main">
        {/* Job hero */}
        <section className="bg-navy-950 py-16 sm:py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <nav aria-label="Breadcrumb" className="text-sm text-white/60">
              <Link href="/" className="hover:text-lime-400">
                Careers
              </Link>
              <span aria-hidden="true" className="mx-2">
                /
              </span>
              <span className="text-white/90">{job.title}</span>
            </nav>
            <h1 className="mt-5 text-3xl font-extrabold text-white sm:text-5xl">
              {job.title}
            </h1>
            <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
              <span className="rounded-full bg-lime-500/15 px-3.5 py-1.5 font-bold uppercase tracking-wide text-lime-400">
                {job.category}
              </span>
              <span className="rounded-full bg-white/10 px-3.5 py-1.5 font-semibold text-white/85">
                {job.typeLabel}
              </span>
              <span className="rounded-full bg-white/10 px-3.5 py-1.5 font-semibold text-white/85">
                {ADDRESS.city}, {ADDRESS.state} + greater St. Louis
              </span>
            </div>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/75">
              {job.overview}
            </p>
            <Link
              href={`/?role=${job.slug}#apply`}
              className="mt-8 inline-block rounded-lg bg-lime-500 px-8 py-4 text-sm font-bold uppercase tracking-wide text-navy-950 shadow-lg shadow-lime-500/25 transition hover:bg-lime-400"
            >
              Apply for this role
            </Link>
          </div>
        </section>

        {/* Job body */}
        <section className="bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-4xl space-y-12 px-4 sm:px-6">
            {job.sections.map((section, i) => (
              <Reveal key={section.heading} delay={Math.min(i, 2) * 100}>
                <h2 className="flex items-center gap-3 text-2xl font-bold text-navy-900">
                  <span aria-hidden="true" className="h-6 w-1.5 rounded-full bg-lime-500" />
                  {section.heading}
                </h2>
                {section.body && (
                  <p className="mt-4 leading-relaxed text-navy-900/75">
                    {section.body}
                  </p>
                )}
                {section.items && (
                  <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
                    {section.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2.5 rounded-lg bg-cream px-4 py-3 text-sm leading-relaxed text-navy-900/85"
                      >
                        <svg
                          className="mt-0.5 h-4 w-4 shrink-0 text-lime-600"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          aria-hidden="true"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </Reveal>
            ))}

            {/* Bottom CTA */}
            <Reveal className="rounded-2xl bg-navy-950 p-8 text-center sm:p-12">
              <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
                Ready to join the team?
              </h2>
              <p className="mx-auto mt-3 max-w-md text-white/70">
                The application takes about two minutes. We review every one and
                respond fast.
              </p>
              <Link
                href={`/?role=${job.slug}#apply`}
                className="mt-7 inline-block rounded-lg bg-lime-500 px-8 py-4 text-sm font-bold uppercase tracking-wide text-navy-950 transition hover:bg-lime-400"
              >
                Apply for this role
              </Link>
              <p className="mt-6 text-sm text-white/50">
                <Link href="/#open-roles" className="underline hover:text-lime-400">
                  ← Back to all open roles
                </Link>
              </p>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
