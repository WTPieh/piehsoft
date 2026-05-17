"use client";

import { useEffect } from "react";
import type Lenis from "lenis";

/**
 * Owns ALL same-page #section navigation (pill/tab nav, hero "See the
 * work ↓", Header links when already on that page). Smooth-scrolls to
 * the target and deliberately does NOT write the URL hash — so:
 *  - no /#work#work stacking (Lenis `anchors` + next/link double-handle),
 *  - back/forward aren't polluted with hash entries,
 *  - refresh / revisits land at the top, not jumped to a stale #hash.
 *
 * Cross-page links (e.g. Header "/#work" from a case study) are left
 * alone so Next navigates home normally.
 */
export function AnchorScroll() {
  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const onClick = (e: MouseEvent) => {
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      )
        return;
      const a = (e.target as HTMLElement)?.closest?.("a");
      if (!a) return;
      const href = a.getAttribute("href");
      if (!href || !href.includes("#") || a.target === "_blank") return;

      const url = new URL(a.href, location.href);
      // Only same-page hash links. Different path → let Next navigate.
      if (url.pathname !== location.pathname || url.hash.length <= 1) return;
      const id = decodeURIComponent(url.hash.slice(1));
      const el = document.getElementById(id);
      if (!el) return;

      // We fully handle it: stop the browser jump AND Next's Link
      // handler (capture phase) so the hash is never written.
      e.preventDefault();
      e.stopImmediatePropagation();

      const lenis = (window as Window & { __lenis?: Lenis }).__lenis;
      if (lenis && !reduce) {
        // Deliberate, even smooth scroll (not a fast snap) regardless of
        // distance — fixed duration + easeInOutCubic, not the wheel lerp.
        lenis.scrollTo(el, {
          offset: -110,
          duration: 1.1,
          easing: (t) =>
            t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
        });
      } else {
        el.scrollIntoView({
          behavior: reduce ? "auto" : "smooth",
          block: "start",
        });
      }
    };

    // Capture phase: run before Next/Lenis click handlers.
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
