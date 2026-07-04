"use client";

import { useEffect, useRef } from "react";

/**
 * The manifesto paragraph. Words start dim and "light up" one by one as
 * the reader scrolls the paragraph through the viewport. Words wrapped
 * in *asterisks* light up gold instead of bone.
 */
const TEXT =
  "Most local businesses are brilliant at what they do and let down by a website that isn't. We find the *gap*, show you exactly what *better* looks like, and build it *fast* at a *fixed price*. And if you want it looked after for good, that's exactly what our *care plan* is for.";

export default function Manifesto() {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const words = Array.from(el.querySelectorAll<HTMLSpanElement>(".w"));

    function update() {
      if (!el) return;
      const r = el.getBoundingClientRect();
      // Progress runs from 0 (paragraph entering the lower part of the
      // viewport) to 1 (fully lit while the paragraph is still around the
      // middle of the screen, so nobody scrolls past unlit text).
      const start = window.innerHeight * 0.9;
      const end = window.innerHeight * 0.6;
      const progress = Math.min(
        1,
        Math.max(0, (start - r.top) / (r.height + start - end))
      );
      const lit = Math.floor(progress * words.length);
      words.forEach((w, i) => w.classList.toggle("lit", i < lit));
    }

    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);

  // Parse the TEXT constant into word spans; *word* becomes a key word.
  const words = TEXT.split(/\s+/).map((raw, i) => {
    const isKey = raw.includes("*");
    const clean = raw.replaceAll("*", "");
    return (
      <span key={i}>
        <span className={`w${isKey ? " key" : ""}`}>{clean}</span>{" "}
      </span>
    );
  });

  return (
    <section className="manifesto">
      <div className="wrap">
        <div className="mono">
          <span className="dot">●</span>Why we exist
        </div>
        <p ref={ref}>{words}</p>
      </div>
    </section>
  );
}
