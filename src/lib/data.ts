import "server-only";

import { unstable_cache } from "next/cache";

import { prisma } from "@/lib/prisma";

export const CONTENT_TAG = "stacklab-content";

export const DEFAULT_PROJECTS = [
  {
    id: "proj-stacklab",
    title: "STACKLAB — Веб-разработка",
    slug: "stacklab",
    category: "corporate",
    description:
      "Сайт, на котором вы сейчас находитесь — одна из наших собственных разработок. Минималистичная эстетика, максимальная скорость отклика, адаптивность и чистый код.",
    challenge:
      "Создать быстрый, стильный и понятный сайт для приёма заявок и демонстрации реального уровня разработки.",
    solution:
      "Разработали проект на Next.js и React 19 с плавной анимацией на Motion, тёмной эстетикой и высокой скоростью загрузки.",
    technologies: "Next.js, React 19, TypeScript, Tailwind CSS, Motion",
    coverImage: "/projects/stacklab-cover.svg",
    projectUrl: "/",
    year: "2026",
    isConcept: false,
    published: true,
    sortOrder: 1,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  },
  {
    id: "proj-apex",
    title: "Apex Detailing",
    slug: "apex-detailing",
    category: "landing",
    description:
      "Премиальный сайт для студии автодетейлинга: бронепленка, полировка кузова, керамика и химчистка с быстрой онлайн-заявкой.",
    challenge:
      "Подчеркнуть премиальный уровень услуг детейлинга для владельцев авто и сделать удобную форму онлайн-записи.",
    solution:
      "Создали конверсионный лендинг с акцентом на детали, фотогалерею до/после, калькулятор услуг и быструю форму связи.",
    technologies: "Next.js, React, Tailwind CSS, Vercel",
    coverImage: "/projects/apex-cover.svg",
    projectUrl: "https://apex-detailing-alpha.vercel.app/",
    year: "2026",
    isConcept: false,
    published: true,
    sortOrder: 2,
    createdAt: new Date("2026-01-02"),
    updatedAt: new Date("2026-01-02"),
  },
  {
    id: "proj-burim",
    title: "Burim Store",
    slug: "burim-store",
    category: "ecommerce",
    description:
      "Стильный интернет-магазин одежды: удобный каталог товаров, выбор размеров, корзина и быстрый чекаут.",
    challenge:
      "Сделать лёгкий, быстрый и стильный интернет-магазин без громоздких и медленных конструкторов.",
    solution:
      "Спроектировали удобную навигацию по категориям, интерактивную корзину, мгновенный просмотр товаров и оформление заказа.",
    technologies: "Next.js, React, Tailwind CSS, E-commerce",
    coverImage: "/projects/burim-cover.svg",
    projectUrl: "https://burim-store.vercel.app/",
    year: "2026",
    isConcept: false,
    published: true,
    sortOrder: 3,
    createdAt: new Date("2026-01-03"),
    updatedAt: new Date("2026-01-03"),
  },
  {
    id: "proj-koreacar",
    title: "KoreaCar",
    slug: "koreacar",
    category: "corporate",
    description:
      "Сервис подбора и доставки автомобилей из Южной Кореи: каталог авто, расчет стоимости доставки и растаможки под ключ.",
    challenge:
      "Построить доверие к покупке авто из-за границы и предоставить клиенту прозрачный расчет полной стоимости под ключ.",
    solution:
      "Разработали функциональный сайт с каталогом проверенных автомобилей, этапами сделки, калькулятором и формой подбора.",
    technologies: "Next.js, TypeScript, Tailwind CSS, API",
    coverImage: "/projects/koreacar-cover.svg",
    projectUrl: "https://koreacar-eight.vercel.app/",
    year: "2026",
    isConcept: false,
    published: true,
    sortOrder: 4,
    createdAt: new Date("2026-01-04"),
    updatedAt: new Date("2026-01-04"),
  },
];

