#!/usr/bin/env node
import { chromium, devices } from "playwright";
import { mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const args = process.argv.slice(2);
const flagIdx = args.findIndex((a) => a.startsWith("--"));
const positional = flagIdx === -1 ? args : args.slice(0, flagIdx);
const flags = flagIdx === -1 ? [] : args.slice(flagIdx);

const url = positional[0] ?? "http://localhost:3100/work/hornscore";
const outArg = positional[1] ?? `tmp/shot-${Date.now()}.png`;
const fullPage = flags.includes("--full");
const theme = flags.includes("--light") ? "light" : "dark";
const sectionFlag = flags.find((f) => f.startsWith("--section="));
const section = sectionFlag ? sectionFlag.slice("--section=".length) : null;
const isMobile = flags.includes("--mobile");
const viewportMode = flags.includes("--viewport");

const desktopViewport = { width: 1440, height: 900 };
const mobileViewport = { width: 390, height: 844 };

const out = resolve(process.cwd(), outArg);
await mkdir(dirname(out), { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: isMobile ? mobileViewport : desktopViewport,
  deviceScaleFactor: 2,
  isMobile,
  hasTouch: isMobile,
  userAgent: isMobile
    ? devices["iPhone 14 Pro"].userAgent
    : undefined,
  colorScheme: theme === "light" ? "light" : "dark",
});
const page = await ctx.newPage();

await page.addInitScript((t) => {
  try {
    localStorage.setItem("theme", t);
  } catch {}
}, theme);

await page.goto(url, { waitUntil: "networkidle" });
await page.waitForTimeout(400);

if (section) {
  if (viewportMode) {
    await page.evaluate(
      (id) => document.getElementById(id)?.scrollIntoView({ block: "start" }),
      section
    );
    await page.waitForTimeout(400);
    await page.screenshot({ path: out });
  } else {
    const el = await page.$(`#${section}`);
    if (el) {
      await el.scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);
      await el.screenshot({ path: out });
    } else {
      console.error(`Section #${section} not found, falling back to viewport`);
      await page.screenshot({ path: out, fullPage });
    }
  }
} else {
  await page.screenshot({ path: out, fullPage });
}

// Report page dimensions vs viewport — useful for catching horizontal overflow
const dims = await page.evaluate(() => ({
  bodyWidth: document.body.scrollWidth,
  htmlWidth: document.documentElement.scrollWidth,
  viewport: window.innerWidth,
}));
console.log(`viewport=${dims.viewport} body=${dims.bodyWidth} html=${dims.htmlWidth}`);

await browser.close();
console.log(out);
