import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto max-w-6xl px-6 sm:px-10 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="group flex items-baseline gap-2 hover:opacity-70 transition-opacity"
        >
          <span className="font-display text-xl tracking-tight">PiehSoft</span>
          <span className="font-mono-tag text-subtle">by William Pieh</span>
        </Link>
        <nav className="flex items-center gap-7 font-mono-tag text-muted">
          <Link href="/#work" className="hover:text-foreground transition-colors">
            Work
          </Link>
          <Link href="/#about" className="hover:text-foreground transition-colors">
            About
          </Link>
          <Link href="/#contact" className="hover:text-foreground transition-colors">
            Contact
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
