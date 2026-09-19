import type { Block } from "@/content/blocks";

/**
 * Renders a `Block[]` as readable long-form prose. Generic: typography only,
 * no client strings. Headings start at h2 because the page supplies the h1.
 * Not scroll-revealed — this is content people came to read.
 */
export default function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-5 text-[1.0625rem] leading-relaxed text-charcoal/85">
      {blocks.map((b, i) => {
        switch (b.type) {
          case "h2":
            return (
              <h2
                key={i}
                className="pt-6 text-2xl font-extrabold text-navy-900 sm:text-3xl"
              >
                {b.text}
              </h2>
            );
          case "h3":
            return (
              <h3 key={i} className="pt-3 text-xl font-bold text-navy-900">
                {b.text}
              </h3>
            );
          case "p":
            return <p key={i}>{b.text}</p>;
          case "lines":
            return (
              <p key={i}>
                {b.lines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </p>
            );
          case "ul":
            return (
              <ul key={i} className="list-disc space-y-2 pl-6 marker:text-lime-700">
                {b.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={i} className="list-decimal space-y-2 pl-6 marker:font-bold marker:text-navy-900">
                {b.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ol>
            );
          case "quote":
            return (
              <blockquote
                key={i}
                className="border-l-4 border-lime-500 pl-5 italic text-charcoal/75"
              >
                {b.text}
              </blockquote>
            );
        }
      })}
    </div>
  );
}
