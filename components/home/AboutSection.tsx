import Image from "next/image";
import Reveal from "@/components/motion/Reveal";
import Parallax from "@/components/motion/Parallax";
import Button from "@/components/site/Button";
import type { Photo } from "@/content/services/types";

/**
 * Story block: eyebrow, heading, paragraphs and a photograph side by side.
 * Takes everything as props — the homepage passes its condensed About copy
 * and links through to /about; the About page passes the full story. The
 * component carries no copy of its own.
 */
export default function AboutSection({
  eyebrow,
  heading,
  headingId = "about-heading",
  paragraphs,
  image,
  cta,
}: {
  eyebrow?: string;
  heading: string;
  headingId?: string;
  paragraphs: string[];
  image: Photo;
  cta?: { label: string; href: string };
}) {
  return (
    <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
      <Reveal from="left">
        {eyebrow && (
          <p className="text-sm font-bold uppercase tracking-widest text-accent-700">
            {eyebrow}
          </p>
        )}
        <h2
          id={headingId}
          className="mt-3 text-3xl font-extrabold text-primary-900 sm:text-4xl"
        >
          {heading}
        </h2>
        <div className="mt-6 space-y-4">
          {paragraphs.map((p) => (
            <p key={p.slice(0, 24)} className="leading-relaxed text-ink/75">
              {p}
            </p>
          ))}
        </div>
        {cta && (
          <div className="mt-8">
            <Button href={cta.href} variant="ghost">
              {cta.label}
            </Button>
          </div>
        )}
      </Reveal>

      <Reveal from="right" delay={0.1}>
        <figure>
          <Parallax className="aspect-[4/5] rounded-2xl border border-primary-900/10 shadow-xl">
            <div className="relative h-full w-full">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
              />
            </div>
          </Parallax>
        </figure>
      </Reveal>
    </div>
  );
}
