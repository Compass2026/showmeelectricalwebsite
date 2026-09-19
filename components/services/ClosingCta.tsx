import Reveal from "@/components/motion/Reveal";
import Button from "@/components/site/Button";
import { site } from "@/config/site.config";

/** Closing contact call to action, same shape as the homepage's. */
export default function ClosingCta({
  heading,
  body,
}: {
  heading: string;
  body: string;
}) {
  return (
    <section
      className="bg-gradient-to-b from-navy-900 to-navy-950 py-20 sm:py-24"
      aria-labelledby="closing-cta-heading"
    >
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <Reveal>
          <h2
            id="closing-cta-heading"
            className="text-3xl font-extrabold text-white sm:text-4xl"
          >
            {heading}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-white/70">
            {body}
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Button href={site.primaryCta.href}>{site.primaryCta.label}</Button>
            <Button href={site.phoneHref} variant="secondary">
              {site.phone}
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
