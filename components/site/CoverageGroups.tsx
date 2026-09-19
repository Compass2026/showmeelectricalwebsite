import Reveal from "@/components/motion/Reveal";
import type { CoverageGroup } from "@/content/service-area";

/**
 * Coverage grid: one card per county (or region) with the communities named
 * within it. Pure layout — the geography is passed in, so another client's
 * service area is a content change. A group with no named communities still
 * renders cleanly (name + note only); nothing empty is drawn.
 *
 * Cards are the `Reveal stagger` targets and carry no CSS transition.
 */
export default function CoverageGroups({ groups }: { groups: CoverageGroup[] }) {
  return (
    <Reveal stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {groups.map((g) => (
        <div
          key={g.name}
          className="rounded-xl border border-navy-900/10 bg-white p-6 shadow-sm"
        >
          <h3 className="text-lg font-bold text-navy-900">{g.name}</h3>
          {g.note && (
            <p className="mt-1 text-sm text-charcoal/60">{g.note}</p>
          )}
          {g.communities.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-2">
              {g.communities.map((c) => (
                <li
                  key={c}
                  className="rounded-full border border-navy-900/15 bg-cream px-3 py-1 text-sm font-medium text-navy-900"
                >
                  {c}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </Reveal>
  );
}
