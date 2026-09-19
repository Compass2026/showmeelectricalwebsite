"use client";

import { useRef, type ElementType } from "react";
import { gsap } from "./gsap";
import { useResponsiveGSAP } from "./useResponsiveGSAP";
import { motion as motionCfg } from "@/config/theme.config";

interface StaggerTextProps {
  text: string;
  className?: string;
  as?: ElementType;
  delay?: number;
  /** Words matching these strings get the accent colour. */
  accentWords?: string[];
  /** Play on mount rather than on scroll — see Reveal's `immediate`. */
  immediate?: boolean;
}

/**
 * Staggered word-by-word text entrance for headlines.
 *
 * The words are split on the server into spans, so the complete sentence is
 * present in the raw HTML for crawlers and for readers without JavaScript.
 * GSAP only animates spans that already exist.
 */
export default function StaggerText({
  text,
  className = "",
  as: Tag = "h2",
  delay = 0,
  accentWords = [],
  immediate = false,
}: StaggerTextProps) {
  const scope = useRef<HTMLElement>(null);
  const words = text.split(" ");
  const accents = new Set(accentWords.map((w) => w.toLowerCase()));

  useResponsiveGSAP(scope, ({ isMobile }) => {
    const targets = scope.current?.querySelectorAll("[data-word]");
    if (!targets?.length) return;
    // Late hydration: leave above-the-fold text as rendered (see config).
    if (immediate && performance.now() > motionCfg.immediateDeadlineMs) return;

    gsap.from(targets, {
      autoAlpha: 0,
      yPercent: isMobile ? 40 : 90,
      duration: isMobile ? 0.5 : 0.7,
      ease: motionCfg.ease,
      delay,
      stagger: isMobile ? motionCfg.stagger * 0.6 : motionCfg.stagger,
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
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className="inline-block overflow-hidden align-bottom"
        >
          <span
            data-word
            className={
              accents.has(word.toLowerCase().replace(/[^a-z]/g, ""))
                ? "inline-block text-lime-500"
                : "inline-block"
            }
          >
            {word}
          </span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </Tag>
  );
}
