import type { Article } from "@/content/blog/types";
import type { Crumb, Photo } from "@/content/services/types";

/** Harbor Lane publishes no articles: /blog is a real 404 and nothing links to it. */
export const articles: Article[] = [];
export function findArticle(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}
export const blog = {
  path: "/blog",
  seo: { title: "Blog | Harbor Lane Plumbing", description: "", image: "/demo/placeholder-1200x630.png" },
  breadcrumbs: [{ label: "Home", href: "/" }, { label: "Blog" }] as Crumb[],
  hero: { eyebrow: "Blog", headline: "Blog", intro: "", image: { src: "/demo/placeholder-hero.svg", alt: "Placeholder" } as Photo },
  postBreadcrumbs: [{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }] as Crumb[],
  labels: { latest: "Latest posts", readPost: "Read the post", readPrefix: "Read:", published: "Published", updated: "Updated", relatedServices: "Related services", relatedArticles: "Keep reading" },
  cta: { heading: "", body: "" },
};
