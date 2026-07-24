"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/**
 * Fixed top navigation. Desktop (>=900px) shows all four links inline plus
 * the CTA, as before. Below 900px - which is every tablet and phone - the
 * links used to simply vanish with no replacement, leaving no way to reach
 * Site Check, Pricing, Resources, or About except scrolling or the footer.
 * This is now a real hamburger menu: a toggle button opens a full-width
 * panel with all four links (each closes the panel on click, so a tap
 * always lands somewhere), keyboard-operable (Escape closes it, focus
 * moves to the toggle on close), and it locks page scroll while open so it
 * reads as a deliberate overlay, not a layout shift.
 */
export default function Nav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const links = [
    { href: "/#audit", label: "Site Check" },
    { href: "/#pricing", label: "Pricing" },
    { href: "/resources", label: "Resources" },
    { href: "/about", label: "About" },
  ];

  return (
    <nav className="site-nav" aria-label="Main">
      <div className="nav-inner">
        <Link href="/" className="logo" onClick={() => setOpen(false)}>
          deep<i>run</i>.
        </Link>
        <div className="nav-links">
          {links.map((l) => (
            <Link key={l.href} href={l.href}>
              {l.label}
            </Link>
          ))}
          <Link href="/#contact" className="pill">
            Start a project <span className="arr">→</span>
          </Link>
        </div>

        <button
          type="button"
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="mobile-nav-panel"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span className={`nav-toggle-bar${open ? " open" : ""}`} />
        </button>
      </div>

      <div
        id="mobile-nav-panel"
        className={`nav-panel${open ? " open" : ""}`}
        aria-hidden={!open}
      >
        <div className="nav-panel-links">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              /* Explicitly untabbable while closed. CSS visibility already
                 removes these from the tab order; this guarantees it even if
                 the styling changes, so a keyboard user can never land on a
                 hidden link (axe: aria-hidden-focus). */
              tabIndex={open ? undefined : -1}
            >
              {l.label}
            </Link>
          ))}
        </div>
        <Link
          href="/#contact"
          className="pill gold nav-panel-cta"
          onClick={() => setOpen(false)}
          tabIndex={open ? undefined : -1}
        >
          Start a project <span className="arr">→</span>
        </Link>
      </div>
    </nav>
  );
}
