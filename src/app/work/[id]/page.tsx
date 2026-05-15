import Image from "next/image";
import Link from "next/link";
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
      <section className="relative overflow-hidden border-b border-border">
        <div className="relative mx-auto max-w-6xl px-6 sm:px-10 pt-24 pb-24">
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
            {/* Glow constrained to behind the image — soft circular falloff,
                center shifted upward to sit behind the phones. */}
            <div
              aria-hidden
              className="absolute -left-[50%] -right-[50%] -top-[70%] -bottom-[30%] pointer-events-none"
              style={{
                maskImage:
                  "radial-gradient(circle at center, black 0%, transparent 55%)",
                WebkitMaskImage:
                  "radial-gradient(circle at center, black 0%, transparent 55%)",
              }}
            >
              <HeroBackground
                brandColor={project.hero.glow}
                shape="radial"
                intensity={0.9}
                noise={0.3}
                softness={0.7}
                vignette={0}
              />
            </div>
            <Image
              src={project.hero.image}
              alt={`${project.title} product render`}
              fill
              className="relative object-contain"
              sizes="(min-width: 1024px) 768px, 90vw"
              priority
            />
          </div>
        </div>
      </section>

      {/* Pill nav */}
      <SectionPillNav items={navItems} />

      {/* Framing + metadata */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 sm:px-10 py-16 sm:py-20">
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

      {/* Sections — each one renders its own materially-different layout */}
      {project.sections.map((section) => (
        <CaseStudySection key={section.id} section={section} />
      ))}

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
