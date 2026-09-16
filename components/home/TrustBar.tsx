import Reveal from "@/components/motion/Reveal";
import { trustPoints } from "@/content/home";

/**
 * Verified company facts. Every entry traces to the client's live site — no
 * review counts, star ratings or project totals, which we do not have.
 */
export default function TrustBar() {
  return (
    <section className="border-b border-navy-900/10 bg-cream py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {trustPoints.map((point) => (
            <div key={point.label} className="flex items-start gap-3">
              <svg
                className="mt-0.5 h-5 w-5 shrink-0 text-lime-700"
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
                <p className="font-bold text-navy-900">{point.label}</p>
                <p className="mt-0.5 text-sm leading-relaxed text-charcoal/70">
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
