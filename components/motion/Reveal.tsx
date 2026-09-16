"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, useGSAP, shouldAnimate, isMobileViewport } from "./gsap";
import { motion as motionCfg } from "@/config/theme.config";

interface RevealProps {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  /** Extra delay in seconds, for hand-tuned sequencing. */
  delay?: number;
  /** Direction the element travels from. */
  from?: "bottom" | "left" | "right" | "none";
  /** Animate direct children in sequence instead of the container as one unit. */
  stagger?: boolean;
}

/**
 * Scroll-triggered section or image reveal.
 *
 * No-JS / failure behaviour: the element is styled visible by default and GSAP
 * sets the hidden start state inside `useGSAP`, which runs in a layout effect
 * before paint. If GSAP never loads, the content simply renders visible — it
 * is never hidden by CSS waiting for JavaScript to release it.
 */
export default function Reveal({
  children,
  className = "",
  as: Tag = "div",
  delay = 0,
  from = "bottom",
  stagger = false,
}: RevealProps) {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!shouldAnimate()) return;

      const targets = stagger
        ? Array.from(scope.current?.children ?? [])
        : [scope.current];
      if (!targets.length) return;

      const mobile = isMobileViewport();
      const travel = mobile ? motionCfg.distance * 0.5 : motionCfg.distance;

      const offset =
        from === "none"
          ? {}
          : from === "left"
            ? { x: -travel }
            : from === "right"
              ? { x: travel }
              : { y: travel };

      gsap.from(targets, {
        autoAlpha: 0,
        ...offset,
        duration: mobile ? motionCfg.duration * 0.75 : motionCfg.duration,
        ease: motionCfg.ease,
        delay,
        stagger: stagger ? motionCfg.stagger : 0,
        scrollTrigger: {
          trigger: scope.current,
          start: motionCfg.start,
          once: true,
        },
      });
    },
    { scope }
  );

  return (
    <Tag ref={scope} className={className}>
      {children}
    </Tag>
  );
}
