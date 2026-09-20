import type { Metadata } from "next";
import { careers } from "@brand/careers";

/**
 * Careers-specific metadata. Lives here rather than in the root layout so the
 * main site and the careers site can carry different titles, descriptions and
 * canonicals from the same codebase.
 *
 * Canonicals stay on careers.showmeelectrical.com — the careers site's public
 * home — even though the routes now sit under /careers internally.
 */
export const metadata: Metadata = careers.metadata;

export default function CareersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
