import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

const base =
  "inline-flex items-center justify-center gap-2 rounded-lg px-7 py-3.5 text-sm font-bold uppercase tracking-wide transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-500";

const variants: Record<Variant, string> = {
  primary:
    "bg-lime-500 text-navy-950 shadow-lg shadow-lime-500/20 hover:bg-lime-400",
  secondary:
    "border border-white/25 text-white hover:border-lime-500 hover:text-lime-400",
  ghost:
    "border border-navy-900/20 text-navy-900 hover:border-navy-900/50 hover:bg-navy-900/5",
};

/** Shared call-to-action button. Renders an anchor for tel:/mailto:/external. */
export default function Button({
  href,
  children,
  variant = "primary",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
}) {
  const cls = `${base} ${variants[variant]} ${className}`;
  const isExternal = /^(https?:|tel:|mailto:)/.test(href);

  if (isExternal) {
    return (
      <a href={href} className={cls}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}
