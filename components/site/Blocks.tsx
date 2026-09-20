import Link from "next/link";
import type { Block, Inline, RichText } from "@/content/blocks";
import { isInternalHref } from "@/content/blocks";

/**
 * Renders a `Block[]` as readable long-form prose. Generic: typography only,
 * no client strings. Headings start at h2 because the page supplies the h1.
 * Not scroll-revealed — this is content people came to read.
 *
 * Links are ordinary anchors (crawlable, keyboard-reachable). Internal links
 * go through next/link; external ones open in the same tab with
 * `rel="noopener"` — nothing here decides that a reader should leave.
 */
export default function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-5 text-[1.0625rem] leading-relaxed text-ink/85">
      {blocks.map((b, i) => {
        switch (b.type) {
          case "h2":
            return (
              <h2
                key={i}
                id={b.id}
                className="scroll-mt-32 pt-6 text-2xl font-extrabold text-primary-900 sm:text-3xl"
              >
                {b.text}
              </h2>
            );
          case "h3":
            return (
              <h3 key={i} id={b.id} className="scroll-mt-32 pt-3 text-xl font-bold text-primary-900">
                {b.text}
              </h3>
            );
          case "p":
            return (
              <p key={i}>
                <Rich text={b.text} />
              </p>
            );
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
              <ul key={i} className="list-disc space-y-2 pl-6 marker:text-accent-700">
                {b.items.map((it, j) => (
                  <li key={j}>
                    <Rich text={it} />
                  </li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={i} className="list-decimal space-y-2 pl-6 marker:font-bold marker:text-primary-900">
                {b.items.map((it, j) => (
                  <li key={j}>
                    <Rich text={it} />
                  </li>
                ))}
              </ol>
            );
          case "quote":
            return (
              <blockquote
                key={i}
                cite={b.cite}
                className="border-l-4 border-accent-500 pl-5 italic text-ink/75"
              >
                <Rich text={b.text} />
              </blockquote>
            );
          case "table":
            return (
              <div key={i} className="overflow-x-auto rounded-lg border border-primary-900/10">
                <table className="w-full min-w-[32rem] border-collapse text-left text-base">
                  <caption className="px-4 py-3 text-left text-sm font-semibold text-ink/70">
                    {b.caption}
                  </caption>
                  <thead className="bg-surface">
                    <tr>
                      {b.header.map((h) => (
                        <th
                          key={h}
                          scope="col"
                          className="border-b border-primary-900/10 px-4 py-2.5 font-bold text-primary-900"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {b.rows.map((row, r) => (
                      <tr key={r} className="odd:bg-white even:bg-surface/50">
                        {row.map((cell, c) =>
                          b.rowHeader && c === 0 ? (
                            <th
                              key={c}
                              scope="row"
                              className="border-b border-primary-900/10 px-4 py-2.5 font-semibold text-primary-900"
                            >
                              <Rich text={cell} />
                            </th>
                          ) : (
                            <td key={c} className="border-b border-primary-900/10 px-4 py-2.5 align-top">
                              <Rich text={cell} />
                            </td>
                          )
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case "sources":
            return (
              <section key={i} aria-labelledby={`sources-${i}`} className="border-t border-primary-900/10 pt-5">
                <h2 id={`sources-${i}`} className="text-base font-bold uppercase tracking-widest text-ink/60">
                  {b.heading ?? "Sources"}
                </h2>
                <ol className="mt-3 list-decimal space-y-1.5 pl-6 text-sm">
                  {b.items.map((s) => (
                    <li key={s.href}>
                      <Anchor href={s.href}>{s.label}</Anchor>
                      {s.note && <span className="text-ink/65"> — {s.note}</span>}
                    </li>
                  ))}
                </ol>
              </section>
            );
        }
      })}
    </div>
  );
}

function Rich({ text }: { text: RichText }) {
  if (typeof text === "string") return <>{text}</>;
  return (
    <>
      {text.map((run, i) => (
        <Run key={i} run={run} />
      ))}
    </>
  );
}

function Run({ run }: { run: Inline }) {
  if (typeof run === "string") return <>{run}</>;
  switch (run.type) {
    case "strong":
      return <strong className="font-semibold text-primary-900">{run.text}</strong>;
    case "em":
      return <em>{run.text}</em>;
    case "link":
      return (
        <Anchor href={run.href} title={run.title}>
          {run.text}
        </Anchor>
      );
  }
}

// Prose links stay inline so they wrap with the sentence. Vertical padding on
// an inline element does not change line layout but does extend its hit
// area, so each link is at least 28px tall on touch screens (WCAG 2.2 target
// size) without breaking the sentence.
const anchorClass =
  "py-1 font-semibold text-accent-700 underline decoration-accent-700/40 underline-offset-[3px] hover:decoration-accent-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500";

function Anchor({ href, title, children }: { href: string; title?: string; children: React.ReactNode }) {
  if (isInternalHref(href)) {
    return (
      <Link href={href} title={title} className={anchorClass}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} title={title} rel="noopener" className={anchorClass}>
      {children}
    </a>
  );
}
