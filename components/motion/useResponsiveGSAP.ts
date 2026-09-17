"use client";

import type { RefObject } from "react";
import { gsap, useGSAP, scheduleScrollTriggerRefresh } from "./gsap";
import { motion as motionCfg } from "@/config/theme.config";

export interface MotionConditions {
  /** Viewport is below the configured mobile breakpoint. */
  isMobile: boolean;
  /** Viewport is at or above the configured mobile breakpoint. */
  isDesktop: boolean;
}

/**
 * Runs a GSAP setup function inside `gsap.matchMedia()`, scoped to a ref.
 *
 * Why this exists: reading `window.innerWidth` or the reduced-motion media
 * query once, at mount, freezes the decision. If the visitor then rotates a
 * tablet, resizes a window across the breakpoint, or toggles the OS
 * reduced-motion setting, the animations keep running under the old
 * assumption.
 *
 * `gsap.matchMedia()` solves both at once. It re-runs `setup` whenever the
 * matching conditions change, and — critically — **reverts everything the
 * previous run created** before re-running. Reverting a `gsap.from()` restores
 * the element to its natural, visible state, so a viewport or preference
 * change can never strand content at `autoAlpha: 0`.
 *
 * Reduced motion is handled here rather than in every caller: when
 * `(prefers-reduced-motion: reduce)` matches, `setup` is simply not invoked,
 * so no hidden start state is ever applied and the page renders statically.
 *
 * Cleanup is twofold: `useGSAP` reverts its own context on unmount, and the
 * returned function reverts the matchMedia instance explicitly.
 */
export function useResponsiveGSAP(
  scope: RefObject<HTMLElement | SVGElement | null>,
  setup: (conditions: MotionConditions) => void,
  dependencies: unknown[] = []
) {
  useGSAP(
    () => {
      if (!motionCfg.enabled) return;

      const bp = motionCfg.mobileBreakpoint;
      const mm = gsap.matchMedia();

      mm.add(
        {
          isMobile: `(max-width: ${bp - 0.02}px)`,
          isDesktop: `(min-width: ${bp}px)`,
          reduced: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { isMobile, isDesktop, reduced } = (context.conditions ??
            {}) as Record<string, boolean>;

          // Honour the visitor's preference — leave the page static.
          if (reduced) return;

          setup({ isMobile: !!isMobile, isDesktop: !!isDesktop });

          // The tweens just created cached their positions against a layout
          // that may have only just changed. Re-measure so any trigger already
          // scrolled past fires immediately instead of leaving its section
          // hidden until the next scroll.
          scheduleScrollTriggerRefresh();
        }
      );

      return () => mm.revert();
    },
    { scope: scope as RefObject<HTMLElement>, dependencies }
  );
}
