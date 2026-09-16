import Link from "next/link";
import Logo from "@/components/Logo";
import { site } from "@/config/site.config";

/** Main-site footer, mirroring the careers footer structure. */
export default function SiteFooter() {
  return (
    <footer className="bg-navy-900 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo className="h-14 sm:h-20" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/70">
            Owner-led electrical contractor serving the {site.serviceArea} with
            residential, commercial and industrial expertise.
          </p>
        </div>

        <nav aria-label="Services and company">
          <h2 className="text-sm font-bold uppercase tracking-widest text-lime-500">
            Explore
          </h2>
          <ul className="mt-4 space-y-2.5">
            {site.footerLinks.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="text-sm text-white/80 transition-colors hover:text-lime-400"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-lime-500">
            Areas Served
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-white/80">
            Proudly serving the {site.serviceArea} and surrounding communities.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-lime-500">
            Contact
          </h2>
          <ul className="mt-4 space-y-3 text-sm text-white/80">
            <li>
              <a
                href={`mailto:${site.email}`}
                className="hover:text-lime-400"
              >
                {site.email}
              </a>
            </li>
            <li>
              <a href={site.phoneHref} className="hover:text-lime-400">
                {site.phone}
              </a>
            </li>
            <li className="leading-relaxed">
              {site.address.street}
              <br />
              {site.address.city}, {site.address.state} {site.address.zip}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-white/50 sm:flex-row sm:px-6">
          <p>
            © {new Date().getFullYear()} {site.legalName}. All rights reserved.
          </p>
          {site.legalLinks.length > 0 && (
            <ul className="flex gap-5">
              {site.legalLinks.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="hover:text-lime-400">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </footer>
  );
}
