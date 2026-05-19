"use client";

import { useEffect, useLayoutEffect, useState } from "react";

export type PerfTier = "high" | "medium" | "low";

const useIso =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

function read(): PerfTier {
  const v = document.documentElement.dataset.perf;
  return v === "high" || v === "medium" ? v : "low";
}

/**
 * Single source of truth for the render tier. Reads the `data-perf`
 * attribute (set pre-paint by the inline script in layout.tsx) and keeps
 * up with it via a MutationObserver, so a runtime demotion by PerfProbe
 * (high -> medium) live-updates every consumer with no reload.
 *
 *  - high   : live animated WebGL shader + full glass blur
 *  - medium : static gradient screenshot + full glass blur (cacheable)
 *  - low    : static gradient screenshot, no blur
 */
export function usePerfTier(): PerfTier {
  const [tier, setTier] = useState<PerfTier>("low");
  useIso(() => {
    setTier(read());
    const ob = new MutationObserver(() => setTier(read()));
    ob.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-perf"],
    });
    return () => ob.disconnect();
  }, []);
  return tier;
}
