#!/usr/bin/env node
import { chromium } from "playwright";

const url = process.argv[2] ?? "http://localhost:3100/work/hornscore";

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
});
const page = await ctx.newPage();

await page.goto(url, { waitUntil: "networkidle" });
await page.waitForTimeout(500);

const offenders = await page.evaluate(() => {
  const docWidth = document.documentElement.clientWidth;
  const out = [];
  const all = document.querySelectorAll("*");
  for (const el of all) {
    const rect = el.getBoundingClientRect();
    if (rect.right > docWidth + 1) {
      const path = [];
      let cur = el;
      while (cur && cur !== document.body && path.length < 6) {
        const tag = cur.tagName.toLowerCase();
        const cls = (cur.className?.toString?.() || "")
          .split(" ")
          .filter(Boolean)
          .slice(0, 3)
          .join(".");
        path.unshift(cls ? `${tag}.${cls}` : tag);
        cur = cur.parentElement;
      }
      out.push({
        path: path.join(" > "),
        right: Math.round(rect.right),
        width: Math.round(rect.width),
        text: (el.textContent || "").trim().slice(0, 60),
      });
    }
  }
  return { docWidth, count: out.length, top: out.slice(0, 12) };
});

console.log(JSON.stringify(offenders, null, 2));
await browser.close();
