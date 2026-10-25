"use server";

import { revalidatePath, revalidateTag } from "next/cache";

import type { ActionState } from "@/lib/action-state";
import { requireAdmin } from "@/lib/auth";
import { CONTENT_TAG } from "@/lib/data";
import { getSiteContent, setSiteSettings, type SettingKey } from "@/lib/settings";

const GROUPS: Record<string, SettingKey[]> = {
  hero: [
    "home.hero.label",
    "home.hero.title",
    "home.hero.subtitle",
    "home.hero.primaryCta",
    "home.hero.secondaryCta",
  ],
  homepage: [
    "home.projects.title",
    "home.projects.subtitle",
    "home.projects.linkLabel",
    "home.services.title",
    "home.services.subtitle",
    "home.services.ctaLabel",
    "home.services.linkLabel",
    "home.advantages.title",
    "home.advantages.subtitle",
    "home.advantages.items",
    "home.process.title",
    "home.process.subtitle",
    "home.about.title",
    "home.about.body",
    "home.about.linkLabel",
    "home.testimonials.title",
    "home.testimonials.emptyTitle",
    "home.testimonials.emptyText",
    "home.faq.title",
    "home.faq.subtitle",
    "home.cta.title",
    "home.cta.subtitle",
    "home.cta.button",
  ],
  sections: [
    "home.sections.projects",
    "home.sections.services",
    "home.sections.advantages",
    "home.sections.process",
    "home.sections.about",
    "home.sections.testimonials",
    "home.sections.faq",
    "home.sections.cta",
  ],
  contacts: [
    "contacts.email",
    "contacts.telegram",
    "contacts.tiktok",
    "contacts.phone",
    "contacts.responseTime",
    "footer.description",
    "footer.note",
    "contacts.title",
    "contacts.subtitle",
    "contacts.formTitle",
    "contacts.formNote",
    "contacts.directTitle",
    "contacts.directEmpty",
  ],
  seo: [
    "seo.defaultTitle",
    "seo.defaultDescription",
    "seo.projectsTitle",
    "seo.projectsDescription",
    "seo.servicesTitle",
    "seo.servicesDescription",
    "seo.aboutTitle",
    "seo.aboutDescription",
    "seo.contactsTitle",
    "seo.contactsDescription",
    "site.name",
    "site.tagline",
    "site.description",
  ],
  about: [
    "about.intro",
    "about.body",
    "about.approach",
    "about.principles",
    "about.ctaTitle",
    "about.ctaText",
  ],
  pages: [
    "projects.intro",
    "projects.note",
    "services.intro",
    "services.note",
  ],
  legal: ["legal.privacyTitle", "legal.privacyBody", "legal.privacyUpdated"],
  notify: ["notify.telegram.enabled", "notify.email.enabled"],
};

function readValue(formData: FormData, key: string): string {
  const all = formData.getAll(key);
  const last = all[all.length - 1];
  return typeof last === "string" ? last.slice(0, 20_000) : "";
}

export async function saveSettingsGroup(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const group = String(formData.get("group") ?? "");
  const keys = GROUPS[group];
  if (!keys) {
    return { error: "Неизвестная группа настроек" };
  }

  const current = await getSiteContent();
  const values: Record<string, string> = {};

  for (const key of keys) {
    const currentValue = current[key];
    const isToggle = currentValue === "true" || currentValue === "false";

    if (formData.has(key)) {
      const raw = readValue(formData, key);
      values[key] = isToggle ? (raw === "on" || raw === "true" ? "true" : "false") : raw;
    } else if (isToggle) {
      // Checkbox group: an unchecked box is not submitted at all.
      values[key] = "false";
    }
  }

  if (values["site.name"] !== undefined && values["site.name"].trim().length === 0) {
    return { error: "Название сайта не может быть пустым" };
  }

  if (group === "contacts") {
    const email = values["contacts.email"]?.trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      return { error: "Укажите корректный email или оставьте поле пустым" };
    }

    const telegram = values["contacts.telegram"]?.trim();
    if (
      telegram &&
      !/^@[a-zA-Z0-9_]{4,32}$/.test(telegram) &&
      !/^https?:\/\/(t\.me|telegram\.me)\/[a-zA-Z0-9_]{4,32}\/?$/.test(telegram)
    ) {
      return { error: "Telegram: укажите @username или ссылку вида https://t.me/username" };
    }

    const tiktok = values["contacts.tiktok"]?.trim();
    if (
      tiktok &&
      !/^@[a-zA-Z0-9._]{2,24}$/.test(tiktok) &&
      !/^https?:\/\/(www\.)?tiktok\.com\/@[a-zA-Z0-9._]{2,24}\/?$/.test(tiktok)
    ) {
      return { error: "TikTok: укажите @username или ссылку вида https://tiktok.com/@username" };
    }

    const phone = values["contacts.phone"]?.trim();
    if (phone && !/^\+?[\d\s()-]{7,20}$/.test(phone)) {
      return { error: "Телефон содержит недопустимые символы" };
    }
  }

  try {
    await setSiteSettings(values);
  } catch (error) {
    console.error("[admin] failed to save settings", error);
    return { error: "Не удалось сохранить настройки. Попробуйте ещё раз." };
  }

  revalidateTag(CONTENT_TAG);
  revalidatePath("/", "layout");
  return { ok: true, message: "Изменения сохранены и опубликованы" };
}
