import { ProjectCard } from "@/components/ProjectCard";
import { HeroBackground } from "@/components/HeroBackground";
import { projects } from "@/lib/projects";

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative border-b border-border -mt-16">
        <HeroBackground inflate={0.25} bleedBelow={240} />
        <div className="relative z-10 mx-auto max-w-6xl px-6 sm:px-10 pt-36 pb-24 sm:pt-48 sm:pb-32">
          <p className="font-mono-tag text-muted mb-8">
            PiehSoft · Design &amp; Software Engineering · Phoenix, AZ
          </p>
          <h1 className="font-display text-5xl sm:text-7xl lg:text-[5.5rem] leading-[0.95] tracking-tight max-w-4xl">
            Native iOS — and the software around it,{" "}
            <span className="italic text-muted">
              designed and built end-to-end.
            </span>
          </h1>
          <p className="mt-10 max-w-2xl text-lg text-muted leading-relaxed">
            <span className="text-foreground">PiehSoft</span> is a design and
            engineering studio. We rebuild iPhone apps and the software, data,
            and AI systems that surround them — considered end-to-end, led by
            William with a small bench of collaborators when projects need
            them.
          </p>

          <div className="mt-12 flex flex-wrap items-center gap-5">
            <a
              href="#work"
              className="inline-flex items-center gap-3 bg-accent text-accent-fg px-5 py-3 rounded-sm font-mono-tag hover:opacity-90 transition-opacity"
            >
              See the work
              <span aria-hidden>↓</span>
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-3 px-5 py-3 rounded-sm font-mono-tag border border-border hover:border-foreground transition-colors backdrop-blur-sm backdrop-saturate-150"
              style={{
                background:
                  "color-mix(in oklab, var(--background) 40%, transparent)",
              }}
            >
              Bring us a brief →
            </a>
          </div>

          <div className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-y-8 gap-x-10 max-w-3xl">
            {[
              { v: "Since 2021", l: "Shipping production" },
              { v: "iOS · Web · AI", l: "Stack" },
              { v: "Phoenix, AZ", l: "Based in" },
              { v: "Remote / hybrid", l: "Engagement" },
            ].map((stat) => (
              <div key={stat.l}>
                <div className="font-display text-2xl leading-none">
                  {stat.v}
                </div>
                <div className="font-mono-tag text-subtle mt-2">{stat.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured work */}
      <section id="work" className="relative border-b border-border">

        {/* Glass strip blurring the hero's bleed, fading to solid bg */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-60 pointer-events-none backdrop-blur-md backdrop-saturate-150 z-0"
          style={{
            maskImage:
              "linear-gradient(to bottom, black 0%, black 30%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black 0%, black 30%, transparent 100%)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-60 pointer-events-none z-0"
          style={{
            background:
              "linear-gradient(to bottom, transparent 0%, var(--background) 100%)",
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
        <div className="relative z-10 mx-auto max-w-6xl px-6 sm:px-10 pt-20 pb-10">
          <div className="flex items-end justify-between mb-2">
            <h2 className="font-display text-4xl sm:text-5xl tracking-tight">
              Selected work
            </h2>
            <p className="font-mono-tag text-subtle hidden sm:block">
              {String(projects.length).padStart(2, "0")} case studies
            </p>
          </div>
          <p className="text-muted max-w-2xl mt-3">
            Each project below ships in production. Click through for the full
            breakdown — what was built, what changed, and what it took.
            Considered, end-to-end.
          </p>
        </div>
        <div className="relative z-10 mx-auto max-w-6xl px-6 sm:px-10 pb-16">
          {projects.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
          ))}
        </div>
      </section>

      {/* About */}
      <section id="about" className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 sm:px-10 py-24 grid grid-cols-12 gap-y-10 sm:gap-x-10">
          <div className="col-span-12 sm:col-span-4">
            <p className="font-mono-tag text-subtle">About</p>
            <h2 className="font-display text-4xl sm:text-5xl tracking-tight mt-3">
              The short version.
            </h2>
          </div>
          <div className="col-span-12 sm:col-span-8 space-y-5 text-lg text-foreground/90 leading-relaxed max-w-2xl">
            <p>
              <span className="font-medium">PiehSoft</span> is a Phoenix-based
              design and engineering studio, founded and led by William. We work
              end-to-end across iOS, the web platforms around it, and the AI
              and data systems that connect them — from research and design
              through production shipping. Every project
              gets the same disposition: think before you build, finish what you
              start, sign your work.
            </p>
            <p>
              Engagements are typically B2B teams whose core software is
              critical but visually a decade behind, or teams who need real AI
              capabilities built into existing products without breaking what
              works.
            </p>
            <p className="text-muted">
              If your team has a working app that quietly hurts to use — or a
              workflow that could use real automation — that&apos;s the work
              PiehSoft does best.
            </p>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section id="capabilities" className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 sm:px-10 py-20">
          <p className="font-mono-tag text-subtle mb-10">What we do</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
            {[
              {
                t: "iOS product design & engineering",
                b: "Native SwiftUI apps designed and built end-to-end — from research and component systems through App Store launch. Field tools, data capture, consumer products.",
              },
              {
                t: "UI/UX modernization",
                b: "Take an existing app that works but feels dated, and rebuild the surface — keeping the data, the integrations, and the users. Most engagements start here.",
              },
              {
                t: "Backend & data pipelines",
                b: "Production data pipelines, server-side APIs, and integration plumbing. The unglamorous half of any field-data product, done properly.",
              },
            ].map((cap) => (
              <div key={cap.t} className="border-t border-border pt-6">
                <h3 className="font-display text-2xl leading-tight">{cap.t}</h3>
                <p className="text-muted mt-3 leading-relaxed">{cap.b}</p>
                <p className="font-display italic text-muted mt-4">
                  — Consider it done.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact">
        <div className="mx-auto max-w-6xl px-6 sm:px-10 py-28">
          <p className="font-mono-tag text-subtle">Contact</p>
          <h2 className="font-display text-5xl sm:text-7xl tracking-tight mt-3 max-w-3xl leading-[1]">
            Have an app that works,{" "}
            <span className="italic text-muted">
              but no longer looks the part?
            </span>
          </h2>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <a
              href="mailto:william@piehsoft.com"
              className="inline-flex items-center gap-3 bg-accent text-accent-fg px-6 py-4 rounded-sm font-mono-tag hover:opacity-90 transition-opacity"
            >
              william@piehsoft.com
              <span aria-hidden>→</span>
            </a>
            <a
              href="tel:+19289634919"
              className="inline-flex items-center gap-3 px-6 py-4 rounded-sm font-mono-tag border border-border hover:border-foreground transition-colors"
            >
              (928) 963-4919
            </a>
          </div>
          <p className="text-muted mt-10 max-w-xl">
            For new engagements: a 30-minute intro call is the fastest way to
            scope. Standard contracts run 6–10 weeks; longer retainers available
            for ongoing product work.
          </p>
        </div>
      </section>
    </>
  );
}
