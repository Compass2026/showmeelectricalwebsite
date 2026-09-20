import Breadcrumbs from "@/components/site/Breadcrumbs";
import Blocks from "@/components/site/Blocks";
import Reveal from "@/components/motion/Reveal";
import type { LegalDocument } from "@/content/legal/types";
import type { Crumb } from "@/content/services/types";

/**
 * Legal document layout: compact header, the document, and a single line
 * pointing at the contact page. No motion beyond the header entrance, no
 * CTA band — a legal page should read as a document.
 */
export default function LegalLayout({
  doc,
  breadcrumbs,
  contact,
}: {
  doc: LegalDocument;
  breadcrumbs: Crumb[];
  contact: { text: string; label: string; href: string };
}) {
  const updated = doc.lastUpdated
    ? new Date(`${doc.lastUpdated}T12:00:00Z`).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC",
      })
    : null;

  return (
    <>
      <header className="bg-primary-950 text-white">
        <div className="mx-auto max-w-3xl px-4 pb-12 pt-6 sm:px-6">
          <Reveal immediate>
            <Breadcrumbs crumbs={breadcrumbs} />
          </Reveal>
          <Reveal immediate delay={0.08}>
            <h1 className="mt-8 text-3xl font-extrabold sm:text-4xl">
              {doc.title}
            </h1>
            {updated && (
              <p className="mt-3 text-sm text-white/60">
                Last updated <time dateTime={doc.lastUpdated}>{updated}</time>
              </p>
            )}
          </Reveal>
        </div>
      </header>

      <main id="main" className="bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <Blocks blocks={doc.body} />
          <p className="mt-12 border-t border-primary-900/10 pt-6 text-sm text-ink/65">
            {contact.text}{" "}
            <a
              href={contact.href}
              className="-my-1 inline-block py-1 font-semibold text-accent-700 underline underline-offset-2"
            >
              {contact.label}
            </a>
          </p>
        </div>
      </main>
    </>
  );
}
