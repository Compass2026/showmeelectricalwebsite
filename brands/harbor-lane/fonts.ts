import { Manrope, Source_Sans_3 } from "next/font/google";

const manrope = Manrope({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--font-manrope", display: "swap" });
const sourceSans = Source_Sans_3({ subsets: ["latin"], weight: ["400", "600", "700"], variable: "--font-source-sans", display: "swap" });

export const fontClassNames = `${manrope.variable} ${sourceSans.variable}`;
