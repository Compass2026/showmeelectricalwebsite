import { existsSync } from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import ArticleLayout from "@/components/site/ArticleLayout";
import { site } from "@/config/site.config";
import { articles, blog, findArticle } from "@/content/blog";
import { findServicePage } from "@/content/services";
import type { RelatedLink } from "@/content/services/types";
import { pageMetadata } from "@/lib/metadata";
import {
  localBusinessJsonLd,
  websiteJsonLd,
  blogPostingJsonLd,
  breadcrumbJsonLd,
} from "@/lib/seo";

/** Only registered posts are built; anything else is a real 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  // A Compass hero is committed with its post; a post whose file is missing
  // fails the build instead of shipping a broken image.
  for (const post of articles) {
    const src = post.heroImage?.src;
    if (src && !existsSync(path.join(process.cwd(), "public", src))) {
      throw new Error(`Blog post "${post.slug}" names hero image ${src}, which is not in public/.`);
    }
  }
  return articles.map((post) => ({ slug: post.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = findArticle(slug);
  if (!post) return {};
  // The SEO title (approved meta title) when the post carries one, else the
  // on-page title; the H1 stays `post.title`. Brand suffix only while the
  // whole title stays within 60 characters — never truncated.
  const seoTitle = post.seo.title?.trim() || post.title;
  const suffixed = `${seoTitle} | ${site.name}`;
  return pageMetadata({
    title: suffixed.length <= 60 ? suffixed : seoTitle,
    description: post.seo.description,
    path: post.path,
    image: (post.image ?? post.heroImage)?.src,
    imageAlt: (post.image ?? post.heroImage)?.alt,
    type: "article",
    publishedTime: post.publishedAt,
    modifiedTime: post.modifiedAt,
    authors: post.author ? [post.author] : undefined,
  });
}

/**
 * Related links are resolved from the registries, so an article can only
 * ever point at a published service page or article. An unregistered
 * reference is dropped here and reported by the route-manifest check.
 */
function relatedServiceLinks(paths: string[] = []): RelatedLink[] {
  return paths.flatMap((path) => {
    const page = findServicePage(path);
    return page
      ? [{ label: page.directory?.title ?? page.schema.name, href: page.path, description: page.directory?.summary ?? page.seo.description }]
      : [];
  });
}

function relatedArticleLinks(slugs: string[] = []): RelatedLink[] {
  return slugs.flatMap((slug) => {
    const a = findArticle(slug);
    return a ? [{ label: a.title, href: a.path, description: a.excerpt }] : [];
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = findArticle(slug);
  if (!post) notFound();

  const breadcrumbs = [...blog.postBreadcrumbs, { label: post.title }];
  const jsonLd = [
    localBusinessJsonLd(),
    websiteJsonLd(),
    blogPostingJsonLd({ ...post, image: post.image ?? post.heroImage }),
    breadcrumbJsonLd(breadcrumbs, post.path),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />
      <main id="main">
        <ArticleLayout
          article={post}
          breadcrumbs={breadcrumbs}
          labels={blog.labels}
          relatedServices={relatedServiceLinks(post.relatedServices)}
          relatedArticles={relatedArticleLinks(post.relatedArticles)}
          cta={blog.cta}
        />
      </main>
      <SiteFooter />
    </>
  );
}
