import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowClockwise, EnvelopeSimple, Warning } from "@phosphor-icons/react/dist/ssr";

import { ActionForm } from "@/components/admin/action-form";
import { CopyButton } from "@/components/admin/copy-button";
import { DeleteForm } from "@/components/admin/delete-form";
import { SelectField, TextArea } from "@/components/admin/fields";
import { NotifyBadge, StatusBadge } from "@/components/admin/status-badge";
import { deleteLeadAction, retryNotificationsAction, updateLeadAction } from "@/actions/leads";
import { LEAD_STATUSES, contactMethodLabel, projectTypeLabel } from "@/lib/constants";
import { getLead } from "@/lib/leads";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Заявка" };
export const dynamic = "force-dynamic";

export default async function LeadDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ retried?: string }>;
}) {
  const { id } = await params;
  const { retried } = await searchParams;
  const lead = await getLead(id);
  if (!lead) notFound();

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/admin/leads"
          className="inline-flex items-center gap-2 text-[11px] text-[#9a9a9a] transition-colors hover:text-fg"
        >
          <ArrowLeft size={13} aria-hidden="true" />
          Все заявки
        </Link>
        <div className="flex items-center gap-2">
          <CopyButton value={lead.contact} label="Копировать контакт" />
          <DeleteForm
            action={deleteLeadAction}
            id={lead.id}
            title={`Удалить заявку №${lead.number}?`}
            description="Заявка и связанные записи об уведомлениях будут удалены из базы без возможности восстановления."
            label="Удалить заявку"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-start justify-between gap-4 border border-[#242424] bg-[#0f0f0f] p-5">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#6f6f6f]">
            Заявка №{lead.number} · {formatDate(lead.createdAt, true)}
          </p>
          <h1 className="mt-2 text-xl font-medium tracking-tight">{lead.name}</h1>
          <p className="mt-1 text-xs text-[#9a9a9a]">
            {projectTypeLabel(lead.projectType)} · {contactMethodLabel(lead.preferredContactMethod)}
          </p>
        </div>
        <div className="flex flex-col items-start gap-2">
          <StatusBadge status={lead.status} />
          <NotifyBadge status={lead.notifyStatus} />
        </div>
      </div>

      {retried ? (
        <p className="border border-[#2c3a2f] bg-[#101610] px-4 py-2.5 text-xs text-[#a7c9b0]">
          Повторная отправка уведомлений выполнена. Проверьте статус в блоке ниже.
        </p>
      ) : null}

      <div className="grid gap-5 xl:grid-cols-3">
        <div className="grid gap-5 xl:col-span-2">
          <section className="border border-[#242424] bg-[#0f0f0f]">
            <div className="border-b border-[#242424] px-5 py-3.5">
              <h2 className="text-sm text-fg">Данные обращения</h2>
            </div>
            <dl className="grid gap-0 text-xs sm:grid-cols-2">
              {[
                { label: "Имя", value: lead.name },
                { label: "Контакт", value: lead.contact },
                { label: "Способ связи", value: contactMethodLabel(lead.preferredContactMethod) },
                { label: "Тип проекта", value: projectTypeLabel(lead.projectType) },
                { label: "Бюджет", value: lead.budget ?? "не указан" },
                { label: "Согласие", value: lead.privacyConsent ? "получено" : "нет" },
                { label: "Источник", value: lead.source },
                { label: "Создана", value: formatDate(lead.createdAt, true) },
                { label: "Обновлена", value: formatDate(lead.updatedAt, true) },
                { label: "User agent", value: lead.userAgent ?? "не сохранён" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="border-b border-[#1f1f1f] px-5 py-3 last:border-b-0 sm:odd:border-r"
                >
                  <dt className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#6f6f6f]">
                    {item.label}
                  </dt>
                  <dd className="mt-1 break-words text-[#d0d0d0]">{item.value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="border border-[#242424] bg-[#0f0f0f]">
            <div className="border-b border-[#242424] px-5 py-3.5">
              <h2 className="text-sm text-fg">Комментарий клиента</h2>
            </div>
            <div className="px-5 py-4">
              {lead.message ? (
                <p className="whitespace-pre-line text-sm leading-relaxed text-[#c0c0c0]">
                  {lead.message}
                </p>
              ) : (
                <p className="text-xs text-[#6f6f6f]">Комментарий не указан.</p>
              )}
            </div>
          </section>

          <section className="border border-[#242424] bg-[#0f0f0f]">
            <div className="border-b border-[#242424] px-5 py-3.5">
              <h2 className="text-sm text-fg">Статус и внутренние заметки</h2>
              <p className="mt-1 text-[11px] text-[#6f6f6f]">
                Заметки не отображаются на публичном сайте.
              </p>
            </div>
            <div className="p-5">
              <ActionForm action={updateLeadAction} submitLabel="Сохранить изменения">
                <input type="hidden" name="leadId" value={lead.id} />
                <SelectField
                  label="Статус заявки"
                  name="status"
                  defaultValue={lead.status}
                  options={LEAD_STATUSES.map((status) => ({
                    value: status.value,
                    label: status.label,
                  }))}
                />
                <TextArea
                  label="Внутренние заметки"
                  name="internalNotes"
                  defaultValue={lead.internalNotes}
                  rows={5}
                  hint="История общения, договорённости, следующий шаг. Видно только в панели управления."
                />
              </ActionForm>
            </div>
          </section>
        </div>

        <div className="grid gap-5">
          <section className="border border-[#242424] bg-[#0f0f0f]">
            <div className="flex items-center justify-between gap-3 border-b border-[#242424] px-5 py-3.5">
              <h2 className="text-sm text-fg">Уведомления</h2>
              <form action={retryNotificationsAction}>
                <input type="hidden" name="leadId" value={lead.id} />
                <button
                  type="submit"
                  className="inline-flex h-8 items-center gap-1.5 border border-[#333] px-2.5 text-[10px] text-[#c0c0c0] transition-colors hover:border-white/40 hover:text-fg"
                >
                  <ArrowClockwise size={12} weight="light" aria-hidden="true" />
                  Повторить
                </button>
              </form>
            </div>

            <div className="px-5 py-4">
              <p className="text-[11px] leading-relaxed text-[#7c7c7c]">
                Заявка сохраняется независимо от доставки уведомлений. Каждая попытка фиксируется
                в журнале.
              </p>

              {lead.notifications.length === 0 ? (
                <p className="mt-4 border border-[#262626] bg-[#0c0c0c] px-3 py-3 text-[11px] text-[#7c7c7c]">
                  Записей пока нет.
                </p>
              ) : (
                <ul className="mt-4 grid gap-2">
                  {lead.notifications.map((entry) => (
                    <li key={entry.id} className="border border-[#262626] bg-[#0c0c0c] px-3 py-2.5">
                      <div className="flex items-center justify-between gap-2 text-[11px]">
                        <span className="font-mono uppercase tracking-[0.1em] text-[#9a9a9a]">
                          {entry.channel}
                        </span>
                        <span
                          className={
                            entry.status === "sent"
                              ? "text-[#8fd3a4]"
                              : entry.status === "failed"
                                ? "text-[#e09191]"
                                : "text-[#7c7c7c]"
                          }
                        >
                          {entry.status === "sent"
                            ? "отправлено"
                            : entry.status === "failed"
                              ? "ошибка"
                              : "пропущено"}
                        </span>
                      </div>
                      <p className="mt-1 text-[10px] text-[#6f6f6f]">
                        {formatDate(entry.createdAt, true)}
                      </p>
                      {entry.detail ? (
                        <p className="mt-1.5 flex gap-1.5 break-words text-[10px] leading-relaxed text-[#8a8a8a]">
                          <Warning size={11} aria-hidden="true" className="mt-0.5 shrink-0" />
                          {entry.detail}
                        </p>
                      ) : null}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          <section className="border border-[#242424] bg-[#0f0f0f] p-5">
            <h2 className="text-sm text-fg">Быстрая связь</h2>
            <p className="mt-1.5 text-[11px] leading-relaxed text-[#7c7c7c]">
              Способ связи выбран клиентом: {contactMethodLabel(lead.preferredContactMethod)}.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {lead.preferredContactMethod === "email" ? (
                <a
                  href={`mailto:${lead.contact}`}
                  className="inline-flex h-9 items-center gap-2 bg-fg px-4 text-[11px] font-medium text-base hover:bg-white"
                >
                  <EnvelopeSimple size={14} weight="light" aria-hidden="true" />
                  Написать
                </a>
              ) : null}
              <CopyButton value={lead.contact} label="Скопировать контакт" />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
