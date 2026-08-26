import Reveal from "./Reveal";

const stages = [
  {
    stage: "01",
    title: "Apprentice",
    years: "Years 0–4",
    description:
      "Earn while you learn. 144 classroom hours and 2,000 paid on-the-job hours per year under a Master or Foreman Electrician — theory, math, blueprints, safety, and code.",
    points: ["Paid on-the-job training", "Classroom instruction", "Mentored by Masters"],
  },
  {
    stage: "02",
    title: "Journeyman",
    years: "Years 4–8+",
    description:
      "Licensed and trusted on high-profile residential, commercial, and industrial projects — power distribution, fire alarm, automation, low-voltage, and more.",
    points: ["Journeyman license", "Lead real installations", "Grow your specialties"],
  },
  {
    stage: "03",
    title: "Master Electrician",
    years: "Your career peak",
    description:
      "Run jobs, mentor the next generation of apprentices, and take on the most complex electrical work in the region as a recognized expert in the trade.",
    points: ["Supervise & mentor", "Top earning potential", "Industry recognition"],
  },
];

export default function CareerTimeline() {
  return (
    <ol className="relative mx-auto mt-14 grid max-w-5xl gap-10 md:grid-cols-3 md:gap-8">
      {/* connecting line */}
      <div
        aria-hidden="true"
        className="absolute left-6 top-0 h-full w-0.5 bg-gradient-to-b from-lime-500 via-lime-500/60 to-navy-700 md:left-0 md:top-9 md:h-0.5 md:w-full md:bg-gradient-to-r"
      />
      {stages.map((s, i) => (
        <Reveal as="li" key={s.stage} delay={i * 150} className="relative pl-16 md:pl-0 md:pt-20">
          {/* node */}
          <div
            aria-hidden="true"
            className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-full border-2 border-lime-500 bg-navy-950 shadow-[0_0_24px_rgba(166,206,57,0.45)] md:left-1/2 md:top-3 md:-translate-x-1/2"
          >
            <BoltIcon />
          </div>
          <div className="rounded-xl border border-white/10 bg-navy-800/60 p-6 backdrop-blur transition-colors hover:border-lime-500/50">
            <p className="text-xs font-bold uppercase tracking-widest text-lime-500">
              Step {s.stage} · {s.years}
            </p>
            <h3 className="mt-2 text-xl font-bold text-white">{s.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/70">
              {s.description}
            </p>
            <ul className="mt-4 space-y-1.5">
              {s.points.map((p) => (
                <li key={p} className="flex items-start gap-2 text-sm text-white/85">
                  <CheckIcon />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      ))}
    </ol>
  );
}

function BoltIcon() {
  return (
    <svg className="h-5 w-5 text-lime-500" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M13 2 4.5 13.5H11L9.5 22 19 10h-6.5L13 2Z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="mt-0.5 h-4 w-4 shrink-0 text-lime-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}
