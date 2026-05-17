"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import type Lenis from "lenis";

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

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
  const router = useRouter();
  const navigatingRef = useRef(false);

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
      if (!a || a.target === "_blank") return;
      const href = a.getAttribute("href");
      if (!href) return;

      let url: URL;
      try {
        url = new URL(a.href, location.href);
      } catch {
        return;
      }
      if (url.origin !== location.origin) return; // external → leave alone

      const w = window as Window & {
        __lenis?: Lenis;
        __lenisWake?: () => void;
      };
      const lenis = w.__lenis;

      // CASE 1 — same-page #section link: smooth-scroll to it, and do
      // NOT write the URL hash (no /#work#work stacking, clean history).
      if (url.pathname === location.pathname && url.hash.length > 1) {
        const el = document.getElementById(
          decodeURIComponent(url.hash.slice(1)),
        );
        if (!el) return;
        e.preventDefault();
        e.stopImmediatePropagation();
        if (lenis && !reduce) {
          lenis.scrollTo(el, {
            offset: -110,
            duration: 1.1,
            easing: easeInOutCubic,
          });
          w.__lenisWake?.(); // capture-phase stop killed click→wake
        } else {
          el.scrollIntoView({
            behavior: reduce ? "auto" : "smooth",
            block: "start",
          });
        }
        return;
      }

      // CASE 2 — internal route nav with no hash (e.g. a project card):
      // glide the current page smoothly to the top, THEN navigate, so
      // it isn't an abrupt instant snap. Only when actually scrolled
      // down; near the top there's nothing to smooth, just navigate.
      if (
        url.pathname !== location.pathname &&
        !url.hash &&
        lenis &&
        !reduce &&
        !navigatingRef.current &&
        window.scrollY > 80
      ) {
        e.preventDefault();
        e.stopImmediatePropagation();
        navigatingRef.current = true;
        lenis.scrollTo(0, { duration: 0.8, easing: easeInOutCubic });
        w.__lenisWake?.();
        const dest = url.pathname + url.search;
        window.setTimeout(() => router.push(dest), 760);
        window.setTimeout(() => {
          navigatingRef.current = false;
        }, 1600);
      }
      // anything else → let Next/the browser handle it normally
    };

    // Capture phase: run before Next/Lenis click handlers.
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router]);

  return null;
}
