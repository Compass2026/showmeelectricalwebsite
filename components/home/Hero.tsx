import Image from "next/image";
import CircuitBackground from "@/components/CircuitBackground";
import StaggerText from "@/components/motion/StaggerText";
import Reveal from "@/components/motion/Reveal";
import Parallax from "@/components/motion/Parallax";
import Button from "@/components/site/Button";
import { site } from "@/config/site.config";
import { hero } from "@/content/home";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-navy-950">
      <CircuitBackground />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-transparent via-navy-950/40 to-navy-950"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 sm:py-24 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:py-28">
        <div>
          <Reveal>
            <p className="inline-flex items-center gap-2 rounded-full border border-lime-500/40 bg-lime-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-lime-400">
              {hero.eyebrow}
            </p>
          </Reveal>

          <h1 className="mt-6 text-4xl font-extrabold leading-[1.08] text-white sm:text-5xl lg:text-6xl">
            <StaggerText as="span" text={hero.headline} className="block" />{" "}
            <StaggerText
              as="span"
              text={hero.headlineAccent}
              className="mt-1 block text-lime-500"
              delay={0.12}
            />
          </h1>

          <Reveal delay={0.15}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/75">
              {hero.body}
            </p>
          </Reveal>

          <Reveal delay={0.25} className="mt-9 flex flex-wrap gap-4">
            <Button href={site.primaryCta.href}>{site.primaryCta.label}</Button>
            <Button href={site.phoneHref} variant="secondary">
              {site.phone}
            </Button>
          </Reveal>
        </div>

        <Reveal from="right" delay={0.2}>
          <Parallax className="aspect-[4/5] rounded-2xl border border-white/10 shadow-2xl shadow-navy-950/60 sm:aspect-[5/4] lg:aspect-[4/5]">
            <div className="relative h-full w-full">
              <Image
                src={hero.image.src}
                alt={hero.image.alt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
              />
            </div>
          </Parallax>
        </Reveal>
      </div>
    </section>
  );
}
