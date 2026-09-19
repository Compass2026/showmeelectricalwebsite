/**
 * /global-styles — an Elementor artifact on the WordPress site that was
 * publicly reachable and in its sitemap. It was never content, so it is not
 * redirected anywhere: 410 Gone tells search engines to drop it.
 */
export const dynamic = "force-static";

export function GET() {
  return new Response("Gone", {
    status: 410,
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
