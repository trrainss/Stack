import type { Metadata } from "next";
import { Plus, Question } from "@phosphor-icons/react/dist/ssr";

import { ActionForm } from "@/components/admin/action-form";
import { DeleteForm } from "@/components/admin/delete-form";
import { Field, FormSection, TextArea, Toggle } from "@/components/admin/fields";
import { PublishedBadge } from "@/components/admin/status-badge";
import { deleteFaqAction, saveFaqAction } from "@/actions/content";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "FAQ" };
export const dynamic = "force-dynamic";

export default async function AdminFaqPage() {
  const items = await prisma.faq.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });

  return (
    <div className="grid gap-5">
      <div>
        <h1 className="text-xl font-medium tracking-tight">FAQ</h1>
        <p className="mt-1 max-w-2xl text-xs leading-relaxed text-[#8a8a8a]">
          Вопросы и ответы на главной странице. Ответы должны быть честными: не обещайте
          гарантированный рост продаж и не указывайте выдуманные сроки.
        </p>
      </div>

      <FormSection
        title="Добавить вопрос"
        description="Новый вопрос появится на сайте сразу после сохранения."
      >
        <ActionForm action={saveFaqAction} submitLabel="Добавить вопрос" compact>
          <div className="grid gap-4">
            <Field label="Вопрос" name="question" required />
            <TextArea label="Ответ" name="answer" rows={4} required />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Порядок"
                name="sortOrder"
                type="number"
                min={0}
                max={9999}
                defaultValue={items.length * 10}
              />
              <div className="flex items-end">
                <div className="w-full">
                  <Toggle label="Опубликовать" name="published" defaultChecked />
                </div>
              </div>
            </div>
          </div>
        </ActionForm>
      </FormSection>

      {items.length === 0 ? (
        <div className="border border-[#242424] bg-[#0f0f0f] px-5 py-14 text-center">
          <Question size={24} weight="light" aria-hidden="true" className="mx-auto text-[#5f5f5f]" />
          <p className="mt-3 text-sm text-fg">Вопросов пока нет</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {items.map((item, index) => (
            <div key={item.id} className="border border-[#242424] bg-[#0f0f0f]">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#242424] px-4 py-2.5">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] text-[#6f6f6f]">
                    {String(index + 1).padStart(2, "0")} · sort {item.sortOrder}
                  </span>
                  <PublishedBadge published={item.published} />
                </div>
                <div className="flex items-center gap-2">
                  <DeleteForm
                    action={deleteFaqAction}
                    id={item.id}
                    title="Удалить вопрос?"
                    description="Вопрос и ответ будут удалены с сайта и из базы данных."
                  />
                </div>
              </div>

              <div className="p-4">
                <ActionForm action={saveFaqAction} submitLabel="Сохранить" compact>
                  <input type="hidden" name="id" value={item.id} />
                  <Field label="Вопрос" name="question" defaultValue={item.question} required />
                  <TextArea label="Ответ" name="answer" defaultValue={item.answer} rows={4} required />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field
                      label="Порядок"
                      name="sortOrder"
                      type="number"
                      min={0}
                      max={9999}
                      defaultValue={item.sortOrder}
                    />
                    <div className="flex items-end">
                      <div className="w-full">
                        <Toggle
                          label="Опубликовано"
                          name="published"
                          defaultChecked={item.published}
                        />
                      </div>
                    </div>
                  </div>
                </ActionForm>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="flex items-center gap-2 text-[11px] text-[#6f6f6f]">
        <Plus size={12} aria-hidden="true" />
        Порядок задаётся числом: меньшее значение показывается выше.
      </p>
    </div>
  );
}
