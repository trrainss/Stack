import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";

import type { Project } from "@prisma/client";
import { projectCategoryLabel } from "@/lib/constants";
import { cn, parseLines, truncate } from "@/lib/utils";

export function ProjectCard({
  project,
  index,
  priority = false,
}: {
  project: Project;
  index: number;
  priority?: boolean;
}) {
  const technologies = parseLines(project.technologies);
  const cover = project.coverImage || "/projects/aster-cover.svg";

  return (
    <article className={cn("group relative", index % 2 === 1 && "lg:mt-24")}>
      <Link href={`/projects/${project.slug}`} className="block focus-visible:outline-offset-8">
        <div className="relative overflow-hidden border border-line bg-card">
          <div className="aspect-[4/3] w-full overflow-hidden">
            <img
              src={cover}
              alt={`Обложка концептуального проекта ${project.title}`}
              width={1200}
              height={900}
              loading={priority ? "eager" : "lazy"}
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-[900ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.035]"
            />
          </div>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-90" />

          <div className="absolute left-4 top-4 flex flex-wrap items-center gap-2">
            <span className="border border-white/20 bg-black/55 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-white/85 backdrop-blur-sm">
              {projectCategoryLabel(project.category)}
            </span>
            {project.isConcept ? (
              <span className="border border-white/15 bg-black/40 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-white/60 backdrop-blur-sm">
                Концепт
              </span>
            ) : null}
          </div>

          <span className="absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center border border-white/25 bg-black/40 text-white backdrop-blur-sm transition-all duration-500 ease-[var(--ease-out-expo)] group-hover:border-white group-hover:bg-white group-hover:text-base">
            <ArrowUpRight size={17} weight="light" aria-hidden="true" />
          </span>
        </div>

        <div className="flex items-start justify-between gap-6 border-b border-line py-5">
          <div>
            <h3 className="text-xl font-medium tracking-tight transition-colors duration-300 group-hover:text-white sm:text-2xl">
              {project.title}
            </h3>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">
              {truncate(project.description, 130)}
            </p>
            {technologies.length > 0 ? (
              <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.12em] text-dim">
                {technologies.slice(0, 3).join(" / ")}
              </p>
            ) : null}
          </div>
          <span className="shrink-0 pt-1 font-mono text-[10px] tracking-[0.12em] text-dim">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
      </Link>
    </article>
  );
}
