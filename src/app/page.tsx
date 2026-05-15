import { ProjectCard } from "@/components/ProjectCard";
import { projects } from "@/lib/projects";

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 sm:px-10 pt-20 pb-24 sm:pt-32 sm:pb-32">
          <p className="font-mono-tag text-muted mb-8">
            PiehSoft · Design &amp; AI Engineering · Phoenix, AZ
          </p>
          <h1 className="font-display text-5xl sm:text-7xl lg:text-[5.5rem] leading-[0.95] tracking-tight max-w-4xl">
            Native iOS &amp; AI systems, designed and built{" "}
            <span className="italic text-muted">end-to-end.</span>
          </h1>
          <p className="mt-10 max-w-2xl text-lg text-muted leading-relaxed">
            <span className="text-foreground">PiehSoft</span> is the studio I
            run — I audit, modernize, and rebuild iPhone apps and the AI
            systems that increasingly power them, for teams whose software has
            outgrown its original code.
          </p>

          <div className="mt-12 flex flex-wrap items-center gap-5">
            <a
              href="#work"
              className="inline-flex items-center gap-3 bg-accent text-accent-fg px-5 py-3 rounded-sm font-mono-tag hover:opacity-90 transition-opacity"
            >
              View selected work
              <span aria-hidden>↓</span>
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-3 px-5 py-3 rounded-sm font-mono-tag border border-border hover:border-foreground transition-colors"
            >
              Start a project →
            </a>
          </div>

          <div className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-y-8 gap-x-10 max-w-3xl">
            {[
              { v: "Since 2021", l: "Shipping production" },
              { v: "iOS · AI · Data", l: "Stack" },
              { v: "Phoenix, AZ", l: "Based in" },
              { v: "Remote / hybrid", l: "Engagement" },
            ].map((stat) => (
              <div key={stat.l}>
                <div className="font-display text-2xl leading-none">{stat.v}</div>
                <div className="font-mono-tag text-subtle mt-2">{stat.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured work */}
      <section id="work" className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 sm:px-10 pt-20 pb-10">
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
          </p>
        </div>
        <div className="mx-auto max-w-6xl px-6 sm:px-10 pb-16">
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
              I&apos;m William Pieh.{" "}
              <span className="font-medium">PiehSoft</span> is the studio I run
              — design and engineering for teams that ship serious software. I
              work end-to-end across iOS, AI systems, and data infrastructure,
              from research and design through production shipping.
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
              I&apos;m best at.
            </p>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 sm:px-10 py-20">
          <p className="font-mono-tag text-subtle mb-10">What I do</p>
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
            <a
              href="https://williampieh.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 px-6 py-4 rounded-sm font-mono-tag border border-border hover:border-foreground transition-colors"
            >
              williampieh.com ↗
            </a>
          </div>
          <p className="text-muted mt-10 max-w-xl">
            For new engagements: a 30-minute intro call is the fastest way to
            scope. Standard contracts run 6–10 weeks; longer retainers
            available for ongoing product work.
          </p>
        </div>
      </section>
    </>
  );
}
