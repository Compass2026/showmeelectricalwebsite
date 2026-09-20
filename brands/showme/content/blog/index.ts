import type { Article } from "@/content/blog/types";
import type { Crumb, Photo } from "@/content/services/types";
import { post as rewiring } from "./top-5-signs-your-home-needs-electrical-rewiring";
import { post as hazards } from "./the-most-common-electrical-hazards-found-in-missouri-homes";
import { post as callImmediately } from "./top-signs-you-need-to-call-an-electrician-immediately";

/**
 * REGISTRY of published articles — the only list the blog index, the post
 * routes and the sitemap read. A post that is not here does not exist on the
 * site. Newest first; posts without a date sort last, in the order listed.
 */
export const articles: Article[] = [rewiring, hazards, callImmediately].sort(
  (a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? "")
);

export function findArticle(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

/**
 * BLOG INDEX CONTENT — /blog. Client copy for the index page and the closing
 * call to action shared by every post.
 */
export const blog = {
  path: "/blog",
  seo: {
    title: "Electrical Safety Tips & Advice | Show Me Electrical Blog",
    description:
      "Practical electrical advice from Show Me Electrical: warning signs of wiring problems, common hazards in Missouri homes and when to call an electrician.",
    image: "/photos/roughin-attic.webp",
  },
  breadcrumbs: [{ label: "Home", href: "/" }, { label: "Blog" }] as Crumb[],
  hero: {
    eyebrow: "Blog",
    headline: "Electrical advice from the people who do the work",
    intro:
      "Warning signs, common hazards and when to pick up the phone — written for homeowners in the Greater St. Louis area.",
    /** Client's own job-site photo (the same one the About hero uses). */
    image: {
      src: "/photos/roughin-attic.webp",
      alt: "Recessed light housings and wiring roughed in across a vaulted ceiling in new framing, with large windows below",
    } as Photo,
  },
  postBreadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
  ] as Crumb[],
  /** Labels the article layout renders around an article; no client facts. */
  labels: {
    latest: "Latest posts",
    readPost: "Read the post",
    readPrefix: "Read:",
    published: "Published",
    updated: "Updated",
    relatedServices: "Related services",
    relatedArticles: "Keep reading",
  },
  cta: {
    heading: "Seeing one of these signs at home?",
    body: "Call us to talk it through, or send the details and we'll get you on the schedule. Free consultations, straight answers.",
  },
};
