import Link from "next/link";
import { ArrowUpRight, CheckCircle } from "@phosphor-icons/react/dist/ssr";

import type { Project } from "@prisma/client";
import { projectCategoryLabel } from "@/lib/constants";
import { cn, parseLines, truncate } from "@/lib/utils";

type ProjectLike = {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  technologies?: string;
  coverImage?: string | null;
  projectUrl?: string | null;
  year?: string | null;
  isConcept?: boolean;
};

export function ProjectCard({
  project,
  index,
  priority = false,
}: {
  project: Project | ProjectLike;
  index: number;
  priority?: boolean;
}) {
  const technologies = parseLines(project.technologies ?? "");
  const cover = project.coverImage || "/projects/stacklab-cover.svg";
  const isExternal = Boolean(project.projectUrl && project.projectUrl.startsWith("http"));
  const isCurrentSite = project.slug === "stacklab" || project.projectUrl === "/";
  const href = project.projectUrl || `/projects/${project.slug}`;

  const linkProps = isExternal
    ? {
        href,
        target: "_blank",
        rel: "noopener noreferrer",
      }
    : {
        href,
      };

  return (
    <article className={cn("group relative", index % 2 === 1 && "lg:mt-16")}>
      <a {...linkProps} className="block focus-visible:outline-offset-8">
        <div className="relative overflow-hidden rounded-2xl border border-line bg-card transition-all duration-500 ease-[var(--ease-out-expo)] group-hover:border-white/30 group-hover:shadow-[0_12px_48px_rgba(0,0,0,0.6)]">
          <div className="aspect-[16/10] w-full overflow-hidden sm:aspect-[4/3]">
            <img
              src={cover}
              alt={`Обложка проекта ${project.title}`}
              width={1200}
              height={900}
              loading={priority ? "eager" : "lazy"}
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-[800ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.03]"
            />
          </div>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-95" />

          {/* Top Badges */}
          <div className="absolute left-4 top-4 flex flex-wrap items-center gap-2">
            <span className="rounded-md border border-white/20 bg-black/70 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-white/90 backdrop-blur-md">
              {projectCategoryLabel(project.category)}
            </span>
            {isCurrentSite ? (
              <span className="flex items-center gap-1.5 rounded-md border border-emerald-500/40 bg-emerald-950/80 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-emerald-300 backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                Текущий сайт
              </span>
            ) : isExternal ? (
              <span className="flex items-center gap-1.5 rounded-md border border-sky-500/40 bg-sky-950/80 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-sky-300 backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
                Работающий сайт
              </span>
            ) : null}
          </div>

          {/* Bottom CTA Arrow Button */}
          <div className="absolute bottom-4 right-4 flex items-center gap-2">
            <span className="hidden rounded-full border border-white/20 bg-black/60 px-3 py-1 font-mono text-[10px] text-white/80 backdrop-blur-md transition-all group-hover:border-white group-hover:bg-white group-hover:text-black sm:inline-flex">
              {isCurrentSite ? "Вы находитесь здесь" : "Перейти на сайт"}
            </span>
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-black/60 text-white backdrop-blur-md transition-all duration-300 ease-[var(--ease-out-expo)] group-hover:border-white group-hover:bg-white group-hover:text-black">
              <ArrowUpRight size={18} weight="bold" aria-hidden="true" />
            </span>
          </div>
        </div>

        {/* Text info below card */}
        <div className="flex items-start justify-between gap-6 border-b border-line py-5">
          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-medium tracking-tight text-fg transition-colors duration-300 group-hover:text-white sm:text-2xl">
                {project.title}
              </h3>
            </div>
            <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted">
              {truncate(project.description, 150)}
            </p>
            {technologies.length > 0 ? (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {technologies.slice(0, 4).map((tech) => (
                  <span
                    key={tech}
                    className="rounded border border-line bg-surface px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.08em] text-[#9a9a9a]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
          <span className="shrink-0 pt-1 font-mono text-xs tracking-[0.14em] text-dim">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
      </a>
    </article>
  );
}
