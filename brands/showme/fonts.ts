import { Inter, Poppins } from "next/font/google";

/**
 * Brand fonts via next/font (self-hosted at build, no layout shift). The
 * CSS variables these define are mapped to the semantic --font-heading /
 * --font-body roles in theme.css.
 */
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

export const fontClassNames = `${poppins.variable} ${inter.variable}`;
