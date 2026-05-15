"use client";

import { GrainGradient } from "@paper-design/shaders-react";
import { useEffect, useMemo, useState } from "react";

type Theme = "light" | "dark";

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

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

const PALETTE = {
  dark: {
    // 2-light cinematic setup: 2 corners killed (match colorBack), 2 lit.
    colors: ["#060504", "#060504", "#7a4828", "#c87838"],
    colorBack: "#060504",
    intensity: 0.85,
    noise: 0.25,
    softness: 0.5,
  },
  light: {
    colors: ["#f7f2e8", "#f7f2e8", "#d89060", "#a85e30"],
    colorBack: "#f7f2e8",
    intensity: 0.4,
    noise: 0.4,
    softness: 0.5,
  },
} as const;

function hexToRgb(hex: string): [number, number, number] {
  const v = hex.replace("#", "");
  return [
    parseInt(v.slice(0, 2), 16),
    parseInt(v.slice(2, 4), 16),
    parseInt(v.slice(4, 6), 16),
  ];
}
function rgbToHex([r, g, b]: [number, number, number]): string {
  return (
    "#" +
    [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("")
  );
}
function mix(a: string, b: string, t: number): string {
  const [ar, ag, ab] = hexToRgb(a);
  const [br, bg, bb] = hexToRgb(b);
  return rgbToHex([ar + (br - ar) * t, ag + (bg - ag) * t, ab + (bb - ab) * t]);
}
function deriveColors(brand: string, base: string): string[] {
  return [
    mix(base, brand, 0.12),
    mix(base, brand, 0.32),
    mix(base, brand, 0.62),
    brand,
  ];
}

type Props = {
  brandColor?: string;
  shape?: "corners" | "ripple" | "wave" | "dots" | "truchet" | "blob" | "sphere";
  intensity?: number;
  noise?: number;
  softness?: number;
  /** Push corner lights further out by scaling the shader canvas beyond
   *  the section. 0 = canvas matches section; 0.2 = canvas is 140% wider
   *  and 140% taller, centered (so corner lights sit 20% off-screen). */
  inflate?: number;
  /** Strength of the dark vignette on top (0 = none). */
  vignette?: number;
  /** Initial frame (ms) to seed the shader's time uniform. Skips the
   *  "frame 0" composition. Try 8000–30000 for organic-looking starts. */
  frame?: number;
  /** Extend the shader past the section's bottom by N pixels and
   *  fade it out over that distance. Lets the atmosphere bleed into
   *  the next section. Requires the section to use `overflow-x-clip`
   *  (or `overflow: visible`) so vertical overflow shows. */
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
}: Props = {}) {
  const theme = useTheme();
  const reduced = useReducedMotion();
  const base = PALETTE[theme];

  const colors = useMemo(
    () =>
      brandColor ? deriveColors(brandColor, base.colorBack) : [...base.colors],
    [brandColor, base.colors, base.colorBack],
  );

  const insetPct = `-${inflate * 100}%`;
  const wrapperStyle: React.CSSProperties =
    bleedBelow > 0
      ? {
          bottom: `-${bleedBelow}px`,
          maskImage: `linear-gradient(to bottom, black 0%, black calc(100% - ${bleedBelow}px), transparent 100%)`,
          WebkitMaskImage: `linear-gradient(to bottom, black 0%, black calc(100% - ${bleedBelow}px), transparent 100%)`,
        }
      : {};

  return (
    <div
      className={
        bleedBelow > 0
          ? "absolute top-0 left-0 right-0 overflow-hidden z-0 pointer-events-none"
          : "absolute inset-0 overflow-hidden z-0 pointer-events-none"
      }
      style={wrapperStyle}
    >
      <GrainGradient
        colors={colors}
        colorBack={base.colorBack}
        softness={softness ?? base.softness}
        intensity={intensity ?? base.intensity}
        noise={noise ?? base.noise}
        shape={shape}
        speed={reduced ? 0 : 0.15}
        frame={frame}
        style={{
          position: "absolute",
          top: insetPct,
          left: insetPct,
          right: insetPct,
          bottom: insetPct,
        }}
      />
      {vignette > 0 && (
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 130% 110% at center, transparent 55%, rgba(0,0,0,${vignette}) 100%)`,
          }}
        />
      )}
    </div>
  );
}
