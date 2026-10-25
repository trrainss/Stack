import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, FolderOpen, Plus } from "@phosphor-icons/react/dist/ssr";

import { DeleteForm } from "@/components/admin/delete-form";
import { PublishedBadge } from "@/components/admin/status-badge";
import { deleteProjectAction, toggleProjectAction } from "@/actions/content";
import { prisma } from "@/lib/prisma";
import { projectCategoryLabel } from "@/lib/constants";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Проекты" };
export const dynamic = "force-dynamic";

export default async function AdminProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ deleted?: string }>;
}) {
  const { deleted } = await searchParams;
  const projects = await prisma.project.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-medium tracking-tight">Проекты</h1>
          <p className="mt-1 text-xs text-[#8a8a8a]">
            Кейсы для главной страницы и раздела «Проекты». Порядок задаётся полем сортировки.
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="inline-flex h-9 items-center gap-2 bg-fg px-4 text-xs font-medium text-base transition-colors hover:bg-white"
        >
          <Plus size={14} weight="bold" aria-hidden="true" />
          Добавить проект
        </Link>
      </div>

      {deleted ? (
        <p className="border border-[#2c3a2f] bg-[#101610] px-4 py-2.5 text-xs text-[#a7c9b0]">
          Проект удалён.
        </p>
      ) : null}

      {projects.length === 0 ? (
        <div className="border border-[#242424] bg-[#0f0f0f] px-5 py-16 text-center">
          <FolderOpen size={26} weight="light" aria-hidden="true" className="mx-auto text-[#5f5f5f]" />
          <p className="mt-4 text-sm text-fg">Проектов пока нет</p>
          <p className="mx-auto mt-1.5 max-w-sm text-[11px] leading-relaxed text-[#7c7c7c]">
            Добавьте первый кейс. Пока он не опубликован, он виден только в панели управления.
          </p>
          <Link
            href="/admin/projects/new"
            className="mt-5 inline-flex h-9 items-center border border-[#333] px-4 text-[11px] text-fg hover:border-white/40"
          >
            Создать проект
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto border border-[#242424] bg-[#0f0f0f]">
          <table className="w-full min-w-[860px] text-left text-xs">
            <thead className="border-b border-[#242424] font-mono text-[9px] uppercase tracking-[0.14em] text-[#6f6f6f]">
              <tr>
                <th className="px-4 py-2.5 font-normal">Обложка</th>
                <th className="px-3 py-2.5 font-normal">Название</th>
                <th className="px-3 py-2.5 font-normal">Категория</th>
                <th className="px-3 py-2.5 font-normal">Порядок</th>
                <th className="px-3 py-2.5 font-normal">Статус</th>
                <th className="px-4 py-2.5 font-normal">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1f1f1f]">
              {projects.map((project) => (
                <tr key={project.id} className="transition-colors hover:bg-white/[0.02]">
                  <td className="px-4 py-3">
                    <img
                      src={project.coverImage || "/projects/aster-cover.svg"}
                      alt=""
                      width={80}
                      height={60}
                      className="h-[46px] w-[62px] border border-[#2a2a2a] object-cover"
                    />
                  </td>
                  <td className="px-3 py-3">
                    <Link href={`/admin/projects/${project.id}`} className="text-fg hover:underline">
                      {project.title}
                    </Link>
                    <span className="mt-0.5 block font-mono text-[10px] text-[#6f6f6f]">
                      /projects/{project.slug}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-[#9a9a9a]">
                    {projectCategoryLabel(project.category)}
                  </td>
                  <td className="px-3 py-3 font-mono text-[#9a9a9a]">{project.sortOrder}</td>
                  <td className="px-3 py-3">
                    <PublishedBadge published={project.published} />
                    <span className="mt-1 block text-[10px] text-[#6f6f6f]">
                      {formatDate(project.updatedAt)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={`/admin/projects/${project.id}`}
                        className="inline-flex h-8 items-center gap-1.5 border border-[#2f2f2f] px-2.5 text-[11px] text-[#c0c0c0] hover:border-white/30 hover:text-fg"
                      >
                        Изменить
                        <ArrowUpRight size={11} aria-hidden="true" />
                      </Link>
                      <form action={toggleProjectAction}>
                        <input type="hidden" name="id" value={project.id} />
                        <input type="hidden" name="published" value={String(!project.published)} />
                        <button
                          type="submit"
                          className="inline-flex h-8 items-center border border-[#2f2f2f] px-2.5 text-[11px] text-[#c0c0c0] transition-colors hover:border-white/30 hover:text-fg"
                        >
                          {project.published ? "Снять" : "Опубликовать"}
                        </button>
                      </form>
                      <DeleteForm
                        action={deleteProjectAction}
                        id={project.id}
                        title={`Удалить «${project.title}»?`}
                        description="Проект и его страница будут удалены из базы. Действие нельзя отменить."
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
