import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

const base =
  "inline-flex items-center justify-center gap-2 rounded-lg px-7 py-3.5 text-sm font-bold uppercase tracking-wide transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent-500 text-primary-950 shadow-lg shadow-accent-500/20 hover:bg-accent-400",
  secondary:
    "border border-white/25 text-white hover:border-accent-500 hover:text-accent-400",
  ghost:
    "border border-primary-900/20 text-primary-900 hover:border-primary-900/50 hover:bg-primary-900/5",
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
