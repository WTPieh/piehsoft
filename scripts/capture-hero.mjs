#!/usr/bin/env node
// Captures the rendered GrainGradient hero background in light + dark as
// static fallback images (background only, no foreground text). These are
// served to devices that can't run the WebGL shader (weak GPUs,
// reduced-motion, lost context) so the page never blanks.
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import sharp from "sharp";

const origin = process.argv[2] ?? "http://localhost:3100";
const outDir = resolve(process.cwd(), "public");
await mkdir(outDir, { recursive: true });

// path → fallback basename. Must match HeroBackground's `fallbackKey`.
const TARGETS = [
  { path: "/", key: "hero" },
  { path: "/work/hornscore", key: "hero-hornscore" },
  { path: "/work/halo-plus", key: "hero-halo-plus" },
  { path: "/work/lead-generation-pipeline", key: "hero-lead-generation-pipeline" },
];

const browser = await chromium.launch();

for (const { path, key } of TARGETS)
for (const theme of ["light", "dark"]) {
  const ctx = await browser.newContext({
    viewport: { width: 1728, height: 1180 },
    deviceScaleFactor: 2,
    colorScheme: theme,
  });
  const page = await ctx.newPage();
  await page.addInitScript((t) => {
    try {
      localStorage.setItem("theme", t);
      // Force the shader on so we can screenshot it even though headless
      // Chrome is software-rendered (would otherwise be data-perf="low").
      localStorage.setItem("pf", "high");
    } catch {}
    document.documentElement.setAttribute("data-theme", t);
  }, theme);

  await page.goto(origin + path, { waitUntil: "networkidle" });
  await page.waitForSelector("canvas", { timeout: 20000 });
  // Software WebGL (headless) is slow to compile; give it room to settle.
  await page.waitForTimeout(3500);

  // Hide every foreground (z-10) layer so only the shader background remains,
  // and measure the hero section box to clip to.
  const clip = await page.evaluate(() => {
    document
      .querySelectorAll("header")
      .forEach((el) => (el.style.visibility = "hidden"));
    // Hide everything in the hero section except the shader background
    // wrapper, so the screenshot is background-only (no title, mockups,
    // links — those render on top of this image at runtime).
    const section = document.querySelector("section");
    const bg = section.querySelector("[data-hero-bg]");
    section.querySelectorAll(":scope > *").forEach((el) => {
      if (el !== bg) el.style.visibility = "hidden";
    });
    const r = section.getBoundingClientRect();
    return { x: 0, y: 0, width: window.innerWidth, height: Math.ceil(r.bottom) };
  });
  await page.waitForTimeout(150);

  // Lossless PNG capture (DSR 2 → ~2x pixels), then a high-quality WebP.
  // WebP keeps the fine grain noise far better than JPEG at a fraction
  // of the size of PNG.
  const png = await page.screenshot({ type: "png", clip });
  const out = resolve(outDir, `${key}-${theme}.webp`);
  await sharp(png)
    .webp({ quality: 92, effort: 6, smartSubsample: true })
    .toFile(out);
  console.log(`wrote ${key}-${theme}.webp (${clip.width}x${clip.height} @2x)`);
  await ctx.close();
}

await browser.close();
