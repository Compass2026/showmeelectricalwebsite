import Reveal from "@/components/motion/Reveal";

export interface Testimonial {
  quote: string;
  /** Attributed exactly as the client publishes it. */
  name: string;
  /** True when sentences were omitted; rendered as a visible "Excerpt" label. */
  excerpt?: boolean;
}

/**
 * Testimonial cards. Takes `items` as a prop and carries none of its own —
 * every entry is attributed exactly as the client publishes it, there is no
 * fallback label (no verification process is documented, so none may be
 * implied), and excerpts are marked as such.
 */
export default function Testimonials({ items }: { items: Testimonial[] }) {
  return (
    <div className="mt-12 grid gap-6 lg:grid-cols-3">
      {items.map((t, i) => (
        <Reveal key={i} delay={i * 0.1} className="h-full">
          <figure className="flex h-full flex-col rounded-xl border border-white/10 bg-primary-800/60 p-7 backdrop-blur">
            <svg
              aria-hidden="true"
              className="h-7 w-7 text-accent-500"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M7.5 5A5.5 5.5 0 0 0 2 10.5V19h8.5v-8.5H6A1.5 1.5 0 0 1 7.5 9V5Zm11 0A5.5 5.5 0 0 0 13 10.5V19h8.5v-8.5H17A1.5 1.5 0 0 1 18.5 9V5Z" />
            </svg>
            <blockquote className="mt-5 flex-1 text-sm leading-relaxed text-white/80">
              {t.quote}
            </blockquote>
            <figcaption className="mt-6 flex items-baseline justify-between gap-3 border-t border-white/10 pt-4 text-sm">
              <span className="font-bold text-accent-500">{t.name}</span>
              {t.excerpt && (
                <span className="text-xs text-white/50">Excerpt</span>
              )}
            </figcaption>
          </figure>
        </Reveal>
      ))}
    </div>
  );
}
