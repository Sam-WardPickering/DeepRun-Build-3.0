import Link from "next/link";

/**
 * Site footer, laid out as two balanced columns rather than three stacked
 * full-width bands. Left: the wordmark, the place line, and the nav links
 * grouped underneath it as a proper brand block. Right: the contact call
 * to action with matching email and phone pills. A single hairline then
 * closes it with the legal line.
 *
 * The previous layout left the nav links stranded alone in a wide band
 * with dead space to their right; grouping them under the wordmark gives
 * both columns real content and a shared top edge.
 */
export default function Footer() {
  const links = [
    { href: "/#audit", label: "Site Check" },
    { href: "/#pricing", label: "Pricing" },
    { href: "/resources", label: "Resources" },
    { href: "/#contact", label: "Contact" },
    { href: "/about", label: "About" },
    { href: "/privacy", label: "Privacy" },
  ];

  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="foot-top">
          <div className="foot-brand">
            <div className="foot-logo">
              deep<i>run</i>.
            </div>
            <p className="foot-place">
              <svg
                className="foot-place-icon"
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              Aotearoa, New Zealand
            </p>
            <nav className="foot-nav" aria-label="Footer">
              {links.map((l) => (
                <Link key={l.href} href={l.href}>
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="foot-cta">
            <p className="foot-cta-line">Ready when you are.</p>
            <a
              href="mailto:hello@deeprun.co.nz"
              className="pill ghost foot-email"
            >
              <svg
                className="foot-contact-icon"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m2 7 10 6 10-6" />
              </svg>
              <span className="foot-contact-value">hello@deeprun.co.nz</span>
            </a>
            <a href="tel:+642041343263" className="pill ghost foot-phone">
              <svg
                className="foot-contact-icon foot-phone-icon"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span className="foot-contact-value foot-phone-number">
                020 4134 3263
              </span>
            </a>
          </div>
        </div>

        <div className="foot-bottom">
          <span>© {new Date().getFullYear()} Deep Run. All rights reserved.</span>
          <span>Fast, sharp, fixed-price websites.</span>
        </div>
      </div>
    </footer>
  );
}