export const DEFAULT_SERVICES = [
  {
    id: "srv-landing",
    title: "Лендинг",
    slug: "landing",
    description:
      "Одностраничный продающий сайт под конкретный продукт, услугу или рекламную кампанию со сроком запуска до 5 дней.",
    features: [
      "Срок разработки: 3–5 дней",
      "Проработка структуры и продающих смыслов",
      "Индивидуальный дизайн под ваш бренд",
      "Полная адаптивность для смартфонов и ПК",
      "Форма приёма заявок в Telegram и на почту",
      "Базовая SEO-оптимизация и аналитика",
    ].join("\n"),
    audience: "Бизнес, услуги, эксперты и стартапы, которым нужен быстрый запуск и поток заявок.",
    outcome: "Готовая страница с высокой конверсией, запущенная и работающая уже через 3–5 дней.",
    priceLabel: "Срок: до 5 дней",
    published: true,
    sortOrder: 1,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  },
  {
    id: "srv-corporate",
    title: "Корпоративный сайт",
    slug: "corporate",
    description:
      "Многостраничный сайт компании: презентация услуг, кейсы, информация о компании и контакты со сроком запуска до 5 дней.",
    features: [
      "Срок разработки: до 5 дней",
      "Продуманная архитектура и навигация",
      "Дизайн-система и типовые шаблоны",
      "Удобные формы обратной связи",
      "Интеграция с мессенджерами и почтой",
      "Быстрая загрузка и адаптивность",
    ].join("\n"),
    audience: "Компании, которым нужно сформировать доверие, презентовать услуги и получать заявки.",
    outcome: "Солидный сайт компании, который убедительно рассказывает о бизнесе и привлекает клиентов.",
    priceLabel: "Срок: до 5 дней",
    published: true,
    sortOrder: 2,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  },
  {
    id: "srv-ecommerce",
    title: "Интернет-магазин",
    slug: "ecommerce",
    description:
      "Каталог товаров, карточки продукции, корзина и удобное оформление заказа со сроком запуска до 5 дней.",
    features: [
      "Срок разработки: до 5 дней",
      "Удобный каталог с фильтрацией",
      "Карточки товаров и фотогалереи",
      "Корзина и быстрый чекаут",
      "Приём заказов в Telegram / Email",
      "Удобное управление ассортиментом",
    ].join("\n"),
    audience: "Бренды и магазины, которым нужна быстрая и стильная онлайн-витрина.",
    outcome: "Работающий магазин с удобным выбором товаров и готовой системой приёма заказов.",
    priceLabel: "Срок: до 5 дней",
    published: true,
    sortOrder: 3,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  },
  {
    id: "srv-redesign",
    title: "Редизайн сайта",
    slug: "redesign",
    description:
      "Обновление визуального стиля, улучшение юзабилити и ускорение загрузки существующего сайта со сроком 2–4 дня.",
    features: [
      "Срок разработки: 2–4 дня",
      "Аудит текущего сайта и слабых мест",
      "Новый современный визуальный язык",
      "Оптимизация под мобильные устройства",
      "Сохранение контента и структуры",
      "Увеличение конверсии в заявку",
    ].join("\n"),
    audience: "Бизнес, чей текущий сайт визуально устарел или медленно работает.",
    outcome: "Обновленный, быстрый и современный сайт без потери важной информации.",
    priceLabel: "Срок: 2–4 дня",
    published: true,
    sortOrder: 4,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  },
  {
    id: "srv-custom",
    title: "Индивидуальная разработка",
    slug: "custom",
    description:
      "Нестандартные страницы, калькуляторы, промо-проекты и интеграции со сроком запуска до 5 дней.",
    features: [
      "Срок разработки: до 5 дней",
      "Нестандартные интерактивные элементы",
      "Калькуляторы стоимости и квизы",
      "Подключение внешних сервисов и API",
      "Анимации и эффекты на заказ",
      "Индивидуальный сценарий под задачу",
    ].join("\n"),
    audience: "Проекты, требующие особенного функционала или нестандартной подачи.",
    outcome: "Точное решение под вашу бизнес-задачу со строгим соблюдением сроков.",
    priceLabel: "Срок: до 5 дней",
    published: true,
    sortOrder: 5,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  },
  {
    id: "srv-support",
    title: "Поддержка и развитие",
    slug: "support",
    description:
      "Сопровождение после запуска: правки, добавление страниц, технический контроль и отклик за 2 часа.",
    features: [
      "Ответ на запросы в течение 2 часов",
      "Оперативное внесение правок",
      "Добавление новых блоков и товаров",
      "Контроль стабильности и форм",
      "Консультации по развитию сайта",
    ].join("\n"),
    audience: "Клиенты, которым важна уверенность в бесперебойной работе сайта.",
    outcome: "Сайт всегда актуален, работает стабильно и развивается вместе с бизнесом.",
    priceLabel: "Отклик за 2 часа",
    published: true,
    sortOrder: 6,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  },
];

