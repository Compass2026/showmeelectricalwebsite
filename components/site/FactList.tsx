import type { LabeledFact } from "@/content/cities/types";

/**
 * A definition list of labelled facts. Semantic `<dl>` so a reader, a
 * screen reader or an agent gets label → value pairs, not a styled grid
 * that only looks like one. Content is passed in; nothing here is a claim.
 */
export default function FactList({ items }: { items: LabeledFact[] }) {
  return (
    <dl className="mt-10 grid gap-px overflow-hidden rounded-xl border border-navy-900/10 bg-navy-900/10 sm:grid-cols-2">
      {items.map((f) => (
        <div key={f.label} className="bg-white px-6 py-5">
          <dt className="text-sm font-bold uppercase tracking-wide text-charcoal/55">{f.label}</dt>
          <dd className="mt-1.5 font-medium leading-relaxed text-navy-900">{f.value}</dd>
        </div>
      ))}
    </dl>
  );
}
