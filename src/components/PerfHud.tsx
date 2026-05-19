"use client";

import { useEffect, useRef, useState } from "react";
import { usePerfTier } from "@/lib/perfTier";

// On-device perf readout. NOT shipped by default — opt in per device so
// it works on the deployed build on the actual phone (where the bug
// lives), not just local dev:
//
//   localStorage.perfhud = '1'   then reload   (perfhud = '' to hide)
//
// Shows the live render tier (reflects a PerfProbe demotion in real
// time) and a rolling FPS counter you can watch while scrolling. The
// tier buttons set localStorage.pf and reload so you can A/B
// high/medium/low on the device by hand.

function useEnabled() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    try {
      setOn(localStorage.getItem("perfhud") === "1");
    } catch {}
  }, []);
  return on;
}

export function PerfHud() {
  const enabled = useEnabled();
  const tier = usePerfTier();
  const [fps, setFps] = useState(0);
  const forced =
    typeof window !== "undefined"
      ? (() => {
          try {
            return localStorage.getItem("pf");
          } catch {
            return null;
          }
        })()
      : null;
  const frames = useRef<number[]>([]);

  useEffect(() => {
    if (!enabled) return;
    let raf = 0;
    let last = 0;
    const tick = (t: number) => {
      if (last) {
        const arr = frames.current;
        arr.push(t - last);
        if (arr.length > 30) arr.shift();
        const avg = arr.reduce((a, b) => a + b, 0) / arr.length;
        setFps(Math.round(1000 / avg));
      }
      last = t;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [enabled]);

  if (!enabled) return null;

  const set = (v: string | null) => {
    try {
      if (v) localStorage.setItem("pf", v);
      else localStorage.removeItem("pf");
    } catch {}
    location.reload();
  };

  const tierColor =
    tier === "high" ? "#4ade80" : tier === "medium" ? "#fbbf24" : "#f87171";

  return (
    <div
      style={{
        position: "fixed",
        bottom: 8,
        left: 8,
        zIndex: 99999,
        font: "11px ui-monospace, Menlo, monospace",
        background: "rgba(0,0,0,0.78)",
        color: "#fff",
        padding: "8px 10px",
        borderRadius: 8,
        lineHeight: 1.5,
        pointerEvents: "auto",
        userSelect: "none",
        backdropFilter: "none",
      }}
    >
      <div>
        tier <strong style={{ color: tierColor }}>{tier}</strong>
        {forced ? <span style={{ opacity: 0.6 }}> (forced)</span> : null}
      </div>
      <div>
        fps{" "}
        <strong style={{ color: fps && fps < 50 ? "#f87171" : "#4ade80" }}>
          {fps || "…"}
        </strong>
      </div>
      <div style={{ marginTop: 5, display: "flex", gap: 4 }}>
        {(["high", "medium", "low"] as const).map((v) => (
          <button
            key={v}
            onClick={() => set(v)}
            style={{
              flex: 1,
              padding: "3px 6px",
              fontSize: 10,
              border: "1px solid #555",
              borderRadius: 4,
              background: forced === v ? "#fff" : "transparent",
              color: forced === v ? "#000" : "#fff",
              cursor: "pointer",
            }}
          >
            {v[0].toUpperCase()}
          </button>
        ))}
        <button
          onClick={() => set(null)}
          style={{
            flex: 1,
            padding: "3px 6px",
            fontSize: 10,
            border: "1px solid #555",
            borderRadius: 4,
            background: !forced ? "#fff" : "transparent",
            color: !forced ? "#000" : "#fff",
            cursor: "pointer",
          }}
        >
          Auto
        </button>
      </div>
    </div>
  );
}
