import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import PageHero from "@/components/site/PageHero";
import Section from "@/components/site/Section";
import Reveal from "@/components/motion/Reveal";
import ClosingCta from "@/components/services/ClosingCta";
import { site } from "@/config/site.config";
import { pageMetadata } from "@/lib/metadata";
import { articles, blog } from "@/content/blog";
import {
  localBusinessJsonLd,
  websiteJsonLd,
  blogJsonLd,
  breadcrumbJsonLd,
} from "@/lib/seo";

export const dynamic = "force-static";


export const metadata: Metadata = pageMetadata({
  title: blog.seo.title,
  description: blog.seo.description,
  path: blog.path,
  image: blog.seo.image,
  imageAlt: blog.hero.image.alt,
});

function formatDate(iso: string) {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

/**
 * /blog — index of the registry in content/blog/index.ts. Dates and bylines
 * are shown only when the post carries them.
 */
export default function BlogIndexPage() {
  // A brand that publishes no articles has no blog: the route is a real 404.
  if (articles.length === 0) notFound();
  const jsonLd = [
    localBusinessJsonLd(),
    websiteJsonLd(),
    blogJsonLd(blog.path, blog.seo.title, blog.seo.description, articles),
    breadcrumbJsonLd(blog.breadcrumbs, blog.path),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />

      <main id="main">
        <PageHero hero={blog.hero} breadcrumbs={blog.breadcrumbs} />

        <Section id="posts" tone="light" headingId="posts-heading" heading={blog.labels.latest}>
          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((post, i) => (
              <li key={post.slug} className="flex">
                <Reveal delay={i * 0.08} className="flex w-full">
                  <article className="flex w-full flex-col rounded-xl border border-primary-900/10 bg-white p-6 shadow-sm">
                    {post.publishedAt && (
                      <p className="text-xs font-semibold uppercase tracking-widest text-ink/55">
                        <time dateTime={post.publishedAt}>
                          {formatDate(post.publishedAt)}
                        </time>
                      </p>
                    )}
                    <h3 className="mt-3 text-xl font-bold leading-snug text-primary-900">
                      <Link
                        href={post.path}
                        className="-my-1 inline-block py-1 hover:text-accent-700"
                      >
                        {post.title}
                      </Link>
                    </h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-ink/75">
                      {post.excerpt}
                    </p>
                    <p className="mt-5">
                      <Link
                        href={post.path}
                        className="-my-1 inline-block py-1 text-sm font-bold text-accent-700 underline underline-offset-4"
                        aria-label={`${blog.labels.readPrefix} ${post.title}`}
                      >
                        {blog.labels.readPost}
                      </Link>
                    </p>
                  </article>
                </Reveal>
              </li>
            ))}
          </ul>
        </Section>

        <ClosingCta heading={blog.cta.heading} body={blog.cta.body} />
      </main>

      <SiteFooter />
    </>
  );
}
