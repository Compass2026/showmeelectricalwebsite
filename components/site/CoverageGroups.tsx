import Link from "next/link";
import Reveal from "@/components/motion/Reveal";
import type { CoverageGroup } from "@/content/service-area";
import { cityHref } from "@/content/cities";

/**
 * Coverage grid: one card per county (or region) with the communities named
 * within it. Pure layout — the geography is passed in, so another client's
 * service area is a content change. A group with no named communities still
 * renders cleanly (name + note only); nothing empty is drawn.
 *
 * Publication-aware: a community that references a city page is rendered as
 * a link only when that page is registered (content/cities). Everything
 * else is plain text, so the hub can never link a planned city.
 *
 * Cards are the `Reveal stagger` targets and carry no CSS transition.
 */
export default function CoverageGroups({ groups }: { groups: CoverageGroup[] }) {
  return (
    <Reveal stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {groups.map((g) => (
        <div
          key={g.name}
          className="rounded-xl border border-primary-900/10 bg-white p-6 shadow-sm"
        >
          <h3 className="text-lg font-bold text-primary-900">{g.name}</h3>
          {g.note && (
            <p className="mt-1 text-sm text-ink/60">{g.note}</p>
          )}
          {g.communities.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-2">
              {g.communities.map((c) => {
                const name = typeof c === "string" ? c : c.name;
                const href = typeof c === "string" ? undefined : cityHref(c.page);
                const pill =
                  "rounded-full border border-primary-900/15 bg-surface px-3 py-1 text-sm font-medium text-primary-900";
                return (
                  <li key={name}>
                    {href ? (
                      <Link
                        href={href}
                        className={`${pill} inline-block underline decoration-accent-700/50 underline-offset-2 hover:border-accent-500 hover:text-accent-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500`}
                      >
                        {name}
                      </Link>
                    ) : (
                      <span className={`${pill} inline-block`}>{name}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      ))}
    </Reveal>
  );
}
