/**
 * DESIGN TOKENS + MOTION SETTINGS — reusable across Compass client builds.
 *
 * Colour and type values live in `app/globals.css` under `@theme` so Tailwind
 * generates utilities from them. This file holds the values that JavaScript
 * needs (motion timings, breakpoints) plus a documented record of how the
 * palette was reconciled between sources.
 */

/* ------------------------------------------------------------------ *
 * Brand reconciliation (recorded, not silently applied)
 *
 * Two sources disagree. The careers site is the newer, approved-in-use
 * design and is the primary reference per Tom's direction; the brand board
 * (2026-09-01, "DRAFT FOR APPROVAL") is older. Differences resolved as:
 *
 *   Lime    brand #BFD62D  vs  careers #C0D634  → keep #C0D634.
 *           Sampled directly from the logo artwork pixels; the two differ by
 *           at most 7/255 per channel and are visually identical.
 *
 *   Navy    brand #04345C  vs  careers #0A1B33  → keep BOTH, as a scale.
 *           #0A1B33 stays the deep surface colour. #04345C is adopted as
 *           `navy-700`, the mid-tone, where it sits naturally (it was
 *           previously #17345F — a 3-point shift). Brand navy is therefore
 *           present in the system rather than discarded.
 *
 *   Charcoal brand #121217 → adopted as `charcoal` for long-form body text
 *           on light surfaces. Careers used navy-900 for all text.
 *
 *   Type    brand: Spectral SC headings / Poppins body
 *           careers: Poppins headings / Inter body  → keep careers.
 *           UNRESOLVED — flagged for Tom. Switching to Spectral SC would
 *           change the look of the live careers site, so it is not applied
 *           unilaterally. One-line change in globals.css if approved.
 * ------------------------------------------------------------------ */

export const motion = {
  /** Master switch — set false to ship a fully static, no-JS-motion build. */
  enabled: true,

  /**
   * Lenis smooth scrolling is intentionally OFF. Native scrolling is the
   * baseline; enable only if a reviewer asks and it measurably helps.
   */
  smoothScroll: false,

  /** Default reveal timing, in seconds. */
  duration: 0.8,
  stagger: 0.08,
  ease: "power3.out",

  /** Distance a revealing element travels, in px. */
  distance: 28,

  /** Mobile simplification: below this width, effects are reduced. */
  mobileBreakpoint: 768,
  /** Parallax is disabled entirely below the breakpoint. */
  parallaxStrength: 40,

  /** ScrollTrigger start position for standard section reveals. */
  start: "top 82%",
} as const;

export type MotionConfig = typeof motion;
