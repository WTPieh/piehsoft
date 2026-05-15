# PiehSoft

The work portfolio for [PiehSoft](https://piehsoft.com) — William Pieh's studio.
A more enterprise-readable companion to the designer portfolio at
[williampieh.com](https://williampieh.com).

Native iOS & AI systems, designed and built end-to-end.

## Stack

- Next.js 16 (App Router) — static export
- React 19, TypeScript, Tailwind 4
- Hosted on Cloudflare Pages
- Images served from R2 via Cloudflare Image Transformations
  (`media.williampieh.com/cdn-cgi/image/…`)
- Typography: Instrument Serif (display) + Inter (body) + JetBrains Mono (tags)

## Develop

```bash
npm install
npm run dev          # http://localhost:3000
```

Visual iteration via Playwright:

```bash
npm run shot -- http://localhost:3000/work/hornscore tmp/shot.png --mobile --full
npm run shot -- http://localhost:3000/ tmp/home.png --light
```

Flags: `--mobile`, `--full`, `--light`, `--section=<id>`, `--viewport`. The script
prints `viewport=W body=W html=W` after each shot — useful for catching
horizontal-overflow regressions early.

For overflow diagnosis:

```bash
node scripts/find-overflow.mjs http://localhost:3000/work/hornscore
```

## Build & deploy

```bash
npm run build:static       # produces out/ for static hosting
npm run deploy:preview     # builds + deploys to Cloudflare Pages preview branch
npm run deploy             # builds + deploys to production
```

Cloudflare Pages auto-deploys on push to `main`; the `deploy` scripts are a
manual fallback.

Static export is gated on `STATIC_EXPORT=1` so `next dev` and `next build`
without the flag work normally for local iteration.

## Content

All case-study content lives in `src/lib/projects.ts`. Each project has a
discriminated `sections` array; each section's `kind` determines its layout:

- `prose` — heading + body, 4/8 column split
- `receipts` — mono-font audit panel (e.g. legacy findings)
- `scoreboard` — large-number stat grid
- `code` — Swift/JS code excerpt with caption + technical detail
- `tokens` — full brand-guide card (logo strip + color/type/spacing/totals)
- `stack` — labeled tech with real brand icons (Simple Icons)
- `gallery` — screenshot mosaic
- `image-prose` — image + prose side-by-side
- `cta` — closing call-to-action card

Add a new section kind by extending the `CaseSection` union in `projects.ts`
and adding a `case` branch in `src/components/CaseStudySection.tsx`.

## Contact

william@piehsoft.com · (928) 963-4919
