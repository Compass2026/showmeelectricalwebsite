import Image from "next/image";
import { HeroBackdrop } from "@/components/decor";
import StaggerText from "@/components/motion/StaggerText";
import Reveal from "@/components/motion/Reveal";
import Parallax from "@/components/motion/Parallax";
import Button from "@/components/site/Button";
import { site } from "@/config/site.config";
import { hero } from "@/content/home";

/**
 * Hero — a two-column split on desktop: the words on the left, the work on the
 * right as a panel that runs to the viewport edge rather than a card floating
 * inside the container. The photo is the first thing a visitor sees of the
 * actual trade, so it is given half the width and the section's full height
 * instead of a boxed crop.
 *
 * Sized so that headline, supporting copy and the primary CTA all sit inside a
 * typical desktop opening screen (1366×768 and up) beneath the sticky header.
 * The column ratio is load-bearing, not taste: at a straight 1fr/1fr the
 * headline wraps to four lines at 1366 and pushes the CTA onto the fold.
 * `1.12fr/0.88fr` keeps the text column near the width it had as a boxed
 * layout, so the headline holds three lines and the CTA stays visible on
 * arrival — measured, not assumed. `lg:min-h-[32rem]` on the photo sets the
 * section's floor.
 *
 * One `<Image>` PER PHOTO, not one per breakpoint: the same element serves the
 * stacked mobile band and the desktop panel, moved by CSS. A copy hidden with
 * `display: none` is still fetched by most browsers, so a per-breakpoint
 * duplicate would cost a second hero-sized download on the one view where that
 * hurts most.
 *
 * A brand may supply one, two or three photos. More than one crossfades — in
 * CSS, so the rotation works on a page served without JavaScript and does not
 * wait on hydration (`.hero-slide-2` / `.hero-slide-3`, app/globals.css), and
 * stops entirely under `prefers-reduced-motion`. Only the FIRST is `priority`:
 * it is the one in front of the visitor on arrival, and preloading the others
 * would put three hero-sized images on the critical path to show one of them
 * eight seconds later.
 *
 * The left column's padding tracks where the `max-w-7xl` container would start
 * — `max(1.5rem, (100vw - 80rem)/2 + 1.5rem)` — so the headline stays aligned
 * with every section below it while the photo ignores the container entirely.
 *
 * Every entrance here is `immediate`: it plays on mount, not on scroll. The
 * hero is above the fold by design, and a scroll-triggered reveal could leave
 * the CTA hidden on a short viewport where it sits right at the trigger line.
 */
export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-primary-950">
      <HeroBackdrop />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-950/40 to-primary-950"
      />

      <div className="relative lg:grid lg:grid-cols-[1.12fr_0.88fr] lg:items-stretch">
        <div className="px-4 py-14 sm:px-6 sm:py-16 lg:py-16 lg:pl-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))] lg:pr-12">
          <Reveal immediate>
            <p className="inline-flex items-center gap-2 rounded-full border border-accent-500/40 bg-accent-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-accent-400">
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
              className="mt-1 block text-accent-500"
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

        {/* The photo panel. Stacked under the text on small screens as a fixed
            band; on `lg` it becomes the right half, flush to the viewport edge
            and as tall as the section. */}
        <Reveal
          from="right"
          delay={0.2}
          immediate
          className="relative h-64 px-4 pb-14 sm:h-80 sm:px-6 sm:pb-16 lg:h-auto lg:min-h-[32rem] lg:p-0"
        >
          <Parallax className="h-full w-full rounded-2xl border border-white/10 shadow-2xl shadow-primary-950/60 lg:rounded-none lg:border-0 lg:border-l lg:shadow-none">
            <div className="relative h-full w-full">
              {hero.images.map((image, i) => (
                <Image
                  key={image.src}
                  src={image.src}
                  alt={image.alt}
                  fill
                  priority={i === 0}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className={`object-cover${i > 0 ? ` hero-slide-${i + 1}` : ""}`}
                />
              ))}
            </div>
          </Parallax>

          {/* Softens the seam where the panel meets the headline column, so the
              photo's left edge is not a hard line against the dark field. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 hidden w-24 bg-gradient-to-r from-primary-950 to-transparent lg:block"
          />
        </Reveal>
      </div>
    </section>
  );
}
