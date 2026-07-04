"use client";

import TiltCard from "./TiltCard";

/** The four pricing tiers with CTAs that funnel to the contact section. */
const TIERS = [
  {
    name: "Starter",
    price: "FROM $800 NZD",
    items: ["1-3 pages, mobile-first", "Contact & click-to-call", "Live within a week"],
    hot: false,
    cta: "Get started",
  },
  {
    name: "Business",
    price: "FROM $1,500 NZD",
    items: ["Up to 8 pages", "Forms & enquiry routing", "SEO foundations"],
    hot: true,
    cta: "Get started",
  },
  {
    name: "Enhanced",
    price: "FROM $3,000 NZD",
    items: ["Booking systems", "E-commerce lite", "Custom features"],
    hot: false,
    cta: "Get started",
  },
  {
    name: "Care plan",
    price: "$150-200 / MONTH",
    items: ["Hosting & domain", "Monthly updates", "Backups & security"],
    hot: false,
    cta: "Add to any build",
  },
];

export default function Pricing() {
  return (
    <section className="pricing" id="pricing">
      <div className="wrap">
        <div className="section-head">
          <div className="mono">
            <span className="dot">●</span>Pricing
          </div>
          <h2>Fixed price. No surprises. Live in days.</h2>
          <p className="lede">
            Every tier includes design, build, mobile-first QA and launch. Add
            the care plan and we host, maintain and update it for you - we&apos;re
            your web people.
          </p>
        </div>
        <div className="cards">
          {TIERS.map((tier) => (
            <TiltCard key={tier.name} hot={tier.hot}>
              {tier.hot && <span className="flag">Most popular</span>}
              <h3>{tier.name}</h3>
              <div className="price">{tier.price}</div>
              <ul>
                {tier.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <a
                href={`#contact`}
                className={`pill tier-cta${tier.hot ? " gold" : " ghost"}`}
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById("contact");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                  // Set the tier in the URL so the contact form picks it up
                  window.history.replaceState(null, "", `#contact?tier=${encodeURIComponent(tier.name)}`);
                  // Dispatch a hashchange so the Contact component can react
                  window.dispatchEvent(new HashChangeEvent("hashchange"));
                }}
              >
                {tier.cta} <span className="arr">→</span>
              </a>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}
