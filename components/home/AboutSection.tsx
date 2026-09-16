import Image from "next/image";
import Reveal from "@/components/motion/Reveal";
import Parallax from "@/components/motion/Parallax";
import Button from "@/components/site/Button";
import { about } from "@/content/home";

export default function AboutSection() {
  return (
    <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
      <Reveal from="left">
        <p className="text-sm font-bold uppercase tracking-widest text-lime-700">
          Meet the owner
        </p>
        <h2
          id="about-heading"
          className="mt-3 text-3xl font-extrabold text-navy-900 sm:text-4xl"
        >
          {about.heading}
        </h2>
        <div className="mt-6 space-y-4">
          {about.paragraphs.map((p) => (
            <p key={p.slice(0, 24)} className="leading-relaxed text-charcoal/75">
              {p}
            </p>
          ))}
        </div>
        <div className="mt-8">
          <Button href="/contact" variant="ghost">
            Get in touch
          </Button>
        </div>
      </Reveal>

      <Reveal from="right" delay={0.1}>
        <figure>
          <Parallax className="aspect-[4/5] rounded-2xl border border-navy-900/10 shadow-xl">
            <div className="relative h-full w-full">
              <Image
                src={about.image.src}
                alt={about.image.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
              />
            </div>
          </Parallax>
          {about.imageNote && (
            <figcaption className="mt-3 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-900">
              {about.imageNote}
            </figcaption>
          )}
        </figure>
      </Reveal>
    </div>
  );
}
