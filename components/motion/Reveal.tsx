"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap } from "./gsap";
import { useResponsiveGSAP } from "./useResponsiveGSAP";
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
  /**
   * Play on mount instead of on scroll. For content that is above the fold by
   * design (the hero), so its entrance never depends on where the reveal
   * trigger line happens to fall for a given viewport height.
   */
  immediate?: boolean;
}

/**
 * Scroll-triggered section or image reveal.
 *
 * No-JS / failure behaviour: the element is visible by default and GSAP sets
 * the hidden start state inside a layout effect before paint. If GSAP never
 * loads, the content simply renders visible — it is never hidden by CSS
 * waiting for JavaScript to release it.
 *
 * Responsive behaviour is delegated to `useResponsiveGSAP`, so crossing the
 * mobile breakpoint or toggling reduced motion re-runs this setup and reverts
 * the previous one.
 *
 * RULE: the animated element (this container, or each direct child when
 * `stagger` is set) must not carry a CSS `transition` on opacity or
 * transform. A CSS transition on a GSAP-tweened property fights the tween and
 * can leave the element stuck at its start state. Put hover transitions on an
 * inner element instead.
 */
export default function Reveal({
  children,
  className = "",
  as: Tag = "div",
  delay = 0,
  from = "bottom",
  stagger = false,
  immediate = false,
}: RevealProps) {
  const scope = useRef<HTMLElement>(null);

  useResponsiveGSAP(scope, ({ isMobile }) => {
    const targets = stagger
      ? Array.from(scope.current?.children ?? [])
      : [scope.current];
    if (!targets.length || !targets[0]) return;

    const travel = isMobile ? motionCfg.distance * 0.5 : motionCfg.distance;

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
      duration: isMobile ? motionCfg.duration * 0.75 : motionCfg.duration,
      ease: motionCfg.ease,
      delay,
      stagger: stagger ? motionCfg.stagger : 0,
      ...(immediate
        ? {}
        : {
            scrollTrigger: {
              trigger: scope.current,
              start: motionCfg.start,
              once: true,
            },
          }),
    });
  });

  return (
    <Tag ref={scope} className={className}>
      {children}
    </Tag>
  );
}
