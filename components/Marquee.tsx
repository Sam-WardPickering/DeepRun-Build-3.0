"use client";

import { useEffect, useRef } from "react";

/**
 * A horizontally scrolling strip of text that speeds up and skews
 * based on how fast the user is scrolling the page.
 */
const ITEMS = ["Trades ·", "Hospitality ·", "Health & wellness ·", "Local retail ·"];

export default function Marquee() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let x = 0;
    let lastY = window.scrollY;
    let vel = 0;
    let raf = 0;

    function tick() {
      raf = requestAnimationFrame(tick);
      if (!el) return;
      const dy = window.scrollY - lastY;
      lastY = window.scrollY;
      // Smooth the raw scroll delta so motion feels fluid, not jittery.
      vel += (dy - vel) * 0.08;
      x -= 0.9 + Math.min(16, Math.abs(vel) * 0.8);
      const half = el.scrollWidth / 2;
      if (-x >= half) x += half; // loop seamlessly
      const skew = Math.max(-10, Math.min(10, -vel * 0.3));
      el.style.transform = `translateX(${x}px) skewX(${skew}deg)`;
    }
    tick();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="marquee-zone" aria-hidden="true">
      <div className="marquee" ref={ref}>
        {[...ITEMS, ...ITEMS].map((t, i) => (
          <span key={i}>{t}</span>
        ))}
      </div>
    </div>
  );
}
