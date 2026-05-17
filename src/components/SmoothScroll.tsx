"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Premium wheel/trackpad scroll smoothing with an easing settle at the
 * end — but the user's input always leads (low lerp = follows the wheel
 * closely, only the tail eases out). Touch is left NATIVE (syncTouch
 * false), so a thumb drag on mobile has zero added latency and full
 * priority.
 *
 * Gated to data-perf="high" (same flag as the shader): premium devices
 * get the smooth scroll; the courtesy low-perf path keeps native scroll
 * so we never re-introduce the scroll jank we removed. Reduced-motion
 * users get native scroll too.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (document.documentElement.dataset.perf !== "high") return;

    const lenis = new Lenis({
      lerp: 0.11, // low → input leads, short eased settle (not laggy)
      wheelMultiplier: 1,
      smoothWheel: true,
      syncTouch: false, // native touch = thumb has full priority
    });

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
