import Link from "next/link";
import Reveal from "@/components/motion/Reveal";
import type { RelatedLink } from "@/content/services/types";

/**
 * Internal links out of a service page — contact, process, owner, area.
 *
 * The cards are the elements `Reveal stagger` animates, so they carry NO CSS
 * `transition` of their own: a CSS transition on a GSAP-tweened element
 * fights the tween and can leave the element stuck at its start opacity.
 * Hover styling transitions on the inner elements instead.
 */
export default function RelatedLinks({ links }: { links: RelatedLink[] }) {
  return (
    <Reveal stagger className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className="group rounded-xl border border-navy-900/10 bg-white p-5 shadow-sm hover:border-lime-500/60 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-500"
        >
          <p className="font-bold text-navy-900 transition-colors group-hover:text-lime-700">
            {l.label} <span aria-hidden="true">→</span>
          </p>
          <p className="mt-1 text-sm leading-relaxed text-charcoal/70">
            {l.description}
          </p>
        </Link>
      ))}
    </Reveal>
  );
}
