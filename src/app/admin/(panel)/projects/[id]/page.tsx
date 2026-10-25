import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";

import { ProjectForm } from "@/components/admin/project-form";
import { DeleteForm } from "@/components/admin/delete-form";
import { deleteProjectAction } from "@/actions/content";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Редактирование проекта" };
export const dynamic = "force-dynamic";

export default async function EditProjectPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const { id } = await params;
  const { saved } = await searchParams;
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) notFound();

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link
            href="/admin/projects"
            className="inline-flex items-center gap-2 text-[11px] text-[#9a9a9a] hover:text-fg"
          >
            <ArrowLeft size={13} aria-hidden="true" />
            Проекты
          </Link>
          <h1 className="mt-3 text-xl font-medium tracking-tight">{project.title}</h1>
          <p className="mt-1 font-mono text-[10px] text-[#6f6f6f]">/projects/{project.slug}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {project.published ? (
            <Link
              href={`/projects/${project.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-8 items-center gap-1.5 border border-[#2f2f2f] px-2.5 text-[11px] text-fg hover:border-white/30"
            >
              Открыть на сайте
              <ArrowUpRight size={11} aria-hidden="true" />
            </Link>
          ) : null}
          <DeleteForm
            action={deleteProjectAction}
            id={project.id}
            title={`Удалить «${project.title}»?`}
            description="Проект и его страница будут удалены из базы. Действие нельзя отменить."
          />
        </div>
      </div>

      {saved ? (
        <p className="border border-[#2c3a2f] bg-[#101610] px-4 py-2.5 text-xs text-[#a7c9b0]">
          Проект сохранён. Публичная страница обновлена.
        </p>
      ) : null}

      <ProjectForm project={project} />
    </div>
  );
}
