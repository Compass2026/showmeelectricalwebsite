import type { Metadata } from "next";
import "./globals.css";
import "@brand/theme.css";
import { fontClassNames } from "@brand/fonts";
import { site } from "@/config/site.config";
import DemoNotice from "@/components/site/DemoNotice";

/**
 * Indexing switch.
 *
 * The preview must never be indexed. Indexing is opt-in via an environment
 * variable so that enabling it at launch is a Vercel setting change, not a
 * code change:
 *
 *   NEXT_PUBLIC_ALLOW_INDEXING=true      (production only)
 *   NEXT_PUBLIC_SITE_URL=https://showmeelectrical.com
 *
 * Both app/robots.ts and this file read it. See README.
 */
const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";

export const metadata: Metadata = {
  metadataBase: new URL(site.productionUrl),
  title: {
    default: site.metadata.defaultTitle,
    template: site.metadata.titleTemplate,
  },
  description: site.metadata.description,
  openGraph: {
    type: "website",
    siteName: site.name,
    images: [{ url: site.shareImage, width: 1200, height: 630, alt: site.name }],
  },
  twitter: { card: "summary_large_image", images: [site.shareImage] },
  // A fictional demonstration brand is never indexable, whatever the env.
  robots: allowIndexing && !site.fictional
    ? { index: true, follow: true }
    : { index: false, follow: false, nocache: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={fontClassNames}>
      <body>
        {site.fictional && (
          <DemoNotice what={`${site.name}, its people, addresses, phone numbers and services do not exist.`} />
        )}
        {children}
      </body>
    </html>
  );
}
