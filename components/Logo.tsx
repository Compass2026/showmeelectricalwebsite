"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/config/site.config";

/**
 * Brand wordmark from site.config (`site.logo`). Falls back to a styled
 * two-part text wordmark if the asset ever fails to load.
 */
export default function Logo({ className = "h-12" }: { className?: string }) {
  const [failed, setFailed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // If the image 404'd before hydration, onError never fires — detect it here.
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0) setFailed(true);
  }, []);

  if (failed) {
    return (
      <span
        style={{ fontFamily: "var(--font-heading)" }}
        className={`inline-flex items-baseline gap-1.5 tracking-tight text-white ${className}`}
      >
        <span className="text-xl font-extrabold uppercase leading-none">
          {site.logo.wordmark[0]}
        </span>
        <span className="text-xl font-extrabold uppercase leading-none text-accent-500">
          {site.logo.wordmark[1]}
        </span>
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={imgRef}
      src={site.logo.src}
      alt={site.logo.alt}
      width={site.logo.width}
      height={site.logo.height}
      className={`w-auto ${className}`}
      onError={() => setFailed(true)}
    />
  );
}
