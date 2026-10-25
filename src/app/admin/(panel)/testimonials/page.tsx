import type { Metadata } from "next";
import { Quotes } from "@phosphor-icons/react/dist/ssr";

import { ActionForm } from "@/components/admin/action-form";
import { DeleteForm } from "@/components/admin/delete-form";
import { Field, FormSection, TextArea, Toggle } from "@/components/admin/fields";
import { PublishedBadge } from "@/components/admin/status-badge";
import { deleteTestimonialAction, saveTestimonialAction } from "@/actions/content";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Отзывы" };
export const dynamic = "force-dynamic";

export default async function AdminTestimonialsPage() {
  const items = await prisma.testimonial.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });

  return (
    <div className="grid gap-5">
      <div>
        <h1 className="text-xl font-medium tracking-tight">Отзывы</h1>
        <p className="mt-1 max-w-2xl text-xs leading-relaxed text-[#8a8a8a]">
          Публикуйте только подтверждённые отзывы реальных клиентов. Пока отзывов нет, секция на
          сайте показывает нейтральный блок вместо вымышленных цитат.
        </p>
      </div>

      <FormSection title="Добавить отзыв">
        <ActionForm action={saveTestimonialAction} submitLabel="Добавить отзыв" compact>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Автор" name="author" required placeholder="Имя и фамилия" />
            <Field label="Компания" name="company" placeholder="Название или сфера" />
          </div>
          <TextArea label="Текст отзыва" name="content" rows={4} required />
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
                <Toggle
                  label="Опубликовать"
                  name="published"
                  hint="Оставляйте выключенным, пока отзыв не подтверждён."
                />
              </div>
            </div>
          </div>
        </ActionForm>
      </FormSection>

      {items.length === 0 ? (
        <div className="border border-[#242424] bg-[#0f0f0f] px-5 py-14 text-center">
          <Quotes size={24} weight="light" aria-hidden="true" className="mx-auto text-[#5f5f5f]" />
          <p className="mt-3 text-sm text-fg">Отзывов пока нет</p>
          <p className="mt-1 text-[11px] text-[#6f6f6f]">На сайте секция останется скрытой.</p>
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
                <DeleteForm
                  action={deleteTestimonialAction}
                  id={item.id}
                  title="Удалить отзыв?"
                  description="Отзыв будет удалён с сайта и из базы данных."
                />
              </div>

              <div className="p-4">
                <ActionForm action={saveTestimonialAction} submitLabel="Сохранить" compact>
                  <input type="hidden" name="id" value={item.id} />
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Автор" name="author" defaultValue={item.author} required />
                    <Field label="Компания" name="company" defaultValue={item.company} />
                  </div>
                  <TextArea label="Текст отзыва" name="content" defaultValue={item.content} rows={4} required />
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
                          label="Опубликован"
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
    </div>
  );
}
