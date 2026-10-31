import "server-only";

import { unstable_cache } from "next/cache";

import { prisma } from "@/lib/prisma";

/**
 * Editable site content. Every string lives in SiteSetting so the owner can
 * change copy from /admin without touching code. Defaults below are used when
 * a key has never been saved, which keeps a fresh database readable.
 */
export const SETTING_DEFAULTS = {
  "site.name": "STACKLAB",
  "site.tagline": "Разработка сайтов для бизнеса",
  "site.description":
    "Разработка быстрых, конвертящих и современных сайтов для бизнеса со сроком запуска до 5 дней. Ответ на заявку в течение 2 часов.",

  "seo.defaultTitle": "STACKLAB — разработка сайтов для бизнеса со сроком до 5 дней",
  "seo.defaultDescription":
    "Создаем быстрые, адаптивные и продуманные сайты для бизнеса со сроком запуска до 5 дней. Ответ на обращение в течение 2 часов.",
  "seo.projectsTitle": "Проекты STACKLAB — примеры сайтов и кейсы",
  "seo.projectsDescription":
    "Примеры разработанных сайтов: Apex Detailing, Burim Store, KoreaCar и сам сайт STACKLAB.",
  "seo.servicesTitle": "Услуги STACKLAB — разработка сайтов под ключ до 5 дней",
  "seo.servicesDescription":
    "Лендинги, корпоративные сайты, интернет-магазины и редизайн со сроком запуска до 5 дней. Быстрый ответ и четкие сроки.",
  "seo.aboutTitle": "О STACKLAB — разработка сайтов со сроком до 5 дней",
  "seo.aboutDescription":
    "Подход STACKLAB: быстрое погружение в задачу, дизайн под ваши цели и запуск сайта в срок до 5 дней.",
  "seo.contactsTitle": "Контакты STACKLAB — обсудить проект за 2 часа",
  "seo.contactsDescription":
    "Напишите нам: ответим в течение 2 часов в любое время и сориентируем по стоимости и срокам запуска.",

  "brand.logoUrl": "/brand/stacklab-logo.svg",
  "brand.faviconUrl": "/icon.svg",

  "home.hero.label": "STACKLAB · САЙТЫ ДЛЯ БИЗНЕСА ЗА 5 ДНЕЙ",
  "home.hero.title": "Сайты, которые превращают интерес в заявки — за 5 дней",
  "home.hero.subtitle":
    "Проектируем понятные, быстрые и выразительные сайты для бизнеса. От первой идеи до готового рабочего сайта — всего до 5 дней с прозрачным процессом.",
  "home.hero.primaryCta": "Обсудить проект",
  "home.hero.secondaryCta": "Примеры сайтов",

  "home.projects.title": "Примеры наших работ",
  "home.projects.subtitle":
    "Сайт, на котором вы сейчас находитесь — одна из наших собственных разработок. Ниже представлены живые сайты, созданные для наших клиентов.",
  "home.projects.linkLabel": "Все проекты",

  "home.services.title": "Услуги и форматы",
  "home.services.subtitle":
    "От продающего лендинга до интернет-магазина со сроком запуска до 5 дней. Понятный состав работ и фиксированные сроки.",
  "home.services.linkLabel": "Все услуги",
  "home.services.ctaLabel": "Заказать сайт",

  "home.advantages.title": "Почему выбирают STACKLAB",
  "home.advantages.subtitle":
    "Создаем сайты, которые решают бизнес-задачи, работают быстро и запускаются точно в заявленный срок.",
  "home.advantages.items": [
    "Запуск до 5 дней | Никаких месяцев ожидания. Налаженный процесс позволяет запустить полноценный сайт в срок до 5 дней без потери качества.",
    "Текущий сайт — наша разработка | Мы доказываем качество на деле: этот сайт создан нами с нуля и показывает наш уровень дизайна и кода.",
    "Ответ за 2 часа | Отвечаем на обращения в течение 2 часов в любое время дня и недели — без задержек и выходных.",
    "Современный дизайн и анимации | Индивидуальный визуальный стиль, выразительная типографика и тёмная эстетика под бренд.",
    "100% адаптивность и скорость | Идеально выглядит на смартфонах и планшетах, оптимизирован для быстрой загрузки.",
    "Прозрачный процесс | Вы контролируете каждый этап разработки, оперативно согласовываете макеты и получаете готовый проект в срок.",
  ].join("\n"),

  "home.process.title": "Как строится работа за 5 дней",
  "home.process.subtitle":
    "Последовательность без скрытых этапов: вы точно знаете, что происходит с проектом каждый день.",

  "home.about.title": "Быстрая разработка. Четкий результат",
  "home.about.body":
    "STACKLAB — команда веб-разработки. Мы делаем сайты, которые должны работать: привлекать внимание, объяснять продукт и приводить к реальным заявкам.\n\nМы ценим время бизнеса, поэтому запускаем сайты в срок до 5 дней. Сначала прорабатываем структуру и ключевые смыслы, затем создаем эстетичный дизайн и переходим к чистой разработке. Такой подход убирает затягивание и делает результат предсказуемым.\n\nСайт, на котором вы находитесь прямо сейчас — тоже одна из наших разработок. Мы обеспечиваем такой же уровень проработки и внимания к деталям для каждого клиента.",
  "home.about.linkLabel": "Подробнее о нас",

  "home.testimonials.title": "Отзывы",
  "home.testimonials.emptyTitle": "Готовим к публикации новые кейсы",
  "home.testimonials.emptyText":
    "Мы публикуем только подтверждённые отзывы реальных клиентов. Новые истории запусков появятся здесь в ближайшее время.",

  "home.faq.title": "Вопросы и ответы",
  "home.faq.subtitle":
    "Ответы на главные вопросы о сроках, стоимости и процессе работы.",

  "home.cta.title": "Нужен сайт за 5 дней? Давайте начнем",
  "home.cta.subtitle":
    "Расскажите о проекте — ответим в течение 2 часов и предложим лучшее решение.",
  "home.cta.button": "Обсудить проект",

  "home.sections.projects": "true",
  "home.sections.services": "true",
  "home.sections.advantages": "true",
  "home.sections.process": "true",
  "home.sections.about": "true",
  "home.sections.testimonials": "false",
  "home.sections.faq": "true",
  "home.sections.cta": "true",

  "about.intro":
    "Мы создаем сайты для бизнеса со сроком запуска до 5 дней: от лаконичных лендингов до каталогов и интернет-магазинов. Работаем напрямую и без лишней бюрократии.",
  "about.body":
    "Наш подход простой: быстро разобраться в задаче, спроектировать структуру и реализовать современный сайт за срок до 5 дней.\n\nМы не обещаем абстрактный рост продаж в процентах. Вместо этого показываем живые сайты, которые мы разработали (включая тот, на котором вы сейчас находитесь), и гарантируем высокую скорость и качество.\n\nОтвечаем на любые вопросы в течение 2 часов и остаемся на связи на всех этапах сотрудничества.",
  "about.approach":
    "Запуск сайта до 5 дней, современный дизайн и готовность приводить заявки с первого дня.",
  "about.principles": [
    "Срок до 5 дней | Ценим ваше время: вы получаете готовый работающий сайт без затягивания.",
    "Ответ за 2 часа | Быстрая обратная связь в любое время дня и недели.",
    "Живые примеры | Показываем реальные кейсы, включая сайт, на котором вы находитесь.",
    "Адаптивность и скорость | Проверяем работу на всех типах экранов и устройств.",
  ].join("\n"),
  "about.ctaTitle": "Обсудим ваш проект",
  "about.ctaText":
    "Расскажите, какой сайт нужен вашему бизнесу. Ответим в течение 2 часов и назовем точные сроки и стоимость.",

  "services.intro":
    "Создаем сайты под ключ со сроком запуска до 5 дней. Выберите подходящий формат или напишите нам для индивидуального расчета.",
  "services.note":
    "Срок разработки — до 5 дней. Состав работ, структура и пожелания согласуются индивидуально под ваш бизнес.",

  "projects.intro":
    "Примеры разработанных нами сайтов. Сайт STACKLAB, на котором вы находитесь — тоже наша работа. Ниже можно перейти на живые сайты и оценить их в реальном использовании.",
  "projects.note":
    "Каждый проект можно открыть по прямой ссылке и протестировать вживую.",

  "contacts.title": "Обсудить проект",
  "contacts.subtitle":
    "Расскажите о задаче в форме или напишите нам напрямую. Отвечаем в течение 2 часов в любое время.",
  "contacts.formTitle": "Заявка на разработку сайта",
  "contacts.formNote":
    "Заполните поля, и мы свяжемся с вами в течение 2 часов для обсуждения деталей проекта.",
  "contacts.directTitle": "Прямые контакты",
  "contacts.directEmpty":
    "Контакты указаны ниже. Также вы можете оставить заявку через форму.",

  "footer.description":
    "Разработка быстрых и современных сайтов для бизнеса со сроком запуска до 5 дней.",
  "footer.note": "Сайты под ключ. Отклик за 2 часа в любое время.",

  "contacts.email": "stacklab7@gmail.com",
  "contacts.telegram": "https://t.me/StackLabb",
  "contacts.tiktok": "https://www.tiktok.com/@nikitrkkls4",
  "contacts.phone": "",
  "contacts.responseTime": "Отвечаем в течение 2 часов в любое время — без выходных и праздников.",

  "legal.privacyTitle": "Политика конфиденциальности",
  "legal.privacyUpdated": "2026-01-01",
  "legal.privacyBody":
    "Настоящая политика описывает, какие данные обрабатываются сайтом STACKLAB и как они используются.\n\n1. Какие данные мы получаем\nЧерез форму заявки мы получаем имя, контакт для связи, предпочтительный способ связи, тип проекта, ориентировочный бюджет и комментарий к задаче.\n\n2. Цель обработки данных\nДанные используются исключительно для обратной связи по вашему обращению, обсуждения деталей проекта и согласования стоимости.\n\n3. Безопасность\nМы не передаем ваши контактные данные сторонним организациям.\n\n4. Контакты для вопросов\nПо всем вопросам вы можете связаться с нами по почте stacklab7@gmail.com или в Telegram @StackLabb.",

  "notify.telegram.enabled": "false",
  "notify.email.enabled": "false",
} as const;

