"use client";

import { useEffect, useRef, useState } from "react";

/**
 * White brand logo (700x266, cropped to the artwork bounds). Falls back to a
 * styled text wordmark if the asset ever fails to load.
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
          Show Me
        </span>
        <span className="text-xl font-extrabold uppercase leading-none text-lime-500">
          Electrical
        </span>
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={imgRef}
      src="/logo-white.webp"
      alt="Show Me Electrical Services — Residential, Commercial, Industrial"
      width={700}
      height={266}
      className={`w-auto ${className}`}
      onError={() => setFailed(true)}
    />
  );
}
