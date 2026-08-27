import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CircuitBackground from "@/components/CircuitBackground";
import CareerTimeline from "@/components/CareerTimeline";
import JobCard from "@/components/JobCard";
import ApplicationForm from "@/components/ApplicationForm";
import Reveal from "@/components/Reveal";
import { jobs, jobPostingJsonLd, AREAS_SERVED } from "@/lib/jobs";

export const dynamic = "force-static";

const whyCards = [
  {
    title: "Paid Training",
    description:
      "Earn a real paycheck from day one while you learn the trade — classroom instruction plus thousands of hours of hands-on experience under Master Electricians.",
    icon: "graduation",
  },
  {
    title: "A Clear Career Path",
    description:
      "Apprentice → Journeyman → Master. We invest in your licensing and advancement, so you always know your next step and what it takes to get there.",
    icon: "path",
  },
  {
    title: "Family-Owned Culture",
    description:
      "You're a name here, not a number. We're a family-owned company that takes care of its people and celebrates their wins.",
    icon: "family",
  },
  {
    title: "Steady, Varied Work",
    description:
      "Residential, commercial, and industrial projects across six Missouri counties mean consistent hours and work that never gets stale.",
    icon: "bolt",
  },
] as const;

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jobs.map(jobPostingJsonLd)),
        }}
      />
      <Header />
      <main id="main">
        {/* ---------- Hero ---------- */}
        <section className="relative overflow-hidden bg-navy-950">
          <CircuitBackground />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-b from-transparent via-navy-950/40 to-navy-950"
          />
          <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:py-40">
            <div className="max-w-3xl">
              <p className="inline-flex items-center gap-2 rounded-full border border-lime-500/40 bg-lime-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-lime-400">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime-500 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-lime-500" />
                </span>
                Now hiring — {jobs.length} open roles
              </p>
              <h1 className="mt-6 text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
                Build Your Career.
                <br />
                <span className="text-lime-500">Power Missouri.</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/75">
                Join a family-owned electrical contractor serving the greater
                St. Louis area. Paid training, steady work, and a clear path
                from Apprentice to Master Electrician.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <a
                  href="#open-roles"
                  className="rounded-lg bg-lime-500 px-8 py-4 text-sm font-bold uppercase tracking-wide text-navy-950 shadow-lg shadow-lime-500/25 transition hover:bg-lime-400"
                >
                  See Open Roles
                </a>
                <a
                  href="#career-path"
                  className="rounded-lg border border-white/25 px-8 py-4 text-sm font-bold uppercase tracking-wide text-white transition hover:border-lime-500 hover:text-lime-400"
                >
                  Your Career Path
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- Why Show Me Electrical ---------- */}
        <section className="bg-cream py-20 sm:py-28" aria-labelledby="why-heading">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <Reveal className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-widest text-lime-700">
                Why Show Me Electrical
              </p>
              <h2 id="why-heading" className="mt-3 text-3xl font-extrabold text-navy-900 sm:text-4xl">
                A trade career that actually goes somewhere
              </h2>
              <p className="mt-4 text-lg text-navy-900/70">
                We don&apos;t just hire electricians — we build them. Here&apos;s
                what you get when you join the team.
              </p>
            </Reveal>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {whyCards.map((card, i) => (
                <Reveal
                  key={card.title}
                  delay={i * 120}
                  className="rounded-xl border border-navy-900/8 bg-white p-7 shadow-sm transition-shadow hover:shadow-lg"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-navy-900">
                    <CardIcon name={card.icon} />
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-navy-900">{card.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-navy-900/70">
                    {card.description}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- Career path timeline ---------- */}
        <section
          id="career-path"
          className="relative overflow-hidden bg-navy-950 py-20 sm:py-28"
          aria-labelledby="path-heading"
        >
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-0 h-72 w-[800px] -translate-x-1/2 rounded-full bg-lime-500/10 blur-3xl"
          />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
            <Reveal className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-bold uppercase tracking-widest text-lime-500">
                Your Career Path
              </p>
              <h2 id="path-heading" className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">
                From first day to Master Electrician
              </h2>
              <p className="mt-4 text-lg text-white/70">
                A proven progression with paid training at every step. This is
                the roadmap our own Masters followed.
              </p>
            </Reveal>
            <CareerTimeline />
          </div>
        </section>

        {/* ---------- Open roles ---------- */}
        <section id="open-roles" className="scroll-mt-24 bg-white py-20 sm:py-28" aria-labelledby="roles-heading">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <Reveal className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-widest text-lime-700">
                Open Roles
              </p>
              <h2 id="roles-heading" className="mt-3 text-3xl font-extrabold text-navy-900 sm:text-4xl">
                Four ways to join the team
              </h2>
              <p className="mt-4 text-lg text-navy-900/70">
                Serving {AREAS_SERVED.slice(0, 3).join(", ")} and beyond — from
                our home base in Affton, MO.
              </p>
            </Reveal>
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {jobs.map((job, i) => (
                <Reveal key={job.slug} delay={i * 120} className="h-full">
                  <JobCard job={job} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- Application form ---------- */}
        <section
          id="apply"
          className="scroll-mt-24 bg-gradient-to-b from-navy-900 to-navy-950 py-20 sm:py-28"
          aria-labelledby="apply-heading"
        >
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <Reveal className="text-center">
              <p className="text-sm font-bold uppercase tracking-widest text-lime-500">
                Apply Now
              </p>
              <h2 id="apply-heading" className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">
                Start your application
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-white/70">
                Three quick steps — takes about two minutes. We review every
                application and respond fast.
              </p>
            </Reveal>
            <div className="mt-10">
              <ApplicationForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function CardIcon({ name }: { name: string }) {
  const cls = "h-6 w-6 text-lime-500";
  switch (name) {
    case "graduation":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 3 1 9l11 6 9-4.91V17h2V9L12 3Zm-7 9.18V17c0 1.66 3.13 3 7 3s7-1.34 7-3v-4.82l-7 3.82-7-3.82Z" />
        </svg>
      );
    case "path":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 19h4a4 4 0 0 0 4-4V9a4 4 0 0 1 4-4h4m0 0-3-3m3 3-3 3" />
        </svg>
      );
    case "family":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M16 11a3 3 0 1 0-3-3 3 3 0 0 0 3 3Zm-8 0a3 3 0 1 0-3-3 3 3 0 0 0 3 3Zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 14.17 10.33 13 8 13Zm8 0c-.29 0-.62.02-.97.05A4.22 4.22 0 0 1 17 16.5V19h6v-2.5c0-2.33-4.67-3.5-7-3.5Z" />
        </svg>
      );
    default:
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M13 2 4.5 13.5H11L9.5 22 19 10h-6.5L13 2Z" />
        </svg>
      );
  }
}
