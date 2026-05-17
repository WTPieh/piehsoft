"use client";

import { useEffect, useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import type Lenis from "lenis";

const useIso =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * On a route change, land at the TOP of the new page — instantly, and
 * Lenis-aware. Without this, Lenis holds the previous scroll offset
 * across navigation (Next's scroll-to-top doesn't reach Lenis's
 * virtualized scroll), so a project page would open mid-content. We
 * deliberately do NOT animate this (animating the page you're leaving
 * felt weird); the smooth part is the NEW page's .page-enter rise+fade.
 * Runs in a layout effect so it happens before the new route paints —
 * no flash of the old scroll position.
 */
export function ScrollTopOnRouteChange() {
  const pathname = usePathname();
  useIso(() => {
    const lenis = (window as Window & { __lenis?: Lenis }).__lenis;
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
