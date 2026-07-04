"use client";

import { useEffect, useState } from "react";

/**
 * Contact section. A simple enquiry form that collects name, email,
 * phone (optional), and a message. On submit it opens the visitor's
 * email client with the details pre-filled in a mailto link.
 *
 * Why mailto instead of a backend form endpoint: we have no backend
 * database yet, and a mailto guarantees delivery without needing
 * SendGrid/Resend/etc. Once volume justifies it, swap this for a
 * POST to an API route that forwards to hello@deeprun.co.nz.
 */

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [tier, setTier] = useState("");

  function handleSubmit() {
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
    const body = encodeURIComponent(lines);
    window.location.href = `mailto:hello@deeprun.co.nz?subject=${subject}&body=${body}`;
  }

  // When a pricing card CTA is clicked it writes #contact?tier=Name into
  // the URL and fires a hashchange event; pick the tier up here so the
  // form shows which package the visitor came from.
  useEffect(() => {
    function readTier() {
      const params = new URLSearchParams(
        window.location.hash.split("?")[1] || ""
      );
      const t = params.get("tier");
      if (t) setTier(t);
    }
    readTier();
    window.addEventListener("hashchange", readTier);
    return () => window.removeEventListener("hashchange", readTier);
  }, []);

  const canSend = name.trim() && email.trim() && message.trim();

  return (
    <section className="contact-section" id="contact">
      <div className="wrap">
        <div className="contact-card">
          <div className="contact-left">
            <div className="mono">
              <span className="dot">●</span>Get in touch
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
            </div>
          </div>
          <div className="contact-right">
            <div className="form-group">
              <label htmlFor="c-name">Your name</label>
              <input
                id="c-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Smith"
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
                />
              </div>
            </div>
            {tier && (
              <div className="form-tier-badge">
                <span className="mono" style={{ color: "var(--gold)" }}>
                  <span className="dot">●</span>{tier} tier
                </span>
              </div>
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
            <button
              className={`pill gold form-submit${!canSend ? " disabled" : ""}`}
              onClick={canSend ? handleSubmit : undefined}
              disabled={!canSend}
            >
              Send enquiry <span className="arr">→</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
