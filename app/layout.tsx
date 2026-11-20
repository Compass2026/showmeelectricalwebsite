import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { SITE_URL } from "@/lib/jobs";

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

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Careers | Show Me Electrical — Electrician Jobs in St. Louis, MO",
    template: "%s | Show Me Electrical Careers",
  },
  description:
    "Build your electrical career with Show Me Electrical Services. Now hiring Apprentice Electricians, Journeyman Electricians, an Electrical Estimator, and an Administrative Assistant in the greater St. Louis area. Paid training and a clear path from Apprentice to certified Journeyman.",
  openGraph: {
    type: "website",
    siteName: "Show Me Electrical Careers",
    title: "Careers | Show Me Electrical — Electrician Jobs in St. Louis, MO",
    description:
      "Now hiring Apprentice Electricians, Journeyman Electricians, an Electrical Estimator, and an Administrative Assistant. Paid training, steady work, and a clear path from Apprentice to certified Journeyman.",
    url: SITE_URL,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Show Me Electrical — now hiring in the Greater St. Louis area",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Careers | Show Me Electrical",
    description:
      "Electrician jobs in St. Louis, MO — paid training and a clear path from Apprentice to certified Journeyman.",
    images: ["/og-image.png"],
  },
  alternates: { canonical: SITE_URL },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${poppins.variable} ${inter.variable}`}>
      <head>
        {/* Scroll reveals start hidden and are shown by JS; never hide content without it. */}
        <noscript>
          <style>{`.reveal{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-lime-500 focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-navy-950"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
