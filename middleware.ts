import { NextResponse, type NextRequest } from "next/server";

/**
 * Host-based routing for the two properties in this codebase.
 *
 * The careers site is LIVE at careers.showmeelectrical.com and serves the
 * careers page at "/" and job detail pages at "/jobs/<slug>". The main site
 * rebuild needs "/" for its homepage, so the careers routes moved to
 * "/careers/*" in the app directory.
 *
 * This middleware rewrites requests arriving on the careers host back onto
 * those routes, so every existing public careers URL keeps working unchanged:
 *
 *   careers.showmeelectrical.com/                    → /careers
 *   careers.showmeelectrical.com/jobs/<slug>         → /careers/jobs/<slug>
 *
 * A rewrite (not a redirect) means the URL in the address bar, in search
 * results and in any existing link is preserved exactly.
 */
const CAREERS_HOST_PREFIX = "careers.";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const { pathname, search } = request.nextUrl;

  if (!host.startsWith(CAREERS_HOST_PREFIX)) {
    return NextResponse.next();
  }

  // Already under /careers — nothing to do.
  if (pathname === "/careers" || pathname.startsWith("/careers/")) {
    return NextResponse.next();
  }

  const target =
    pathname === "/"
      ? "/careers"
      : pathname.startsWith("/jobs")
        ? `/careers${pathname}`
        : null;

  if (!target) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = target;
  url.search = search;
  return NextResponse.rewrite(url);
}

export const config = {
  // Skip Next internals, the API routes and anything with a file extension.
  matcher: ["/((?!api|_next/static|_next/image|.*\\..*).*)"],
};
