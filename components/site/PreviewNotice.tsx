import { site } from "@/config/site.config";

/**
 * Review-stage banner. Makes it unambiguous that this is a prototype, that it
 * is not indexable, and which content is still outstanding. Remove this
 * component (and the noindex in app/layout.tsx) at launch.
 */
export default function PreviewNotice() {
  return (
    <div className="border-b-2 border-amber-400 bg-amber-50 text-amber-950">
      <div className="mx-auto max-w-7xl px-4 py-3 text-xs leading-relaxed sm:px-6">
        <p className="font-bold uppercase tracking-wide">
          Prototype for review — not indexable, not live
        </p>
        <p className="mt-1">
          Homepage prototype for the {site.name} rebuild. The live WordPress
          site and the careers site are untouched. Photography is from the
          client&apos;s existing media library; items still needing client
          input are flagged in amber throughout the page.
        </p>
      </div>
    </div>
  );
}
