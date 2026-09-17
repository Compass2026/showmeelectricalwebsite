"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap } from "./gsap";
import { useResponsiveGSAP } from "./useResponsiveGSAP";
import { motionColors } from "@/config/theme.config";

export interface StoryStage {
  /** Short label shown in the node, e.g. "01". */
  step: string;
  title: string;
  body: string;
  image?: { src: string; alt: string };
}

/**
 * Signature "Powering your project" scroll story.
 *
 * Desktop: three rows on a central circuit rail. Copy sits on one side of the
 * rail and the photograph on the other, alternating row by row, so each stage
 * is a balanced pair rather than a stack. As the visitor scrolls, the dim base
 * line between nodes is overdrawn in lime — the circuit energising — and each
 * node lights as its stage arrives.
 *
 * Mobile: a plain left-rail timeline — node, title, copy, photo — read top to
 * bottom. The circuit renders fully drawn and static.
 *
 * Degradation, in order of severity:
 *  - Reduced motion or mobile: the line renders fully drawn and static.
 *  - No JavaScript: identical. The lime overlay is rendered at full length in
 *    the markup, so nothing is missing — GSAP only ever *shortens* it to then
 *    draw it back in.
 */
export default function ScrollStory({ stages }: { stages: StoryStage[] }) {
  const scope = useRef<HTMLOListElement>(null);

  useResponsiveGSAP(scope, ({ isMobile }) => {
    if (isMobile) return;

    const connectors =
      scope.current?.querySelectorAll<SVGPathElement>("[data-circuit]");
    connectors?.forEach((path) => {
      const len = path.getTotalLength();
      gsap.fromTo(
        path,
        { strokeDasharray: len, strokeDashoffset: len },
        {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: path.closest("[data-stage]"),
            start: "top 60%",
            end: "bottom 60%",
            scrub: true,
          },
        }
      );
    });

    const nodes = scope.current?.querySelectorAll("[data-node]");
    nodes?.forEach((node) => {
      gsap.fromTo(
        node,
        {
          borderColor: motionColors.nodeIdleBorder,
          backgroundColor: motionColors.surfaceDeep,
          boxShadow: "0 0 0 rgba(0,0,0,0)",
        },
        {
          borderColor: motionColors.accent,
          backgroundColor: motionColors.nodeActiveFill,
          boxShadow: motionColors.nodeGlow,
          duration: 0.45,
          scrollTrigger: {
            trigger: node.closest("[data-stage]"),
            start: "top 65%",
            once: true,
          },
        }
      );
    });
  });

  return (
    <ol ref={scope} className="relative mx-auto mt-12 max-w-6xl lg:mt-14">
      {stages.map((stage, i) => {
        const last = i === stages.length - 1;
        const flip = i % 2 === 1;

        return (
          <li
            key={stage.step}
            data-stage
            className="grid grid-cols-[auto_1fr] gap-x-5 lg:grid-cols-[1fr_auto_1fr] lg:gap-x-12"
          >
            {/* ---- Circuit rail: node + connector to the next stage ---- */}
            <div className="row-span-2 flex flex-col items-center lg:col-start-2 lg:row-span-1">
              <div
                data-node
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-white/20 bg-navy-950 font-(family-name:--font-heading) text-sm font-bold text-lime-500"
              >
                {stage.step}
              </div>

              {!last && (
                <svg
                  aria-hidden="true"
                  viewBox="0 0 40 200"
                  className="w-10 flex-1"
                  preserveAspectRatio="none"
                  fill="none"
                >
                  {/* Dim base trace — always present */}
                  <path
                    d="M20 0 V60 L34 80 V120 L20 140 V200"
                    stroke="currentColor"
                    className="text-white/15"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  {/* Energised overlay — full length by default, drawn by scroll */}
                  <path
                    data-circuit
                    d="M20 0 V60 L34 80 V120 L20 140 V200"
                    stroke="var(--color-lime-500)"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </div>

            {/* ---- Copy ---- */}
            <div
              className={`pt-3 lg:row-start-1 ${last ? "pb-2" : "pb-10 lg:pb-16"} ${
                flip ? "lg:col-start-3 lg:text-left" : "lg:col-start-1 lg:text-right"
              }`}
            >
              <h3 className="text-2xl font-bold text-white lg:text-3xl">
                {stage.title}
              </h3>
              <p
                className={`mt-3 max-w-md leading-relaxed text-white/70 ${
                  flip ? "" : "lg:ml-auto"
                }`}
              >
                {stage.body}
              </p>
            </div>

            {/* ---- Photograph ---- */}
            {stage.image && (
              <figure
                className={`col-start-2 lg:row-start-1 ${last ? "pb-2" : "pb-10 lg:pb-16"} ${
                  flip ? "lg:col-start-1" : "lg:col-start-3"
                }`}
              >
                <div
                  className={`relative aspect-[16/10] overflow-hidden rounded-xl border border-white/10 lg:aspect-[3/2] lg:max-w-md ${
                    flip ? "lg:ml-auto" : ""
                  }`}
                >
                  <Image
                    src={stage.image.src}
                    alt={stage.image.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 448px"
                    className="object-cover"
                  />
                </div>
              </figure>
            )}
          </li>
        );
      })}
    </ol>
  );
}
