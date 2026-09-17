"use client";

import { useRef, type ReactNode } from "react";
import { gsap } from "./gsap";
import { useResponsiveGSAP } from "./useResponsiveGSAP";
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
 * Desktop only. When the viewport narrows past the breakpoint,
 * `useResponsiveGSAP` reverts this tween and re-runs the setup, which then
 * skips it — so a resize genuinely turns parallax off rather than leaving a
 * stale transform on the element. Nothing here affects layout, so a failure is
 * invisible.
 */
export default function Parallax({
  children,
  className = "",
  strength = 1,
}: ParallaxProps) {
  const scope = useRef<HTMLDivElement>(null);

  useResponsiveGSAP(scope, ({ isMobile }) => {
    // Parallax is a desktop-only nicety — mobile keeps a static image.
    if (isMobile) return;

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
  });

  return (
    <div ref={scope} className={`overflow-hidden ${className}`}>
      <div className="h-[115%] w-full">{children}</div>
    </div>
  );
}
