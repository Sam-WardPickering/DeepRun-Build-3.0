import Link from "next/link";

/** Fixed top navigation. Kept deliberately minimal: four links and one CTA. */
export default function Nav() {
  return (
    <nav className="site-nav">
      <div className="nav-inner">
        <Link href="/" className="logo">
          deep<i>run</i>.
        </Link>
        <div className="nav-links">
          <Link href="/#audit">Site check</Link>
          <Link href="/#pricing">Pricing</Link>
          <Link href="/resources">Resources</Link>
          <Link href="/#contact" className="pill">
            Start a project <span className="arr">→</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
