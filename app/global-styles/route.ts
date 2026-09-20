import { gone } from "@/config/redirects";

/**
 * 410 Gone for a legacy path the brand lists in `redirects.ts` `gone`. A
 * brand that does not list "/global-styles" gets a 404 here instead.
 */
export const dynamic = "force-static";

export function GET() {
  const isGone = gone.includes("/global-styles");
  return new Response(isGone ? "Gone" : "Not found", {
    status: isGone ? 410 : 404,
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
