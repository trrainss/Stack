import type { Metadata } from "next";

import { ActionForm } from "@/components/admin/action-form";
import { Field, FormSection, TextArea, Toggle } from "@/components/admin/fields";
import { saveSettingsGroup } from "@/actions/settings";
import { serverEnv } from "@/lib/env";
import { getSiteContent, isEnabled } from "@/lib/settings";

export const metadata: Metadata = { title: "Настройки" };
export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const content = await getSiteContent();

  const telegramReady = Boolean(serverEnv.telegram.token && serverEnv.telegram.chatId);
  const emailReady = Boolean(serverEnv.email.host && serverEnv.email.from);

  return (
    <div className="grid gap-5">
      <div>
        <h1 className="text-xl font-medium tracking-tight">Настройки сайта</h1>
        <p className="mt-1 max-w-2xl text-xs leading-relaxed text-[#8a8a8a]">
          SEO, юридический текст и каналы уведомлений. Секреты задаются только в переменных
          окружения и никогда не отдаются в браузер.
        </p>
      </div>

      <FormSection title="Сайт и SEO" description="Базовые метаданные и название студии.">
        <ActionForm action={saveSettingsGroup} submitLabel="Сохранить SEO">
          <input type="hidden" name="group" value="seo" />
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Название сайта" name="site.name" defaultValue={content["site.name"]} required />
            <Field label="Подпись бренда" name="site.tagline" defaultValue={content["site.tagline"]} />
          </div>
          <TextArea
            label="Описание сайта"
            name="site.description"
            defaultValue={content["site.description"]}
            rows={2}
          />
          <Field
            label="SEO title главной"
            name="seo.defaultTitle"
            defaultValue={content["seo.defaultTitle"]}
            hint="До 60-70 символов, чтобы не обрезался в выдаче."
          />
          <TextArea
            label="SEO description главной"
            name="seo.defaultDescription"
            defaultValue={content["seo.defaultDescription"]}
            rows={3}
          />
          <div className="grid gap-4 md:grid-cols-2">
            <Field
              label="SEO title /projects"
              name="seo.projectsTitle"
              defaultValue={content["seo.projectsTitle"]}
            />
            <Field
              label="SEO title /services"
              name="seo.servicesTitle"
              defaultValue={content["seo.servicesTitle"]}
            />
            <TextArea
              label="SEO description /projects"
              name="seo.projectsDescription"
              defaultValue={content["seo.projectsDescription"]}
              rows={2}
            />
            <TextArea
              label="SEO description /services"
              name="seo.servicesDescription"
              defaultValue={content["seo.servicesDescription"]}
              rows={2}
            />
            <Field label="SEO title /about" name="seo.aboutTitle" defaultValue={content["seo.aboutTitle"]} />
            <Field
              label="SEO title /contacts"
              name="seo.contactsTitle"
              defaultValue={content["seo.contactsTitle"]}
            />
            <TextArea
              label="SEO description /about"
              name="seo.aboutDescription"
              defaultValue={content["seo.aboutDescription"]}
              rows={2}
            />
            <TextArea
              label="SEO description /contacts"
              name="seo.contactsDescription"
              defaultValue={content["seo.contactsDescription"]}
              rows={2}
            />
          </div>
        </ActionForm>
      </FormSection>

      <FormSection
        title="Уведомления о заявках"
        description="Заявка сохраняется в базе всегда. Уведомление - дополнительный канал, его сбой не приводит к потере обращения."
      >
        <ActionForm action={saveSettingsGroup} submitLabel="Сохранить уведомления">
          <input type="hidden" name="group" value="notify" />
          <div className="grid gap-2 sm:grid-cols-2">
            <Toggle
              label="Telegram"
              name="notify.telegram.enabled"
              value="true"
              defaultChecked={isEnabled(content["notify.telegram.enabled"])}
              hint={
                telegramReady
                  ? "Токен и chat_id найдены в переменных окружения."
                  : "Нужны TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID в .env"
              }
            />
            <Toggle
              label="Email"
              name="notify.email.enabled"
              value="true"
              defaultChecked={isEnabled(content["notify.email.enabled"])}
              hint={
                emailReady
                  ? "SMTP-параметры найдены в переменных окружения."
                  : "Нужны EMAIL_SERVER_HOST и EMAIL_FROM в .env"
              }
            />
          </div>

          <div className="grid gap-2 border border-[#262626] bg-[#0c0c0c] p-4 text-[11px] leading-relaxed text-[#8a8a8a]">
            <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#6f6f6f]">
              Состояние окружения
            </p>
            <p>
              Telegram: токен {serverEnv.telegram.token ? "задан" : "не задан"}, chat_id{" "}
              {serverEnv.telegram.chatId ? "задан" : "не задан"}.
            </p>
            <p>
              Email: хост {serverEnv.email.host ? "задан" : "не задан"}, отправитель{" "}
              {serverEnv.email.from ? "задан" : "не задан"}.
            </p>
            <p>
              Если включить канал без настроенных переменных, попытка отправки зафиксируется как
              ошибка в журнале заявки. Повторить отправку можно на странице заявки.
            </p>
          </div>
        </ActionForm>
      </FormSection>

      <FormSection title="Страница «О студии»">
        <ActionForm action={saveSettingsGroup} submitLabel="Сохранить тексты">
          <input type="hidden" name="group" value="about" />
          <TextArea label="Вступление" name="about.intro" defaultValue={content["about.intro"]} rows={3} />
          <TextArea
            label="Основной текст"
            name="about.body"
            defaultValue={content["about.body"]}
            rows={7}
            hint="Абзацы разделяются пустой строкой."
          />
          <TextArea
            label="Ключевая фраза"
            name="about.approach"
            defaultValue={content["about.approach"]}
            rows={2}
          />
          <TextArea
            label="Принципы"
            name="about.principles"
            defaultValue={content["about.principles"]}
            rows={6}
            hint="Формат строки: Заголовок | Пояснение."
          />
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Заголовок призыва" name="about.ctaTitle" defaultValue={content["about.ctaTitle"]} />
            <Field label="Текст призыва" name="about.ctaText" defaultValue={content["about.ctaText"]} />
          </div>
        </ActionForm>
      </FormSection>

      <FormSection title="Тексты страниц услуг и проектов">
        <ActionForm action={saveSettingsGroup} submitLabel="Сохранить тексты">
          <input type="hidden" name="group" value="pages" />
          <TextArea label="Вступление /services" name="services.intro" defaultValue={content["services.intro"]} rows={3} />
          <TextArea label="Примечание /services" name="services.note" defaultValue={content["services.note"]} rows={2} />
          <TextArea label="Вступление /projects" name="projects.intro" defaultValue={content["projects.intro"]} rows={3} />
          <TextArea label="Примечание /projects" name="projects.note" defaultValue={content["projects.note"]} rows={2} />
        </ActionForm>
      </FormSection>

      <FormSection
        title="Политика конфиденциальности"
        description="Текст должен соответствовать реальной практике обработки данных. При необходимости согласуйте его с юристом."
      >
        <ActionForm action={saveSettingsGroup} submitLabel="Сохранить политику">
          <input type="hidden" name="group" value="legal" />
          <div className="grid gap-4 md:grid-cols-2">
            <Field
              label="Заголовок документа"
              name="legal.privacyTitle"
              defaultValue={content["legal.privacyTitle"]}
            />
            <Field
              label="Дата обновления"
              name="legal.privacyUpdated"
              type="date"
              defaultValue={content["legal.privacyUpdated"]}
            />
          </div>
          <TextArea
            label="Текст политики"
            name="legal.privacyBody"
            defaultValue={content["legal.privacyBody"]}
            rows={16}
            hint="Разделы начинаются с номера: «1. Заголовок». Каждый раздел - с новой строки."
          />
        </ActionForm>
      </FormSection>
    </div>
  );
}
