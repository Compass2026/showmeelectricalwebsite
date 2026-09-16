"use client";

import Link from "next/link";
import { useState } from "react";
import Logo from "@/components/Logo";
import { site } from "@/config/site.config";

/**
 * Main-site header. Carries the careers site's structure — utility bar above a
 * navy nav — so the two properties read as one brand. Nav items come from
 * site.config, so a new client build changes no markup.
 */
export default function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 shadow-lg shadow-navy-950/20">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-lime-500 focus:px-4 focus:py-2 focus:font-bold focus:text-navy-950"
      >
        Skip to content
      </a>

      {/* Utility bar */}
      <div className="bg-navy-950 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 text-xs sm:px-6 sm:text-sm">
          <p className="font-semibold uppercase tracking-widest text-lime-500">
            Contact Us Today
          </p>
          <div className="flex items-center gap-4 sm:gap-6">
            <a
              href={site.phoneHref}
              className="font-medium hover:text-lime-400"
            >
              {site.phone}
            </a>
            <a
              href={`mailto:${site.email}`}
              className="hidden font-medium hover:text-lime-400 sm:inline"
            >
              {site.email}
            </a>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="bg-navy-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:px-6">
          <Link href="/" aria-label={`${site.name} — home`}>
            <Logo className="h-12 sm:h-20" />
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-7 lg:flex">
            {site.nav.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:text-lime-400"
              >
                {item.label}
              </Link>
            ))}
            <a
              href={site.primaryCta.href}
              className="rounded-md bg-lime-500 px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-navy-950 transition hover:bg-lime-400"
            >
              {site.primaryCta.label}
            </a>
          </nav>

          <button
            type="button"
            className="rounded-md p-2 text-white hover:bg-navy-800 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <svg
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                d={open ? "M6 6l12 12M18 6L6 18" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>

        {open && (
          <nav
            id="mobile-nav"
            aria-label="Mobile"
            className="border-t border-navy-800 bg-navy-900 px-4 pb-6 pt-2 lg:hidden"
          >
            {site.nav.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block border-b border-navy-800 py-3 text-sm font-semibold uppercase tracking-wide text-white"
              >
                {item.label}
              </Link>
            ))}
            <a
              href={site.primaryCta.href}
              onClick={() => setOpen(false)}
              className="mt-4 block rounded-md bg-lime-500 px-5 py-3 text-center text-sm font-bold uppercase tracking-wide text-navy-950"
            >
              {site.primaryCta.label}
            </a>
          </nav>
        )}
      </div>
    </header>
  );
}
