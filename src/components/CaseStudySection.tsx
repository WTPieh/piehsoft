import Image from "next/image";
import {
  SiApple,
  SiFacebook,
  SiFirebase,
  SiGoogle,
  SiGooglecloud,
  SiRevenuecat,
  SiSentry,
} from "@icons-pack/react-simple-icons";
import type { CaseSection } from "@/lib/projects";
import { Reveal } from "@/components/Reveal";
import { BeforeAfterComparison } from "@/components/BeforeAfterComparison";

const BRAND_ICONS: Record<
  string,
  { Icon: React.ComponentType<{ size?: number; color?: string }>; color: string }
> = {
  Firebase: { Icon: SiFirebase, color: "#FFCA28" },
  "Cloud Functions": { Icon: SiGooglecloud, color: "#4285F4" },
  RevenueCat: { Icon: SiRevenuecat, color: "#F23F3D" },
  Sentry: { Icon: SiSentry, color: "#B14CE8" },
  "Sign in with Apple": { Icon: SiApple, color: "currentColor" },
  Google: { Icon: SiGoogle, color: "#4285F4" },
  Facebook: { Icon: SiFacebook, color: "#1877F2" },
};

const BRAND_MONOGRAMS: Record<string, { letter: string; color: string }> = {
  Amplitude: { letter: "A", color: "#1E61F0" },
};

export function CaseStudySection({ section }: { section: CaseSection }) {
  return (
    <section
      id={section.id}
      className="border-t border-border scroll-mt-40 py-20 sm:py-24"
    >
      <Reveal className="mx-auto max-w-6xl px-6 sm:px-10">
        {renderBody(section)}
      </Reveal>
    </section>
  );
}

function SectionHeader({
  label,
  heading,
  lede,
  align = "left",
}: {
  label?: string;
  heading: string;
  lede?: string;
  align?: "left" | "center";
}) {
  return (
    <div
      className={`max-w-3xl ${align === "center" ? "mx-auto text-center" : ""}`}
    >
      {label && (
        <p className="font-mono-tag text-subtle mb-4">{label}</p>
      )}
      <h2 className="font-display text-4xl sm:text-5xl tracking-tight leading-[1.05]">
        {heading}
      </h2>
      {lede && (
        <p className="mt-5 text-lg text-muted leading-relaxed">{lede}</p>
      )}
    </div>
  );
}

