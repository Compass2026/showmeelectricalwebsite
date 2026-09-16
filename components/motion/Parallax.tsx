"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, shouldAnimate, isMobileViewport } from "./gsap";
import { motion as motionCfg } from "@/config/theme.config";

interface ParallaxProps {
  children: ReactNode;
  className?: string;
  /** Multiplier on the configured strength; negative moves the other way. */
  strength?: number;
}

/**
 * Subtle vertical drift on an image as it passes through the viewport.
 *
 * Disabled entirely on mobile and under reduced-motion. The inner wrapper is
 * over-scaled so the drift never exposes an edge, and the parent must clip.
 * Nothing here affects layout, so a failure is invisible.
 */
export default function Parallax({
  children,
  className = "",
  strength = 1,
}: ParallaxProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Parallax is a desktop-only nicety — mobile keeps a static image.
      if (!shouldAnimate() || isMobileViewport()) return;
      const inner = scope.current?.firstElementChild;
      if (!inner) return;

      const travel = motionCfg.parallaxStrength * strength;

      gsap.fromTo(
        inner,
        { yPercent: -travel / 10 },
        {
          yPercent: travel / 10,
          ease: "none",
          scrollTrigger: {
            trigger: scope.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    },
    { scope }
  );

  return (
    <div ref={scope} className={`overflow-hidden ${className}`}>
      <div className="h-[115%] w-full">{children}</div>
    </div>
  );
}
