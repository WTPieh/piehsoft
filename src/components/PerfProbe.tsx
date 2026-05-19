"use client";

import { useEffect } from "react";
import { usePerfTier } from "@/lib/perfTier";

// Runtime guard for the gap the capability check can't see: a device can
// have a perfectly valid WebGL2 context (so the inline script picks
// 'high') yet still not composite an animated shader behind stacked
// backdrop-filter strips at frame rate — e.g. Pixel/Firefox. We can't
// know that statically, so we MEASURE: once the live shader is running,
// sample real frame cadence; if it can't hold framerate, demote to
// 'medium' (static gradient + full glass — visually ~identical, no
// per-frame re-blur). Demotion flips `data-perf`, which usePerfTier
// observes, so the swap is live and reload-free.

const WARMUP_FRAMES = 10; // skip JIT / shader init / first layout
const SAMPLE_FRAMES = 50; // ~0.8s at 60fps
const MIN_FPS = 50; // sustained below this on 'high' => demote

export function PerfProbe() {
  const tier = usePerfTier();

  useEffect(() => {
    if (tier !== "high") return;
    if (document.documentElement.dataset.perf !== "high") return;

    let raf = 0;
    let seen = 0;
    let last = 0;
    const deltas: number[] = [];

    const tick = (t: number) => {
      // rAF is throttled to ~1fps in background tabs — a false demote.
      // Reset and wait until the tab is actually visible.
      if (document.visibilityState !== "visible") {
        seen = 0;
        last = 0;
        deltas.length = 0;
        raf = requestAnimationFrame(tick);
        return;
      }
      seen++;
      if (seen > WARMUP_FRAMES) {
        if (last) deltas.push(t - last);
        last = t;
        if (deltas.length >= SAMPLE_FRAMES) {
          // Median delta — robust against one-off GC / scheduling spikes.
          const sorted = [...deltas].sort((a, b) => a - b);
          const med = sorted[sorted.length >> 1];
          const fps = 1000 / med;
          if (fps < MIN_FPS) {
            document.documentElement.setAttribute("data-perf", "medium");
          }
          return; // done either way; one probe per load
        }
      } else {
        last = t;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [tier]);

  return null;
}
