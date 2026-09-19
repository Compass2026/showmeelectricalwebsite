import Image from "next/image";
import { HeroBackdrop } from "@/components/decor";
import StaggerText from "@/components/motion/StaggerText";
import Reveal from "@/components/motion/Reveal";
import Parallax from "@/components/motion/Parallax";
import Button from "@/components/site/Button";
import { site } from "@/config/site.config";
import { hero } from "@/content/home";

/**
 * Hero, sized so that headline, supporting copy and the primary CTA all sit
 * inside a typical desktop opening screen (1366×768 and up) beneath the sticky
 * header. The photo is a fixed-height landscape crop on desktop rather than a
 * 4:5 portrait, so it no longer dictates the section's height.
 *
 * Every entrance here is `immediate`: it plays on mount, not on scroll. The
 * hero is above the fold by design, and a scroll-triggered reveal could leave
 * the CTA hidden on a short viewport where it sits right at the trigger line.
 */
export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-navy-950">
      <HeroBackdrop />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-transparent via-navy-950/40 to-navy-950"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 sm:py-16 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14 lg:py-16">
        <div>
          <Reveal immediate>
            <p className="inline-flex items-center gap-2 rounded-full border border-lime-500/40 bg-lime-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-lime-400">
              {hero.eyebrow}
            </p>
          </Reveal>

          <h1 className="mt-5 text-4xl font-extrabold leading-[1.08] text-white sm:text-5xl lg:text-[3rem] xl:text-[3.25rem]">
            <StaggerText
              as="span"
              text={hero.headline}
              className="block"
              immediate
            />{" "}
            <StaggerText
              as="span"
              text={hero.headlineAccent}
              className="mt-1 block text-lime-500"
              delay={0.12}
              immediate
            />
          </h1>

          <Reveal delay={0.15} immediate>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/75">
              {hero.body}
            </p>
          </Reveal>

          <Reveal delay={0.25} immediate className="mt-7 flex flex-wrap gap-4">
            <Button href={site.primaryCta.href}>{site.primaryCta.label}</Button>
            <Button href={site.phoneHref} variant="secondary">
              {site.phone}
            </Button>
          </Reveal>
        </div>

        <Reveal from="right" delay={0.2} immediate>
          <Parallax className="aspect-[4/3] rounded-2xl border border-white/10 shadow-2xl shadow-navy-950/60 lg:aspect-auto lg:h-[440px] xl:h-[480px]">
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
