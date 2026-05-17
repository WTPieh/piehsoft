"use client";

import { useEffect } from "react";
import { projects } from "@/lib/projects";

// On idle, warm the hero fallback WebPs for the OTHER routes (current
// theme) so a route navigation never shows a flash of solid colorBack
// while the new page's hero image downloads. Re-runs if the theme
// changes so the needed set is always warm. Cheap: idle priority,
// browser-cached, deduped.
const KEYS = ["hero", ...projects.map((p) => `hero-${p.id}`)];

export function HeroPrefetch() {
  useEffect(() => {
    const done = new Set<string>();

    const warm = () => {
      const theme =
        document.documentElement.getAttribute("data-theme") === "dark"
          ? "dark"
          : "light";
      for (const key of KEYS) {
        const href = `/${key}-${theme}.webp`;
        if (done.has(href)) continue;
        done.add(href);
        const link = document.createElement("link");
        link.rel = "prefetch";
        link.as = "image";
        link.href = href;
        document.head.appendChild(link);
      }
    };

    const idle = (cb: () => void) =>
      "requestIdleCallback" in window
        ? (window as Window).requestIdleCallback(cb, { timeout: 2500 })
        : setTimeout(cb, 1200);
    idle(warm);

    const obs = new MutationObserver(() => idle(warm));
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => obs.disconnect();
  }, []);

  return null;
}
