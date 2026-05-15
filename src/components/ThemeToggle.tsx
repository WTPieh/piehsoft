"use client";

import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const current = (document.documentElement.getAttribute("data-theme") as
      | "light"
      | "dark") || "light";
    setTheme(current);
    setMounted(true);
  }, []);

  function toggle() {
    const next = theme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    setTheme(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle color theme"
      className="font-mono-tag text-muted hover:text-foreground transition-colors px-2 py-1 -mr-2"
    >
      {mounted ? (theme === "light" ? "Dark" : "Light") : " "}
    </button>
  );
}
