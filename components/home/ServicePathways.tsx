import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/motion/Reveal";
import { servicePathways } from "@/content/home";

/**
 * The three top-level service pathways — the hub pages the approved taxonomy
 * hangs its 24 services from. A card is a link only when its `href` is set,
 * i.e. only when that page exists; the others stay plain cards rather than
 * pointing at a 404. The whole card is one link, so keyboard users get a
 * single tab stop per card.
 */
export default function ServicePathways() {
  return (
    <div className="mt-12 grid gap-6 lg:grid-cols-3">
      {servicePathways.map((service, i) => (
        <Reveal key={service.slug} delay={i * 0.1} className="h-full">
          <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-navy-900/10 bg-white shadow-sm transition-all duration-300 hover:border-lime-500/60 hover:shadow-lg focus-within:border-lime-500 focus-within:shadow-lg">
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
              <h3 className="text-xl font-bold text-navy-900">
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
              <p className="mt-3 flex-1 text-sm leading-relaxed text-charcoal/70">
                {service.summary}
              </p>

              <ul className="mt-5 space-y-2 border-t border-navy-900/10 pt-5">
                {service.examples.map((example) => (
                  <li
                    key={example}
                    className="flex items-start gap-2 text-sm text-charcoal/80"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-lime-500"
                    />
                    {example}
                  </li>
                ))}
              </ul>

              {service.href && (
                <p
                  aria-hidden="true"
                  className="mt-6 text-sm font-bold uppercase tracking-wide text-lime-700 transition-colors group-hover:text-navy-900"
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
