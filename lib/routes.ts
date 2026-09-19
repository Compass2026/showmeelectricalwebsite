import { site } from "@/config/site.config";
import { servicePages } from "@/content/services";
import { articles } from "@/content/blog";
import { legalDocuments } from "@/content/legal";
import { corePages } from "@/content/pages";

/**
 * REGISTRY OF PUBLISHED ROUTES — the one list that the sitemap, the route
 * manifest and the link checker read.
 *
 * A route is here only if it is implemented and public. Every entry comes
 * from a content registry (core pages, services, articles, legal documents),
 * so adding a page means registering its content, never editing this file.
 *
 * `lastModified` is the date of a significant content change when it is
 * known (an article's `modifiedAt` or `publishedAt`, a policy's
 * `lastUpdated`, a core page's recorded `modifiedAt`). It is never derived
 * from the build, so an ordinary deploy changes no date.
 */
export interface PublishedRoute {
  path: string;
  kind: "core" | "service" | "article" | "legal";
  title: string;
  /** ISO date of the last significant content change, when known. */
  lastModified?: string;
  /** Registry-declared relationships, for the route manifest. */
  links?: { parent?: string; related?: string[] };
  /** Where the page is linked from, for the orphan check. */
  incoming: string[];
}

export function publishedRoutes(): PublishedRoute[] {
  const core: PublishedRoute[] = corePages.map((p) => ({
    path: p.path,
    kind: "core",
    title: p.title,
    ...(p.modifiedAt ? { lastModified: p.modifiedAt } : {}),
    links: { parent: p.parent, related: p.related },
    incoming: p.incoming,
  }));

  const services: PublishedRoute[] = servicePages.map((page) => ({
    path: page.path,
    kind: "service",
    title: page.seo.title,
    ...(page.modifiedAt ? { lastModified: page.modifiedAt } : {}),
    links: {
      parent: "/services",
      related: (page.related?.links ?? []).map((l) => l.href).filter(isInternal),
    },
    incoming: ["/", "/services", "/service-area", "/about"],
  }));

  const posts: PublishedRoute[] = articles.map((a) => ({
    path: a.path,
    kind: "article",
    title: a.title,
    ...(a.modifiedAt || a.publishedAt ? { lastModified: a.modifiedAt ?? a.publishedAt } : {}),
    links: {
      parent: "/blog",
      related: [...(a.relatedServices ?? []), ...(a.relatedArticles ?? []).map((s) => `/blog/${s}`)],
    },
    incoming: ["/blog", ...articles.filter((o) => o.relatedArticles?.includes(a.slug)).map((o) => o.path)],
  }));

  const legal: PublishedRoute[] = legalDocuments.map((d) => ({
    path: d.path,
    kind: "legal",
    title: d.title,
    ...(d.lastUpdated ? { lastModified: d.lastUpdated } : {}),
    links: { parent: "/" },
    incoming: ["footer"],
  }));

  return [...core, ...services, ...posts, ...legal];
}

export function publishedPaths(): Set<string> {
  return new Set(publishedRoutes().map((r) => r.path));
}

/** True when an internal href (path, optionally with a fragment) points at a published route. */
export function isPublishedHref(href: string): boolean {
  if (!isInternal(href)) return true; // external links are checked separately (https + reachable)
  const path = href.split("#")[0].split("?")[0] || "/";
  return publishedPaths().has(path);
}

function isInternal(href: string) {
  return href.startsWith("/") && !href.startsWith("//");
}

export const siteOrigin = site.productionUrl;
