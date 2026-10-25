import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";

import { ProjectForm } from "@/components/admin/project-form";

export const metadata: Metadata = { title: "Новый проект" };

export default function NewProjectPage() {
  return (
    <div className="grid gap-5">
      <div>
        <Link
          href="/admin/projects"
          className="inline-flex items-center gap-2 text-[11px] text-[#9a9a9a] hover:text-fg"
        >
          <ArrowLeft size={13} aria-hidden="true" />
          Проекты
        </Link>
        <h1 className="mt-3 text-xl font-medium tracking-tight">Новый проект</h1>
        <p className="mt-1 text-xs text-[#8a8a8a]">
          После сохранения откроется страница редактирования с публичной ссылкой.
        </p>
      </div>

      <ProjectForm />
    </div>
  );
}