export const DEFAULT_FAQS = [
  {
    id: "faq-1",
    question: "Сколько времени занимает создание сайта?",
    answer:
      "Мы создаем и запускаем сайты в срок до 5 дней. Процесс разбит по дням: от утверждения структуры до финального запуска. Вы получаете готовый проект без затягивания сроков.",
    published: true,
    sortOrder: 1,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  },
  {
    id: "faq-2",
    question: "Как быстро вы отвечаете на сообщения?",
    answer:
      "Мы отвечаем в течение 2 часов в любое время — без выходных, праздников и задержек. Вы можете написать нам в Telegram @StackLabb или на почту stacklab7@gmail.com.",
    published: true,
    sortOrder: 2,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  },
  {
    id: "faq-3",
    question: "Этот сайт тоже сделали вы?",
    answer:
      "Да! Сайт STACKLAB, на котором вы находитесь — наша собственная разработка. Мы сделали его с нуля, чтобы на практике показать наш подход к дизайну, скорости и вёрстке.",
    published: true,
    sortOrder: 3,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  },
  {
    id: "faq-4",
    question: "Где можно посмотреть другие ваши работы?",
    answer:
      "В блоке проектов представлены реальные живые сайты, которые мы запустили: Apex Detailing, Burim Store и KoreaCar. Вы можете кликнуть на любой из них и перейти на работающий сайт.",
    published: true,
    sortOrder: 4,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  },
  {
    id: "faq-5",
    question: "Будет ли сайт адаптирован под телефоны?",
    answer:
      "Да, абсолютно. Мы проектируем адаптивную версию так, чтобы сайт мгновенно открывался и идеально выглядел на любых смартфонах, планшетах и мониторах.",
    published: true,
    sortOrder: 5,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  },
  {
    id: "faq-6",
    question: "Куда будут приходить заявки с сайта?",
    answer:
      "Заявки могут приходить напрямую в ваш Telegram, на электронную почту или в CRM-систему — как вам удобнее. Уведомление приходит моментально при отправке формы клиентом.",
    published: true,
    sortOrder: 6,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  },
  {
    id: "faq-7",
    question: "Поможете ли вы с доменом и хостингом?",
    answer:
      "Да, мы полностью берем на себя публикацию: поможем выбрать и привязать домен, настроим бесплатный HTTPS-сертификат и запустим сайт на надежном быстром хостинге.",
    published: true,
    sortOrder: 7,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  },
];

export const DEFAULT_PROCESS_STEPS = [
  {
    id: "step-1",
    title: "День 1: Знакомство и структура",
    description:
      "Разбираем задачу, определяем ключевые цели сайта и собираем прототип структуры без лишней воды.",
    published: true,
    sortOrder: 1,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  },
  {
    id: "step-2",
    title: "День 2: Концепция и дизайн",
    description:
      "Разрабатываем современный визуальный стиль, подбираем типографику, цветовую гамму и макеты ключевых экранов.",
    published: true,
    sortOrder: 2,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  },
  {
    id: "step-3",
    title: "День 3: Согласование и правки",
    description:
      "Показываем дизайн, вносим необходимые пожелания и оперативно финализируем визуальную часть.",
    published: true,
    sortOrder: 3,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  },
  {
    id: "step-4",
    title: "День 4: Вёрстка и интерактив",
    description:
      "Переносим дизайн в чистый код, подключаем формы заявок, анимации и проверяем мобильную адаптивность.",
    published: true,
    sortOrder: 4,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  },
  {
    id: "step-5",
    title: "День 5: Тестирование и запуск",
    description:
      "Проверяем скорость загрузки, подключаем домен, тестируем отправку заявок и публикуем готовый сайт.",
    published: true,
    sortOrder: 5,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  },
];

