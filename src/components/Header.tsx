import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto max-w-6xl px-5 sm:px-10 h-16 flex items-center justify-between gap-4">
        <Link
          href="/"
          className="group flex items-baseline gap-2 hover:opacity-70 transition-opacity min-w-0"
        >
          <span className="font-display text-xl tracking-tight whitespace-nowrap">
            PiehSoft
          </span>
          <span className="hidden md:inline font-mono-tag text-subtle whitespace-nowrap">
            by William Pieh
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
    </header>
  );
}
