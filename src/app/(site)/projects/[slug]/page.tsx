import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, CheckCircle } from "@phosphor-icons/react/dist/ssr";

import { LeadButton } from "@/components/lead/lead-dialog";
import { getProjectBySlug } from "@/lib/data";
import { projectCategoryLabel } from "@/lib/constants";
import { serverEnv } from "@/lib/env";
import { parseLines, splitParagraphs } from "@/lib/utils";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Проект не найден",
      robots: { index: false, follow: false },
    };
  }

  const category = projectCategoryLabel(project.category).toLowerCase();

  return {
    title: project.isConcept ? `${project.title} - концепт ${category}` : `${project.title} - ${category}`,
    description: project.description,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      title: `${project.title} | STACKLAB`,
      description: project.description,
      url: `/projects/${project.slug}`,
      images: project.coverImage ? [{ url: project.coverImage }] : undefined,
    },
  };
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const technologies = parseLines(project.technologies);
  const solutionParagraphs = splitParagraphs(project.solution);
  const challengeParagraphs = splitParagraphs(project.challenge);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.description,
    url: `${serverEnv.appUrl}/projects/${project.slug}`,
    creator: { "@type": "Organization", name: "STACKLAB" },
    ...(project.year ? { dateCreated: project.year } : {}),
    ...(project.isConcept ? { abstract: "Концептуальный проект студии" } : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="pt-28 lg:pt-36">
        <div className="container-page">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-xs text-muted transition-colors duration-300 hover:text-fg"
          >
            <ArrowLeft size={14} aria-hidden="true" />
            Все проекты
          </Link>

          <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <div className="flex flex-wrap items-center gap-2">
                <span className="border border-line px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-muted">
                  {projectCategoryLabel(project.category)}
                </span>
                {project.isConcept ? (
                  <span className="border border-line bg-card px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-dim">
                    Концепт
                  </span>
                ) : null}
                {project.year ? (
                  <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-dim">
                    {project.year}
                  </span>
                ) : null}
              </div>
              <h1 className="mt-5 text-h2">{project.title}</h1>
              <p className="mt-5 max-w-2xl text-lead text-muted">{project.description}</p>
            </div>

            <div className="lg:col-span-4">
              <div className="border border-line bg-card p-5">
                <p className="mono-label">Статус</p>
                <p className="mt-2 flex items-center gap-2 text-sm text-fg">
                  <CheckCircle size={16} weight="light" aria-hidden="true" className="text-muted" />
                  {project.isConcept ? "Концептуальный проект студии" : "Реализованный проект"}
                </p>
                {project.projectUrl ? (
                  <a
                    href={project.projectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 border-b border-line pb-1 text-sm text-fg transition-colors hover:border-fg"
                  >
                    Открыть сайт
                    <ArrowUpRight size={14} aria-hidden="true" />
                  </a>
                ) : (
                  <p className="mt-4 text-xs leading-relaxed text-dim">
                    Публичная ссылка не указана: проект существует как концепт.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-12 overflow-hidden border border-line bg-card">
            <img
              src={project.coverImage || "/projects/aster-cover.svg"}
              alt={`Обложка проекта ${project.title}`}
              width={1200}
              height={900}
              className="h-auto w-full object-cover"
            />
          </div>

          <div className="mt-16 grid gap-12 border-t border-line pt-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <h2 className="mono-label">Задача</h2>
            </div>
            <div className="lg:col-span-8">
              {challengeParagraphs.map((paragraph, index) => (
                <p key={index} className="mb-4 max-w-2xl text-base leading-relaxed text-muted">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <div className="mt-12 grid gap-12 border-t border-line pt-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <h2 className="mono-label">Решение</h2>
            </div>
            <div className="lg:col-span-8">
              {solutionParagraphs.map((paragraph, index) => (
                <p key={index} className="mb-4 max-w-2xl text-base leading-relaxed text-muted">
                  {paragraph}
                </p>
              ))}

              {technologies.length > 0 ? (
                <div className="mt-8">
                  <p className="mono-label">Технологии</p>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {technologies.map((technology) => (
                      <li
                        key={technology}
                        className="border border-line bg-card px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-muted"
                      >
                        {technology}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="mt-20 border-t border-line bg-surface">
          <div className="container-page py-20 lg:py-24">
            <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-8">
                <h2 className="max-w-[22ch] text-h2">Нужен похожий результат?</h2>
                <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted">
                  Обсудим задачу и предложим структуру, которая работает на ваш бизнес.
                </p>
              </div>
              <div className="lg:col-span-4">
                <LeadButton className="group inline-flex h-12 items-center gap-3 bg-fg px-6 text-sm font-medium text-base transition-[background-color,transform] duration-500 ease-[var(--ease-out-expo)] hover:bg-white active:scale-[0.98]">
                  Обсудить проект
                </LeadButton>
              </div>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
