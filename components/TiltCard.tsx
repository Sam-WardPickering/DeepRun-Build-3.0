"use client";

import { useRef, type ReactNode } from "react";

/**
 * A card that tilts in 3D toward the cursor, with a soft light "glare"
 * that follows the pointer. Inner content sits at different depths
 * (via translateZ in CSS) so the card feels layered.
 */
export default function TiltCard({
  children,
  hot = false,
}: {
  children: ReactNode;
  hot?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  function handleMove(e: React.PointerEvent) {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.transform = `rotateY(${(px - 0.5) * 10}deg) rotateX(${(0.5 - py) * 8}deg)`;
    el.style.setProperty("--gx", px * 100 + "%");
    el.style.setProperty("--gy", py * 100 + "%");
  }

  function handleLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.transition = "transform 0.5s cubic-bezier(0.34,1.56,0.64,1)";
    el.style.transform = "rotateY(0) rotateX(0)";
    setTimeout(() => {
      if (el) el.style.transition = "transform 0.12s ease-out";
    }, 500);
  }

  return (
    <div
      ref={ref}
      className={`tilt${hot ? " hot" : ""}`}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
    >
      <div className="glare" />
      {children}
    </div>
  );
}
