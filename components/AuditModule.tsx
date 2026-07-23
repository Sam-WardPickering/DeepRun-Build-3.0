"use client";

import { useEffect, useRef, useState } from "react";


/**
 * The AI site check module. A visitor enters a URL, we POST it to
 * /api/audit, and the five category rows + total score animate to the
 * real result. While the request is in flight the card gets a .scanning
 * class, which fades in the golden aurora shader behind the content.
 *
 * Each category is visualised as a row of dots (a nod to the particle
 * field in the hero): score 0-100 maps to how many dots light up gold.
 */

const CATEGORIES = [
  "message",
  "action",
  "content",
  "foundations",
  "credibility",
] as const;
type Category = (typeof CATEGORIES)[number];

const DOTS_PER_ROW = 22;

// The example scores shown before anyone runs a real check.
const EXAMPLE_SCORES: Record<Category, number> = {
  message: 62,
  action: 48,
  content: 66,
  foundations: 57,
  credibility: 57,
};

/**
 * A one-word read on the score, shown as a chip beside the number. The
 * long sentence underneath explains; this gives the eye something to land
 * on instantly.
 */
function shortVerdict(total: number): string {
  if (total >= 80) return "Strong";
  if (total >= 60) return "Decent";
  if (total >= 40) return "Underperforming";
  return "Losing work";
}
const EXAMPLE_VERDICT =
  "Example result - run your own site to see where it stands.";

type AuditResponse = {
  total: number;
  verdict: string;
  scores: Record<Category, number>;
  findings: { category: string; message: string }[];
  error?: string;
};

/** One row of dots. `value` is 0-100; dots light up left to right. */
function DotRow({ value, scanning }: { value: number; scanning: boolean }) {
  const lit = scanning ? 1 : Math.round((value / 100) * DOTS_PER_ROW);
  return (
    <div className="dotrow" aria-hidden="true">
      {Array.from({ length: DOTS_PER_ROW }, (_, i) => (
        <i
          key={i}
          className={i < lit ? "on" : ""}
          style={{ transitionDelay: `${i * 28}ms` }}
        />
      ))}
    </div>
  );
}

