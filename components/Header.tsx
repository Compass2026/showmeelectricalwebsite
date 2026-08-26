"use client";

import Link from "next/link";
import { useState } from "react";
import Logo from "./Logo";
import { EMAIL, PHONE, PHONE_HREF, WP_URL } from "@/lib/jobs";

const navLinks = [
  { label: "Home", href: `${WP_URL}/`, external: true },
  { label: "About", href: `${WP_URL}/about/`, external: true },
  { label: "Services", href: `${WP_URL}/services/`, external: true },
  { label: "Career", href: "/", external: false, active: true },
  { label: "Contact", href: `${WP_URL}/contact/`, external: true },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 shadow-lg shadow-navy-950/20">
      {/* Top utility bar */}
      <div className="bg-navy-950 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 text-xs sm:px-6 sm:text-sm">
          <p className="font-semibold uppercase tracking-widest text-lime-500">
            Contact Us Today
          </p>
          <div className="flex items-center gap-4 sm:gap-6">
            <a
              href={PHONE_HREF}
              className="flex items-center gap-1.5 font-medium hover:text-lime-400"
            >
              <PhoneIcon />
              <span>{PHONE}</span>
            </a>
            <a
              href={`mailto:${EMAIL}`}
              className="hidden items-center gap-1.5 font-medium hover:text-lime-400 sm:flex"
            >
              <MailIcon />
              <span>{EMAIL}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="bg-navy-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <a href={`${WP_URL}/`} aria-label="Show Me Electrical — Home">
            <Logo className="h-10 sm:h-12" />
          </a>

          <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) =>
              link.external ? (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:text-lime-400"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  aria-current="page"
                  className="border-b-2 border-lime-500 pb-0.5 text-sm font-semibold uppercase tracking-wide text-lime-500"
                >
                  {link.label}
                </Link>
              )
            )}
            <a
              href="/#apply"
              className="rounded-md bg-lime-500 px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-navy-950 transition hover:bg-lime-400"
            >
              Apply Now
            </a>
          </nav>

          <button
            type="button"
            className="rounded-md p-2 text-white hover:bg-navy-800 md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>

        {open && (
          <nav
            id="mobile-nav"
            aria-label="Mobile"
            className="border-t border-navy-800 bg-navy-900 px-4 pb-6 pt-2 md:hidden"
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`block border-b border-navy-800 py-3 text-sm font-semibold uppercase tracking-wide ${
                  link.active ? "text-lime-500" : "text-white"
                }`}
              >
                {link.label}
              </a>
            ))}
            <a
              href="/#apply"
              onClick={() => setOpen(false)}
              className="mt-4 block rounded-md bg-lime-500 px-5 py-3 text-center text-sm font-bold uppercase tracking-wide text-navy-950"
            >
              Apply Now
            </a>
          </nav>
        )}
      </div>
    </header>
  );
}

function PhoneIcon() {
  return (
    <svg className="h-3.5 w-3.5 text-lime-500" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24 11.36 11.36 0 0 0 3.57.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.36 11.36 0 0 0 .57 3.57 1 1 0 0 1-.25 1.02l-2.2 2.2Z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg className="h-3.5 w-3.5 text-lime-500" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 4-8 5-8-5V6l8 5 8-5v2Z" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}
