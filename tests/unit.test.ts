import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, it } from "node:test";

import {
  BUDGET_OPTIONS,
  LEAD_STATUSES,
  contactMethodLabel,
  leadStatusLabel,
  projectCategoryLabel,
  projectTypeLabel,
} from "../src/lib/constants";
import {
  csvEscape,
  formatDate,
  normalizeTelegram,
  normalizeTikTok,
  parseLines,
  slugify,
  splitParagraphs,
  toCsv,
  truncate,
} from "../src/lib/utils";
import {
  fieldErrors,
  firstError,
  leadSchema,
  leadUpdateSchema,
  loginSchema,
  projectSchema,
  serviceSchema,
} from "../src/lib/validation";

const validLead = {
  name: "Анна",
  contact: "@anna",
  preferredContactMethod: "telegram",
  projectType: "landing",
  budget: "100 000 - 250 000 ₽",
  message: "Нужен лендинг для запуска.",
  privacyConsent: true,
};

describe("slugify", () => {
  it("transliterates Cyrillic", () => {
    assert.equal(slugify("Лендинг для бизнеса"), "lending-dlya-biznesa");
  });

  it("collapses punctuation and trims separators", () => {
    assert.equal(slugify("  STACKLAB: сайт №1!  "), "stacklab-sayt-1");
  });

  it("limits length to 70 characters", () => {
    assert.ok(slugify("a".repeat(120)).length <= 70);
  });
});

describe("text helpers", () => {
  it("parseLines drops empty lines and trims", () => {
    assert.deepEqual(parseLines(" первая \n\n вторая \r\n"), ["первая", "вторая"]);
    assert.deepEqual(parseLines(null), []);
  });

  it("splitParagraphs keeps single newlines inside a paragraph", () => {
    assert.deepEqual(splitParagraphs("Первый\nстроки\n\nВторой"), ["Первый\nстроки", "Второй"]);
  });

  it("truncate adds an ellipsis only when needed", () => {
    assert.equal(truncate("короткий", 20), "короткий");
    assert.equal(truncate("abcdefghij", 6), "abcde…");
  });

  it("formats dates in Russian and survives invalid input", () => {
    const date = new Date(2026, 0, 15, 9, 5);
    assert.equal(formatDate(date), "15 января 2026");
    assert.equal(formatDate(date, true), "15 января 2026, 09:05");
    assert.equal(formatDate("not-a-date"), "-");
  });

  it("escapes CSV cells and joins with semicolons", () => {
    assert.equal(csvEscape('text with "quotes"'), '"text with ""quotes"""');
    assert.equal(csvEscape(null), "");
    assert.equal(toCsv([["a", 1], ["b;c", true]]), "a;1\r\n\"b;c\";true");
  });

  it("normalizes Telegram and TikTok links", () => {
    assert.equal(normalizeTelegram("@studio"), "https://t.me/studio");
    assert.equal(normalizeTelegram("https://t.me/studio"), "https://t.me/studio");
    assert.equal(normalizeTelegram(""), "");
    assert.equal(normalizeTikTok("@studio"), "https://www.tiktok.com/@studio");
    assert.equal(normalizeTikTok("https://tiktok.com/@studio"), "https://tiktok.com/@studio");
  });
});

describe("lead validation", () => {
  it("accepts a complete submission and trims values", () => {
    const parsed = leadSchema.safeParse({ ...validLead, name: "  Анна  " });
    assert.equal(parsed.success, true);
    if (parsed.success) {
      assert.equal(parsed.data.name, "Анна");
      assert.equal(parsed.data.privacyConsent, true);
    }
  });

  it("requires consent", () => {
    const parsed = leadSchema.safeParse({ ...validLead, privacyConsent: false });
    assert.equal(parsed.success, false);
    if (!parsed.success) {
      assert.match(firstError(parsed.error), /согласие/i);
      assert.ok(fieldErrors(parsed.error).privacyConsent);
    }
  });

  it("rejects short names, unknown project types and filled honeypots", () => {
    assert.equal(leadSchema.safeParse({ ...validLead, name: "A" }).success, false);
    assert.equal(leadSchema.safeParse({ ...validLead, projectType: "spaceship" }).success, false);
    assert.equal(leadSchema.safeParse({ ...validLead, website: "spam" }).success, false);
  });

  it("strips control characters and rejects overly long messages", () => {
    const parsed = leadSchema.safeParse({ ...validLead, message: "Текст\u0000\u0007 задачи" });
    assert.equal(parsed.success, true);
    if (parsed.success) assert.equal(parsed.data.message, "Текст задачи");

    assert.equal(leadSchema.safeParse({ ...validLead, message: "x".repeat(2001) }).success, false);
  });
});

