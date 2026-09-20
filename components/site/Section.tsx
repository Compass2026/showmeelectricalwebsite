import type { ReactNode } from "react";
import Reveal from "@/components/motion/Reveal";

type Tone = "light" | "surface" | "primary" | "deep";

const tones: Record<Tone, string> = {
  light: "bg-white text-ink",
  surface: "bg-surface text-ink",
  primary: "bg-primary-900 text-white",
  deep: "bg-primary-950 text-white",
};

/**
 * Standard page section: tone, width and heading rhythm in one place so every
 * section on every client site shares the same vertical scale.
 */
export default function Section({
  id,
  tone = "light",
  eyebrow,
  heading,
  intro,
  children,
  className = "",
  headingId,
  center = false,
}: {
  id?: string;
  tone?: Tone;
  eyebrow?: string;
  heading?: ReactNode;
  intro?: string;
  children?: ReactNode;
  className?: string;
  headingId?: string;
  center?: boolean;
}) {
  const dark = tone === "primary" || tone === "deep";

  return (
    <section
      id={id}
      className={`${tones[tone]} py-20 sm:py-28 ${className}`}
      aria-labelledby={headingId}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {(eyebrow || heading || intro) && (
          <Reveal
            className={`max-w-2xl ${center ? "mx-auto text-center" : ""}`}
          >
            {eyebrow && (
              <p
                className={`text-sm font-bold uppercase tracking-widest ${
                  dark ? "text-accent-500" : "text-accent-700"
                }`}
              >
                {eyebrow}
              </p>
            )}
            {heading && (
              <h2
                id={headingId}
                className={`mt-3 text-3xl font-extrabold sm:text-4xl ${
                  dark ? "text-white" : "text-primary-900"
                }`}
              >
                {heading}
              </h2>
            )}
            {intro && (
              <p
                className={`mt-4 text-lg leading-relaxed ${
                  dark ? "text-white/70" : "text-ink/70"
                }`}
              >
                {intro}
              </p>
            )}
          </Reveal>
        )}
        {children}
      </div>
    </section>
  );
}
