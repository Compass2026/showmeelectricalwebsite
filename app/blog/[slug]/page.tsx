import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import PreviewNotice from "@/components/site/PreviewNotice";
import ArticleLayout from "@/components/site/ArticleLayout";
import { site } from "@/config/site.config";
import { articles, blog, findArticle } from "@/content/blog";
import { servicePages } from "@/content/services";
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
  return articles.map((post) => ({ slug: post.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = findArticle(slug);
  if (!post) return {};
  // Brand suffix only while the whole title stays within 60 characters.
  const suffixed = `${post.title} | ${site.name}`;
  return pageMetadata({
    title: suffixed.length <= 60 ? suffixed : post.title,
    description: post.seo.description,
    path: post.path,
    image: post.image?.src,
    imageAlt: post.image?.alt,
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
    const page = servicePages.find((p) => p.path === path);
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
    blogPostingJsonLd(post),
    breadcrumbJsonLd(breadcrumbs, post.path),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PreviewNotice />
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
