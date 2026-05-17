"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Premium wheel/trackpad scroll smoothing — snappy (high lerp = input
 * leads, short tail), and IDLE-GATED: the rAF loop only runs while a
 * scroll is actually animating/settling, then stops until the next
 * input. The original site had plain native scroll; an always-on rAF
 * was the main extra cost — this removes it whenever you're just
 * reading.
 *
 * Gated to data-perf="high" (same flag as the shader). Reduced-motion
 * and low-perf keep native scroll.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (document.documentElement.dataset.perf !== "high") return;

    const lenis = new Lenis({
      lerp: 0.2, // snappier: closes ~20%/frame → tracks input, short tail
      wheelMultiplier: 1,
      smoothWheel: true,
      syncTouch: false, // native touch = thumb has full priority
      anchors: { offset: -110 }, // smooth #link scroll, clears the header
      autoRaf: false, // we drive rAF so we can stop it on idle
    });

    let raf = 0;
    let running = false;

    // Truly settled: not scrolling, no velocity, target reached.
    const idle = () =>
      !lenis.isScrolling &&
      Math.abs(lenis.velocity) < 0.01 &&
      Math.abs(lenis.targetScroll - lenis.animatedScroll) < 0.5;

    const tick = (time: number) => {
      lenis.raf(time);
      if (idle()) {
        running = false; // stop — nothing is moving, don't burn frames
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    const wake = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(tick);
    };

    // Resume on any input that can scroll, on anchor clicks
    // (pointerdown/click — Lenis intercepts these for smooth #links),
    // and on Lenis's own scroll events (covers programmatic scrollTo).
    const offScroll = lenis.on("scroll", wake);
    const passive = { passive: true } as AddEventListenerOptions;
    window.addEventListener("wheel", wake, passive);
    window.addEventListener("touchstart", wake, passive);
    window.addEventListener("keydown", wake);
    window.addEventListener("pointerdown", wake);
    window.addEventListener("click", wake);
    window.addEventListener("resize", wake);
    wake(); // initial sync tick

    return () => {
      cancelAnimationFrame(raf);
      offScroll?.();
      window.removeEventListener("wheel", wake);
      window.removeEventListener("touchstart", wake);
      window.removeEventListener("keydown", wake);
      window.removeEventListener("pointerdown", wake);
      window.removeEventListener("click", wake);
      window.removeEventListener("resize", wake);
      lenis.destroy();
    };
  }, []);

  return null;
}
