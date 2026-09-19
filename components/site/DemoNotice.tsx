/**
 * Visible notice on a FICTIONAL demonstration page. Rendered only when a
 * content object is `fictional: true`; the same flag forces noindex and
 * keeps the page out of the route registry. Not dismissible, not collapsed:
 * nobody should read a demo page without seeing this.
 */
export default function DemoNotice({ what }: { what: string }) {
  return (
    <div role="note" className="border-b-2 border-rose-500 bg-rose-50 text-rose-950">
      <p className="mx-auto max-w-7xl px-4 py-2.5 text-xs sm:px-6">
        <strong className="font-bold uppercase tracking-wide">Fictional demonstration fixture.</strong>{" "}
        {what} This page is not indexable and is excluded from every client production build.
      </p>
    </div>
  );
}
