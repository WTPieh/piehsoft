"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Scroll-reveal: fades + rises its children in as they enter the
 * viewport (one-shot). Reduced-motion safe (renders visible instantly,
 * no transform). Fail-safe: if IntersectionObserver is unavailable or
 * something goes wrong, content still shows (timeout + initial check).
 *
 * Do NOT wrap the hero / bleed-strip region with this — a transitioning
 * transform on an ancestor of a backdrop-filter element makes it a
 * backdrop root in Chrome. Use it only on content sections below.
 */
export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      typeof IntersectionObserver === "undefined"
    ) {
      setShown(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 },
    );
    io.observe(el);
    // Safety net: never leave content hidden if IO never fires.
    const t = setTimeout(() => setShown(true), 1600);
    return () => {
      io.disconnect();
      clearTimeout(t);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal${shown ? " reveal-in" : ""} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
