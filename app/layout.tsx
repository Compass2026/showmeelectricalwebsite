import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { site } from "@/config/site.config";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

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
    default: `${site.name} — Electrician in St. Louis, MO`,
    template: `%s | ${site.name}`,
  },
  description:
    "Owner-led electrical contractor serving the Greater St. Louis area with residential, commercial and industrial electrical work.",
  openGraph: {
    type: "website",
    siteName: site.name,
    images: [{ url: site.shareImage, width: 1200, height: 630, alt: site.name }],
  },
  twitter: { card: "summary_large_image", images: [site.shareImage] },
  robots: allowIndexing
    ? { index: true, follow: true }
    : { index: false, follow: false, nocache: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${poppins.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
