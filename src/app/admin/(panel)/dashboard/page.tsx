import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpRight,
  ChartBar,
  CheckCircle,
  Clock,
  FolderOpen,
  Plus,
  Tray,
  Warning,
} from "@phosphor-icons/react/dist/ssr";

import { NotifyBadge, StatusBadge } from "@/components/admin/status-badge";
import { getLeadStats } from "@/lib/leads";
import { getSiteContent, isEnabled } from "@/lib/settings";
import { formatDate, truncate } from "@/lib/utils";

export const metadata: Metadata = { title: "Обзор" };
export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [stats, content] = await Promise.all([getLeadStats(), getSiteContent()]);
  const maxDay = Math.max(1, ...stats.days.map((day) => day.count));
  const telegramOn = isEnabled(content["notify.telegram.enabled"]);
  const emailOn = isEnabled(content["notify.email.enabled"]);

  const cards = [
    { label: "Всего заявок", value: stats.total, icon: Tray, href: "/admin/leads" },
    { label: "Новые", value: stats.new, icon: Plus, href: "/admin/leads?status=new" },
    { label: "В работе", value: stats.inProgress, icon: Clock, href: "/admin/leads?status=in_progress" },
    { label: "Завершены", value: stats.done, icon: CheckCircle, href: "/admin/leads?status=done" },
  ];

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-medium tracking-tight">Обзор</h1>
          <p className="mt-1 text-xs text-[#8a8a8a]">
            Сводка по обращениям и быстрые действия. Данные обновляются при каждом открытии.
          </p>
        </div>
        <Link
          href="/admin/leads"
          className="inline-flex h-9 items-center gap-2 border border-[#333] px-3.5 text-xs text-fg transition-colors hover:border-white/40"
        >
          Все заявки
          <ArrowUpRight size={13} aria-hidden="true" />
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              href={card.href}
              className="group border border-[#242424] bg-[#0f0f0f] p-4 transition-colors duration-300 hover:border-[#3a3a3a]"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#8a8a8a]">
                  {card.label}
                </span>
                <Icon size={15} weight="light" aria-hidden="true" className="text-[#5f5f5f]" />
              </div>
              <p className="mt-4 font-mono text-3xl tracking-tight text-fg">{card.value}</p>
            </Link>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <section className="border border-[#242424] bg-[#0f0f0f] xl:col-span-2">
          <div className="flex items-center justify-between border-b border-[#242424] px-5 py-3.5">
            <div className="flex items-center gap-2">
              <ChartBar size={15} weight="light" aria-hidden="true" className="text-[#8a8a8a]" />
              <h2 className="text-sm text-fg">Заявки за 14 дней</h2>
            </div>
            <span className="font-mono text-[10px] tracking-[0.1em] text-[#6f6f6f]">
              {stats.days.reduce((sum, day) => sum + day.count, 0)} всего
            </span>
          </div>
          <div className="p-5">
            <div className="flex h-[180px] items-end gap-1.5">
              {stats.days.map((day) => (
                <div key={day.date} className="group flex h-full flex-1 flex-col justify-end">
                  <div className="relative flex h-full items-end">
                    <div
                      className="w-full bg-[#2b2b2b] transition-colors duration-300 group-hover:bg-[#4a4a4a]"
                      style={{ height: `${Math.max(day.count === 0 ? 2 : 8, (day.count / maxDay) * 100)}%` }}
                      title={`${day.label}: ${day.count}`}
                    />
                  </div>
                  <span className="mt-2 hidden text-center font-mono text-[8px] text-[#5f5f5f] sm:block">
                    {day.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border border-[#242424] bg-[#0f0f0f]">
          <div className="border-b border-[#242424] px-5 py-3.5">
            <h2 className="text-sm text-fg">Уведомления</h2>
          </div>
          <div className="grid gap-3 p-5 text-xs">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[#9a9a9a]">Telegram</span>
              <span className={telegramOn ? "text-[#8fd3a4]" : "text-[#7c7c7c]"}>
                {telegramOn ? "Включены" : "Выключены"}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-[#9a9a9a]">Email</span>
              <span className={emailOn ? "text-[#8fd3a4]" : "text-[#7c7c7c]"}>
                {emailOn ? "Включены" : "Выключены"}
              </span>
            </div>
            {!telegramOn && !emailOn ? (
              <p className="mt-1 flex gap-2 border border-[#3a3320] bg-[#161308] p-3 text-[11px] leading-relaxed text-[#d8b26a]">
                <Warning size={14} weight="light" aria-hidden="true" className="mt-0.5 shrink-0" />
                <span>
                  Уведомления отключены. Заявки сохраняются в базе, но узнать о них можно только в
                  панели. Настроить каналы можно в разделе «Настройки».
                </span>
              </p>
            ) : null}
            <Link
              href="/admin/settings"
              className="mt-2 inline-flex h-9 items-center justify-center border border-[#333] px-3 text-[11px] text-fg transition-colors hover:border-white/40"
            >
              Настроить уведомления
            </Link>
          </div>
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <section className="border border-[#242424] bg-[#0f0f0f] xl:col-span-2">
          <div className="flex items-center justify-between border-b border-[#242424] px-5 py-3.5">
            <h2 className="text-sm text-fg">Последние обращения</h2>
            <Link href="/admin/leads" className="text-[11px] text-[#9a9a9a] hover:text-fg">
              Смотреть все
            </Link>
          </div>

          {stats.recent.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <p className="text-sm text-[#9a9a9a]">Заявок пока нет</p>
              <p className="mt-1 text-[11px] text-[#6f6f6f]">
                Новая заявка появится здесь сразу после отправки формы на сайте.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-xs">
                <thead className="border-b border-[#242424] font-mono text-[9px] uppercase tracking-[0.14em] text-[#6f6f6f]">
                  <tr>
                    <th className="px-5 py-2.5 font-normal">№</th>
                    <th className="px-3 py-2.5 font-normal">Клиент</th>
                    <th className="px-3 py-2.5 font-normal">Контакт</th>
                    <th className="px-3 py-2.5 font-normal">Статус</th>
                    <th className="px-5 py-2.5 font-normal">Дата</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1f1f1f]">
                  {stats.recent.map((lead) => (
                    <tr key={lead.id} className="transition-colors hover:bg-white/[0.02]">
                      <td className="px-5 py-3 font-mono text-[#9a9a9a]">{lead.number}</td>
                      <td className="px-3 py-3">
                        <Link href={`/admin/leads/${lead.id}`} className="text-fg hover:underline">
                          {lead.name}
                        </Link>
                      </td>
                      <td className="px-3 py-3 text-[#9a9a9a]">{truncate(lead.contact, 26)}</td>
                      <td className="px-3 py-3">
                        <StatusBadge status={lead.status} />
                      </td>
                      <td className="px-5 py-3 text-[#7c7c7c]">{formatDate(lead.createdAt, true)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="border border-[#242424] bg-[#0f0f0f]">
          <div className="border-b border-[#242424] px-5 py-3.5">
            <h2 className="text-sm text-fg">Быстрые действия</h2>
          </div>
          <div className="grid gap-2 p-5">
            {[
              { href: "/admin/projects/new", label: "Добавить проект" },
              { href: "/admin/services/new", label: "Добавить услугу" },
              { href: "/admin/faq", label: "Отредактировать FAQ" },
              { href: "/admin/homepage", label: "Тексты главной" },
              { href: "/admin/contacts", label: "Контакты и ссылки" },
            ].map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="flex items-center justify-between gap-3 border border-[#262626] bg-[#0d0d0d] px-3 py-2.5 text-[12px] text-[#c0c0c0] transition-colors hover:border-[#3a3a3a] hover:text-fg"
              >
                <span>{action.label}</span>
                <ArrowUpRight size={12} aria-hidden="true" />
              </Link>
            ))}
            <div className="mt-2 border-t border-[#242424] pt-3">
              <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#6f6f6f]">
                Статусы заявок
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <span className="text-[11px] text-[#9a9a9a]">На рассмотрении: {stats.review}</span>
                <span className="text-[#3a3a3a]">/</span>
                <span className="text-[11px] text-[#9a9a9a]">Отклонено: {stats.rejected}</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="border border-[#242424] bg-[#0f0f0f] p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-sm text-fg">Публикация сайта</h2>
            <p className="mt-1 text-[11px] leading-relaxed text-[#7c7c7c]">
              Изменения в разделах панели сразу попадают на публичные страницы. Кэш контента
              сбрасывается автоматически после сохранения.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <FolderOpen size={16} weight="light" aria-hidden="true" className="text-[#7c7c7c]" />
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 items-center gap-2 border border-[#333] px-3.5 text-xs text-fg transition-colors hover:border-white/40"
            >
              Открыть сайт
              <ArrowUpRight size={13} aria-hidden="true" />
            </Link>
          </div>
        </div>
        {stats.recent[0] ? (
          <p className="mt-4 flex items-center gap-2 border-t border-[#242424] pt-3 text-[11px] text-[#7c7c7c]">
            Последняя заявка: №{stats.recent[0].number}, {formatDate(stats.recent[0].createdAt, true)}
            <span aria-hidden="true">·</span>
            <NotifyBadge status={stats.recent[0].notifyStatus} />
          </p>
        ) : null}
      </section>
    </div>
  );
}
