import type { Metadata } from "next";
import { site } from "@/config/site.config";

/**
 * Page metadata defaults — one place that turns a page's own facts into a
 * complete, consistent `Metadata` object: absolute canonical, Open Graph and
 * Twitter cards with an owned share image, and article dates when known.
 *
 * Every public page calls this so no route can ship without a social image
 * or with a relative URL. The default image is the site's owned share
 * asset (`site.shareImage`), never a stock file and never a third-party host.
 */
export function absoluteUrl(pathOrUrl: string, baseUrl: string = site.productionUrl): string {
  if (/^https?:\/\//.test(pathOrUrl)) return pathOrUrl;
  return `${baseUrl}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}

export interface PageMeta {
  /** Full title as it should appear (no template applied). */
  title: string;
  description: string;
  /** Root-relative path, e.g. "/about". */
  path: string;
  /** Root-relative or absolute image; defaults to the owned share image. */
  image?: string;
  imageAlt?: string;
  type?: "website" | "article";
  /** Article-only. ISO dates as known; omitted when unknown. */
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  /** Override robots (defaults come from the root layout). */
  noindex?: boolean;
}

export function pageMetadata(meta: PageMeta): Metadata {
  const url = absoluteUrl(meta.path);
  const image = absoluteUrl(meta.image ?? site.shareImage);
  const imageAlt = meta.imageAlt ?? `${site.name}`;
  const type = meta.type ?? "website";
  return {
    title: { absolute: meta.title },
    description: meta.description,
    alternates: { canonical: url },
    openGraph: {
      type,
      siteName: site.name,
      title: meta.title,
      description: meta.description,
      url,
      images: [{ url: image, alt: imageAlt, width: 1200, height: 630 }],
      ...(type === "article"
        ? {
            ...(meta.publishedTime ? { publishedTime: meta.publishedTime } : {}),
            ...(meta.modifiedTime ? { modifiedTime: meta.modifiedTime } : {}),
            ...(meta.authors?.length ? { authors: meta.authors } : {}),
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: [{ url: image, alt: imageAlt }],
    },
    ...(meta.noindex ? { robots: { index: false, follow: false } } : {}),
  };
}
