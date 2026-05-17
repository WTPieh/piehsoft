import Image from "next/image";
import Link from "next/link";
import { BrandGlow } from "./BrandGlow";
import type { Project } from "@/lib/projects";

export function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  return (
    <Link
      href={`/work/${project.id}`}
      className="group block border-t border-border py-14 transition-colors"
    >
      <div className="grid grid-cols-12 gap-y-8 sm:gap-x-6 items-center">
        <div className="col-span-12 sm:col-span-1 font-mono-tag text-subtle pt-1">
          {String(index + 1).padStart(2, "0")}
        </div>

        <div className="col-span-12 sm:col-span-5">
          <h3 className="font-display text-5xl sm:text-6xl leading-[0.95] tracking-tight group-hover:opacity-70 transition-opacity">
            {project.title}
          </h3>
          <p className="mt-4 font-display italic text-2xl text-muted leading-tight max-w-md">
            {project.tagline}
          </p>
          <p className="mt-5 text-base text-muted/90 max-w-md leading-relaxed">
            {project.summary}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {project.tech.slice(0, 4).map((t) => (
              <span
                key={t}
                className="font-mono-tag text-subtle border border-border px-2 py-1 rounded-sm"
              >
                {t}
              </span>
            ))}
          </div>
          <p className="mt-7 font-mono-tag text-muted group-hover:text-foreground transition-colors">
            View case study →
          </p>
        </div>

        <div className="col-span-12 sm:col-span-6">
          <div className="relative aspect-[4/3]">
            <BrandGlow color={project.hero.glow} intensity={0.7} />
            <div className="relative h-full w-full flex items-center justify-center p-6">
              <div className="relative h-full w-full">
                <Image
                  src={project.hero.image}
                  alt={`${project.title} — product render`}
                  fill
                  className="object-contain transition-transform duration-500 group-hover:scale-[1.02]"
                  sizes="(min-width: 640px) 50vw, 100vw"
                  priority={index === 0}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
