import Image from "next/image";
import { HeroBackdrop } from "@/components/decor";
import Reveal from "@/components/motion/Reveal";
import Button from "@/components/site/Button";
import Breadcrumbs from "@/components/site/Breadcrumbs";
import { site } from "@/config/site.config";
import type { Crumb, Photo } from "@/content/services/types";

export interface PageHeroContent {
  eyebrow: string;
  /** The page's only H1. */
  headline: string;
  intro: string;
  image: Photo;
}

/**
 * Inner-page hero (service pages, About, and any future page with a
 * breadcrumb). Same navy-and-backdrop language as the homepage, sized so the
 * H1, intro and both CTAs sit inside a typical desktop opening screen.
 *
 * Every entrance is `immediate` — this is above the fold by design and must
 * never wait for a scroll trigger. The backdrop comes from the decoration
 * registry; nothing here is client- or industry-specific.
 */
export default function PageHero({
  hero,
  breadcrumbs,
}: {
  hero: PageHeroContent;
  breadcrumbs: Crumb[];
}) {
  return (
    <section className="relative overflow-hidden bg-primary-950">
      <HeroBackdrop />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-950/40 to-primary-950"
      />

      <div className="relative mx-auto max-w-7xl px-4 pt-6 sm:px-6">
        <Reveal immediate>
          <Breadcrumbs crumbs={breadcrumbs} />
        </Reveal>
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 pb-14 pt-8 sm:px-6 sm:pb-16 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
        <div>
          <Reveal immediate>
            <p className="inline-flex items-center gap-2 rounded-full border border-accent-500/40 bg-accent-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-accent-400">
              {hero.eyebrow}
            </p>
          </Reveal>

          <Reveal immediate delay={0.08}>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.08] text-white sm:text-5xl lg:text-[3rem] xl:text-[3.25rem]">
              {hero.headline}
            </h1>
          </Reveal>

          <Reveal immediate delay={0.15}>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/75">
              {hero.intro}
            </p>
          </Reveal>

          <Reveal immediate delay={0.25} className="mt-7 flex flex-wrap gap-4">
            <Button href={site.primaryCta.href}>{site.primaryCta.label}</Button>
            <Button href={site.phoneHref} variant="secondary">
              {site.phone}
            </Button>
          </Reveal>
        </div>

        <Reveal from="right" delay={0.2} immediate>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-primary-950/60 lg:aspect-auto lg:h-[420px] xl:h-[460px]">
            <Image
              src={hero.image.src}
              alt={hero.image.alt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
