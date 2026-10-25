import { z } from "zod";

import { CONTACT_METHODS, LEAD_STATUSES, PROJECT_TYPES } from "@/lib/constants";

const contactValues = CONTACT_METHODS.map((method) => method.value) as [string, ...string[]];
const projectTypeValues = PROJECT_TYPES.map((type) => type.value) as [string, ...string[]];
const statusValues = LEAD_STATUSES.map((status) => status.value) as [string, ...string[]];

const controlChars = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

const httpUrl = z
  .string()
  .url("Ссылка должна начинаться с http:// или https://")
  .refine(
    (value) => /^https?:\/\//i.test(value),
    "Допустимы только ссылки http:// или https://",
  );

export function cleanText(value: string): string {
  return value.replace(controlChars, "").trim();
}

export const leadSchema = z.object({
  name: z
    .string()
    .transform(cleanText)
    .pipe(z.string().min(2, "Укажите имя (минимум 2 символа)").max(80, "Слишком длинное имя")),
  contact: z
    .string()
    .transform(cleanText)
    .pipe(
      z
        .string()
        .min(3, "Укажите контакт для связи")
        .max(120, "Контакт слишком длинный"),
    ),
  preferredContactMethod: z.enum(contactValues, {
    errorMap: () => ({ message: "Выберите способ связи" }),
  }),
  projectType: z.enum(projectTypeValues, {
    errorMap: () => ({ message: "Выберите тип проекта" }),
  }),
  budget: z
    .string()
    .transform(cleanText)
    .pipe(z.string().max(60, "Слишком длинное значение бюджета"))
    .optional()
    .transform((value) => (value ? value : undefined)),
  message: z
    .string()
    .transform(cleanText)
    .pipe(z.string().max(2000, "Комментарий слишком длинный"))
    .optional(),
  privacyConsent: z.literal(true, {
    errorMap: () => ({ message: "Нужно согласие на обработку персональных данных" }),
  }),
  website: z.string().max(0).optional(),
  formOpenedAt: z.coerce.number().optional(),
});

export type LeadInput = z.input<typeof leadSchema>;

export const loginSchema = z.object({
  email: z
    .string()
    .transform(cleanText)
    .pipe(z.string().min(3, "Введите email").max(160).email("Некорректный email")),
  password: z.string().min(8, "Пароль слишком короткий").max(200),
  csrf: z.string().min(10, "Форма устарела, обновите страницу"),
});

export const leadUpdateSchema = z.object({
  leadId: z.string().min(1),
  status: z.enum(statusValues),
  internalNotes: z
    .string()
    .transform(cleanText)
    .pipe(z.string().max(4000, "Заметка слишком длинная"))
    .optional(),
});

export const projectSchema = z.object({
  id: z.string().optional(),
  title: z.string().transform(cleanText).pipe(z.string().min(2, "Укажите название").max(120)),
  slug: z
    .string()
    .transform(cleanText)
    .optional()
    .transform((value) => (value ? value : undefined)),
  category: z.string().min(1, "Выберите категорию"),
  description: z.string().transform(cleanText).pipe(z.string().min(10, "Добавьте описание").max(600)),
  challenge: z.string().transform(cleanText).pipe(z.string().min(10, "Опишите задачу").max(2000)),
  solution: z.string().transform(cleanText).pipe(z.string().min(10, "Опишите решение").max(2000)),
  technologies: z.string().transform(cleanText).pipe(z.string().max(400)).optional(),
  coverImage: z.string().transform(cleanText).pipe(z.string().max(300)).optional(),
  projectUrl: z
    .string()
    .transform(cleanText)
    .optional()
    .transform((value) => (value ? value : undefined))
    .pipe(z.union([httpUrl, z.undefined()]).optional()),
  year: z.string().transform(cleanText).pipe(z.string().max(20)).optional(),
  isConcept: z.boolean(),
  published: z.boolean(),
  sortOrder: z.coerce.number().int().min(0).max(9999),
});

export const serviceSchema = z.object({
  id: z.string().optional(),
  title: z.string().transform(cleanText).pipe(z.string().min(2, "Укажите название").max(120)),
  slug: z
    .string()
    .transform(cleanText)
    .optional()
    .transform((value) => (value ? value : undefined)),
  description: z.string().transform(cleanText).pipe(z.string().min(10, "Добавьте описание").max(800)),
  features: z.string().transform(cleanText).pipe(z.string().max(2000)).optional(),
  audience: z.string().transform(cleanText).pipe(z.string().max(400)).optional(),
  outcome: z.string().transform(cleanText).pipe(z.string().max(400)).optional(),
  priceLabel: z.string().transform(cleanText).pipe(z.string().max(80)).optional(),
  published: z.boolean(),
  sortOrder: z.coerce.number().int().min(0).max(9999),
});

export const testimonialSchema = z.object({
  id: z.string().optional(),
  author: z.string().transform(cleanText).pipe(z.string().min(2, "Укажите автора").max(120)),
  company: z.string().transform(cleanText).pipe(z.string().max(120)).optional(),
  content: z.string().transform(cleanText).pipe(z.string().min(10, "Добавьте текст отзыва").max(1200)),
  published: z.boolean(),
  sortOrder: z.coerce.number().int().min(0).max(9999),
});

export const faqSchema = z.object({
  id: z.string().optional(),
  question: z.string().transform(cleanText).pipe(z.string().min(5, "Укажите вопрос").max(300)),
  answer: z.string().transform(cleanText).pipe(z.string().min(5, "Добавьте ответ").max(3000)),
  published: z.boolean(),
  sortOrder: z.coerce.number().int().min(0).max(9999),
});

export const processStepSchema = z.object({
  id: z.string().optional(),
  title: z.string().transform(cleanText).pipe(z.string().min(2, "Укажите название этапа").max(120)),
  description: z.string().transform(cleanText).pipe(z.string().min(5, "Добавьте описание").max(600)),
  published: z.boolean(),
  sortOrder: z.coerce.number().int().min(0).max(9999),
});

export function firstError(error: z.ZodError): string {
  return error.issues[0]?.message ?? "Проверьте заполнение полей";
}

export function fieldErrors(error: z.ZodError): Record<string, string> {
  const result: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "form";
    if (!result[key]) result[key] = issue.message;
  }
  return result;
}
