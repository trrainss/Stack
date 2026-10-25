import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, EnvelopeSimple, TelegramLogo, TiktokLogo } from "@phosphor-icons/react/dist/ssr";

import { ActionForm } from "@/components/admin/action-form";
import { Field, FormSection, TextArea } from "@/components/admin/fields";
import { saveSettingsGroup } from "@/actions/settings";
import { getSiteContent } from "@/lib/settings";
import { normalizeTelegram, normalizeTikTok } from "@/lib/utils";

export const metadata: Metadata = { title: "Контакты" };
export const dynamic = "force-dynamic";

export default async function AdminContactsPage() {
  const content = await getSiteContent();

  const telegram = content["contacts.telegram"].trim();
  const tiktok = content["contacts.tiktok"].trim();
  const email = content["contacts.email"].trim();

  return (
    <div className="grid gap-5">
      <div>
        <h1 className="text-xl font-medium tracking-tight">Контакты и ссылки</h1>
        <p className="mt-1 max-w-2xl text-xs leading-relaxed text-[#8a8a8a]">
          Пока поле пустое, соответствующий контакт не показывается на сайте. Выдуманные адреса не
          подставляются автоматически.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="border border-[#242424] bg-[#0f0f0f] p-4">
          <p className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.14em] text-[#6f6f6f]">
            <EnvelopeSimple size={12} aria-hidden="true" />
            Email
          </p>
          <p className="mt-2 break-all text-xs text-[#c0c0c0]">{email || "не заполнен"}</p>
        </div>
        <div className="border border-[#242424] bg-[#0f0f0f] p-4">
          <p className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.14em] text-[#6f6f6f]">
            <TelegramLogo size={12} aria-hidden="true" />
            Telegram
          </p>
          {telegram ? (
            <Link
              href={normalizeTelegram(telegram)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1 break-all text-xs text-[#c0c0c0] hover:text-fg"
            >
              {telegram}
              <ArrowUpRight size={10} aria-hidden="true" />
            </Link>
          ) : (
            <p className="mt-2 text-xs text-[#7c7c7c]">не заполнен</p>
          )}
        </div>
        <div className="border border-[#242424] bg-[#0f0f0f] p-4">
          <p className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.14em] text-[#6f6f6f]">
            <TiktokLogo size={12} aria-hidden="true" />
            TikTok
          </p>
          {tiktok ? (
            <Link
              href={normalizeTikTok(tiktok)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1 break-all text-xs text-[#c0c0c0] hover:text-fg"
            >
              {tiktok}
              <ArrowUpRight size={10} aria-hidden="true" />
            </Link>
          ) : (
            <p className="mt-2 text-xs text-[#7c7c7c]">не заполнен</p>
          )}
        </div>
      </div>

      <FormSection
        title="Контактные данные"
        description="Ссылки должны быть рабочими. Внутренние проверки не пропустят некорректный адрес."
      >
        <ActionForm action={saveSettingsGroup} submitLabel="Сохранить контакты">
          <input type="hidden" name="group" value="contacts" />
          <div className="grid gap-4 md:grid-cols-2">
            <Field
              label="Email"
              name="contacts.email"
              type="email"
              defaultValue={content["contacts.email"]}
              placeholder="hello@studio.ru"
            />
            <Field
              label="Телефон"
              name="contacts.phone"
              type="tel"
              defaultValue={content["contacts.phone"]}
              placeholder="+7 900 000-00-00"
              hint="Показывается только если заполнен."
            />
            <Field
              label="Telegram"
              name="contacts.telegram"
              defaultValue={content["contacts.telegram"]}
              placeholder="@studio или https://t.me/studio"
            />
            <Field
              label="TikTok"
              name="contacts.tiktok"
              defaultValue={content["contacts.tiktok"]}
              placeholder="@studio или https://tiktok.com/@studio"
            />
          </div>
          <TextArea
            label="Время ответа"
            name="contacts.responseTime"
            defaultValue={content["contacts.responseTime"]}
            rows={2}
          />
          <TextArea
            label="Описание студии в подвале"
            name="footer.description"
            defaultValue={content["footer.description"]}
            rows={2}
          />
          <Field label="Подпись в подвале" name="footer.note" defaultValue={content["footer.note"]} />
        </ActionForm>
      </FormSection>

      <FormSection title="Страница контактов" description="Заголовки и пояснения к форме заявки.">
        <ActionForm action={saveSettingsGroup} submitLabel="Сохранить тексты">
          <input type="hidden" name="group" value="contacts" />
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Заголовок" name="contacts.title" defaultValue={content["contacts.title"]} />
            <Field
              label="Заголовок формы"
              name="contacts.formTitle"
              defaultValue={content["contacts.formTitle"]}
            />
          </div>
          <TextArea
            label="Подзаголовок"
            name="contacts.subtitle"
            defaultValue={content["contacts.subtitle"]}
            rows={2}
          />
          <TextArea
            label="Пояснение к форме"
            name="contacts.formNote"
            defaultValue={content["contacts.formNote"]}
            rows={2}
          />
          <div className="grid gap-4 md:grid-cols-2">
            <Field
              label="Заголовок прямых контактов"
              name="contacts.directTitle"
              defaultValue={content["contacts.directTitle"]}
            />
            <Field
              label="Текст при пустых контактах"
              name="contacts.directEmpty"
              defaultValue={content["contacts.directEmpty"]}
            />
          </div>
        </ActionForm>
      </FormSection>
    </div>
  );
}
