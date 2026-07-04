import Link from "next/link";

/**
 * Site footer: big wordmark and a "ready when you are" email CTA up top,
 * a mono nav row for every section, and a quiet bottom line.
 * The year is computed at render time so it never dates.
 */
export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="foot-top">
          <div>
            <div className="foot-logo">
              deep<i>run</i>.
            </div>
            <div className="mono" style={{ marginTop: 18 }}>
              <span className="dot">●</span>Aotearoa, New Zealand
            </div>
          </div>
          <div className="foot-cta">
            <p className="foot-cta-line">Ready when you are.</p>
            <a href="mailto:hello@deeprun.co.nz" className="pill ghost">
              hello@deeprun.co.nz <span className="arr">→</span>
            </a>
          </div>
        </div>
        <nav className="foot-nav" aria-label="Footer">
          <Link href="/#audit">Site check</Link>
          <Link href="/#pricing">Pricing</Link>
          <Link href="/resources">Resources</Link>
          <Link href="/#contact">Contact</Link>
          <Link href="/about">About</Link>
          <Link href="/privacy">Privacy</Link>
        </nav>
        <div className="foot-bottom">
          <span>© {new Date().getFullYear()} Deep Run. All rights reserved.</span>
          <span>Fast, sharp, fixed-price websites.</span>
        </div>
      </div>
    </footer>
  );
}
