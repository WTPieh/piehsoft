#!/usr/bin/env node
import { chromium } from "playwright";
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
const viewport = { width: 1440, height: 900 };

const out = resolve(process.cwd(), outArg);
await mkdir(dirname(out), { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport,
  deviceScaleFactor: 2,
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
  const el = await page.$(`#${section}`);
  if (el) {
    await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await el.screenshot({ path: out });
  } else {
    console.error(`Section #${section} not found, falling back to viewport`);
    await page.screenshot({ path: out, fullPage });
  }
} else {
  await page.screenshot({ path: out, fullPage });
}

await browser.close();
console.log(out);
