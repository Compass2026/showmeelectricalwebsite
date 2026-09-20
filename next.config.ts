import type { NextConfig } from "next";
import path from "node:path";
import { activeBrand } from "./brands/registry";

/**
 * Brand selection happens here, once, at build time:
 *
 *   COMPASS_BRAND=showme        (default) — the reference client
 *   COMPASS_BRAND=harbor-lane   — the fictional second-brand demonstration
 *
 * `@brand/*` resolves to brands/<brand>/*, so every framework module imports
 * the active brand's config and content without knowing which brand it is.
 * tsconfig.json maps the same alias to the default brand for type-checking;
 * `npm run typecheck:brand -- <brand>` checks another.
 *
 * PRODUCTION GUARD: a fictional brand, or the demo fixtures flag, can never
 * reach a production deployment — the build fails first.
 */
const { name: brandName, entry: brand } = activeBrand();
const brandDir = path.resolve(__dirname, "brands", brand.dir);

if (process.env.VERCEL_ENV === "production") {
  if (brand.fictional) {
    throw new Error(`Refusing a production build: brand "${brandName}" is a fictional demonstration brand.`);
  }
  if (process.env.COMPASS_DEMO === "true") {
    throw new Error("Refusing a production build: COMPASS_DEMO=true would publish fictional demo fixtures.");
  }
}

const nextConfig: NextConfig = {
  poweredByHeader: false,
  /**
   * Settled once, before launch: no trailing slashes. Every WordPress URL
   * ends in one, so Next's own 308 (`/about/` → `/about`) covers each page
   * that keeps its path; only renamed paths need an explicit entry.
   */
  trailingSlash: false,
  async redirects() {
    return brand.redirects;
  },
  turbopack: {
    resolveAlias: { "@brand": brandDir },
  },
  webpack: (config) => {
    config.resolve.alias = { ...(config.resolve.alias ?? {}), "@brand": brandDir };
    // Next also registers tsconfig.json `paths` as a resolver plugin, and
    // that plugin wins over `alias`. tsconfig maps @brand/* to the default
    // brand so editors and tsc have types; here the mapping is repointed
    // at the brand actually being built.
    for (const plugin of config.resolve.plugins ?? []) {
      const paths = (plugin as { paths?: Record<string, string[]> }).paths;
      if (paths && paths["@brand/*"]) paths["@brand/*"] = [path.join(brandDir, "*")];
    }
    return config;
  },
};

export default nextConfig;
