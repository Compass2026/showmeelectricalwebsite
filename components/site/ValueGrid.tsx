import Reveal from "@/components/motion/Reveal";

export interface ValueItem {
  title: string;
  body: string;
}

/**
 * Short statements in a grid — how a company works, what a customer gets.
 * Generic: the items are props. Cards are the `Reveal stagger` targets, so
 * they carry no CSS transition of their own (see Reveal.tsx).
 */
export default function ValueGrid({ items }: { items: ValueItem[] }) {
  return (
    <Reveal stagger className="mt-12 grid gap-5 sm:grid-cols-2">
      {items.map((v) => (
        <div
          key={v.title}
          className="rounded-xl border border-primary-900/10 bg-white p-7 shadow-sm"
        >
          <h3 className="text-lg font-bold text-primary-900">{v.title}</h3>
          <p className="mt-2 leading-relaxed text-ink/75">{v.body}</p>
        </div>
      ))}
    </Reveal>
  );
}
