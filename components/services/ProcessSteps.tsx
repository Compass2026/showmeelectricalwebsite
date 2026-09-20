import Reveal from "@/components/motion/Reveal";
import type { ProcessStep } from "@/content/services/types";

/**
 * Compact three-step process for service pages: numbered nodes on a single
 * horizontal circuit trace. The homepage tells the same story at length with
 * photography and a scroll-drawn line; here it is a static strip so the page
 * stays short and scannable. Reduced motion needs nothing special — there is
 * no motion beyond the section reveal.
 */
export default function ProcessSteps({ steps }: { steps: ProcessStep[] }) {
  return (
    <div className="relative mt-12">
      {/* Horizontal circuit trace behind the nodes — desktop only */}
      <div
        aria-hidden="true"
        className="absolute left-0 right-0 top-7 hidden h-px bg-white/15 md:block"
      >
        <div className="mx-auto h-full w-2/3 bg-accent-500/60" />
      </div>

      <Reveal stagger as="ol" className="grid gap-10 md:grid-cols-3 md:gap-8">
        {steps.map((s) => (
          <li key={s.step} className="relative">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-accent-500 bg-primary-950 font-(family-name:--font-heading) text-sm font-bold text-accent-500 shadow-[0_0_24px_rgba(192,214,52,0.25)]">
              {s.step}
            </div>
            <h3 className="mt-5 text-xl font-bold text-white">{s.title}</h3>
            <p className="mt-2 leading-relaxed text-white/70">{s.body}</p>
          </li>
        ))}
      </Reveal>
    </div>
  );
}
