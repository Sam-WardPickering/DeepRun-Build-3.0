"use client";

import dynamic from "next/dynamic";

// Three.js only works in the browser, so the particle field is loaded
// client-side only (ssr: false) to avoid server-render errors.
const ParticleField = dynamic(() => import("./ParticleField"), { ssr: false });

/** Splits a phrase into words that rise in one by one on page load. */
function RisingWords({
  text,
  startDelay = 0,
  italicGold = false,
}: {
  text: string;
  startDelay?: number;
  italicGold?: boolean;
}) {
  return (
    <>
      {text.split(" ").map((word, i) => (
        <span key={i}>
          <span className="word">
            <span style={{ animationDelay: `${startDelay + i * 0.09}s` }}>
              {italicGold ? <em>{word}</em> : word}
            </span>
          </span>{" "}
        </span>
      ))}
    </>
  );
}

export default function Hero() {
  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <header className="hero">
      <ParticleField />
      <div className="hero-vignette" aria-hidden="true" />
      <div className="hero-content">
        <div className="mono" style={{ marginBottom: 22 }}>
          <span className="dot">●</span>Web studio · New Zealand
        </div>
        <h1>
          <RisingWords text="Websites that" />
          <RisingWords text="win work." startDelay={0.25} italicGold />
        </h1>
        <p className="hero-sub">
          Deep Run builds fast, sharp, fixed-price websites for New
          Zealand&apos;s trades, hospitality and local businesses. Live in
          days, built to last - and looked after for as long as you want
          us around.
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
