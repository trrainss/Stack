export const LEAD_STATUSES = [
  { value: "new", label: "Новая" },
  { value: "review", label: "На рассмотрении" },
  { value: "in_progress", label: "В работе" },
  { value: "done", label: "Завершена" },
  { value: "rejected", label: "Отклонена" },
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number]["value"];

export function leadStatusLabel(value: string): string {
  return LEAD_STATUSES.find((status) => status.value === value)?.label ?? value;
}

export const CONTACT_METHODS = [
  { value: "telegram", label: "Telegram" },
  { value: "email", label: "Электронная почта" },
  { value: "phone", label: "Телефон" },
] as const;

export function contactMethodLabel(value: string): string {
  return CONTACT_METHODS.find((method) => method.value === value)?.label ?? value;
}

export const PROJECT_TYPES = [
  { value: "landing", label: "Лендинг" },
  { value: "corporate", label: "Корпоративный сайт" },
  { value: "ecommerce", label: "Интернет-магазин" },
  { value: "redesign", label: "Редизайн сайта" },
  { value: "custom", label: "Индивидуальная разработка" },
  { value: "support", label: "Поддержка и развитие" },
  { value: "other", label: "Другая задача" },
] as const;

export function projectTypeLabel(value: string): string {
  return PROJECT_TYPES.find((type) => type.value === value)?.label ?? value;
}

export const PROJECT_CATEGORIES = [
  { value: "landing", label: "Лендинг" },
  { value: "corporate", label: "Корпоративный сайт" },
  { value: "ecommerce", label: "Интернет-магазин" },
  { value: "redesign", label: "Редизайн" },
  { value: "interface", label: "Интерфейс" },
  { value: "other", label: "Другое" },
] as const;

export function projectCategoryLabel(value: string): string {
  return PROJECT_CATEGORIES.find((category) => category.value === value)?.label ?? value;
}

export const BUDGET_OPTIONS = [
  "Небольшой бюджет",
  "Средний бюджет",
  "Гибкий бюджет",
  "Пока не определён",
  "Хочу обсудить варианты",
] as const;

export const LEADS_PAGE_SIZE = 10;
