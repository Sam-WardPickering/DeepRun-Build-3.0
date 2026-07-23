"use client";

import { useEffect, useState } from "react";

/**
 * Contact section. Collects name, email, phone (optional), and a message,
 * and POSTs to /api/contact which emails hello@deeprun.co.nz via Resend.
 *
 * If email isn't configured yet (no RESEND_API_KEY), the API responds with
 * { fallback:true } and we open the visitor's mail client via mailto - so
 * enquiries are never lost. A honeypot field guards against bots.
 */

type Status = "idle" | "sending" | "sent" | "error";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [tier, setTier] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function mailtoFallback() {
    const subject = encodeURIComponent(
      tier ? `New enquiry - ${tier} tier` : "New enquiry from deeprun.co.nz"
    );
    const lines = [
      `Name: ${name}`,
      `Email: ${email}`,
      phone ? `Phone: ${phone}` : "",
      tier ? `Interested in: ${tier}` : "",
      "",
      message,
    ]
      .filter(Boolean)
      .join("\n");
    window.location.href = `mailto:hello@deeprun.co.nz?subject=${subject}&body=${encodeURIComponent(
      lines
    )}`;
  }

  async function handleSubmit() {
    if (status === "sending") return;
    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, tier, message, website }),
      });
      const data = await res.json().catch(() => ({}));
      if (data.ok) {
        setStatus("sent");
        return;
      }
      if (data.fallback) {
        // Email not configured yet - open the mail client instead.
        mailtoFallback();
        setStatus("sent");
        return;
      }
      setStatus("error");
      setErrorMsg(data.error || "Something went wrong. Please email us directly.");
    } catch {
      setStatus("error");
      setErrorMsg("Something went wrong. Please email us directly.");
    }
  }

  useEffect(() => {
    function readTier() {
      const params = new URLSearchParams(window.location.hash.split("?")[1] || "");
      const t = params.get("tier");
      if (t) setTier(t);
    }
    readTier();
    window.addEventListener("hashchange", readTier);
    return () => window.removeEventListener("hashchange", readTier);
  }, []);

  const canSend =
    name.trim() && email.trim() && message.trim() && status !== "sending";

  return (
    <section className="contact-section" id="contact">
      <div className="wrap">
        <div className="contact-card" data-pw="flicker">
          <div
            className="contact-left"
            data-pw="rise"
            style={{ "--pw-delay": "0.15s" } as React.CSSProperties}
          >
            <div className="mono">
              <span className="dot" />Get in touch
            </div>
            <h2>Let&apos;s talk about your site</h2>
            <p className="contact-desc">
              Tell us a bit about your business and what you need. We respond
              to every enquiry within 24 hours - usually much faster.
            </p>
            <div className="contact-direct">
              <a href="mailto:hello@deeprun.co.nz" className="contact-method">
                <span className="contact-method-label">Email</span>
                <span className="contact-method-value">hello@deeprun.co.nz</span>
              </a>
              <a href="tel:+642041343263" className="contact-method">
                <span className="contact-method-label">Phone</span>
                <span className="contact-method-value">020 4134 3263</span>
              </a>
            </div>
          </div>
          <div
            className="contact-right"
            data-pw="rise"
            style={{ "--pw-delay": "0.32s" } as React.CSSProperties}
          >
            {status === "sent" ? (
              <div className="form-success" role="status">
                <div className="mono" style={{ color: "var(--gold)" }}>
                  <span className="dot lit" />Message sent
                </div>
                <h3>Thanks - we&apos;ll be in touch.</h3>
                <p>
                  We respond to every enquiry within 24 hours, usually much
                  faster. Keep an eye on your inbox.
                </p>
              </div>
            ) : (
              <>
                <div className="form-group">
                  <label htmlFor="c-name">Your name</label>
                  <input
                    id="c-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Smith"
                    autoComplete="name"
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="c-email">Email</label>
                    <input
                      id="c-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jane@example.co.nz"
                      autoComplete="email"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="c-phone">Phone (optional)</label>
                    <input
                      id="c-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="021 123 4567"
                      autoComplete="tel"
                    />
                  </div>
                </div>

                {/* Honeypot: hidden from real users, catches bots. */}
                <div className="hp-field" aria-hidden="true">
                  <label htmlFor="c-website">Website</label>
                  <input
                    id="c-website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                </div>

                {tier && (
                  <button
                    type="button"
                    className="form-tier-badge"
                    onClick={() => setTier("")}
                    aria-label={`Remove ${tier} tier`}
                    title="Click to remove"
                  >
                    <span className="mono">
                      {tier} tier
                    </span>
                    <span className="tier-remove" aria-hidden="true">
                      ×
                    </span>
                  </button>
                )}
                <div className="form-group">
                  <label htmlFor="c-msg">What do you need?</label>
                  <textarea
                    id="c-msg"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about your business and what you're looking for - a new site, a rebuild, or just some advice."
                    rows={4}
                  />
                </div>
                {status === "error" && (
                  <p className="form-error" role="alert">
                    {errorMsg}
                  </p>
                )}
                <button
                  className={`pill gold form-submit${!canSend ? " disabled" : ""}`}
                  onClick={canSend ? handleSubmit : undefined}
                  disabled={!canSend}
                >
                  {status === "sending" ? "Sending..." : "Send enquiry"}{" "}
                  <span className="arr">→</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
