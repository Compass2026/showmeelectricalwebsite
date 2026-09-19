import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import PreviewNotice from "@/components/site/PreviewNotice";
import ArticleLayout from "@/components/site/ArticleLayout";
import { site } from "@/config/site.config";
import { articles, blog, findArticle } from "@/content/blog";
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
  const url = `${site.productionUrl}${post.path}`;
  const image = post.image
    ? `${site.productionUrl}${post.image.src}`
    : `${site.productionUrl}${blog.seo.image}`;
  // Brand suffix only while the whole title stays within 60 characters.
  const suffixed = `${post.title} | ${site.name}`;
  return {
    title: { absolute: suffixed.length <= 60 ? suffixed : post.title },
    description: post.seo.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      siteName: site.name,
      title: post.title,
      description: post.seo.description,
      url,
      images: [{ url: image }],
      ...(post.publishedAt ? { publishedTime: post.publishedAt } : {}),
      ...(post.author ? { authors: [post.author] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.seo.description,
      images: [image],
    },
  };
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
        <ArticleLayout article={post} breadcrumbs={breadcrumbs} cta={blog.cta} />
      </main>
      <SiteFooter />
    </>
  );
}