export const getPublishedProjects = unstable_cache(
  async (limit?: number) => {
    try {
      const items = await prisma.project.findMany({
        where: { published: true },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
        ...(limit ? { take: limit } : {}),
      });
      if (items && items.length > 0) return items;
    } catch (e) {
      console.warn("[data] using default projects fallback", e);
    }
    return limit ? DEFAULT_PROJECTS.slice(0, limit) : DEFAULT_PROJECTS;
  },
  ["published-projects"],
  { tags: [CONTENT_TAG], revalidate: 300 },
);

export const getProjectBySlug = unstable_cache(
  async (slug: string) => {
    try {
      const item = await prisma.project.findFirst({ where: { slug, published: true } });
      if (item) return item;
    } catch (e) {
      console.warn("[data] fallback for slug", slug, e);
    }
    return DEFAULT_PROJECTS.find((p) => p.slug === slug) ?? null;
  },
  ["project-by-slug"],
  { tags: [CONTENT_TAG], revalidate: 300 },
);

export const getPublishedServices = unstable_cache(
  async () => {
    try {
      const items = await prisma.service.findMany({
        where: { published: true },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      });
      if (items && items.length > 0) return items;
    } catch (e) {
      console.warn("[data] using default services fallback", e);
    }
    return DEFAULT_SERVICES;
  },
  ["published-services"],
  { tags: [CONTENT_TAG], revalidate: 300 },
);

export const getPublishedFaqs = unstable_cache(
  async () => {
    try {
      const items = await prisma.faq.findMany({
        where: { published: true },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      });
      if (items && items.length > 0) return items;
    } catch (e) {
      console.warn("[data] using default faqs fallback", e);
    }
    return DEFAULT_FAQS;
  },
  ["published-faqs"],
  { tags: [CONTENT_TAG], revalidate: 300 },
);

export const getPublishedTestimonials = unstable_cache(
  async () => {
    try {
      return await prisma.testimonial.findMany({
        where: { published: true },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      });
    } catch (e) {
      console.warn("[data] testimonials fallback", e);
      return [];
    }
  },
  ["published-testimonials"],
  { tags: [CONTENT_TAG], revalidate: 300 },
);

export const getPublishedProcessSteps = unstable_cache(
  async () => {
    try {
      const items = await prisma.processStep.findMany({
        where: { published: true },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      });
      if (items && items.length > 0) return items;
    } catch (e) {
      console.warn("[data] using default process steps fallback", e);
    }
    return DEFAULT_PROCESS_STEPS;
  },
  ["published-process-steps"],
  { tags: [CONTENT_TAG], revalidate: 300 },
);

export const getAllProjects = unstable_cache(
  async () => {
    try {
      const items = await prisma.project.findMany({
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      });
      if (items && items.length > 0) return items;
    } catch {
      // fallback
    }
    return DEFAULT_PROJECTS;
  },
  ["all-projects"],
  { tags: [CONTENT_TAG], revalidate: 60 },
);

export const getAllServices = unstable_cache(
  async () => {
    try {
      const items = await prisma.service.findMany({
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      });
      if (items && items.length > 0) return items;
    } catch {
      // fallback
    }
    return DEFAULT_SERVICES;
  },
  ["all-services"],
  { tags: [CONTENT_TAG], revalidate: 60 },
);

export const getAllFaqs = unstable_cache(
  async () => {
    try {
      const items = await prisma.faq.findMany({
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      });
      if (items && items.length > 0) return items;
    } catch {
      // fallback
    }
    return DEFAULT_FAQS;
  },
  ["all-faqs"],
  { tags: [CONTENT_TAG], revalidate: 60 },
);

export const getAllTestimonials = unstable_cache(
  async () => {
    try {
      return await prisma.testimonial.findMany({
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      });
    } catch {
      return [];
    }
  },
  ["all-testimonials"],
  { tags: [CONTENT_TAG], revalidate: 60 },
);

export const getAllProcessSteps = unstable_cache(
  async () => {
    try {
      const items = await prisma.processStep.findMany({
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      });
      if (items && items.length > 0) return items;
    } catch {
      // fallback
    }
    return DEFAULT_PROCESS_STEPS;
  },
  ["all-process-steps"],
  { tags: [CONTENT_TAG], revalidate: 60 },
);
