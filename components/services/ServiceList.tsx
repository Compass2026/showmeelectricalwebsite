import Link from "next/link";
import type { ServiceItem } from "@/content/services/types";

/**
 * The services a page covers, each as a problem → what-we-do pair. This is
 * the content a homeowner came for, so it is deliberately NOT scroll-revealed:
 * it renders visible in the initial HTML and stays that way. Item names become
 * links once their dedicated pages exist (`href` set in content).
 */
export default function ServiceList({ items }: { items: ServiceItem[] }) {
  return (
    <ol className="mt-12 grid gap-4 lg:grid-cols-2">
      {items.map((item, i) => (
        <li
          key={item.name}
          className="flex gap-5 rounded-xl border border-primary-900/10 bg-white p-6 shadow-sm"
        >
          <span
            aria-hidden="true"
            className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-950 font-(family-name:--font-heading) text-xs font-bold text-accent-500"
          >
            {String(i + 1).padStart(2, "0")}
          </span>
          <div className="min-w-0">
            <h3 className="text-lg font-bold text-primary-900">
              {item.href ? (
                <Link href={item.href} className="hover:text-accent-700">
                  {item.name}
                </Link>
              ) : (
                item.name
              )}
            </h3>
            <dl className="mt-3 space-y-3 text-sm leading-relaxed">
              <div>
                <dt className="font-semibold uppercase tracking-wide text-ink/50">
                  The problem
                </dt>
                <dd className="mt-1 text-ink/80">{item.problem}</dd>
              </div>
              <div>
                <dt className="font-semibold uppercase tracking-wide text-accent-700">
                  What we do
                </dt>
                <dd className="mt-1 text-ink/80">{item.solution}</dd>
              </div>
            </dl>
          </div>
        </li>
      ))}
    </ol>
  );
}
