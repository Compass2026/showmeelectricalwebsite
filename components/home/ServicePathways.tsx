import Image from "next/image";
import Reveal from "@/components/motion/Reveal";
import { servicePathways } from "@/content/home";

/**
 * The three top-level service pathways. These are the hub pages the approved
 * taxonomy hangs its 24 services from, so the cards link to routes that will
 * exist even though those pages are not built in this milestone.
 */
export default function ServicePathways() {
  return (
    <div className="mt-12 grid gap-6 lg:grid-cols-3">
      {servicePathways.map((service, i) => (
        <Reveal key={service.slug} delay={i * 0.1} className="h-full">
          <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-navy-900/10 bg-white shadow-sm transition-all duration-300 hover:border-lime-500/60 hover:shadow-lg">
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
                {service.title}
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

              <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-charcoal/45">
                Detailed page in the next milestone
              </p>
            </div>
          </article>
        </Reveal>
      ))}
    </div>
  );
}
