/**
 * Decorative animated circuit-trace motif for the hero. Pure SVG + CSS
 * animation (no JS), lime traces on navy. aria-hidden — purely decorative.
 */
export default function CircuitBackground() {
  const traces = [
    { d: "M-20 80 H180 L240 140 H420 L470 90 H720", delay: "0s", opacity: 0.5 },
    { d: "M1460 60 H1150 L1090 120 H900 L850 170 H640", delay: "1.6s", opacity: 0.4 },
    { d: "M-20 260 H120 L200 340 H460 L520 280 H760", delay: "3.1s", opacity: 0.35 },
    { d: "M1460 320 H1240 L1170 250 H950 L880 310 H700", delay: "2.2s", opacity: 0.45 },
    { d: "M-20 430 H240 L310 370 H560 L630 430 H900", delay: "4.4s", opacity: 0.3 },
    { d: "M1460 470 H1180 L1100 410 H860", delay: "5.2s", opacity: 0.35 },
  ];

  const nodes = [
    { cx: 240, cy: 140, delay: "0.4s" },
    { cx: 720, cy: 90, delay: "1.2s" },
    { cx: 1090, cy: 120, delay: "2s" },
    { cx: 200, cy: 340, delay: "2.8s" },
    { cx: 880, cy: 310, delay: "0.9s" },
    { cx: 630, cy: 430, delay: "3.5s" },
    { cx: 1100, cy: 410, delay: "1.7s" },
  ];

  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 1440 520"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
    >
      {traces.map((t, i) => (
        <path
          key={i}
          d={t.d}
          stroke="var(--color-lime-500)"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="circuit-path"
          style={
            {
              animationDelay: t.delay,
              "--circuit-opacity": t.opacity,
            } as React.CSSProperties
          }
        />
      ))}
      {nodes.map((n, i) => (
        <circle
          key={i}
          cx={n.cx}
          cy={n.cy}
          r="3.5"
          fill="var(--color-lime-500)"
          className="circuit-node"
          style={{ animationDelay: n.delay }}
        />
      ))}
    </svg>
  );
}
