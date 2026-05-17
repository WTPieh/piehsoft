// Shared hero palette + color math. Used by the persistent shader
// (HeroShader) and the per-page static fallback (HeroBackground).

export type Theme = "light" | "dark";

export const PALETTE = {
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
export function deriveColors(brand: string, base: string): string[] {
  return [
    mix(base, brand, 0.12),
    mix(base, brand, 0.32),
    mix(base, brand, 0.62),
    brand,
  ];
}
