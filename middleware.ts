import { NextResponse, type NextRequest } from "next/server";
import { site } from "@/config/site.config";

/**
 * Host-based routing for the two properties in this codebase.
 *
 * The careers site is LIVE at careers.showmeelectrical.com and serves the
 * careers page at "/" and job detail pages at "/jobs/<slug>". The main site
 * needs "/" for its own homepage, so the careers routes live at "/careers/*"
 * in the app directory. Two rules keep both hostnames correct:
 *
 * 1. REWRITE (careers host only) — the live public URLs keep working, with the
 *    address bar, search results and existing links unchanged:
 *      careers.showmeelectrical.com/            → /careers
 *      careers.showmeelectrical.com/jobs/<slug> → /careers/jobs/<slug>
 *
 * 2. REDIRECT (careers host only) — the internal "/careers/*" paths that
 *    careers components link to are NOT valid public URLs on this host. Left
 *    alone they would serve the same page at a second address
 *    (careers.showmeelectrical.com/careers/jobs/x), competing with the
 *    canonical /jobs/x. A 308 sends every one of them to the canonical form,
 *    so no duplicate URL is ever reachable or indexable:
 *      careers.showmeelectrical.com/careers            → /
 *      careers.showmeelectrical.com/careers/jobs/<slug> → /jobs/<slug>
 *
 * 3. NOT FOUND (careers host only) — every other path. The main site's routes
 *    (/contact, /services/…) must not resolve on the careers host, or each
 *    would exist at two hostnames as duplicate content. They are rewritten to
 *    a path that has no route, so Next returns its 404 page with a 404 status.
 *
 * 4. REDIRECT (main host only) — "/careers/*" is where the careers routes live
 *    in the app directory, but the careers property's public address is its
 *    own hostname. Serving the same pages at showmeelectrical.com/careers
 *    would be duplicate content, so the main host sends them (and the old
 *    WordPress "/career" path) to the careers host with the path preserved:
 *      showmeelectrical.com/careers            → careers.showmeelectrical.com/
 *      showmeelectrical.com/careers/jobs/<slug> → careers.showmeelectrical.com/jobs/<slug>
 *      showmeelectrical.com/career             → careers.showmeelectrical.com/
 *    Rules 1–3 for the careers host are unchanged by this.
 */
const CAREERS_HOST_PREFIX = "careers.";

function isCareersHost(host: string) {
  return host.startsWith(CAREERS_HOST_PREFIX);
}

/**
 * For a main-host path that belongs to the careers property, the path on the
 * careers host; otherwise null. "/careers/jobs/x" → "/jobs/x"; "/career" (the
 * old WordPress duplicate) → "/".
 */
function mainHostCareersPath(pathname: string): string | null {
  for (const prefix of ["/careers", "/career"]) {
    if (pathname === prefix) return "/";
    if (pathname.startsWith(`${prefix}/`)) {
      return pathname.slice(prefix.length) || "/";
    }
  }
  return null;
}

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const { pathname, search } = request.nextUrl;

  if (!isCareersHost(host)) {
    // Rule 4 — careers pages are not served on the main host.
    const careersPath = mainHostCareersPath(pathname);
    if (careersPath !== null) {
      return NextResponse.redirect(
        `${site.careersUrl}${careersPath}${search}`,
        308
      );
    }
    return NextResponse.next();
  }

  // Rule 2 — collapse the internal /careers prefix to the public URL.
  if (pathname === "/careers" || pathname.startsWith("/careers/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice("/careers".length) || "/";
    url.search = search;
    return NextResponse.redirect(url, 308);
  }

  // Rule 1 — serve the careers routes from the public URLs.
  const target =
    pathname === "/"
      ? "/careers"
      : pathname === "/jobs" || pathname.startsWith("/jobs/")
        ? `/careers${pathname}`
        : null;

  const url = request.nextUrl.clone();
  // Rule 3 — anything else is not a careers URL: 404, never the main site.
  url.pathname = target ?? "/careers/__not-found__";
  url.search = search;
  return NextResponse.rewrite(url);
}

export const config = {
  // Skip Next internals, the API routes and anything with a file extension.
  matcher: ["/((?!api|_next/static|_next/image|.*\\..*).*)"],
};
