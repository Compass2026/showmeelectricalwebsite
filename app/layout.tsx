import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { SITE_URL, WP_URL } from "@/lib/jobs";

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
        url: `${WP_URL}/wp-content/uploads/2024/08/Show-me-electric-white-logo-4.png`,
        alt: "Show Me Electrical Services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Careers | Show Me Electrical",
    description:
      "Electrician jobs in St. Louis, MO — paid training and a clear path from Apprentice to certified Journeyman.",
  },
  alternates: { canonical: SITE_URL },
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
