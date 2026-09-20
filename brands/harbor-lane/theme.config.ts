/** Harbor Lane (fictional demo): motion settings, JS colour literals, decoration. */
export const motionColors = {
  /** --color-accent-500 */
  accent: "#f2b134",
  /** --color-primary-950 */
  surfaceDeep: "#06201f",
  nodeIdleBorder: "rgba(255,255,255,0.18)",
  nodeActiveFill: "rgba(242,177,52,0.12)",
  nodeGlow: "0 0 24px rgba(242,177,52,0.45)",
} as const;

export const motion = {
  enabled: true,
  smoothScroll: false,
  duration: 0.8,
  stagger: 0.08,
  ease: "power3.out",
  distance: 28,
  mobileBreakpoint: 768,
  parallaxStrength: 40,
  start: "top 82%",
  immediateDeadlineMs: 1200,
} as const;

export type MotionConfig = typeof motion;

/** No industry motif: plain hero, straight story rail. */
export const decoration = {
  heroBackdrop: "none",
  storyRail: "line",
} as const;

export type Decoration = typeof decoration;
