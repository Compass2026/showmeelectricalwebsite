import type { NextConfig } from "next";
import { redirects } from "./config/redirects";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  /**
   * Settled once, before launch: no trailing slashes. Every WordPress URL
   * ends in one, so Next's own 308 (`/about/` → `/about`) covers each page
   * that keeps its path; only renamed paths need an explicit entry.
   */
  trailingSlash: false,
  async redirects() {
    return redirects;
  },
};

export default nextConfig;
