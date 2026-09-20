import Link from "next/link";
import type { Job } from "@/lib/jobs";

export default function JobCard({ job }: { job: Job }) {
  return (
    <article className="group relative flex h-full flex-col rounded-xl border border-primary-900/10 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-accent-500 hover:shadow-xl hover:shadow-primary-900/10">
      <div className="flex items-center justify-between gap-3">
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${
            job.category === "Field"
              ? "bg-accent-500/15 text-accent-700"
              : "bg-primary-900/8 text-primary-700"
          }`}
        >
          {job.category}
        </span>
        <span className="text-xs font-medium text-primary-900/50">
          {job.typeLabel}
        </span>
      </div>

      <h3 className="mt-4 text-xl font-bold text-primary-900 transition-colors group-hover:text-primary-700">
        {job.title}
      </h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-primary-900/70">
        {job.cardSummary}
      </p>

      <ul className="mt-5 flex flex-wrap gap-2">
        {job.highlights.map((h) => (
          <li
            key={h}
            className="rounded-md bg-surface px-2.5 py-1 text-xs font-semibold text-primary-800"
          >
            {h}
          </li>
        ))}
      </ul>

      <div className="mt-6 flex items-center justify-between border-t border-primary-900/10 pt-5">
        <Link
          href={`/careers/jobs/${job.slug}`}
          className="text-sm font-bold text-primary-900 after:absolute after:inset-0 group-hover:text-accent-700"
        >
          View details
          <span aria-hidden="true" className="ml-1 inline-block transition-transform group-hover:translate-x-1">
            →
          </span>
        </Link>
        <Link
          href={`/careers?role=${job.slug}#apply`}
          className="relative z-10 rounded-md bg-primary-900 px-4 py-2 text-xs font-bold uppercase tracking-wide text-white transition-colors hover:bg-accent-500 hover:text-primary-950"
        >
          Apply
        </Link>
      </div>
    </article>
  );
}