export default function AuditModule() {
  const [url, setUrl] = useState("");
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState("");
  const [scores, setScores] = useState<Record<Category, number>>(EXAMPLE_SCORES);
  const [verdict, setVerdict] = useState(EXAMPLE_VERDICT);
  const [findings, setFindings] = useState<AuditResponse["findings"]>([]);
  const [displayTotal, setDisplayTotal] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Animate the big number counting toward a target.
  function animateTotal(target: number) {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setDisplayTotal(target);
      return;
    }
    const startVal = displayTotal;
    const t0 = performance.now();
    function step(now: number) {
      const p = Math.min(1, (now - t0) / 900);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplayTotal(Math.round(startVal + (target - startVal) * eased));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // Reveal the example scores the first time the card scrolls into view.
  useEffect(() => {
    const card = cardRef.current;
    if (!card || revealed) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setRevealed(true);
          animateTotal(exampleTotal());
          io.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    io.observe(card);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revealed]);

  function exampleTotal() {
    const vals = Object.values(EXAMPLE_SCORES);
    return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
  }

  // While scanning, a single status line steps through what's being checked,
  // in plain, casual language. It advances at a calm pace (well under the
  // 3-flashes-per-second WCAG threshold) and simply holds on the last line
  // if the scan runs long - it never flashes or rapidly cycles. No random
  // number spinning (that was a photosensitivity risk and has been removed).
  const SCAN_STATUS = [
    "Grabbing your page…",
    "Having a read of your headline…",
    "Seeing how easy you are to reach…",
    "Checking the words pull their weight…",
    "Looking under the bonnet…",
    "Making sure it earns some trust…",
    "Tallying it all up…",
  ];
  const [statusIdx, setStatusIdx] = useState(0);

  useEffect(() => {
    if (!scanning) {
      setStatusIdx(0);
      return;
    }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return; // reduced-motion: hold on the first calm line
    // Advance once every 900ms, and STOP at the last line (no looping/flashing).
    const id = setInterval(() => {
      setStatusIdx((i) => (i < SCAN_STATUS.length - 1 ? i + 1 : i));
    }, 900);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scanning]);

  async function runCheck() {
    if (scanning) return;
    setError("");
    setFindings([]);
    setScanning(true);
    setStatusIdx(0);
    setVerdict(`Reading ${url.trim() || "your site"}…`);

    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data: AuditResponse = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setVerdict(EXAMPLE_VERDICT);
        return;
      }

      setScores(data.scores);
      setVerdict(data.verdict);
      setFindings(data.findings);
      animateTotal(data.total);
    } catch {
      setError("Something went wrong. Please try again.");
      setVerdict(EXAMPLE_VERDICT);
    } finally {
      setScanning(false);
    }
  }

  return (
    <section className="audit-section" id="audit">
      <div className="wrap">
        <div
          ref={cardRef}
          className={`audit-card${revealed ? " on" : ""}${scanning ? " scanning" : ""}`}
          data-pw="flicker"
        >
          <div className={`audit-left${revealed ? " on" : ""}`} data-pw="rise" style={{ "--pw-delay": "0.15s" } as React.CSSProperties}>
            <div className="mono">
              <span className="dot" />AI site check
            </div>
            <h2>How hard is your website working?</h2>
            <p className="desc">
              Paste your address below and our AI reads the page the way a
              customer would. You get a score across five areas - what the
              site says, how easy it is to act, the words, the build
              underneath, and whether it earns trust - so you can see
              exactly where it's falling short.
            </p>
            <div className="audit-input">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && runCheck()}
                placeholder="yourdomain.co.nz"
                spellCheck={false}
                aria-label="Your website address"
              />
              <button
                className="pill gold"
                onClick={runCheck}
                disabled={scanning}
              >
                {scanning ? "Reading…" : "Check my site"}{" "}
                <span className="arr">→</span>
              </button>
            </div>
            {error ? (
              <p className="audit-error" role="alert">{error}</p>
            ) : (
              <p className="audit-note">
                Free. Takes about 20 seconds. No email required.
              </p>
            )}
          </div>

          <div className={`audit-right${revealed ? " on" : ""}`} data-pw="rise" style={{ "--pw-delay": "0.32s" } as React.CSSProperties}>
            <div className="score-top">
              <span className="score-num">
                {revealed ? displayTotal : "–"}
              </span>
              <span className="score-den">/100</span>
              {revealed && !scanning && (
                <span className="score-chip">{shortVerdict(displayTotal)}</span>
              )}
            </div>
            <div className="score-verdict">
              {scanning ? SCAN_STATUS[statusIdx] : verdict}
            </div>
            <div className="bars">
              {CATEGORIES.map((cat) => (
                <div className="bar-row" key={cat}>
                  <span className="bar-label">{cat}</span>
                  <DotRow
                    value={revealed ? scores[cat] : 0}
                    scanning={scanning}
                  />
                  <span className="bar-val">
                    {scanning ? "–" : scores[cat]}
                  </span>
                </div>
              ))}
            </div>
            {findings.length > 0 && (
              <div className="findings">
                {findings.map((f) => (
                  <p className="finding" key={f.category}>
                    <b style={{ textTransform: "capitalize" }}>
                      {f.category}:
                    </b>{" "}
                    {f.message}
                  </p>
                ))}
                <p className="finding" style={{ marginTop: 12, color: "var(--gold)" }}>
                  Want to know exactly how to fix these? <a href="#contact" onClick={(e) => { e.preventDefault(); document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }); }} style={{ color: "var(--gold)", borderBottom: "1px solid rgba(226,177,60,0.4)" }}>Get in touch</a> - we&apos;ll walk you through it.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
