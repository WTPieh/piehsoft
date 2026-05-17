import Image from "next/image";
import { Link } from "next-view-transitions";
import { notFound } from "next/navigation";
import { HeroBackground } from "@/components/HeroBackground";
import { CaseStudySection } from "@/components/CaseStudySection";
import { SectionPillNav } from "@/components/SectionPillNav";
import { getProject, projects } from "@/lib/projects";

export function generateStaticParams() {
  return projects.map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = getProject(id);
  if (!project) return {};
  return {
    title: `${project.title} — PiehSoft`,
    description: project.summary,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = getProject(id);
  if (!project) notFound();

  const idx = projects.findIndex((p) => p.id === project.id);
  const next = projects[(idx + 1) % projects.length];

  const navItems = project.sections
    .filter((s) => "label" in s && s.label)
    .map((s) => ({ id: s.id, label: ("label" in s && s.label) || s.id }));

  return (
    <>
      {/* Hero */}
      <section className="relative -mt-16">
        <HeroBackground
          fallbackKey={`hero-${project.id}`}
          brandColor={project.hero.glow}
          shape="wave"
          intensity={0.05}
          noise={0.35}
          softness={1.0}
          bleedBelow={340}
          vignette={0.5}
        />
        <div className="relative mx-auto max-w-6xl px-6 sm:px-10 pt-40 pb-24">
          <Link
            href="/#work"
            className="font-mono-tag text-muted hover:text-foreground transition-colors"
          >
            ← All work
          </Link>

          <div className="mt-20 text-center">
            <h1 className="font-display text-6xl sm:text-7xl lg:text-8xl leading-[0.95] tracking-tight">
              {project.title}
            </h1>
            <p className="mt-5 font-display italic text-2xl sm:text-3xl text-muted">
              {project.tagline}
            </p>
          </div>

          <div className="relative mx-auto mt-12 w-full max-w-3xl aspect-[16/12]">
            <Image
              src={project.hero.image}
              alt={`${project.title} product render`}
              fill
              className="object-contain"
              sizes="(min-width: 1024px) 768px, 90vw"
              priority
            />
          </div>
        </div>
      </section>

      {/* Combined wrapper — framing region + content sections all share one
          sticky context so the pill nav stays docked through every section. */}
      <div className="relative pt-4">
        {/* Glass strip blurring the hero's bleed, fading to solid bg.
            Height must cover the hero's bleedBelow distance + buffer. */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-[400px] pointer-events-none z-0"
          style={{
            // Muted blur (desaturated/darkened) on high-perf; `none` on
            // low-perf (shared flag) — solid comes from --bleed-fade below.
            backdropFilter: "var(--glass-filter-cs)",
            WebkitBackdropFilter: "var(--glass-filter-cs)",
            maskImage:
              "linear-gradient(to bottom, black 0%, black 50%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black 0%, black 50%, transparent 100%)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-[400px] pointer-events-none z-0"
          style={{
            // High-perf: long transparent ramp so the (muted) blur reads.
            // Low-perf: --bleed-fade goes solid fast so content sits on
            // opaque bg. Color muting is handled by --glass-filter-cs, not
            // a heavy veil (which previously flattened the blur to solid).
            background: "var(--bleed-fade)",
          }}
        />
        {/* Refraction rim — theme-aware specular hairline at the glass edge */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-[2px] pointer-events-none z-[1]"
          style={{
            background:
              "linear-gradient(to right, transparent 0%, var(--glass-rim-mid) 20%, var(--glass-rim-strong) 50%, var(--glass-rim-mid) 80%, transparent 100%)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-x-0 top-[2px] h-[6px] pointer-events-none z-[1]"
          style={{
            background:
              "linear-gradient(to bottom, var(--glass-rim-bloom) 0%, transparent 100%)",
            filter: "blur(2px)",
          }}
        />

        {/* Pill nav — DIRECT child of the wrapper so its sticky range spans
            the wrapper's full height (framing + every section below).
            Wrapping it in another div would clip the sticky pin to that div's box. */}
        <SectionPillNav items={navItems} />

        {/* Framing content (one-liner + metadata + metrics) */}
        <section className="relative z-10 border-b border-border">
          <div className="mx-auto max-w-6xl px-6 sm:px-10 pt-10 pb-16 sm:pb-20">
            <p className="text-2xl sm:text-3xl font-display max-w-4xl leading-snug">
              {project.oneLineFraming}
            </p>

            <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-y-6 gap-x-10 border-t border-border pt-8">
              {[
                { l: "Timeline", v: project.metadata.timeline },
                { l: "Role", v: project.metadata.role },
                { l: "Technology", v: project.metadata.technology },
                { l: "Platform", v: project.metadata.platform },
              ].map((m) => (
                <div key={m.l}>
                  <div className="font-mono-tag text-subtle">{m.l}</div>
                  <div className="mt-2 text-sm leading-snug">{m.v}</div>
                </div>
              ))}
            </div>

            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-10 border-t border-border pt-10">
              {project.metrics.map((m) => (
                <div key={m.label}>
                  <div className="font-display text-4xl sm:text-5xl leading-none tracking-tight">
                    {m.value}
                  </div>
                  <div className="font-mono-tag text-subtle mt-3">{m.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sections — each renders its own layout, all under the same sticky scope */}
        {project.sections.map((section) => (
          <CaseStudySection key={section.id} section={section} />
        ))}
      </div>

      {/* Up next + contact */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 sm:px-10 py-24 grid grid-cols-1 sm:grid-cols-2 gap-12">
          <div>
            <p className="font-mono-tag text-subtle">Up next</p>
            <Link href={`/work/${next.id}`} className="block mt-4 group">
              <h3 className="font-display text-5xl tracking-tight group-hover:opacity-70 transition-opacity">
                {next.title} →
              </h3>
              <p className="font-display italic text-xl text-muted mt-2">
                {next.tagline}
              </p>
            </Link>
          </div>
          <div className="sm:text-right">
            <p className="font-mono-tag text-subtle">Have a project?</p>
            <h3 className="font-display text-5xl tracking-tight mt-4">
              Let&apos;s talk.
            </h3>
            <a
              href="mailto:william@piehsoft.com"
              className="inline-flex items-center gap-3 mt-6 bg-accent text-accent-fg px-5 py-3 rounded-sm font-mono-tag hover:opacity-90 transition-opacity"
            >
              william@piehsoft.com →
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
