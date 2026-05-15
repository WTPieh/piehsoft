"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Props = {
  beforeLabel?: string;
  afterLabel?: string;
  beforeContent: React.ReactNode;
  afterContent: React.ReactNode;
  aspect?: string;
};

export function BeforeAfterSlider({
  beforeLabel = "Before",
  afterLabel = "After",
  beforeContent,
  afterContent,
  aspect = "16 / 10",
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pct, setPct] = useState(50);
  const dragging = useRef(false);

  const setFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const next = ((clientX - rect.left) / rect.width) * 100;
    setPct(Math.max(0, Math.min(100, next)));
  }, []);

  useEffect(() => {
    function onMove(e: PointerEvent) {
      if (!dragging.current) return;
      setFromClientX(e.clientX);
    }
    function onUp() {
      dragging.current = false;
    }
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [setFromClientX]);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-md border border-border bg-surface-2 select-none"
      style={{ aspectRatio: aspect }}
      onPointerDown={(e) => {
        dragging.current = true;
        setFromClientX(e.clientX);
      }}
    >
      <div className="absolute inset-0">{afterContent}</div>
      <div
        className="absolute inset-y-0 left-0 overflow-hidden"
        style={{ width: `${pct}%` }}
      >
        <div
          className="h-full"
          style={{ width: containerRef.current?.clientWidth ?? "100%" }}
        >
          {beforeContent}
        </div>
      </div>

      <span className="absolute top-3 left-3 font-mono-tag bg-foreground/85 text-background px-2 py-1 rounded">
        {beforeLabel}
      </span>
      <span className="absolute top-3 right-3 font-mono-tag bg-foreground/85 text-background px-2 py-1 rounded">
        {afterLabel}
      </span>

      <div
        className="absolute inset-y-0 w-px bg-foreground/80 pointer-events-none"
        style={{ left: `${pct}%` }}
      />
      <div
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-background border border-foreground shadow-md flex items-center justify-center cursor-ew-resize"
        style={{ left: `${pct}%` }}
        role="slider"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pct)}
        aria-label="Before/after comparison slider"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M5 3L2 7l3 4M9 3l3 4-3 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}
