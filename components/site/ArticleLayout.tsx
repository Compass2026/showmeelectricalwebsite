import Image from "next/image";
import Breadcrumbs from "@/components/site/Breadcrumbs";
import Blocks from "@/components/site/Blocks";
import Reveal from "@/components/motion/Reveal";
import ClosingCta from "@/components/services/ClosingCta";
import type { Article } from "@/content/blog/types";
import type { Crumb } from "@/content/services/types";

/**
 * Article page layout. Header (breadcrumb, eyebrow, h1, meta line), an
 * optional lead image, the body, and the shared closing CTA. Date and byline
 * render only when present on the article — never a placeholder.
 */
export default function ArticleLayout({
  article,
  breadcrumbs,
  eyebrow = "Blog",
  cta,
}: {
  article: Article;
  breadcrumbs: Crumb[];
  eyebrow?: string;
  cta: { heading: string; body: string };
}) {
  const date = article.publishedAt
    ? new Date(`${article.publishedAt}T12:00:00Z`).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC",
      })
    : null;

  return (
    <>
      <header className="bg-navy-950 text-white">
        <div className="mx-auto max-w-3xl px-4 pb-14 pt-6 sm:px-6 sm:pb-16">
          <Reveal immediate>
            <Breadcrumbs crumbs={breadcrumbs} />
          </Reveal>
          <Reveal immediate delay={0.08}>
            <p className="mt-8 text-sm font-bold uppercase tracking-widest text-lime-500">
              {eyebrow}
            </p>
            <h1 className="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
              {article.title}
            </h1>
          </Reveal>
          {(date || article.author) && (
            <Reveal immediate delay={0.15}>
              <p className="mt-5 text-sm text-white/60">
                {date && (
                  <time dateTime={article.publishedAt}>{date}</time>
                )}
                {date && article.author && <span aria-hidden="true"> · </span>}
                {article.author && <span>By {article.author}</span>}
              </p>
            </Reveal>
          )}
        </div>
      </header>

      <article className="bg-white py-14 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          {article.image && (
            <figure className="mb-10">
              <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-navy-900/10">
                <Image
                  src={article.image.src}
                  alt={article.image.alt}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 768px"
                  className="object-cover"
                />
              </div>
              {article.image.caption && (
                <figcaption className="mt-3 text-sm text-charcoal/60">
                  {article.image.caption}
                </figcaption>
              )}
            </figure>
          )}
          <Blocks blocks={article.body} />
        </div>
      </article>

      <ClosingCta heading={cta.heading} body={cta.body} />
    </>
  );
}
