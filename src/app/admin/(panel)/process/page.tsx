import type { Metadata } from "next";
import { Path } from "@phosphor-icons/react/dist/ssr";

import { ActionForm } from "@/components/admin/action-form";
import { DeleteForm } from "@/components/admin/delete-form";
import { Field, FormSection, TextArea, Toggle } from "@/components/admin/fields";
import { PublishedBadge } from "@/components/admin/status-badge";
import { deleteProcessStepAction, saveProcessStepAction } from "@/actions/content";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Этапы работы" };
export const dynamic = "force-dynamic";

export default async function AdminProcessPage() {
  const steps = await prisma.processStep.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });

  return (
    <div className="grid gap-5">
      <div>
        <h1 className="text-xl font-medium tracking-tight">Этапы работы</h1>
        <p className="mt-1 max-w-2xl text-xs leading-relaxed text-[#8a8a8a]">
          Последовательность работы на главной странице. Номера этапов формируются автоматически
          по порядку сортировки.
        </p>
      </div>

      <FormSection title="Добавить этап">
        <ActionForm action={saveProcessStepAction} submitLabel="Добавить этап" compact>
          <div className="grid gap-4">
            <Field label="Название этапа" name="title" required placeholder="Знакомство" />
            <TextArea label="Описание" name="description" rows={3} required />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Порядок"
                name="sortOrder"
                type="number"
                min={0}
                max={9999}
                defaultValue={(steps.length + 1) * 10}
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

      {steps.length === 0 ? (
        <div className="border border-[#242424] bg-[#0f0f0f] px-5 py-14 text-center">
          <Path size={24} weight="light" aria-hidden="true" className="mx-auto text-[#5f5f5f]" />
          <p className="mt-3 text-sm text-fg">Этапы не добавлены</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {steps.map((step, index) => (
            <div key={step.id} className="border border-[#242424] bg-[#0f0f0f]">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#242424] px-4 py-2.5">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] text-[#6f6f6f]">
                    {String(index + 1).padStart(2, "0")} · sort {step.sortOrder}
                  </span>
                  <PublishedBadge published={step.published} />
                </div>
                <DeleteForm
                  action={deleteProcessStepAction}
                  id={step.id}
                  title="Удалить этап?"
                  description="Этап будет удалён с сайта и из базы данных."
                />
              </div>

              <div className="p-4">
                <ActionForm action={saveProcessStepAction} submitLabel="Сохранить" compact>
                  <input type="hidden" name="id" value={step.id} />
                  <Field label="Название" name="title" defaultValue={step.title} required />
                  <TextArea
                    label="Описание"
                    name="description"
                    defaultValue={step.description}
                    rows={3}
                    required
                  />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field
                      label="Порядок"
                      name="sortOrder"
                      type="number"
                      min={0}
                      max={9999}
                      defaultValue={step.sortOrder}
                    />
                    <div className="flex items-end">
                      <div className="w-full">
                        <Toggle
                          label="Опубликован"
                          name="published"
                          defaultChecked={step.published}
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
    </div>
  );
}
