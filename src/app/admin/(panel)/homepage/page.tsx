import type { Metadata } from "next";

import { ActionForm } from "@/components/admin/action-form";
import { Field, FormSection, TextArea, Toggle } from "@/components/admin/fields";
import { saveSettingsGroup } from "@/actions/settings";
import { getSiteContent, isEnabled } from "@/lib/settings";

export const metadata: Metadata = { title: "Главная страница" };
export const dynamic = "force-dynamic";

export default async function AdminHomepagePage() {
  const content = await getSiteContent();

  return (
    <div className="grid gap-5">
      <div>
        <h1 className="text-xl font-medium tracking-tight">Главная страница</h1>
        <p className="mt-1 max-w-2xl text-xs leading-relaxed text-[#8a8a8a]">
          Тексты и видимость блоков. Изменения публикуются сразу после сохранения.
        </p>
      </div>

      <FormSection title="Первый экран">
        <ActionForm action={saveSettingsGroup} submitLabel="Сохранить первый экран">
          <input type="hidden" name="group" value="hero" />
          <div className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Надзаголовок" name="home.hero.label" defaultValue={content["home.hero.label"]} />
              <Field
                label="Кнопка «Обсудить проект»"
                name="home.hero.primaryCta"
                defaultValue={content["home.hero.primaryCta"]}
              />
            </div>
            <TextArea
              label="Заголовок"
              name="home.hero.title"
              defaultValue={content["home.hero.title"]}
              rows={2}
              required
              hint="Крупный H1. Оптимально до 60 символов."
            />
            <TextArea
              label="Подзаголовок"
              name="home.hero.subtitle"
              defaultValue={content["home.hero.subtitle"]}
              rows={3}
            />
            <Field
              label="Кнопка «Смотреть проекты»"
              name="home.hero.secondaryCta"
              defaultValue={content["home.hero.secondaryCta"]}
            />
          </div>
        </ActionForm>
      </FormSection>

      <FormSection
        title="Видимость блоков"
        description="Снимите галочку, чтобы скрыть блок на главной. Данные блока сохранятся."
      >
        <ActionForm action={saveSettingsGroup} submitLabel="Сохранить видимость">
          <input type="hidden" name="group" value="sections" />
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              { key: "home.sections.projects", label: "Проекты" },
              { key: "home.sections.services", label: "Услуги" },
              { key: "home.sections.advantages", label: "Преимущества" },
              { key: "home.sections.process", label: "Этапы работы" },
              { key: "home.sections.about", label: "О студии" },
              { key: "home.sections.testimonials", label: "Отзывы" },
              { key: "home.sections.faq", label: "FAQ" },
              { key: "home.sections.cta", label: "Финальный призыв" },
            ].map((section) => (
              <Toggle
                key={section.key}
                label={section.label}
                name={section.key}
                value="true"
                defaultChecked={isEnabled(content[section.key as keyof typeof content])}
              />
            ))}
          </div>
        </ActionForm>
      </FormSection>

      <FormSection title="Блок проектов">
        <ActionForm action={saveSettingsGroup} submitLabel="Сохранить блок">
          <input type="hidden" name="group" value="homepage" />
          <div className="grid gap-4">
            <Field label="Заголовок" name="home.projects.title" defaultValue={content["home.projects.title"]} />
            <TextArea
              label="Подзаголовок"
              name="home.projects.subtitle"
              defaultValue={content["home.projects.subtitle"]}
              rows={3}
            />
            <Field
              label="Подпись ссылки"
              name="home.projects.linkLabel"
              defaultValue={content["home.projects.linkLabel"]}
            />

            <div className="mt-2 border-t border-[#242424] pt-4">
              <h3 className="text-xs font-medium text-fg">Блок услуг</h3>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Заголовок" name="home.services.title" defaultValue={content["home.services.title"]} />
              <Field
                label="Подпись ссылки"
                name="home.services.linkLabel"
                defaultValue={content["home.services.linkLabel"]}
              />
            </div>
            <TextArea
              label="Подзаголовок"
              name="home.services.subtitle"
              defaultValue={content["home.services.subtitle"]}
              rows={2}
            />
            <Field
              label="Кнопка заказа услуги"
              name="home.services.ctaLabel"
              defaultValue={content["home.services.ctaLabel"]}
            />

            <div className="mt-2 border-t border-[#242424] pt-4">
              <h3 className="text-xs font-medium text-fg">Блок преимуществ</h3>
            </div>
            <Field
              label="Заголовок"
              name="home.advantages.title"
              defaultValue={content["home.advantages.title"]}
            />
            <TextArea
              label="Подзаголовок"
              name="home.advantages.subtitle"
              defaultValue={content["home.advantages.subtitle"]}
              rows={2}
            />
            <TextArea
              label="Пункты"
              name="home.advantages.items"
              defaultValue={content["home.advantages.items"]}
              rows={8}
              hint="Формат строки: Заголовок | Пояснение. Одна строка - один пункт."
            />

            <div className="mt-2 border-t border-[#242424] pt-4">
              <h3 className="text-xs font-medium text-fg">Блок этапов</h3>
            </div>
            <Field
              label="Заголовок"
              name="home.process.title"
              defaultValue={content["home.process.title"]}
            />
            <TextArea
              label="Подзаголовок"
              name="home.process.subtitle"
              defaultValue={content["home.process.subtitle"]}
              rows={2}
            />

            <div className="mt-2 border-t border-[#242424] pt-4">
              <h3 className="text-xs font-medium text-fg">Блок о студии</h3>
            </div>
            <Field label="Заголовок" name="home.about.title" defaultValue={content["home.about.title"]} />
            <TextArea
              label="Текст"
              name="home.about.body"
              defaultValue={content["home.about.body"]}
              rows={6}
              hint="Абзацы разделяются пустой строкой."
            />
            <Field
              label="Подпись ссылки"
              name="home.about.linkLabel"
              defaultValue={content["home.about.linkLabel"]}
            />

            <div className="mt-2 border-t border-[#242424] pt-4">
              <h3 className="text-xs font-medium text-fg">Отзывы</h3>
            </div>
            <Field
              label="Заголовок"
              name="home.testimonials.title"
              defaultValue={content["home.testimonials.title"]}
            />
            <Field
              label="Заголовок пустого состояния"
              name="home.testimonials.emptyTitle"
              defaultValue={content["home.testimonials.emptyTitle"]}
            />
            <TextArea
              label="Текст пустого состояния"
              name="home.testimonials.emptyText"
              defaultValue={content["home.testimonials.emptyText"]}
              rows={3}
            />

            <div className="mt-2 border-t border-[#242424] pt-4">
              <h3 className="text-xs font-medium text-fg">FAQ</h3>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Заголовок" name="home.faq.title" defaultValue={content["home.faq.title"]} />
              <Field
                label="Подзаголовок"
                name="home.faq.subtitle"
                defaultValue={content["home.faq.subtitle"]}
              />
            </div>

            <div className="mt-2 border-t border-[#242424] pt-4">
              <h3 className="text-xs font-medium text-fg">Финальный призыв</h3>
            </div>
            <Field label="Заголовок" name="home.cta.title" defaultValue={content["home.cta.title"]} />
            <TextArea
              label="Подзаголовок"
              name="home.cta.subtitle"
              defaultValue={content["home.cta.subtitle"]}
              rows={2}
            />
            <Field label="Кнопка" name="home.cta.button" defaultValue={content["home.cta.button"]} />
          </div>
        </ActionForm>
      </FormSection>
    </div>
  );
}
