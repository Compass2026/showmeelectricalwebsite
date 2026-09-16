"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP, shouldAnimate, isMobileViewport } from "./gsap";

export interface StoryStage {
  /** Short label shown in the node, e.g. "01". */
  step: string;
  title: string;
  body: string;
  image?: { src: string; alt: string };
  /** Shown under the image when the photo needs sourcing. */
  imageNote?: string;
}

/**
 * Signature "Powering your project" scroll story.
 *
 * A restrained circuit line links the stages. As the visitor scrolls, the dim
 * base line is overdrawn in lime — the circuit energising — and each node
 * lights as its stage arrives.
 *
 * Degradation, in order of severity:
 *  - Reduced motion or mobile: the line renders fully drawn and static, and
 *    the stages read as a plain top-to-bottom sequence.
 *  - No JavaScript: identical to the above. The lime overlay is rendered at
 *    full length in the markup, so nothing is missing — GSAP only ever
 *    *shortens* it to then draw it back in.
 */
export default function ScrollStory({ stages }: { stages: StoryStage[] }) {
  const scope = useRef<HTMLOListElement>(null);

  useGSAP(
    () => {
      if (!shouldAnimate() || isMobileViewport()) return;

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
              start: "center 70%",
              end: "bottom 45%",
              scrub: true,
            },
          }
        );
      });

      const nodes = scope.current?.querySelectorAll("[data-node]");
      nodes?.forEach((node) => {
        gsap.fromTo(
          node,
          { borderColor: "rgba(255,255,255,0.18)", backgroundColor: "rgba(6,16,31,1)" },
          {
            borderColor: "var(--color-lime-500)",
            backgroundColor: "rgba(192,214,52,0.12)",
            duration: 0.45,
            scrollTrigger: {
              trigger: node.closest("[data-stage]"),
              start: "top 72%",
              once: true,
            },
          }
        );
      });
    },
    { scope }
  );

  return (
    <ol ref={scope} className="relative mx-auto mt-16 max-w-5xl">
      {stages.map((stage, i) => (
        <li
          key={stage.step}
          data-stage
          className="relative grid gap-8 pb-4 md:grid-cols-[auto_1fr] md:gap-10"
        >
          {/* Circuit rail: node + connector to the next stage */}
          <div className="flex flex-row items-center gap-3 md:flex-col md:gap-0">
            <div
              data-node
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-white/20 bg-navy-950 font-(family-name:--font-heading) text-sm font-bold text-lime-500"
            >
              {stage.step}
            </div>

            {i < stages.length - 1 && (
              <svg
                aria-hidden="true"
                viewBox="0 0 40 170"
                className="h-4 w-full md:h-[170px] md:w-10 md:flex-1"
                preserveAspectRatio="none"
                fill="none"
              >
                {/* Dim base trace — always present */}
                <path
                  d="M20 0 V54 L34 72 V104 L20 122 V170"
                  stroke="currentColor"
                  className="text-white/15"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                {/* Energised overlay — full length by default, drawn by scroll */}
                <path
                  data-circuit
                  d="M20 0 V54 L34 72 V104 L20 122 V170"
                  stroke="var(--color-lime-500)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </div>

          {/* Stage content */}
          <div className="pb-14">
            <h3 className="text-xl font-bold text-white sm:text-2xl">
              {stage.title}
            </h3>
            <p className="mt-3 max-w-xl leading-relaxed text-white/70">
              {stage.body}
            </p>

            {stage.image && (
              <figure className="mt-6 max-w-xl">
                <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-white/10">
                  <Image
                    src={stage.image.src}
                    alt={stage.image.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 576px"
                    className="object-cover"
                  />
                </div>
                {stage.imageNote && (
                  <figcaption className="mt-2 text-xs text-white/45">
                    {stage.imageNote}
                  </figcaption>
                )}
              </figure>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
