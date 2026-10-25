import type { Service } from "@prisma/client";

import { ActionForm } from "@/components/admin/action-form";
import { Field, FormSection, TextArea, Toggle } from "@/components/admin/fields";
import { saveServiceAction } from "@/actions/content";

export function ServiceForm({ service }: { service?: Service }) {
  return (
    <ActionForm
      action={saveServiceAction}
      submitLabel={service ? "Сохранить услугу" : "Создать услугу"}
    >
      {service ? <input type="hidden" name="id" value={service.id} /> : null}

      <FormSection title="Основное">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Название" name="title" defaultValue={service?.title} required />
          <Field
            label="Slug"
            name="slug"
            defaultValue={service?.slug}
            hint="Используется в форме заявки как тип проекта. Для базовых услуг лучше сохранять значения landing, corporate, ecommerce, redesign, custom, support."
          />
          <Field
            label="Цена или способ расчёта"
            name="priceLabel"
            defaultValue={service?.priceLabel}
            placeholder="от 90 000 ₽"
            hint="Если пусто, на сайте будет показано «Стоимость после обсуждения»."
          />
          <Field
            label="Порядок сортировки"
            name="sortOrder"
            type="number"
            min={0}
            max={9999}
            defaultValue={service?.sortOrder ?? 0}
          />
        </div>
      </FormSection>

      <FormSection title="Описание услуги">
        <div className="grid gap-4">
          <TextArea
            label="Краткое описание"
            name="description"
            defaultValue={service?.description}
            rows={3}
            required
          />
          <TextArea
            label="Что входит в работу"
            name="features"
            defaultValue={service?.features}
            rows={6}
            hint="Одна строка - один пункт списка."
          />
          <div className="grid gap-4 md:grid-cols-2">
            <TextArea
              label="Кому подходит"
              name="audience"
              defaultValue={service?.audience}
              rows={3}
            />
            <TextArea
              label="Результат для клиента"
              name="outcome"
              defaultValue={service?.outcome}
              rows={3}
            />
          </div>
        </div>
      </FormSection>

      <FormSection title="Публикация">
        <Toggle
          label="Опубликовать услугу"
          name="published"
          defaultChecked={service?.published ?? true}
          hint="Скрытая услуга не отображается на главной и в разделе услуг."
        />
      </FormSection>
    </ActionForm>
  );
}
