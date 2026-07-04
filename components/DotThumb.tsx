/**
 * A small generative dot-matrix thumbnail rendered as SVG.
 * The same seed always produces the same pattern, so each article keeps
 * a stable visual identity. Rendered on the server - no JS shipped.
 */
export default function DotThumb({ seed }: { seed: number }) {
  // Simple deterministic pseudo-random number generator (Park-Miller).
  let state = seed;
  const rand = () => {
    state = (state * 16807) % 2147483647;
    return state / 2147483647;
  };

  const n = 11;
  const cell = 176 / n;
  const dots: { x: number; y: number; gold: boolean; opacity: number }[] = [];
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      const v = rand();
      if (v > 0.62) {
        dots.push({
          x: x * cell + cell / 2,
          y: y * cell + cell / 2,
          gold: v > 0.93,
          opacity: 0.12 + v * 0.25,
        });
      }
    }
  }

  return (
    <svg viewBox="0 0 176 176" role="img" aria-hidden="true">
      <rect width="176" height="176" fill="#131210" />
      {dots.map((d, i) => (
        <circle
          key={i}
          cx={d.x}
          cy={d.y}
          r={cell * 0.22}
          fill={d.gold ? "#e2b13c" : `rgba(236,231,218,${d.opacity.toFixed(3)})`}
        />
      ))}
    </svg>
  );
}
