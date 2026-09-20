import Image from "next/image";
import Link from "next/link";
import Breadcrumbs from "@/components/site/Breadcrumbs";
import Blocks from "@/components/site/Blocks";
import Reveal from "@/components/motion/Reveal";
import ClosingCta from "@/components/services/ClosingCta";
import type { Article } from "@/content/blog/types";
import type { Crumb, RelatedLink } from "@/content/services/types";

export interface ArticleLabels {
  published: string;
  updated: string;
  relatedServices: string;
  relatedArticles: string;
}

/**
 * Article page layout. Header (breadcrumb, eyebrow, h1, meta line), an
 * optional lead image, the body, the article's registered relationships as
 * plain link lists, and the shared closing CTA.
 *
 * Dates and the byline render only when present on the article — never a
 * placeholder. "Updated" appears only for a recorded substantive revision,
 * alongside (not instead of) the original publication date.
 *
 * The related lists are resolved by the route from the registries, so they
 * can only ever point at published pages.
 */
export default function ArticleLayout({
  article,
  breadcrumbs,
  eyebrow = "Blog",
  labels,
  relatedServices = [],
  relatedArticles = [],
  cta,
}: {
  article: Article;
  breadcrumbs: Crumb[];
  eyebrow?: string;
  labels: ArticleLabels;
  relatedServices?: RelatedLink[];
  relatedArticles?: RelatedLink[];
  cta: { heading: string; body: string };
}) {
  const date = article.publishedAt ? formatDate(article.publishedAt) : null;
  const updated =
    article.modifiedAt && article.modifiedAt !== article.publishedAt
      ? formatDate(article.modifiedAt)
      : null;

  return (
    <>
      <header className="bg-primary-950 text-white">
        <div className="mx-auto max-w-3xl px-4 pb-14 pt-6 sm:px-6 sm:pb-16">
          <Reveal immediate>
            <Breadcrumbs crumbs={breadcrumbs} />
          </Reveal>
          <Reveal immediate delay={0.08}>
            <p className="mt-8 text-sm font-bold uppercase tracking-widest text-accent-500">
              {eyebrow}
            </p>
            <h1 className="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
              {article.title}
            </h1>
          </Reveal>
          {(date || article.author || updated) && (
            <Reveal immediate delay={0.15}>
              <p className="mt-5 text-sm text-white/60">
                {date && (
                  <>
                    <span className="sr-only">{labels.published} </span>
                    <time dateTime={article.publishedAt}>{date}</time>
                  </>
                )}
                {date && article.author && <span aria-hidden="true"> · </span>}
                {article.author && <span>By {article.author}</span>}
                {updated && (
                  <>
                    <span aria-hidden="true"> · </span>
                    <span>
                      {labels.updated} <time dateTime={article.modifiedAt}>{updated}</time>
                    </span>
                  </>
                )}
              </p>
            </Reveal>
          )}
        </div>
      </header>

      <article className="bg-white py-14 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          {article.image && (
            <figure className="mb-10">
              <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-primary-900/10">
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
                <figcaption className="mt-3 text-sm text-ink/60">
                  {article.image.caption}
                </figcaption>
              )}
            </figure>
          )}
          <Blocks blocks={article.body} />

          {(relatedServices.length > 0 || relatedArticles.length > 0) && (
            <div className="mt-14 grid gap-8 border-t border-primary-900/10 pt-10 sm:grid-cols-2">
              {relatedServices.length > 0 && (
                <RelatedList id="related-services" heading={labels.relatedServices} links={relatedServices} />
              )}
              {relatedArticles.length > 0 && (
                <RelatedList id="related-articles" heading={labels.relatedArticles} links={relatedArticles} />
              )}
            </div>
          )}
        </div>
      </article>

      <ClosingCta heading={cta.heading} body={cta.body} />
    </>
  );
}

function RelatedList({ id, heading, links }: { id: string; heading: string; links: RelatedLink[] }) {
  return (
    <nav aria-labelledby={`${id}-heading`}>
      <h2 id={`${id}-heading`} className="text-sm font-bold uppercase tracking-widest text-ink/60">
        {heading}
      </h2>
      <ul className="mt-4 space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="-my-1 inline-block py-1 font-bold text-primary-900 underline decoration-accent-700/40 underline-offset-4 hover:decoration-accent-700"
            >
              {link.label}
            </Link>
            {link.description && (
              <p className="mt-0.5 text-sm text-ink/70">{link.description}</p>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}

function formatDate(iso: string) {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}
