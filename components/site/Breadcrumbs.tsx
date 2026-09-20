import Link from "next/link";
import type { Crumb } from "@/content/services/types";

/**
 * Visible breadcrumb trail. The same `crumbs` array feeds the BreadcrumbList
 * schema, so what crawlers read and what visitors see cannot drift apart.
 */
export default function Breadcrumbs({
  crumbs,
  tone = "dark",
}: {
  crumbs: Crumb[];
  tone?: "dark" | "light";
}) {
  const muted = tone === "dark" ? "text-white/55" : "text-ink/55";
  const link =
    tone === "dark"
      ? "text-white/80 hover:text-accent-400"
      : "text-primary-900 hover:text-accent-700";
  const current = tone === "dark" ? "text-white" : "text-primary-900";

  return (
    <nav aria-label="Breadcrumb" className="text-sm">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {crumbs.map((c, i) => {
          const last = i === crumbs.length - 1;
          return (
            <li key={c.label} className="flex items-center gap-x-2">
              {c.href && !last ? (
                <Link
                  href={c.href}
                  className={`-my-1 inline-block py-1 font-medium ${link}`}
                >
                  {c.label}
                </Link>
              ) : (
                <span
                  className={`font-semibold ${current}`}
                  aria-current={last ? "page" : undefined}
                >
                  {c.label}
                </span>
              )}
              {!last && (
                <span aria-hidden="true" className={muted}>
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
