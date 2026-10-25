import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, DownloadSimple, MagnifyingGlass, Tray } from "@phosphor-icons/react/dist/ssr";

import { CopyButton } from "@/components/admin/copy-button";
import { NotifyBadge, StatusBadge } from "@/components/admin/status-badge";
import { LEAD_STATUSES, contactMethodLabel, projectTypeLabel } from "@/lib/constants";
import { listLeads } from "@/lib/leads";
import { formatDate, truncate } from "@/lib/utils";

export const metadata: Metadata = { title: "Заявки" };
export const dynamic = "force-dynamic";

type SearchParams = Promise<{
  q?: string;
  status?: string;
  sort?: string;
  page?: string;
  deleted?: string;
}>;

function buildQuery(params: Record<string, string | undefined>, overrides: Record<string, string | undefined>) {
  const search = new URLSearchParams();
  const merged = { ...params, ...overrides };
  for (const [key, value] of Object.entries(merged)) {
    if (value) search.set(key, value);
  }
  const query = search.toString();
  return query ? `/admin/leads?${query}` : "/admin/leads";
}

export default async function AdminLeadsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const page = Number(params.page ?? "1") || 1;

  const result = await listLeads({
    query: params.q,
    status: params.status,
    sort: params.sort,
    page,
  });

  const baseParams = { q: params.q, status: params.status, sort: params.sort };
  const exportQuery = params.status ? `?status=${params.status}` : "";

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-medium tracking-tight">Заявки</h1>
          <p className="mt-1 text-xs text-[#8a8a8a]">
            {result.total > 0
              ? `Найдено ${result.total}. Внутренние заметки видны только здесь.`
              : "Все обращения с сайта сохраняются в базе данных."}
          </p>
        </div>
        <a
          href={`/api/admin/leads/export${exportQuery}`}
          className="inline-flex h-9 items-center gap-2 border border-[#333] px-3.5 text-xs text-fg transition-colors hover:border-white/40"
        >
          <DownloadSimple size={14} weight="light" aria-hidden="true" />
          Экспорт CSV
        </a>
      </div>

      {params.deleted ? (
        <p className="border border-[#2c3a2f] bg-[#101610] px-4 py-2.5 text-xs text-[#a7c9b0]">
          Заявка удалена.
        </p>
      ) : null}

      <form
        action="/admin/leads"
        method="get"
        className="grid gap-3 border border-[#242424] bg-[#0f0f0f] p-4 md:grid-cols-[1fr_auto_auto_auto]"
      >
        <div className="relative">
          <label htmlFor="q" className="sr-only">
            Поиск по заявкам
          </label>
          <MagnifyingGlass
            size={15}
            weight="light"
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#6f6f6f]"
          />
          <input
            id="q"
            name="q"
            defaultValue={params.q ?? ""}
            placeholder="Имя, контакт, текст заявки"
            className="h-9 w-full border border-[#2c2c2c] bg-[#0c0c0c] pl-9 pr-3 text-xs text-fg outline-none transition-colors focus:border-white/50"
          />
        </div>

        <div>
          <label htmlFor="status" className="sr-only">
            Статус
          </label>
          <select
            id="status"
            name="status"
            defaultValue={params.status ?? ""}
            className="h-9 w-full border border-[#2c2c2c] bg-[#0c0c0c] px-2.5 text-xs text-fg outline-none focus:border-white/50 md:w-[190px]"
          >
            <option value="">Все статусы</option>
            {LEAD_STATUSES.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="sort" className="sr-only">
            Сортировка
          </label>
          <select
            id="sort"
            name="sort"
            defaultValue={params.sort ?? "newest"}
            className="h-9 w-full border border-[#2c2c2c] bg-[#0c0c0c] px-2.5 text-xs text-fg outline-none focus:border-white/50 md:w-[170px]"
          >
            <option value="newest">Сначала новые</option>
            <option value="oldest">Сначала старые</option>
            <option value="status">По статусу</option>
          </select>
        </div>

        <button
          type="submit"
          className="h-9 bg-fg px-4 text-xs font-medium text-base transition-colors hover:bg-white"
        >
          Применить
        </button>
      </form>

      {result.items.length === 0 ? (
        <div className="border border-[#242424] bg-[#0f0f0f] px-5 py-16 text-center">
          <Tray size={26} weight="light" aria-hidden="true" className="mx-auto text-[#5f5f5f]" />
          <p className="mt-4 text-sm text-fg">
            {params.q || params.status ? "Ничего не найдено" : "Заявок пока нет"}
          </p>
          <p className="mx-auto mt-1.5 max-w-sm text-[11px] leading-relaxed text-[#7c7c7c]">
            {params.q || params.status
              ? "Попробуйте изменить запрос или сбросить фильтр статуса."
              : "Отправьте тестовую заявку через форму на сайте, чтобы проверить сохранение и уведомления."}
          </p>
          {params.q || params.status ? (
            <Link
              href="/admin/leads"
              className="mt-5 inline-flex h-9 items-center border border-[#333] px-4 text-[11px] text-fg hover:border-white/40"
            >
              Сбросить фильтры
            </Link>
          ) : null}
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-x-auto border border-[#242424] bg-[#0f0f0f] md:block">
            <table className="w-full min-w-[980px] text-left text-xs">
              <thead className="border-b border-[#242424] font-mono text-[9px] uppercase tracking-[0.14em] text-[#6f6f6f]">
                <tr>
                  <th className="px-4 py-2.5 font-normal">№</th>
                  <th className="px-3 py-2.5 font-normal">Дата</th>
                  <th className="px-3 py-2.5 font-normal">Клиент</th>
                  <th className="px-3 py-2.5 font-normal">Контакт</th>
                  <th className="px-3 py-2.5 font-normal">Проект</th>
                  <th className="px-3 py-2.5 font-normal">Бюджет</th>
                  <th className="px-3 py-2.5 font-normal">Статус</th>
                  <th className="px-4 py-2.5 font-normal">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1f1f1f]">
                {result.items.map((lead) => (
                  <tr key={lead.id} className="transition-colors hover:bg-white/[0.02]">
                    <td className="px-4 py-3 font-mono text-[#9a9a9a]">{lead.number}</td>
                    <td className="px-3 py-3 text-[#8a8a8a]">{formatDate(lead.createdAt, true)}</td>
                    <td className="px-3 py-3">
                      <Link href={`/admin/leads/${lead.id}`} className="text-fg hover:underline">
                        {lead.name}
                      </Link>
                      <span className="mt-0.5 block text-[10px] text-[#6f6f6f]">
                        {contactMethodLabel(lead.preferredContactMethod)}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-[#b0b0b0]">{truncate(lead.contact, 28)}</td>
                    <td className="px-3 py-3 text-[#9a9a9a]">{projectTypeLabel(lead.projectType)}</td>
                    <td className="px-3 py-3 text-[#9a9a9a]">{lead.budget ?? "не указан"}</td>
                    <td className="px-3 py-3">
                      <StatusBadge status={lead.status} />
                      <span className="mt-1 block">
                        <NotifyBadge status={lead.notifyStatus} />
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/leads/${lead.id}`}
                          className="inline-flex h-8 items-center gap-1.5 border border-[#2f2f2f] px-2.5 text-[11px] text-[#c0c0c0] transition-colors hover:border-white/30 hover:text-fg"
                        >
                          Открыть
                          <ArrowUpRight size={12} aria-hidden="true" />
                        </Link>
                        <CopyButton value={lead.contact} label="Контакт" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="grid gap-2 md:hidden">
            {result.items.map((lead) => (
              <div key={lead.id} className="border border-[#242424] bg-[#0f0f0f] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm text-fg">
                      <span className="font-mono text-[10px] text-[#6f6f6f]">№{lead.number}</span>{" "}
                      {lead.name}
                    </p>
                    <p className="mt-1 text-[11px] text-[#9a9a9a]">{lead.contact}</p>
                  </div>
                  <StatusBadge status={lead.status} />
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 border-t border-[#242424] pt-3 text-[11px] text-[#7c7c7c]">
                  <span>{projectTypeLabel(lead.projectType)}</span>
                  <span>{lead.budget ?? "Бюджет не указан"}</span>
                  <span>{formatDate(lead.createdAt, true)}</span>
                  <span>{contactMethodLabel(lead.preferredContactMethod)}</span>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <Link
                    href={`/admin/leads/${lead.id}`}
                    className="inline-flex h-8 flex-1 items-center justify-center border border-[#2f2f2f] text-[11px] text-fg"
                  >
                    Открыть заявку
                  </Link>
                  <CopyButton value={lead.contact} label="Контакт" />
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#242424] pt-4">
            <p className="text-[11px] text-[#7c7c7c]">
              Страница {result.page} из {result.pageCount}
            </p>
            <div className="flex items-center gap-2">
              {result.page > 1 ? (
                <Link
                  href={buildQuery(baseParams, { page: String(result.page - 1) })}
                  className="inline-flex h-8 items-center border border-[#2f2f2f] px-3 text-[11px] text-fg hover:border-white/30"
                >
                  Назад
                </Link>
              ) : null}
              {result.page < result.pageCount ? (
                <Link
                  href={buildQuery(baseParams, { page: String(result.page + 1) })}
                  className="inline-flex h-8 items-center border border-[#2f2f2f] px-3 text-[11px] text-fg hover:border-white/30"
                >
                  Далее
                </Link>
              ) : null}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
