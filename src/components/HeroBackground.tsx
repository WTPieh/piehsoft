"use client";

import { GrainGradient } from "@paper-design/shaders-react";
import {
  Component,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

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

/**
 * Whether this device should run the live WebGL shader. Reads the shared
 * `data-perf` flag set pre-paint in layout.tsx (same probe that gates the
 * glass backdrop-blur), so the shader and the glass always flip together.
 * Starts `false` so SSR / static export and the first client paint render
 * the safe image; upgrades to the shader after mount if perf is "high".
 */
function useShaderCapable(): boolean {
  const [capable, setCapable] = useState(false);
  useEffect(() => {
    setCapable(document.documentElement.dataset.perf === "high");
  }, []);
  return capable;
}

/**
 * True while the element is on (or near) screen. Used to *pause* the shader
 * (speed 0) when the hero scrolls away — NOT to unmount it. Unmounting
 * destroys the WebGL context; scrolling back recreates it, recompiling
 * shaders and churning ~33MB contexts that aren't GC'd promptly (and
 * eventually hits the browser's context limit). One persistent context,
 * animation paused off-screen, is the correct trade.
 */
function useOnScreen(ref: React.RefObject<HTMLElement | null>): boolean {
  const [onScreen, setOnScreen] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => setOnScreen(entry.isIntersecting),
      { rootMargin: "200px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
  return onScreen;
}

/** If the shader library throws (context creation, lost context, unsupported
 *  extension), swallow it so the static image underneath stays visible
 *  instead of the whole page going blank. */
class ShaderBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
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
  /** Basename of the static fallback screenshot (per-theme `.jpg` in
   *  /public). The homepage corners hero uses the default; each case
   *  study passes its own so low-perf devices get the matching wave. */
  fallbackKey?: string;
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
  fallbackKey = "hero",
}: Props = {}) {
  const theme = useTheme();
  const capable = useShaderCapable();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const onScreen = useOnScreen(wrapperRef);
  const base = PALETTE[theme];

  const colors = useMemo(
    () =>
      brandColor ? deriveColors(brandColor, base.colorBack) : [...base.colors],
    [brandColor, base.colors, base.colorBack],
  );

  const insetPct = `-${inflate * 100}%`;
  // Only bleed into the next section on high-perf (glass atmosphere by
  // design). On low-perf: no mask at all — the image ends at the hero
  // bounds, the section line handles the seam, solid bg immediately.
  const bleeding = capable && bleedBelow > 0;
  const wrapperStyle: React.CSSProperties = bleeding
    ? {
        bottom: `-${bleedBelow}px`,
        maskImage: `linear-gradient(to bottom, black 0%, black calc(100% - ${bleedBelow}px), transparent 100%)`,
        WebkitMaskImage: `linear-gradient(to bottom, black 0%, black calc(100% - ${bleedBelow}px), transparent 100%)`,
      }
    : {};

  // Mount the shader once when the device can handle it, and keep it mounted
  // for the whole session — toggling `speed` (below) pauses it off-screen
  // without destroying/recreating the WebGL context.

  return (
    <div
      ref={wrapperRef}
      data-hero-bg
      className={
        bleeding
          ? "absolute top-0 left-0 right-0 overflow-hidden z-0 pointer-events-none"
          : "absolute inset-0 overflow-hidden z-0 pointer-events-none"
      }
      style={wrapperStyle}
    >
      {/* Static fallback — a real screenshot of the shader, per theme.
          Driven by CSS keyed on [data-theme] (set pre-paint by the inline
          script), NOT React state — so the correct-theme image is fetched
          on the very first paint and there is no light→dark swap. Only the
          active theme's image is ever requested. Always present underneath
          so the hero is never blank, even mid-frame or if the shader
          throws. */}
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

      {capable && (
        <ShaderBoundary>
          <div className="shader-fade absolute inset-0">
            <GrainGradient
              colors={colors}
              colorBack={base.colorBack}
              softness={softness ?? base.softness}
              intensity={intensity ?? base.intensity}
              noise={noise ?? base.noise}
              shape={shape}
              speed={onScreen ? 0.15 : 0}
              frame={frame}
              style={{
                position: "absolute",
                top: insetPct,
                left: insetPct,
                right: insetPct,
                bottom: insetPct,
              }}
            />
          </div>
        </ShaderBoundary>
      )}

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