export type SettingKey = keyof typeof SETTING_DEFAULTS;
export type SiteContent = Record<SettingKey, string>;

const DEFAULTS = SETTING_DEFAULTS as Record<string, string>;

export async function getSiteContent(): Promise<SiteContent> {
  return readSiteContent();
}

const readSiteContent = unstable_cache(
  async (): Promise<SiteContent> => {
    let stored: { key: string; value: string }[] = [];
    try {
      stored = await prisma.siteSetting.findMany({ select: { key: true, value: true } });
    } catch (error) {
      console.warn("[settings] failed to read settings from database, using defaults", error);
    }

    const merged: Record<string, string> = { ...DEFAULTS };
    for (const row of stored) {
      if (row.key in DEFAULTS) merged[row.key] = row.value;
    }
    return merged as SiteContent;
  },
  ["site-content"],
  { tags: ["stacklab-content"], revalidate: 300 },
);

export async function setSiteSettings(values: Record<string, string>): Promise<void> {
  const entries = Object.entries(values).filter(([key]) => key in DEFAULTS);
  try {
    await prisma.$transaction(
      entries.map(([key, value]) =>
        prisma.siteSetting.upsert({
          where: { key },
          update: { value },
          create: { key, value },
        }),
      ),
    );
  } catch (error) {
    console.error("[settings] failed to save settings", error);
  }
}

/** "Title | Description" lines used by editable list sections. */
export function parsePairs(raw: string): { title: string; text: string }[] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [title, ...rest] = line.split("|");
      return {
        title: (title ?? "").trim(),
        text: rest.join("|").trim(),
      };
    })
    .filter((item) => item.title.length > 0);
}

export function isEnabled(value: string | undefined): boolean {
  return value === "true";
}
