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
