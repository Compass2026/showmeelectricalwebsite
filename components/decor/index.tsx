import CircuitBackground from "./CircuitBackground";
import { decoration } from "@/config/theme.config";

/**
 * Decoration registry. Shared components ask for "the hero backdrop" or "the
 * story rail path" and get whatever the client's theme config selects. Adding
 * a treatment for a new client means adding an entry here — never editing
 * Hero, ServiceHero or ScrollStory.
 */
const heroBackdrops = {
  circuit: CircuitBackground,
  none: () => null,
} as const;

/** Decorative backdrop behind a hero. Always aria-hidden; never content. */
export function HeroBackdrop() {
  const Backdrop = heroBackdrops[decoration.heroBackdrop];
  return <Backdrop />;
}

/**
 * SVG path (viewBox 0 0 40 200) drawn between scroll-story nodes. The
 * "circuit" variant jogs like a PCB trace; "line" is a plain vertical.
 */
const storyRails = {
  circuit: "M20 0 V60 L34 80 V120 L20 140 V200",
  line: "M20 0 V200",
} as const;

export function storyRailPath(): string {
  return storyRails[decoration.storyRail];
}
