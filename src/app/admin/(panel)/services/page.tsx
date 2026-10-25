import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Plus, Stack } from "@phosphor-icons/react/dist/ssr";

import { DeleteForm } from "@/components/admin/delete-form";
import { PublishedBadge } from "@/components/admin/status-badge";
import { deleteServiceAction, toggleServiceAction } from "@/actions/content";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Услуги" };
export const dynamic = "force-dynamic";

export default async function AdminServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ deleted?: string }>;
}) {
  const { deleted } = await searchParams;
  const services = await prisma.service.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-medium tracking-tight">Услуги</h1>
          <p className="mt-1 text-xs text-[#8a8a8a]">
            Названия, описания и цены выводятся на главной и в разделе услуг.
          </p>
        </div>
        <Link
          href="/admin/services/new"
          className="inline-flex h-9 items-center gap-2 bg-fg px-4 text-xs font-medium text-base transition-colors hover:bg-white"
        >
          <Plus size={14} weight="bold" aria-hidden="true" />
          Добавить услугу
        </Link>
      </div>

      {deleted ? (
        <p className="border border-[#2c3a2f] bg-[#101610] px-4 py-2.5 text-xs text-[#a7c9b0]">
          Услуга удалена.
        </p>
      ) : null}

      {services.length === 0 ? (
        <div className="border border-[#242424] bg-[#0f0f0f] px-5 py-16 text-center">
          <Stack size={26} weight="light" aria-hidden="true" className="mx-auto text-[#5f5f5f]" />
          <p className="mt-4 text-sm text-fg">Услуг пока нет</p>
          <Link
            href="/admin/services/new"
            className="mt-5 inline-flex h-9 items-center border border-[#333] px-4 text-[11px] text-fg hover:border-white/40"
          >
            Создать услугу
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto border border-[#242424] bg-[#0f0f0f]">
          <table className="w-full min-w-[780px] text-left text-xs">
            <thead className="border-b border-[#242424] font-mono text-[9px] uppercase tracking-[0.14em] text-[#6f6f6f]">
              <tr>
                <th className="px-4 py-2.5 font-normal">Порядок</th>
                <th className="px-3 py-2.5 font-normal">Услуга</th>
                <th className="px-3 py-2.5 font-normal">Цена</th>
                <th className="px-3 py-2.5 font-normal">Статус</th>
                <th className="px-4 py-2.5 font-normal">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1f1f1f]">
              {services.map((service) => (
                <tr key={service.id} className="transition-colors hover:bg-white/[0.02]">
                  <td className="px-4 py-3 font-mono text-[#9a9a9a]">{service.sortOrder}</td>
                  <td className="px-3 py-3">
                    <Link href={`/admin/services/${service.id}`} className="text-fg hover:underline">
                      {service.title}
                    </Link>
                    <span className="mt-0.5 block font-mono text-[10px] text-[#6f6f6f]">
                      {service.slug}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-[#9a9a9a]">
                    {"Стоимость по договорённости"}
                  </td>
                  <td className="px-3 py-3">
                    <PublishedBadge published={service.published} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={`/admin/services/${service.id}`}
                        className="inline-flex h-8 items-center gap-1.5 border border-[#2f2f2f] px-2.5 text-[11px] text-[#c0c0c0] hover:border-white/30 hover:text-fg"
                      >
                        Изменить
                        <ArrowUpRight size={11} aria-hidden="true" />
                      </Link>
                      <form action={toggleServiceAction}>
                        <input type="hidden" name="id" value={service.id} />
                        <input type="hidden" name="published" value={String(!service.published)} />
                        <button
                          type="submit"
                          className="inline-flex h-8 items-center border border-[#2f2f2f] px-2.5 text-[11px] text-[#c0c0c0] transition-colors hover:border-white/30 hover:text-fg"
                        >
                          {service.published ? "Снять" : "Опубликовать"}
                        </button>
                      </form>
                      <DeleteForm
                        action={deleteServiceAction}
                        id={service.id}
                        title={`Удалить «${service.title}»?`}
                        description="Услуга будет удалена из базы. Заявки, связанные с этим типом проекта, сохранятся."
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
