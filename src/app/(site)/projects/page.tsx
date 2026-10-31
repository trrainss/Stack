import type { Metadata } from "next";
import { ArrowUpRight, Sparkle } from "@phosphor-icons/react/dist/ssr";

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
        meta={`${projects.length} реализованных проектов`}
      />

      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container-page">
          {/* Note callout explaining live works */}
          <div className="mb-12 rounded-2xl border border-emerald-500/25 bg-emerald-950/20 p-5 sm:p-6">
            <div className="flex items-start gap-3.5">
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                <Sparkle size={16} weight="bold" />
              </span>
              <div>
                <p className="text-sm font-medium text-emerald-200">
                  Сайт STACKLAB — одна из наших собственных разработок
                </p>
                <p className="mt-1 text-xs leading-relaxed text-emerald-300/80">
                  Мы создали этот сайт с нуля, чтобы показать на практике качество нашего кода,
                  анимации и визуальный стиль. Ниже представлены другие проекты, созданные и
                  запущенные для бизнеса со сроком до 5 дней.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-12 sm:gap-14 md:grid-cols-2">
            {projects.map((project, index) => (
              <Reveal key={project.id} delay={(index % 2) * 0.06}>
                <ProjectCard project={project} index={index} priority={index < 2} />
              </Reveal>
            ))}
          </div>

          <div className="mt-16 rounded-2xl border border-line bg-surface p-6 sm:p-8">
            <p className="mono-label text-[#cbd5e1]">Прозрачный подход</p>
            <h3 className="mt-2 text-xl font-medium tracking-tight">
              Запустим ваш сайт за 5 дней
            </h3>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
              Каждый сайт создаётся с учётом индивидуальных задач вашего бизнеса: от презентации
              услуг до приёма заказов. Вы можете перейти по ссылкам на действующие сайты и оценить
              их скорость работы.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-line bg-surface">
        <div className="container-page py-20 lg:py-28">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <h2 className="max-w-[22ch] text-h2">Хотите такой же результат?</h2>
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted">
                Расскажите о вашей задаче. Ответим в течение 2 часов, рассчитаем точный срок (до 5
                дней) и согласуем структуру будущего сайта.
              </p>
            </div>
            <div className="lg:col-span-4">
              <LeadButton className="group inline-flex h-12 items-center gap-3 bg-fg px-6 text-sm font-medium text-base transition-[background-color,transform] duration-500 ease-[var(--ease-out-expo)] hover:bg-white active:scale-[0.98]">
                <span>Обсудить задачу</span>
                <ArrowUpRight size={16} weight="bold" />
              </LeadButton>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
