"use client";

import { GrainGradient } from "@paper-design/shaders-react";
import {
  Component,
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { PALETTE, deriveColors, type Theme } from "@/lib/heroPalette";

// Runs before the browser paints (client). Lets the persistent canvas
// decide shader-vs-nothing before a frame is shown.
const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export type HeroParams = {
  shape: "corners" | "ripple" | "wave" | "dots" | "truchet" | "blob" | "sphere";
  brandColor?: string;
  intensity?: number;
  noise?: number;
  softness?: number;
  inflate: number;
  bleedBelow: number;
  frame: number;
  fallbackKey: string;
};

// The page publishes its hero params here; the ONE persistent shader in
// the layout reads them and morphs. The shader is never unmounted on
// navigation (that WebGL teardown/rebuild was the route-transition flash
// we are eliminating) — only its props change.
const HeroParamsContext = createContext<(p: HeroParams) => void>(() => {});

export function useSetHeroParams(params: HeroParams) {
  const set = useContext(HeroParamsContext);
  // Layout effect so the new route's params are applied before paint.
  useIsoLayoutEffect(() => {
    set(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    params.shape,
    params.brandColor,
    params.intensity,
    params.noise,
    params.softness,
    params.inflate,
    params.bleedBelow,
    params.frame,
    params.fallbackKey,
  ]);
}

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

/**
 * The single persistent shader. Lives in the root layout, mounts its
 * WebGL context ONCE, and stays mounted for the whole session — across
 * every route navigation. It is `position: fixed` but, every animation
 * frame, it tracks the current page's `[data-hero-anchor]` box (its
 * top/height) so it visually scrolls *with* the hero section exactly
 * like the old in-section absolute element did — without the context
 * ever being destroyed and rebuilt (that teardown was the nav flash).
 */
function PersistentHeroCanvas({ params }: { params: HeroParams | null }) {
  const theme = useTheme();
  const capable = useShaderCapable();
  const containerRef = useRef<HTMLDivElement>(null);
  const metricsRef = useRef({ docTop: 0, height: 0, found: false });
  const [onScreen, setOnScreen] = useState(true);
  const base = PALETTE[theme];

  const colors = useMemo(
    () =>
      params?.brandColor
        ? deriveColors(params.brandColor, base.colorBack)
        : [...base.colors],
    [params?.brandColor, base.colors, base.colorBack],
  );

  // MEASURE the hero anchor (the only getBoundingClientRect — a forced
  // reflow) ONLY on route change / resize / layout settle, never per
  // frame. Per-frame reflow was the scroll lag. docTop = the anchor's
  // position in the document (scroll-independent); height/opacity are
  // written here, not in the loop.
  useEffect(() => {
    if (!capable) return;
    const measure = () => {
      const el = containerRef.current;
      const anchor = document.querySelector<HTMLElement>("[data-hero-anchor]");
      if (!el) return;
      if (!anchor) {
        metricsRef.current.found = false;
        el.style.opacity = "0";
        return;
      }
      const r = anchor.getBoundingClientRect();
      metricsRef.current = {
        docTop: r.top + window.scrollY,
        height: r.height,
        found: true,
      };
      el.style.height = `${r.height}px`;
      el.style.opacity = "1";
    };
    measure();
    // Re-measure after fonts/images/layout settle.
    const t1 = setTimeout(measure, 60);
    const t2 = setTimeout(measure, 300);
    const anchor = document.querySelector<HTMLElement>("[data-hero-anchor]");
    const ro = new ResizeObserver(measure);
    if (anchor) ro.observe(anchor);
    window.addEventListener("resize", measure);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [capable, params]);

  // Per-frame: REFLOW-FREE. Only reads window.scrollY (cached, no
  // layout) and writes transform (composited, no layout). This is what
  // makes the persistent canvas scroll with the hero without the jank.
  useEffect(() => {
    if (!capable) return;
    let raf = 0;
    let lastVisible = true;
    const tick = () => {
      const el = containerRef.current;
      const m = metricsRef.current;
      if (el && m.found) {
        const top = m.docTop - window.scrollY;
        el.style.transform = `translate3d(0, ${top}px, 0)`;
        const visible =
          top + m.height > -200 && top < window.innerHeight + 200;
        if (visible !== lastVisible) {
          lastVisible = visible;
          setOnScreen(visible);
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [capable]);

  if (!capable || !params) return null;

  const inset = `-${params.inflate * 100}%`;
  const mask =
    params.bleedBelow > 0
      ? `linear-gradient(to bottom, black 0%, black calc(100% - ${params.bleedBelow}px), transparent 100%)`
      : undefined;

  return (
    <div
      ref={containerRef}
      data-hero-canvas
      aria-hidden
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        top: 0,
        height: 0,
        // z-0 (NOT -1: a negative z-index fixed child hides behind the
        // opaque body background). Same layer the original in-section
        // shader used. Hero content is explicitly z-10 (both pages), so
        // it sits above this; the canvas is clipped to the hero box so
        // it never shows behind other sections.
        zIndex: 0,
        overflow: "hidden",
        pointerEvents: "none",
        willChange: "transform",
        maskImage: mask,
        WebkitMaskImage: mask,
      }}
    >
      {/* Static screenshot of the shader, BEHIND the canvas. Safety net:
          if WebGL is slow or fails to init (common on first load,
          esp. Safari/Private — works on refresh), the hero shows this
          instead of going blank. The shader paints over it once ready
          (it's a pixel-exact screenshot, so no visible swap). */}
      <div
        className="hero-fallback absolute inset-0 h-full w-full"
        style={
          {
            backgroundColor: base.colorBack,
            "--fb-light": `url(/${params.fallbackKey}-light.webp)`,
            "--fb-dark": `url(/${params.fallbackKey}-dark.webp)`,
          } as React.CSSProperties
        }
      />
      <ShaderBoundary>
        <GrainGradient
          colors={colors}
          colorBack={base.colorBack}
          softness={params.softness ?? base.softness}
          intensity={params.intensity ?? base.intensity}
          noise={params.noise ?? base.noise}
          shape={params.shape}
          speed={onScreen ? 0.15 : 0}
          frame={params.frame}
          style={{
            position: "absolute",
            top: inset,
            left: inset,
            right: inset,
            bottom: inset,
          }}
        />
      </ShaderBoundary>
    </div>
  );
}

export function HeroShaderProvider({ children }: { children: ReactNode }) {
  // Keep the LAST params even across the brief unmount→mount gap on a
  // route change, so the shader never blanks between pages.
  const [params, setParams] = useState<HeroParams | null>(null);
  return (
    <HeroParamsContext.Provider value={setParams}>
      {/* BEFORE children: template.tsx's .page-enter opacity animation
          wraps the page in a stacking context (flattening the hero's
          z-10). Painting the canvas first (earlier in DOM, same z-0
          level) keeps it behind that whole content stacking context. */}
      <PersistentHeroCanvas params={params} />
      {children}
    </HeroParamsContext.Provider>
  );
}
