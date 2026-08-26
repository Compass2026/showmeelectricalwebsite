import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex min-h-[50vh] items-center justify-center bg-navy-950 px-4 py-24">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-lime-500">
            404
          </p>
          <h1 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">
            That page has gone dark
          </h1>
          <p className="mx-auto mt-4 max-w-md text-white/70">
            The page you&apos;re looking for doesn&apos;t exist — but the
            careers do.
          </p>
          <Link
            href="/"
            className="mt-8 inline-block rounded-lg bg-lime-500 px-8 py-4 text-sm font-bold uppercase tracking-wide text-navy-950 transition hover:bg-lime-400"
          >
            View Open Roles
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
