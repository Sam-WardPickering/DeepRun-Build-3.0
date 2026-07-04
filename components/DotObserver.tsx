"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * The page's power-up system. Two observers, one component:
 *
 * 1. Section label dots (.mono .dot): hollow gold rings that fill solid
 *    (.lit) with a single pulse, once they're well within view.
 *
 * 2. Reveal elements ([data-pw]): cards flicker on like a filament
 *    catching ("flicker"), contents rise in ("rise") with delays set
 *    via the --pw-delay custom property.
 *
 * The rootMargin pulls the trigger line up from the bottom edge of the
 * viewport, so elements activate when the visitor can actually see
 * them - not the instant one pixel appears.
 *
 * Fires once per element, re-runs on route changes, renders nothing.
 * Reduced-motion and no-JS visitors see everything immediately via CSS.
 */
export default function DotObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const observe = (
      selector: string,
      className: string,
      options: IntersectionObserverInit
    ): IntersectionObserver | null => {
      const els = document.querySelectorAll<HTMLElement>(selector);
      if (els.length === 0) return null;
      const io = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add(className);
            io.unobserve(entry.target);
          }
        }
      }, options);
      els.forEach((el) => io.observe(el));
      return io;
    };

    const dots = observe(".mono .dot", "lit", {
      threshold: 0.5,
      rootMargin: "0px 0px -18% 0px",
    });
    const reveals = observe("[data-pw]", "on", {
      threshold: 0.1,
      rootMargin: "0px 0px -10% 0px",
    });

    return () => {
      dots?.disconnect();
      reveals?.disconnect();
    };
  }, [pathname]);

  return null;
}
