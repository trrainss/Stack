import type { Metadata } from "next";

import { PageIntro } from "@/components/layout/page-intro";
import { LeadButton } from "@/components/lead/lead-dialog";
import { ProjectCard } from "@/components/projects/project-card";
import { Reveal } from "@/components/ui/reveal";
import { getPublishedProjects } from "@/lib/data";
import { getSiteContent } from "@/lib/settings";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  return {
    title: content["seo.projectsTitle"],
    description: content["seo.projectsDescription"],
    alternates: { canonical: "/projects" },
    openGraph: {
      title: content["seo.projectsTitle"],
      description: content["seo.projectsDescription"],
      url: "/projects",
    },
  };
}

export default async function ProjectsPage() {
  const content = await getSiteContent();
  const projects = await getPublishedProjects();

  return (
    <>
      <PageIntro
        title="Проекты"
        subtitle={content["projects.intro"]}
        meta={`${projects.length} ${projects.length === 1 ? "кейс" : "кейса"} в подборке`}
      />

      <section className="py-16 lg:py-24">
        <div className="container-page">
          {projects.length > 0 ? (
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-x-12 lg:gap-y-6">
              {projects.map((project, index) => (
                <Reveal key={project.id} delay={(index % 2) * 0.05}>
                  <ProjectCard project={project} index={index} priority={index < 2} />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="border border-line bg-card p-8">
              <p className="text-sm text-muted">
                Проекты пока не опубликованы. Добавьте первый кейс в панели управления.
              </p>
            </div>
          )}

          <p className="mt-12 max-w-2xl text-xs leading-relaxed text-dim">
            {content["projects.note"]}
          </p>
        </div>
      </section>

      <section className="border-t border-line bg-surface">
        <div className="container-page py-20 lg:py-28">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <h2 className="max-w-[20ch] text-h2">Ваш проект может быть следующим</h2>
            </div>
            <div className="lg:col-span-4">
              <p className="max-w-sm text-sm leading-relaxed text-muted">
                Расскажите о задаче - предложим структуру, формат работы и реалистичный срок.
              </p>
              <LeadButton className="group mt-6 inline-flex h-12 items-center gap-3 bg-fg px-6 text-sm font-medium text-base transition-[background-color,transform] duration-500 ease-[var(--ease-out-expo)] hover:bg-white active:scale-[0.98]">
                Обсудить проект
              </LeadButton>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
