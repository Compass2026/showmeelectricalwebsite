import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import { site } from "@/config/site.config";

/**
 * Shared 404. With a careers property configured this keeps the careers
 * chrome (the live careers site's 404); without one it uses the main-site
 * chrome. Copy comes from site.config.
 */
export default function NotFound() {
  const careers = Boolean(site.careers);
  const { eyebrow, heading, body, cta } = site.notFound;
  return (
    <>
      {careers ? <Header /> : <SiteHeader />}
      <main className="flex min-h-[50vh] items-center justify-center bg-primary-950 px-4 py-24">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-accent-500">
            {eyebrow}
          </p>
          <h1 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">
            {heading}
          </h1>
          <p className="mx-auto mt-4 max-w-md text-white/70">{body}</p>
          <Link
            href={cta.href}
            className="mt-8 inline-block rounded-lg bg-accent-500 px-8 py-4 text-sm font-bold uppercase tracking-wide text-primary-950 transition hover:bg-accent-400"
          >
            {cta.label}
          </Link>
        </div>
      </main>
      {careers ? <Footer /> : <SiteFooter />}
    </>
  );
}
