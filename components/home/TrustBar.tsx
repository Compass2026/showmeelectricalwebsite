import Reveal from "@/components/motion/Reveal";
import type { TrustPoint } from "@/content/services/types";

/**
 * A strip of short verified facts. The component carries no facts of its own
 * — every page passes its `points` in — so no client's claims can ever become
 * a default in the shared component.
 */
export default function TrustBar({ points }: { points: TrustPoint[] }) {
  return (
    <section className="border-b border-primary-900/10 bg-surface py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {points.map((point) => (
            <div key={point.label} className="flex items-start gap-3">
              <svg
                className="mt-0.5 h-5 w-5 shrink-0 text-accent-700"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <div>
                <p className="font-bold text-primary-900">{point.label}</p>
                <p className="mt-0.5 text-sm leading-relaxed text-ink/70">
                  {point.detail}
                </p>
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