function renderBody(section: CaseSection) {
  switch (section.kind) {
    case "prose":
      return (
        <div className="grid grid-cols-12 gap-y-10 sm:gap-x-10">
          <div className="col-span-12 sm:col-span-4">
            <SectionHeader label={section.label} heading={section.heading} />
          </div>
          <div className="col-span-12 sm:col-span-7 sm:col-start-6 space-y-5 text-lg leading-relaxed text-foreground/90">
            {section.body.split("\n\n").map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>
      );

    case "receipts": {
      const severity = (s?: "critical" | "high" | "note") =>
        s === "critical"
          ? "border-l-2 border-l-red-500/70 pl-4"
          : s === "high"
            ? "border-l-2 border-l-amber-400/60 pl-4"
            : "pl-5";
      const badge = (s?: "critical" | "high" | "note") =>
        s === "critical" ? (
          <span className="font-mono-tag text-red-400 ml-3">CRITICAL</span>
        ) : s === "high" ? (
          <span className="font-mono-tag text-amber-400 ml-3">HIGH</span>
        ) : null;
      return (
        <div className="space-y-12">
          <SectionHeader
            label={section.label}
            heading={section.heading}
            lede={section.lede}
          />
          <div className="rounded-md border border-border-strong bg-surface-2/70 p-6 sm:p-10 font-mono text-[15px]">
            <div className="font-mono-tag text-subtle mb-6">
              audit findings · week 01
            </div>
            <ul className="space-y-4">
              {section.findings.map((f, i) => (
                <li
                  key={i}
                  className={`flex items-start ${severity(f.severity)} text-foreground/90`}
                >
                  <span className="text-subtle mr-3 select-none">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{f.item}</span>
                  {badge(f.severity)}
                </li>
              ))}
            </ul>
            {section.callout && (
              <div className="mt-8 border-t border-border pt-6">
                <div className="font-mono-tag text-red-400 mb-2">
                  → {section.callout.title}
                </div>
                <p className="text-foreground/90 leading-relaxed font-sans">
                  {section.callout.body}
                </p>
              </div>
            )}
          </div>
        </div>
      );
    }

    case "scoreboard":
      return (
        <div className="space-y-14">
          <SectionHeader
            label={section.label}
            heading={section.heading}
            lede={section.lede}
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-10 gap-y-10">
            {section.stats.map((s) => (
              <div key={s.label} className="border-t border-border pt-6">
                <div className="font-display text-5xl sm:text-6xl leading-none tracking-tight">
                  {s.value}
                </div>
                <div className="mt-3 text-foreground/90">{s.label}</div>
                {s.sublabel && (
                  <div className="font-mono-tag text-subtle mt-1">
                    {s.sublabel}
                  </div>
                )}
              </div>
            ))}
          </div>
          {section.footnote && (
            <p className="text-sm text-muted italic max-w-3xl">
              {section.footnote}
            </p>
          )}
        </div>
      );

    case "code":
      return (
        <div className="grid grid-cols-12 gap-y-8 sm:gap-x-10">
          <div className="col-span-12 sm:col-span-5 min-w-0">
            <SectionHeader label={section.label} heading={section.heading} />
            <div className="mt-6 space-y-5 text-base text-muted leading-relaxed">
              {section.lede.split("\n\n").map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
          <div className="col-span-12 sm:col-span-7 min-w-0 space-y-5">
            <p className="font-mono-tag text-subtle">{section.caption}</p>
            <div className="relative rounded-md bg-surface-2/60 overflow-hidden">
              <span className="absolute top-3 right-4 font-mono text-[10px] tracking-widest uppercase text-subtle">
                {section.language}
              </span>
              <pre className="overflow-x-auto p-5 pr-16 text-[13px] leading-[1.6] font-mono text-foreground/95">
                <code>{section.code}</code>
              </pre>
            </div>
            {section.followUp && (
              <p className="mt-2 text-sm text-muted leading-relaxed italic">
                <span className="not-italic font-mono-tag text-subtle mr-2">
                  ↳ Detail
                </span>
                {section.followUp}
              </p>
            )}
          </div>
        </div>
      );

    case "tokens": {
      const brand = section.brand;
      return (
        <div className="space-y-8">
          <SectionHeader
            label={section.label}
            heading={section.heading}
            lede={section.lede}
          />

          {/* Brand guide card — one solid composed rectangle */}
          <div className="rounded-lg border border-border-strong overflow-hidden bg-surface/30">
            {/* Brand strip — logo · wordmark · tagline · file ref */}
            {brand && (
              <div className="flex items-center justify-between gap-6 px-6 py-5 border-b border-border">
                <div className="flex items-center gap-4">
                  {brand.logoSrc && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={brand.logoSrc}
                      alt="HornScore mark"
                      className="h-8 w-auto"
                    />
                  )}
                  {brand.wordmarkSrc && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={brand.wordmarkSrc}
                      alt="HornScore"
                      className="h-5 w-auto opacity-90"
                    />
                  )}
                </div>
                {brand.tagline && (
                  <p className="font-display italic text-base sm:text-lg text-muted text-center flex-1 hidden sm:block">
                    “{brand.tagline}”
                  </p>
                )}
                <p className="font-mono-tag text-subtle whitespace-nowrap">
                  DesignSystem.swift · 586 lines
                </p>
              </div>
            )}

            {/* Main composition — Color (5) | Type+Spacing stacked (7) */}
            <div className="grid grid-cols-12">
              {/* Color tokens — fills left, full height */}
              <div className="col-span-12 sm:col-span-5 border-b sm:border-b-0 sm:border-r border-border">
                <div className="flex items-baseline justify-between px-6 py-3 border-b border-border">
                  <p className="font-mono-tag text-subtle">01 · Color</p>
                  <p className="font-mono-tag text-subtle">50+ tokens</p>
                </div>
                <div className="p-6 grid grid-cols-2 gap-3">
                  {section.swatches.map((s) => (
                    <div key={s.name}>
                      <div
                        className="aspect-square w-full rounded-md flex items-end p-3"
                        style={{
                          background: s.color,
                          color: contrastFor(s.color),
                        }}
                      >
                        <span className="font-mono text-[10px] tracking-wider opacity-85">
                          {s.value}
                        </span>
                      </div>
                      <div className="mt-2 font-display text-sm leading-tight">
                        {s.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right column — Type (top) over Spacing (bottom) */}
              <div className="col-span-12 sm:col-span-7 flex flex-col">
                <div className="border-b border-border">
                  <div className="flex items-baseline justify-between px-6 py-3 border-b border-border">
                    <p className="font-mono-tag text-subtle">02 · Type</p>
                    <p className="font-mono-tag text-subtle">20+ sizes</p>
                  </div>
                  <div className="p-6 space-y-3">
                    <div className="flex items-baseline gap-5 border-b border-border pb-3">
                      <span className="font-mono-tag text-subtle w-20 shrink-0">
                        Display 64
                      </span>
                      <span className="font-display text-5xl leading-none tracking-tight">
                        HornScore
                      </span>
                    </div>
                    <div className="flex items-baseline gap-5 border-b border-border pb-3">
                      <span className="font-mono-tag text-subtle w-20 shrink-0">
                        Title 32
                      </span>
                      <span className="font-display text-2xl leading-tight">
                        Field judge accurately.
                      </span>
                    </div>
                    <div className="flex items-baseline gap-5 border-b border-border pb-3">
                      <span className="font-mono-tag text-subtle w-20 shrink-0">
                        Body 18
                      </span>
                      <span className="text-base leading-relaxed text-foreground/90">
                        Score trophies the right way.
                      </span>
                    </div>
                    <div className="flex items-baseline gap-5">
                      <span className="font-mono-tag text-subtle w-20 shrink-0">
                        Caption 12
                      </span>
                      <span className="font-mono-tag text-foreground/80">
                        ANTLER POINTS · 0.12EM
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-baseline justify-between px-6 py-3 border-b border-border">
                    <p className="font-mono-tag text-subtle">03 · Spacing</p>
                    <p className="font-mono-tag text-subtle">
                      25 tokens · 4pt grid
                    </p>
                  </div>
                  <div className="p-6 grid grid-cols-2 gap-x-8 gap-y-1.5">
                    {[4, 8, 12, 16, 20, 24, 32, 48, 64].map((n) => (
                      <div key={n} className="flex items-center gap-3">
                        <span className="font-mono-tag text-subtle w-10 shrink-0">
                          {n}pt
                        </span>
                        <div
                          className="h-1.5 bg-foreground/80 rounded-sm"
                          style={{ width: `${Math.min(n * 2.4, 140)}px` }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Totals strip — bottom edge */}
            <div className="border-t border-border grid grid-cols-2 sm:grid-cols-4 divide-x divide-border">
              {section.counts.map((c) => (
                <div key={c.label} className="px-6 py-5">
                  <div className="font-display text-3xl leading-none">
                    {c.value}
                  </div>
                  <div className="font-mono-tag text-subtle mt-2">
                    {c.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {section.footnote && (
            <p className="text-xs text-muted italic max-w-3xl">
              {section.footnote}
            </p>
          )}
        </div>
      );
    }

    case "stack":
      return (
        <div className="space-y-12">
          <SectionHeader
            label={section.label}
            heading={section.heading}
            lede={section.lede}
          />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-10 border-t border-border pt-8">
            {section.items.map((it) => {
              const brand = BRAND_ICONS[it.name];
              const mono = BRAND_MONOGRAMS[it.name];
              return (
                <div key={it.name} className="flex items-start gap-4">
                  <div
                    className="shrink-0 mt-1 flex items-center justify-center w-9 h-9 rounded-md bg-foreground/5"
                    style={{ color: brand?.color ?? mono?.color }}
                  >
                    {brand ? (
                      <brand.Icon size={20} color={brand.color} />
                    ) : mono ? (
                      <span
                        className="font-mono text-base font-semibold"
                        style={{ color: mono.color }}
                      >
                        {mono.letter}
                      </span>
                    ) : null}
                  </div>
                  <div>
                    <div className="font-display text-2xl leading-tight">
                      {it.name}
                    </div>
                    <div className="font-mono-tag text-subtle mt-2">
                      {it.role}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );

    case "gallery":
      return (
        <div className="space-y-14">
          <SectionHeader
            label={section.label}
            heading={section.heading}
            lede={section.lede}
          />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-12 sm:gap-x-8 sm:gap-y-14">
            {section.images.map((img) => (
              <figure key={img.src} className="flex flex-col">
                <div className="relative w-full aspect-[9/19.5] overflow-hidden">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-contain"
                    sizes="(min-width: 640px) 22vw, 45vw"
                  />
                </div>
                {img.caption && (
                  <figcaption className="mt-4 pt-3 border-t border-border font-mono-tag text-subtle">
                    {img.caption}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        </div>
      );

    case "image-prose": {
      const imageSide = section.imageSide ?? "right";
      const proseStart = imageSide === "right" ? "sm:col-start-1" : "sm:col-start-7";
      const imageStart = imageSide === "right" ? "sm:col-start-7" : "sm:col-start-1";
      return (
        <div className="grid grid-cols-12 gap-y-8 sm:gap-x-10 items-center">
          <div className={`col-span-12 sm:col-span-6 ${proseStart}`}>
            <SectionHeader label={section.label} heading={section.heading} />
            <div className="mt-6 space-y-5 text-lg text-foreground/90 leading-relaxed">
              {section.body.split("\n\n").map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
          <div
            className={`col-span-12 sm:col-span-6 sm:row-start-1 ${imageStart}`}
          >
            <ImageBlock image={section.image} />
          </div>
        </div>
      );
    }

    case "before-after": {
      const hasSingle = section.beforeImage && section.afterImage;
      const hasPairs = section.pairs && section.pairs.length > 0;
      if (!hasSingle && !hasPairs) return null;
      return (
        <div className="space-y-14">
          <SectionHeader
            label={section.label}
            heading={section.heading}
            lede={section.lede}
            align="center"
          />
          <BeforeAfterComparison
            beforeImage={section.beforeImage}
            afterImage={section.afterImage}
            beforeSubLabel={section.beforeSubLabel}
            afterSubLabel={section.afterSubLabel}
            pairs={section.pairs}
          />
        </div>
      );
    }

    case "cta":
      return (
        <div className="rounded-lg border border-border-strong bg-surface-2/60 p-10 sm:p-14 max-w-3xl mx-auto">
          <p className="font-mono-tag text-subtle">{section.label}</p>
          <h2 className="mt-4 font-display text-4xl sm:text-5xl tracking-tight leading-tight">
            {section.heading}
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-foreground/90">
            {section.body}
          </p>
          <a
            href="mailto:william@piehsoft.com"
            className="inline-flex items-center gap-3 mt-8 bg-accent text-accent-fg px-5 py-3 rounded-sm font-mono-tag hover:opacity-90 transition-opacity"
          >
            william@piehsoft.com →
          </a>
        </div>
      );
  }
}

function contrastFor(hex: string): string {
  const v = hex.replace("#", "");
  const r = parseInt(v.slice(0, 2), 16);
  const g = parseInt(v.slice(2, 4), 16);
  const b = parseInt(v.slice(4, 6), 16);
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum > 0.7 ? "#111" : "#f5f2ec";
}

function ImageBlock({
  image,
}: {
  image: { src: string; alt: string; caption?: string };
}) {
  return (
    <div>
      <div className="relative aspect-[4/5] sm:aspect-[9/12] overflow-hidden">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          className="object-contain"
          sizes="(min-width: 640px) 45vw, 90vw"
        />
      </div>
      {image.caption && (
        <p className="mt-4 pt-3 border-t border-border font-mono-tag text-subtle">
          {image.caption}
        </p>
      )}
    </div>
  );
}
