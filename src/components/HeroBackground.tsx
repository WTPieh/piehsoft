"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { PALETTE, type Theme } from "@/lib/heroPalette";
import { useSetHeroParams } from "@/components/HeroShader";

// Thin per-page hero. The live WebGL shader is NOT here anymore — it's a
// single persistent instance in the root layout (see HeroShader) that
// never unmounts on navigation (that teardown/rebuild was the route
// flash). This component only:
//   1. publishes this page's hero params to that persistent shader, and
//   2. renders the per-page static fallback image + vignette + the
//      [data-hero-anchor] box the persistent shader tracks/overlays.
// On low-perf / reduced-motion the persistent shader renders nothing, so
// the static image below is the whole hero — unchanged behaviour.

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

function useTheme(): Theme {
  const [theme, setTheme] = useState<Theme>("light");
  useEffect(() => {
    const read = () =>
      (document.documentElement.getAttribute("data-theme") as Theme) || "light";
    setTheme(read());
    const observer = new MutationObserver(() => setTheme(read()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);
  return theme;
}

function useShaderCapable(): boolean {
  const [capable, setCapable] = useState(false);
  useIsoLayoutEffect(() => {
    setCapable(document.documentElement.dataset.perf === "high");
  }, []);
  return capable;
}

type Props = {
  brandColor?: string;
  shape?: "corners" | "ripple" | "wave" | "dots" | "truchet" | "blob" | "sphere";
  intensity?: number;
  noise?: number;
  softness?: number;
  inflate?: number;
  vignette?: number;
  frame?: number;
  fallbackKey?: string;
  bleedBelow?: number;
};

export function HeroBackground({
  brandColor,
  shape = "corners",
  intensity,
  noise,
  softness,
  inflate = 0,
  vignette = 0.35,
  frame = 12000,
  bleedBelow = 0,
  fallbackKey = "hero",
}: Props = {}) {
  const theme = useTheme();
  const capable = useShaderCapable();
  const base = PALETTE[theme];

  // Publish this page's params to the persistent shader (it morphs;
  // never unmounts → no WebGL teardown flash on navigation).
  useSetHeroParams({
    shape,
    brandColor,
    intensity,
    noise,
    softness,
    inflate,
    bleedBelow,
    frame,
  });

  // Bleed only on high-perf (glass atmosphere by design). Low-perf: no
  // mask — image ends at hero bounds, solid bg immediately after.
  const bleeding = capable && bleedBelow > 0;
  const wrapperStyle: React.CSSProperties = bleeding
    ? {
        bottom: `-${bleedBelow}px`,
        maskImage: `linear-gradient(to bottom, black 0%, black calc(100% - ${bleedBelow}px), transparent 100%)`,
        WebkitMaskImage: `linear-gradient(to bottom, black 0%, black calc(100% - ${bleedBelow}px), transparent 100%)`,
      }
    : {};

  return (
    <div
      data-hero-bg
      data-hero-anchor
      className={
        bleeding
          ? "absolute top-0 left-0 right-0 overflow-hidden z-0 pointer-events-none"
          : "absolute inset-0 overflow-hidden z-0 pointer-events-none"
      }
      style={wrapperStyle}
    >
      {/* Static fallback — pixel-exact screenshot of the shader, per
          theme. ONLY on low-perf: it IS the hero there. On high-perf the
          persistent shader (fixed, z-index:-1) is the hero; rendering
          this image would sit at z-0 in the section and occlude it. */}
      {!capable && (
        <div
          aria-hidden
          className="hero-fallback absolute inset-0 h-full w-full"
          style={
            {
              backgroundColor: base.colorBack,
              "--fb-light": `url(/${fallbackKey}-light.webp)`,
              "--fb-dark": `url(/${fallbackKey}-dark.webp)`,
            } as React.CSSProperties
          }
        />
      )}

      {vignette > 0 && (
        // z-1: above the persistent shader (fixed, z-0) and the low-perf
        // static image, below the hero text (z-10) — darkens as before.
        <div
          className="absolute inset-0"
          style={{
            zIndex: 1,
            background: `radial-gradient(ellipse 130% 110% at center, transparent 55%, rgba(0,0,0,${vignette}) 100%)`,
          }}
        />
      )}
    </div>
  );
}
