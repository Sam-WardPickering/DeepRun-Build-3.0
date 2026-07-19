"use client";

import dynamic from "next/dynamic";

// Three.js is browser-only, so the ocean field loads client-side only.
const ParticleField = dynamic(() => import("./ParticleField"), { ssr: false });

/**
 * The hero. Everything - mono label, headline, sub-text, buttons - is real
 * DOM in one normal layout flow, so alignment can never break at any
 * viewport size. The ocean-from-above field (ParticleField) sits purely
 * behind as a background; there is no canvas text and no cursor effect.
 */
export default function Hero() {
  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <header className="hero">
      <ParticleField />
      <div className="hero-vignette" aria-hidden="true" />
      <div className="hero-content">
        <div className="mono hero-mono">
          <span className="dot" />Web studio · New Zealand
        </div>
        <h1 className="hero-title">
          Websites that <em>win work.</em>
        </h1>
        <p className="hero-sub">
          Deep Run builds fast, sharp, fixed-price websites for New
          Zealand&apos;s trades, hospitality and local businesses.
        </p>
        <div className="hero-cta">
          <button className="pill gold" onClick={() => scrollTo("audit")}>
            Get your free site check <span className="arr">→</span>
          </button>
          <button className="pill ghost" onClick={() => scrollTo("pricing")}>
            See pricing
          </button>
        </div>
      </div>
      <div className="scroll-hint">
        <span className="mono">Scroll</span>
      </div>
    </header>
  );
}
