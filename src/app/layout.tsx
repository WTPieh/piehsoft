import type { Metadata } from "next";
import { Instrument_Serif, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://piehsoft.com"),
  title: "PiehSoft — Considered software.",
  description:
    "PiehSoft is a design and engineering studio that rebuilds iPhone apps and the AI systems that power them. Considered, end-to-end. Phoenix, AZ.",
  manifest: "/site.webmanifest",
};

const themeScript = `
(function () {
  try {
    var stored = localStorage.getItem('theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var theme = stored || (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'light');
  }
})();
`;

// Single source of truth for "can this device do the heavy stuff": the
// animated WebGL shader AND the glass backdrop-blur. Runs before first
// paint so there is no flash. Defaults to "low" (solid, no blur) on any
// failure — weak/blocklisted GPUs (which refuse a no-caveat WebGL context)
// and reduced-motion users land here. HeroBackground reads this same flag.
const perfScript = `
(function () {
  try {
    // Manual override for testing/screenshots: localStorage 'pf' = 'high'|'low'.
    var forced = null;
    try { forced = localStorage.getItem('pf'); } catch (e) {}
    if (forced === 'high' || forced === 'low') {
      document.documentElement.setAttribute('data-perf', forced);
      return;
    }
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var ok = false;
    if (!reduced) {
      var c = document.createElement('canvas');
      var a = { failIfMajorPerformanceCaveat: true };
      var gl = c.getContext('webgl2', a) || c.getContext('webgl', a) || c.getContext('experimental-webgl', a);
      ok = !!gl;
    }
    document.documentElement.setAttribute('data-perf', ok ? 'high' : 'low');
  } catch (e) {
    document.documentElement.setAttribute('data-perf', 'low');
  }
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="light"
      data-perf="low"
      className={`${instrumentSerif.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script dangerouslySetInnerHTML={{ __html: perfScript }} />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Header />
        <main className="flex-1 pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
