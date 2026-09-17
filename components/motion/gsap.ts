"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { motion } from "@/config/theme.config";

/**
 * Single registration point for GSAP plugins. Importing from here guarantees
 * ScrollTrigger is registered exactly once and keeps plugin choices in one
 * place. `useGSAP` scopes every animation to a container ref and reverts it on
 * unmount, which is the cleanup story for the whole motion system.
 */
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);

  /**
   * Images and web fonts land after hydration and change the document height,
   * which leaves every ScrollTrigger start/end position stale. Without this
   * refresh a trigger below the fold can be measured against the wrong
   * position and never fire, leaving its section invisible. Refresh once the
   * page has fully loaded, and again if fonts settle later.
   */
  window.addEventListener("load", () => ScrollTrigger.refresh());
  if (document.fonts?.ready) {
    document.fonts.ready.then(() => ScrollTrigger.refresh()).catch(() => {});
  }
}

/**
 * Coalesced ScrollTrigger refresh.
 *
 * When animations are rebuilt — crossing the mobile breakpoint, toggling
 * reduced motion, or a client-side route change — the new tweens apply their
 * hidden start state immediately, but ScrollTrigger's cached start/end
 * positions are still those of the old layout. Until it re-measures, a trigger
 * whose element is already in or above the viewport does not fire, so that
 * section sits at `autoAlpha: 0` and the content disappears until the visitor
 * happens to scroll.
 *
 * Refreshing forces a re-measure, after which every already-passed trigger
 * fires at once. Two rAFs let layout settle first, and the flag collapses the
 * calls from every animated component on the page into a single refresh.
 */
let refreshQueued = false;
export function scheduleScrollTriggerRefresh(): void {
  if (typeof window === "undefined" || refreshQueued) return;
  refreshQueued = true;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      refreshQueued = false;
      ScrollTrigger.refresh();
    });
  });
}

/** True when the visitor has asked for reduced motion. */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** True on viewports where effects should be simplified. */
export function isMobileViewport(): boolean {
  if (typeof window === "undefined") return false;
  return window.innerWidth < motion.mobileBreakpoint;
}

/**
 * Whether decorative motion should run at all. Reduced-motion preference and
 * the global config switch both veto it.
 */
export function shouldAnimate(): boolean {
  return motion.enabled && !prefersReducedMotion();
}

export { gsap, ScrollTrigger, useGSAP };
