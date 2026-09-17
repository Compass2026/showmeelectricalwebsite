import { site } from "@/config/site.config";
import { reviewerNotes } from "@/content/reviewer-notes";

/**
 * Review-stage banner. One slim line so it costs the hero as little viewport
 * as possible, with the reviewer notes folded underneath rather than scattered
 * through the page as captions. Remove this component (and the noindex in
 * app/layout.tsx) at launch.
 */
export default function PreviewNotice() {
  return (
    <div className="border-b-2 border-amber-400 bg-amber-50 text-amber-950">
      <details className="mx-auto max-w-7xl px-4 text-xs sm:px-6">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-2.5 marker:hidden [&::-webkit-details-marker]:hidden">
          <span className="font-bold uppercase tracking-wide">
            Prototype for review — not indexable, not live
          </span>
          <span className="shrink-0 font-semibold underline underline-offset-2">
            Reviewer notes ({reviewerNotes.length})
          </span>
        </summary>
        <div className="border-t border-amber-300/60 pb-4 pt-3 leading-relaxed">
          <p>
            Homepage prototype for the {site.name} rebuild. The live WordPress
            site and the careers site are untouched. All photography is from
            the client&apos;s own media library.
          </p>
          <ul className="mt-3 space-y-1.5">
            {reviewerNotes.map((n) => (
              <li key={n.where} className="flex gap-2">
                <span className="shrink-0 font-bold">{n.where}:</span>
                <span>{n.note}</span>
              </li>
            ))}
          </ul>
        </div>
      </details>
    </div>
  );
}
