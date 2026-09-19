import type { Faq as FaqItem } from "@/content/services/types";

/**
 * FAQ list built on native <details>/<summary>: keyboard-operable, screen
 * reader friendly, and every answer is present in the initial HTML whether
 * or not JavaScript runs. The same `items` array feeds the FAQPage schema, so
 * the structured data always matches the visible text exactly.
 *
 * Not scroll-revealed — questions are content a visitor may be scanning for.
 */
export default function Faq({ items }: { items: FaqItem[] }) {
  return (
    <div className="mt-10 divide-y divide-navy-900/10 rounded-xl border border-navy-900/10 bg-white">
      {items.map((item) => (
        <details key={item.q} className="group px-6 py-1">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-4 text-left font-bold text-navy-900 marker:hidden [&::-webkit-details-marker]:hidden">
            <span>{item.q}</span>
            <svg
              aria-hidden="true"
              className="mt-1 h-5 w-5 shrink-0 text-lime-700 transition-transform group-open:rotate-45"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path strokeLinecap="round" d="M12 5v14M5 12h14" />
            </svg>
          </summary>
          <p className="pb-5 pr-11 leading-relaxed text-charcoal/80">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
