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
    // Lenis is OFF by default. On-device testing (Safari/ProMotion)
    // showed its per-frame fractional-px transform of the whole document
    // forces the glass strips' backdrop-filter to re-rasterize every
    // frame and desyncs the raw-scrollY fixed shader canvas from the
    // Lenis-eased strip — tearing the bleed seam and dipping to ~49fps.
    // Native scroll = stable backdrop, in-phase canvas, "sweet FPS".
    // Opt back in (HUD button / localStorage.lenis='on') to compare.
    try {
      if (localStorage.getItem("lenis") !== "on") return;
    } catch {
      return;
    }

    const lenis = new Lenis({
      lerp: 0.2, // snappier: closes ~20%/frame → tracks input, short tail
      wheelMultiplier: 1,
      smoothWheel: true,
      syncTouch: false, // native touch = thumb has full priority
      autoRaf: false, // we drive rAF so we can stop it on idle
    });
    // Expose for AnchorScroll (which owns #link handling). Lenis's own
    // `anchors` option is intentionally NOT used — it double-handled
    // clicks with next/link and stacked the URL hash (/#work#work).
    (window as Window & { __lenis?: Lenis }).__lenis = lenis;

    let raf = 0;
    let running = false;

    // Truly settled: not scrolling, no velocity, target reached.
    const idle = () =>
      !lenis.isScrolling &&
      Math.abs(lenis.velocity) < 0.01 &&
      Math.abs(lenis.targetScroll - lenis.animatedScroll) < 0.5;

    const tick = (time: number) => {
      lenis.raf(time);
      // End the release glide a little faster: once you've essentially
      // stopped (low velocity) but Lenis is still slowly crawling the
      // last few px toward target, snap to rest instead of the long
      // asymptotic tail. Doesn't touch active scrolling (velocity is
      // high there), so the tracking feel is unchanged.
      const gap = Math.abs(lenis.targetScroll - lenis.animatedScroll);
      if (Math.abs(lenis.velocity) < 0.6 && gap > 0.5 && gap < 6) {
        lenis.scrollTo(lenis.targetScroll, { immediate: true });
      }
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
    // AnchorScroll calls lenis.scrollTo() then this — required because
    // its capture-phase stopImmediatePropagation kills the click→wake,
    // so without it the programmatic scroll never gets rAF ticks (the
    // "one click behind" bug).
    (window as Window & { __lenisWake?: () => void }).__lenisWake = wake;

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
      const w = window as Window & {
        __lenis?: Lenis;
        __lenisWake?: () => void;
      };
      delete w.__lenis;
      delete w.__lenisWake;
      lenis.destroy();
    };
  }, []);

  return null;
}
