import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/motion/Reveal";
import type { Photo } from "@/content/services/types";

export interface PathwayCard {
  slug: string;
  title: string;
  summary: string;
  examples: string[];
  image: Photo;
  /** Set only when the page exists. Absent = a plain card, never a 404. */
  href?: string;
}

/**
 * Pathway cards. Takes `items` as a prop — the homepage passes its own copy,
 * the services directory builds them from the registry of implemented pages.
 * A card is a link only when `href` is set; the whole card is one link, so
 * keyboard users get a single tab stop per card.
 */
export default function ServicePathways({ items }: { items: PathwayCard[] }) {
  return (
    <div className="mt-12 grid gap-6 lg:grid-cols-3">
      {items.map((service, i) => (
        <Reveal key={service.slug} delay={i * 0.1} className="h-full">
          <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-primary-900/10 bg-white shadow-sm transition-all duration-300 hover:border-accent-500/60 hover:shadow-lg focus-within:border-accent-500 focus-within:shadow-lg">
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image
                src={service.image.src}
                alt={service.image.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            <div className="flex flex-1 flex-col p-7">
              <h3 className="text-xl font-bold text-primary-900">
                {service.href ? (
                  <Link
                    href={service.href}
                    className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
                  >
                    {service.title}
                  </Link>
                ) : (
                  service.title
                )}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-ink/70">
                {service.summary}
              </p>

              {service.examples.length > 0 && (
                <ul className="mt-5 space-y-2 border-t border-primary-900/10 pt-5">
                  {service.examples.map((example) => (
                    <li
                      key={example}
                      className="flex items-start gap-2 text-sm text-ink/80"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-500"
                      />
                      {example}
                    </li>
                  ))}
                </ul>
              )}

              {service.href && (
                <p
                  aria-hidden="true"
                  className="mt-6 text-sm font-bold uppercase tracking-wide text-accent-700 transition-colors group-hover:text-primary-900"
                >
                  {service.title} services →
                </p>
              )}
            </div>
          </article>
        </Reveal>
      ))}
    </div>
  );
}
