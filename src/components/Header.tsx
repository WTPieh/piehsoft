import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        // High-perf: translucent glass + blur (original design, meshes with
        // the shader). Low-perf: solid full background, no backdrop-filter
        // (a fixed blur re-snapshots the page every scroll frame on weak
        // GPUs). Driven by the shared data-perf flag.
        background: "var(--header-bg)",
        backdropFilter: "var(--glass-filter)",
        WebkitBackdropFilter: "var(--glass-filter)",
      }}
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-10 h-16 flex items-center justify-between gap-4">
        <Link
          href="/"
          className="group flex items-baseline gap-2 hover:opacity-70 transition-opacity min-w-0"
        >
          <span className="font-display text-xl tracking-tight whitespace-nowrap">
            PiehSoft
          </span>
          <span className="hidden md:inline font-display italic text-sm text-muted whitespace-nowrap">
            Considered software.
          </span>
        </Link>
        <nav className="flex items-center gap-4 sm:gap-7 font-mono-tag text-muted">
          <Link
            href="/#work"
            className="hover:text-foreground transition-colors"
          >
            Work
          </Link>
          <Link
            href="/#about"
            className="hover:text-foreground transition-colors"
          >
            About
          </Link>
          <Link
            href="/#contact"
            className="hidden sm:inline hover:text-foreground transition-colors"
          >
            Contact
          </Link>
          <ThemeToggle />
        </nav>
      </div>
      {/* Refraction rim — theme-aware specular hairline at the glass edge */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-[2px] pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, transparent 0%, var(--glass-rim-mid) 20%, var(--glass-rim-strong) 50%, var(--glass-rim-mid) 80%, transparent 100%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-[2px] h-[6px] pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, var(--glass-rim-bloom) 0%, transparent 100%)",
          filter: "blur(2px)",
        }}
      />
    </header>
  );
}
