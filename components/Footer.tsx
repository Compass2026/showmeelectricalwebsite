import Logo from "./Logo";
import {
  ADDRESS,
  AREAS_SERVED,
  EMAIL,
  PHONE,
  PHONE_HREF,
  WP_URL,
} from "@/lib/jobs";

const quickLinks = [
  { label: "Home", href: `${WP_URL}/` },
  { label: "About", href: `${WP_URL}/about/` },
  { label: "Services", href: `${WP_URL}/services/` },
  { label: "Career", href: "/" },
  { label: "Contact", href: `${WP_URL}/contact/` },
];

export default function Footer() {
  return (
    <footer className="bg-navy-900 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo className="h-14 sm:h-20" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/70">
            Family-owned electrical contractor serving the greater St. Louis
            area with residential, commercial, and industrial expertise.
          </p>
        </div>

        <nav aria-label="Quick links">
          <h3 className="text-sm font-bold uppercase tracking-widest text-lime-500">
            Quick Links
          </h3>
          <ul className="mt-4 space-y-2.5">
            {quickLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="text-sm text-white/80 transition-colors hover:text-lime-400"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-lime-500">
            Areas Served
          </h3>
          <ul className="mt-4 space-y-2.5">
            {AREAS_SERVED.map((area) => (
              <li key={area} className="text-sm text-white/80">
                {area}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-lime-500">
            Contact
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-white/80">
            <li>
              <a href={`mailto:${EMAIL}`} className="hover:text-lime-400">
                {EMAIL}
              </a>
            </li>
            <li>
              <a href={PHONE_HREF} className="hover:text-lime-400">
                {PHONE}
              </a>
            </li>
            <li className="leading-relaxed">
              {ADDRESS.street}
              <br />
              {ADDRESS.city}, {ADDRESS.state} {ADDRESS.zip}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-white/50 sm:flex-row sm:px-6">
          <p>
            © {new Date().getFullYear()} Show Me Electrical Services. All
            rights reserved.
          </p>
          <a href={`${WP_URL}/`} className="hover:text-lime-400">
            showmeelectrical.com
          </a>
        </div>
      </div>
    </footer>
  );
}
