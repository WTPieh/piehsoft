"use client";

import { useEffect, useRef, useState } from "react";

type Item = { id: string; label: string };

export function SectionPillNav({ items }: { items: Item[] }) {
  const [active, setActive] = useState(items[0]?.id ?? "");
  const [hidden, setHidden] = useState(true);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: 0 }
    );

    items.forEach((it) => {
      const el = document.getElementById(it.id);
      if (el) observer.observe(el);
    });

    const onScroll = () => setHidden(window.scrollY < 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [items]);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const pill = scroller.querySelector<HTMLAnchorElement>(
      `a[data-id="${active}"]`
    );
    if (!pill) return;
    const target =
      pill.offsetLeft - scroller.clientWidth / 2 + pill.clientWidth / 2;
    scroller.scrollTo({ left: target, behavior: "smooth" });
  }, [active]);

  return (
    <div
      className={`sticky top-20 z-40 mx-auto mb-6 w-fit max-w-[calc(100%-2rem)] transition-opacity duration-300 ${
        hidden ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <nav
        ref={scrollerRef}
        className="flex items-center gap-1 rounded-full px-2 py-1.5 overflow-x-auto max-w-[calc(100vw-2rem)] no-scrollbar"
        style={{
          // High-perf: translucent glass + blur. Low-perf: solid pill, no
          // backdrop-filter (a sticky blur repaints every scroll frame).
          // Driven by the shared data-perf flag.
          background: "var(--pill-bg)",
          backdropFilter: "var(--glass-filter)",
          WebkitBackdropFilter: "var(--glass-filter)",
          /* Refraction rim — top specular highlight following the curve,
             matching the header's glass-rim treatment. */
          boxShadow:
            "inset 0 1px 0 var(--glass-rim-strong), inset 0 -1px 0 rgba(0,0,0,0.08), 0 6px 24px rgba(0,0,0,0.08)",
        }}
        aria-label="Case study sections"
      >
        {items.map((item) => {
          const isActive = item.id === active;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              data-id={item.id}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
                isActive
                  ? "bg-foreground text-background"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {item.label}
            </a>
          );
        })}
      </nav>
    </div>
  );
}