describe("admin validation", () => {
  it("validates login payloads", () => {
    assert.equal(
      loginSchema.safeParse({ email: "owner@studio.ru", password: "long-enough", csrf: "x".repeat(12) })
        .success,
      true,
    );
    assert.equal(
      loginSchema.safeParse({ email: "not-an-email", password: "long-enough", csrf: "x".repeat(12) })
        .success,
      false,
    );
    assert.equal(
      loginSchema.safeParse({ email: "owner@studio.ru", password: "short", csrf: "x".repeat(12) })
        .success,
      false,
    );
  });

  it("validates project urls and coerces sort order", () => {
    const base = {
      title: "Проект",
      category: "landing",
      description: "Достаточно длинное описание проекта.",
      challenge: "Достаточно длинная задача проекта.",
      solution: "Достаточно длинное решение проекта.",
      isConcept: true,
      published: false,
      sortOrder: "12",
    };

    const ok = projectSchema.safeParse({ ...base, projectUrl: "https://example.com" });
    assert.equal(ok.success, true);
    if (ok.success) assert.equal(ok.data.sortOrder, 12);

    assert.equal(projectSchema.safeParse({ ...base, projectUrl: "javascript:alert(1)" }).success, false);
    assert.equal(projectSchema.safeParse({ ...base, sortOrder: "-1" }).success, false);
  });

  it("validates service and lead update payloads", () => {
    assert.equal(
      serviceSchema.safeParse({
        title: "Лендинг",
        description: "Описание услуги для проверки.",
        published: true,
        sortOrder: 1,
      }).success,
      true,
    );

    assert.equal(
      leadUpdateSchema.safeParse({ leadId: "lead_1", status: "in_progress", internalNotes: "ok" })
        .success,
      true,
    );
    assert.equal(
      leadUpdateSchema.safeParse({ leadId: "lead_1", status: "unknown" }).success,
      false,
    );
  });
});

describe("labels", () => {
  it("maps known values and falls back to the raw value", () => {
    assert.equal(leadStatusLabel("in_progress"), "В работе");
    assert.equal(leadStatusLabel("custom"), "custom");
    assert.equal(contactMethodLabel("email"), "Электронная почта");
    assert.equal(projectTypeLabel("ecommerce"), "Интернет-магазин");
    assert.equal(projectCategoryLabel("interface"), "Интерфейс");
    assert.equal(LEAD_STATUSES.length, 5);
    assert.ok(BUDGET_OPTIONS.length >= 4);
  });
});

describe("prisma schemas", () => {
  function modelBlock(relativePath: string): string {
    const source = readFileSync(resolve(process.cwd(), relativePath), "utf8").replace(/\r\n/g, "\n");
    const match = /^model\s+\w+\s*\{/m.exec(source);
    assert.ok(match, `${relativePath} must contain models`);
    return source
      .slice(match.index)
      .split("\n")
      .map((line) => line.trimEnd())
      .join("\n")
      .trim();
  }

  it("keeps the SQLite and PostgreSQL model definitions identical", () => {
    assert.equal(
      modelBlock("prisma/schema.prisma"),
      modelBlock("prisma/postgres/schema.prisma"),
      "prisma/schema.prisma and prisma/postgres/schema.prisma have drifted apart",
    );
  });

  it("ships migrations without a UTF-8 BOM", () => {
    // PostgreSQL rejects a leading BOM with "syntax error at or near <BOM>",
    // and Prisma then records the migration as failed. Windows editors add it
    // silently, so guard against it in CI.
    for (const file of ["prisma/migrations/20261025133536_init/migration.sql", "prisma/postgres/migrations/20261025133536_init/migration.sql"]) {
      const bytes = readFileSync(resolve(process.cwd(), file));
      assert.ok(
        !(bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf),
        `${file} starts with a BOM`,
      );
    }
  });
});
