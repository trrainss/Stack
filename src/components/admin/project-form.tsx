import type { Project } from "@prisma/client";

import { ActionForm } from "@/components/admin/action-form";
import { CoverUploader } from "@/components/admin/cover-uploader";
import { Field, FormSection, SelectField, TextArea, Toggle } from "@/components/admin/fields";
import { saveProjectAction } from "@/actions/content";
import { PROJECT_CATEGORIES } from "@/lib/constants";

export function ProjectForm({ project }: { project?: Project }) {
  return (
    <ActionForm
      action={saveProjectAction}
      submitLabel={project ? "Сохранить проект" : "Создать проект"}
    >
      {project ? <input type="hidden" name="id" value={project.id} /> : null}

      <FormSection title="Основное" description="Название, адрес страницы и категория проекта.">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Название" name="title" defaultValue={project?.title} required />
          <Field
            label="Slug"
            name="slug"
            defaultValue={project?.slug}
            hint="Латиница, цифры и дефисы. Если оставить пустым, будет создан из названия."
          />
          <SelectField
            label="Категория"
            name="category"
            defaultValue={project?.category ?? "landing"}
            options={PROJECT_CATEGORIES.map((category) => ({
              value: category.value,
              label: category.label,
            }))}
          />
          <Field label="Год" name="year" defaultValue={project?.year} placeholder="2026" />
        </div>
      </FormSection>

      <FormSection title="Описание и кейс" description="Эти тексты видны на странице проекта.">
        <div className="grid gap-4">
          <TextArea
            label="Краткое описание"
            name="description"
            defaultValue={project?.description}
            rows={3}
            required
            hint="Одно-два предложения для карточки проекта."
          />
          <TextArea
            label="Задача"
            name="challenge"
            defaultValue={project?.challenge}
            rows={4}
            required
          />
          <TextArea
            label="Решение"
            name="solution"
            defaultValue={project?.solution}
            rows={4}
            required
          />
          <Field
            label="Технологии"
            name="technologies"
            defaultValue={project?.technologies}
            hint="Через запятую или с новой строки. Показываются как список."
          />
        </div>
      </FormSection>

      <FormSection title="Медиа и ссылка" description="Обложка проекта и публичный адрес, если он есть.">
        <div className="grid gap-5">
          <CoverUploader name="coverImage" defaultValue={project?.coverImage} />
          <Field
            label="Ссылка на опубликованный проект"
            name="projectUrl"
            type="url"
            defaultValue={project?.projectUrl}
            placeholder="https://example.com"
            hint="Оставьте пустым для концептуального кейса."
          />
        </div>
      </FormSection>

      <FormSection title="Публикация">
        <div className="grid gap-3 sm:grid-cols-2">
          <Toggle
            label="Опубликовать"
            name="published"
            defaultChecked={project?.published ?? false}
            hint="Снятая публикация скрывает проект с сайта, но сохраняет данные."
          />
          <Toggle
            label="Концептуальный кейс"
            name="isConcept"
            defaultChecked={project?.isConcept ?? true}
            hint="На карточке появится пометка «Концепт». Отключите для реального проекта."
          />
          <Field
            label="Порядок сортировки"
            name="sortOrder"
            type="number"
            min={0}
            max={9999}
            defaultValue={project?.sortOrder ?? 0}
            hint="Меньшее значение показывается раньше."
          />
        </div>
      </FormSection>
    </ActionForm>
  );
}
