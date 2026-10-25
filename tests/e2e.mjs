#!/usr/bin/env node
/**
 * End-to-end verification against a production build.
 *
 * Run:  npm run build && npm run test:e2e
 *
 * The script starts `next start` on a free port, drives the real HTTP surface
 * (public pages, lead API, auth redirects, server actions), and asserts the
 * resulting rows in the real database through Prisma. It does not mock the
 * server or the database.
 */
import { spawn, execSync } from "node:child_process";
import { createHash, randomBytes } from "node:crypto";
import { existsSync, readFileSync, unlinkSync } from "node:fs";
import { resolve } from "node:path";
import { setTimeout as sleep } from "node:timers/promises";

import prismaPackage from "@prisma/client";

const { PrismaClient } = prismaPackage;
const prisma = new PrismaClient();

const PORT = Number(process.env.E2E_PORT ?? 3105);
const BASE = `http://127.0.0.1:${PORT}`;
const RUN = Date.now().toString(36);

const results = [];

function loadEnvFile() {
  const file = resolve(process.cwd(), ".env");
  if (!existsSync(file)) return;
  for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const index = trimmed.indexOf("=");
    if (index === -1) continue;
    const key = trimmed.slice(0, index).trim();
    let value = trimmed.slice(index + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

async function test(name, fn) {
  try {
    await fn();
    results.push({ name, ok: true });
    console.log(`  PASS  ${name}`);
  } catch (error) {
    results.push({ name, ok: false, error });
    console.log(`  FAIL  ${name}`);
    console.log(`        ${error instanceof Error ? error.message : String(error)}`);
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`${message} (expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)})`);
  }
}

/* ------------------------------- HTTP client ------------------------------ */

const cookies = new Map();

function cookieHeader() {
  return [...cookies.entries()].map(([key, value]) => `${key}=${value}`).join("; ");
}

function storeCookies(response) {
  const list = typeof response.headers.getSetCookie === "function" ? response.headers.getSetCookie() : [];
  for (const raw of list) {
    const pair = raw.split(";")[0] ?? "";
    const index = pair.indexOf("=");
    if (index === -1) continue;
    const name = pair.slice(0, index).trim();
    const value = pair.slice(index + 1).trim();
    const expired = /max-age=0|expires=thu, 01 jan 1970/i.test(raw);
    if (!value || expired) cookies.delete(name);
    else cookies.set(name, value);
  }
}

async function request(path, options = {}) {
  const headers = {
    origin: BASE,
    ...(options.headers ?? {}),
  };
  if (cookies.size > 0) headers.cookie = cookieHeader();

  const response = await fetch(`${BASE}${path}`, {
    redirect: "manual",
    ...options,
    headers,
  });
  storeCookies(response);
  return response;
}

async function getText(path) {
  const response = await request(path);
  return { status: response.status, text: await response.text(), headers: response.headers };
}

function formBlocks(html) {
  return [...html.matchAll(/<form\b[^>]*>([\s\S]*?)<\/form>/g)].map((match) => match[0]);
}

function decodeEntities(value) {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function findForm(html, predicate) {
  for (const block of formBlocks(html)) {
    if (predicate(block)) return block;
  }
  return null;
}

/**
 * React 19 renders progressive-enhancement fields for server actions:
 * `$ACTION_ID_x` for plain actions and `$ACTION_REF_n` / `$ACTION_n:0` for
 * useActionState forms. Sending them back verbatim performs a real
 * no-JavaScript form submission, exactly like a browser would.
 */
function hiddenFields(block) {
  const fields = {};
  for (const tag of block.matchAll(/<input\b[^>]*>/g)) {
    const attrs = {};
    for (const attr of tag[0].matchAll(/([a-zA-Z0-9_$:-]+)="([^"]*)"/g)) {
      attrs[attr[1]] = decodeEntities(attr[2] ?? "");
    }
    if (attrs.type === "hidden" && attrs.name) fields[attrs.name] = attrs.value ?? "";
  }
  return fields;
}

async function submitForm(path, block, fields) {
  const body = new FormData();
  for (const [key, value] of Object.entries(hiddenFields(block))) body.set(key, value);
  for (const [key, value] of Object.entries(fields)) body.set(key, value);
  return request(path, {
    method: "POST",
    body,
    headers: { referer: `${BASE}${path}` },
  });
}

function ipFor(tag) {
  const part = Math.abs(hashCode(`${RUN}-${tag}`)) % 250;
  return `10.${100 + (part % 100)}.${part}.${(part % 200) + 1}`;
}

function hashCode(value) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }
  return hash;
}

/* ---------------------------------- setup --------------------------------- */

loadEnvFile();
process.env.APP_URL = BASE;
process.env.NODE_ENV = "production";

const adminEmail = (process.env.ADMIN_EMAIL ?? "").trim().toLowerCase();
const adminPassword = process.env.ADMIN_PASSWORD ?? "";

if (!adminEmail || !adminPassword) {
  console.error("ADMIN_EMAIL / ADMIN_PASSWORD are required in .env to run the admin checks.");
  process.exit(1);
}

if (!existsSync(resolve(process.cwd(), ".next", "BUILD_ID"))) {
  console.error("No production build found. Run `npm run build` first.");
  process.exit(1);
}

const server = spawn(`npx next start -p ${PORT}`, {
  shell: true,
  env: { ...process.env, NODE_ENV: "production", APP_URL: BASE },
  stdio: ["ignore", "pipe", "pipe"],
});

let serverLog = "";
server.stdout.on("data", (chunk) => {
  serverLog += chunk.toString();
});
server.stderr.on("data", (chunk) => {
  serverLog += chunk.toString();
});

function stopServer() {
  if (server.killed) return;
  try {
    if (process.platform === "win32") {
      execSync(`taskkill /PID ${server.pid} /T /F`, { stdio: "ignore" });
    } else {
      server.kill("SIGTERM");
    }
  } catch {
    // Already stopped.
  }
}

async function waitForServer() {
  for (let attempt = 0; attempt < 90; attempt += 1) {
    if (server.exitCode !== null) break;
    try {
      const response = await fetch(`${BASE}/`, { signal: AbortSignal.timeout(2000) });
      if (response.status === 200) return;
    } catch {
      // Not ready yet.
    }
    await sleep(1000);
  }
  throw new Error(`Server did not start.\n${serverLog.slice(-2000)}`);
}

/* ---------------------------------- run ---------------------------------- */

const leadContact = `e2e-${RUN}@example.com`;
const leadName = `E2E Клиент ${RUN}`;
const testIps = [];
let leadId = null;
let leadNumber = null;

async function main() {
  await waitForServer();
  console.log(`\nSTACKLAB e2e - ${BASE}\n`);

  // Clean leftovers from previous runs.
  await prisma.lead.deleteMany({ where: { contact: { contains: "e2e-" } } });
  await prisma.project.deleteMany({ where: { slug: { startsWith: "e2e-" } } });
  await prisma.testimonial.deleteMany({ where: { author: { startsWith: "E2E " } } });
  // Login attempts from previous runs must not exhaust the rate limit.
  await prisma.rateLimit.deleteMany({ where: { key: { startsWith: "login:" } } });

  await test("public pages respond with expected content", async () => {
    const pages = [
      ["/", "Создаём сайты"],
      ["/projects", "Aster"],
      ["/projects/aster", "Задача"],
      ["/services", "Лендинг"],
      ["/about", "Принципы"],
      ["/contacts", "Заявка на проект"],
      ["/privacy", "Политика конфиденциальности"],
    ];
    for (const [path, marker] of pages) {
      const { status, text } = await getText(path);
      assertEqual(status, 200, `GET ${path}`);
      assert(text.includes(marker), `GET ${path} does not contain "${marker}"`);
    }
  });

  await test("unknown route returns 404 page", async () => {
    const { status, text } = await getText("/this-page-does-not-exist");
    assertEqual(status, 404, "status for unknown route");
    assert(text.includes("Такой страницы здесь нет"), "404 page content");
  });

  await test("robots.txt and sitemap.xml expose the public site only", async () => {
    const robots = await getText("/robots.txt");
    assertEqual(robots.status, 200, "robots status");
    assert(robots.text.includes("Disallow: /admin"), "robots must disallow /admin");
    assert(robots.text.includes("sitemap.xml"), "robots must reference sitemap");

    const sitemap = await getText("/sitemap.xml");
    assertEqual(sitemap.status, 200, "sitemap status");
    assert(sitemap.text.includes("/projects/aster"), "sitemap must include project pages");
    assert(!sitemap.text.includes("/admin"), "sitemap must not include admin");
  });

  await test("admin routes redirect anonymous visitors to the login page", async () => {
    for (const path of ["/admin", "/admin/dashboard", "/admin/leads", "/admin/projects"]) {
      const response = await request(path);
      assert([307, 302].includes(response.status), `${path} must redirect, got ${response.status}`);
      const location = response.headers.get("location") ?? "";
      assert(location.includes("/admin/login"), `${path} redirects to ${location}`);
    }
  });

  await test("login page issues a CSRF token and renders the form", async () => {
    const { status, text } = await getText("/admin/login");
    assertEqual(status, 200, "login page status");
    assert(text.includes("Вход для владельца"), "login heading");
    assert(cookies.has("stacklab_csrf"), "CSRF cookie must be set");
    const csrf = cookies.get("stacklab_csrf");
    assert(csrf && csrf.length >= 10, "CSRF token looks invalid");
    assert(findForm(text, (block) => block.includes('name="password"')), "login form not found");
  });

  await test("lead API rejects invalid, spammy and too-fast submissions", async () => {
    const ip = ipFor("negative");
    testIps.push(ip);

    const invalid = await request("/api/leads", {
      method: "POST",
      headers: { "content-type": "application/json", "x-forwarded-for": ip },
      body: JSON.stringify({
        name: "A",
        contact: "",
        preferredContactMethod: "telegram",
        projectType: "unknown",
        privacyConsent: false,
      }),
    });
    assertEqual(invalid.status, 400, "invalid lead status");
    const invalidBody = await invalid.json();
    assert(invalidBody.fieldErrors?.privacyConsent, "consent error must be returned");

    const honeypot = await request("/api/leads", {
      method: "POST",
      headers: { "content-type": "application/json", "x-forwarded-for": ip },
      body: JSON.stringify({
        name: "Spam Bot",
        contact: "@spam",
        preferredContactMethod: "telegram",
        projectType: "landing",
        privacyConsent: true,
        website: "https://spam.example",
      }),
    });
    assertEqual(honeypot.status, 400, "honeypot status");

    const tooFast = await request("/api/leads", {
      method: "POST",
      headers: { "content-type": "application/json", "x-forwarded-for": ip },
      body: JSON.stringify({
        name: "Fast Bot",
        contact: "@fast",
        preferredContactMethod: "telegram",
        projectType: "landing",
        privacyConsent: true,
        formOpenedAt: Date.now(),
      }),
    });
    assertEqual(tooFast.status, 400, "instant submit status");
  });

  await test("lead API stores a valid lead in the database", async () => {
    const ip = ipFor("happy");
    testIps.push(ip);

    const response = await request("/api/leads", {
      method: "POST",
      headers: { "content-type": "application/json", "x-forwarded-for": ip, "user-agent": "STACKLAB e2e" },
      body: JSON.stringify({
        name: leadName,
        contact: leadContact,
        preferredContactMethod: "email",
        projectType: "corporate",
        budget: "100 000 - 250 000 ₽",
        message: "Проверка сохранения заявки из автотеста.",
        privacyConsent: true,
        formOpenedAt: Date.now() - 5000,
      }),
    });

    assertEqual(response.status, 200, "valid lead status");
    const body = await response.json();
    assertEqual(body.ok, true, "response ok flag");
    assertEqual(body.duplicate, false, "first submission must not be a duplicate");

    const stored = await prisma.lead.findFirst({ where: { contact: leadContact } });
    assert(stored, "lead row must exist");
    assertEqual(stored.name, leadName, "stored name");
    assertEqual(stored.status, "new", "stored status");
    assertEqual(stored.privacyConsent, true, "consent must be stored");
    assertEqual(stored.projectType, "corporate", "project type");
    assert(stored.number >= 1001, "lead number must be allocated");
    assert(stored.ipHash && stored.ipHash.length === 32, "IP must be hashed, not stored raw");

    leadId = stored.id;
    leadNumber = stored.number;
  });

  await test("repeated submission is deduplicated instead of duplicated", async () => {
    const ip = ipFor("dedupe");
    testIps.push(ip);

    const response = await request("/api/leads", {
      method: "POST",
      headers: { "content-type": "application/json", "x-forwarded-for": ip },
      body: JSON.stringify({
        name: leadName,
        contact: leadContact,
        preferredContactMethod: "email",
        projectType: "corporate",
        privacyConsent: true,
        formOpenedAt: Date.now() - 5000,
      }),
    });
    assertEqual(response.status, 200, "duplicate status");
    const body = await response.json();
    assertEqual(body.duplicate, true, "must be marked as duplicate");
    assertEqual(body.number, leadNumber, "same lead number expected");

    const count = await prisma.lead.count({ where: { contact: leadContact } });
    assertEqual(count, 1, "only one row per contact and project type");
  });

  await test("lead API rate limits repeated contacts", async () => {
    const ip = ipFor("contact-limit");
    testIps.push(ip);
    let lastStatus = 0;

    for (let index = 0; index < 4; index += 1) {
      const response = await request("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json", "x-forwarded-for": ip },
        body: JSON.stringify({
          name: "Rate Limit",
          contact: `rate-${RUN}@example.com`,
          preferredContactMethod: "email",
          projectType: "landing",
          privacyConsent: true,
          formOpenedAt: Date.now() - 5000,
        }),
      });
      lastStatus = response.status;
      if (index < 3) assertEqual(response.status, 200, `request ${index + 1} should pass`);
    }
    assertEqual(lastStatus, 429, "fourth request from the same contact must be limited");
    await prisma.lead.deleteMany({ where: { contact: `rate-${RUN}@example.com` } });
  });

  await test("wrong credentials are rejected", async () => {
    const page = await getText("/admin/login");
    const form = findForm(page.text, (block) => block.includes('name="password"'));
    const csrf = cookies.get("stacklab_csrf") ?? "";
    const response = await submitForm("/admin/login", form, {
      email: adminEmail,
      password: `${adminPassword}-wrong`,
      csrf,
      next: "",
    });
    const text = await response.text();
    assert(text.includes("Неверный email или пароль"), "login error message expected");
    assert(!cookies.has("stacklab_session"), "session cookie must not be issued");
  });

  await test("correct credentials create a session", async () => {
    const page = await getText("/admin/login");
    const form = findForm(page.text, (block) => block.includes('name="password"'));
    const csrf = cookies.get("stacklab_csrf") ?? "";
    const response = await submitForm("/admin/login", form, {
      email: adminEmail,
      password: adminPassword,
      csrf,
      next: "/admin/leads",
    });
    await response.text();

    if (!cookies.has("stacklab_session")) {
      // Fallback so the remaining admin checks still run: create a real session row.
      const admin = await prisma.adminUser.findUnique({ where: { email: adminEmail } });
      assert(admin, "admin user must exist");
      const token = randomBytes(32).toString("base64url");
      await prisma.adminSession.create({
        data: {
          tokenHash: createHash("sha256").update(token).digest("hex"),
          userId: admin.id,
          expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        },
      });
      cookies.set("stacklab_session", token);
      throw new Error(
        `login form did not set a session cookie (status ${response.status}); used a direct session fallback`,
      );
    }

    const dashboard = await getText("/admin/dashboard");
    assertEqual(dashboard.status, 200, "dashboard after login");
    assert(dashboard.text.includes("Обзор"), "dashboard heading");
  });

  await test("admin pages render for an authenticated owner", async () => {
    const pages = [
      ["/admin/dashboard", "Обзор"],
      ["/admin/leads", "Заявки"],
      ["/admin/projects", "Проекты"],
      ["/admin/services", "Услуги"],
      ["/admin/homepage", "Первый экран"],
      ["/admin/process", "Этапы работы"],
      ["/admin/testimonials", "Отзывы"],
      ["/admin/faq", "FAQ"],
      ["/admin/contacts", "Контакты и ссылки"],
      ["/admin/settings", "Настройки сайта"],
    ];
    for (const [path, marker] of pages) {
      const { status, text } = await getText(path);
      assertEqual(status, 200, `GET ${path}`);
      assert(text.includes(marker), `GET ${path} does not contain "${marker}"`);
    }
  });

  await test("saved lead is visible in the admin panel", async () => {
    const list = await getText("/admin/leads?q=" + encodeURIComponent(leadContact));
    assertEqual(list.status, 200, "leads list status");
    assert(list.text.includes(leadName), "lead name must be listed");

    const detail = await getText(`/admin/leads/${leadId}`);
    assertEqual(detail.status, 200, "lead detail status");
    assert(detail.text.includes(leadContact), "contact must be visible");
    assert(detail.text.includes("Внутренние заметки"), "notes field must be present");
  });

  await test("lead status and internal notes are persisted", async () => {
    const detail = await getText(`/admin/leads/${leadId}`);
    const form = findForm(
      detail.text,
      (block) => block.includes('name="leadId"') && block.includes('name="status"'),
    );
    assert(form, "lead update form not found");

    const note = `Созвон назначен ${RUN}`;
    const response = await submitForm(`/admin/leads/${leadId}`, form, {
      leadId,
      status: "in_progress",
      internalNotes: note,
    });
    await response.text();

    const stored = await prisma.lead.findUnique({ where: { id: leadId } });
    assertEqual(stored?.status, "in_progress", "status must be saved");
    assertEqual(stored?.internalNotes, note, "notes must be saved");

    const refreshed = await getText(`/admin/leads/${leadId}`);
    assert(refreshed.text.includes("В работе"), "updated status must be rendered");
  });

  await test("CSV export requires auth and contains the lead", async () => {
    const authorized = await request("/api/admin/leads/export");
    assertEqual(authorized.status, 200, "export status");
    assert(
      (authorized.headers.get("content-type") ?? "").includes("text/csv"),
      "export content type",
    );
    const csv = await authorized.text();
    assert(csv.includes("Номер;Дата;Имя"), "CSV header");
    assert(csv.includes(leadContact), "CSV must contain the test lead");
    assert(csv.includes("В работе"), "CSV must reflect the updated status");
  });

  await test("project can be created, published and deleted from the admin", async () => {
    const formPage = await getText("/admin/projects/new");
    const form = findForm(formPage.text, (block) => block.includes('name="title"'));
    assert(form, "project create form not found");

    const slug = `e2e-${RUN}`;
    const title = `E2E Проект ${RUN}`;
    const response = await submitForm("/admin/projects/new", form, {
      title,
      slug,
      category: "landing",
      description: "Описание тестового проекта для проверки публикации.",
      challenge: "Проверить создание проекта через панель управления.",
      solution: "Создание, публикация и удаление выполняются серверными действиями.",
      technologies: "Next.js, Prisma",
      coverImage: "/projects/aster-cover.svg",
      projectUrl: "",
      year: "2026",
      isConcept: "on",
      published: "on",
      sortOrder: "999",
    });
    await response.text();

    const project = await prisma.project.findUnique({ where: { slug } });
    assert(project, "project row must be created");
    assertEqual(project.published, true, "project must be published");

    const publicPage = await getText(`/projects/${slug}`);
    assertEqual(publicPage.status, 200, "public project page");
    assert(publicPage.text.includes(title), "project title on the public page");

    const editPage = await getText(`/admin/projects/${project.id}`);
    const deleteForm = findForm(
      editPage.text,
      (block) => block.includes('name="id"') && block.includes("Удалить"),
    );
    assert(deleteForm, "project delete form not found");
    const deleteResponse = await submitForm(`/admin/projects/${project.id}`, deleteForm, {
      id: project.id,
    });
    await deleteResponse.text();

    const removed = await prisma.project.findUnique({ where: { slug } });
    assertEqual(removed, null, "project must be deleted");
  });

  await test("FAQ content is editable from the admin", async () => {
    const faq = await prisma.faq.findFirst({ orderBy: { sortOrder: "asc" } });
    assert(faq, "seed FAQ must exist");

    const page = await getText("/admin/faq");
    const form = findForm(
      page.text,
      (block) => block.includes('name="question"') && block.includes(faq.id),
    );
    assert(form, "FAQ save form not found");

    const originalAnswer = faq.answer;
    const marker = `Обновлено автотестом ${RUN}`;
    const response = await submitForm("/admin/faq", form, {
      id: faq.id,
      question: faq.question,
      answer: marker,
      published: "on",
      sortOrder: String(faq.sortOrder),
    });
    await response.text();

    const updated = await prisma.faq.findUnique({ where: { id: faq.id } });
    assertEqual(updated?.answer, marker, "FAQ answer must be updated");

    await submitForm("/admin/faq", form, {
      id: faq.id,
      question: faq.question,
      answer: originalAnswer,
      published: "on",
      sortOrder: String(faq.sortOrder),
    });
  });

  await test("testimonial can be published to the public site and removed", async () => {
    const page = await getText("/admin/testimonials");
    const form = findForm(
      page.text,
      (block) => block.includes('name="author"') && block.includes('name="content"'),
    );
    assert(form, "testimonial create form not found");

    const author = `E2E Клиент ${RUN}`;
    const content = `Проверка публикации отзыва ${RUN}. Текст не выдаётся за реальный отзыв.`;
    const response = await submitForm("/admin/testimonials", form, {
      author,
      company: "E2E",
      content,
      published: "on",
      sortOrder: "999",
    });
    await response.text();

    const created = await prisma.testimonial.findFirst({ where: { author } });
    assert(created, "testimonial row must be created");

    const home = await getText("/");
    assert(home.text.includes(author), "published testimonial must appear on the home page");

    const list = await getText("/admin/testimonials");
    const deleteForm = findForm(
      list.text,
      (block) => block.includes('name="id"') && block.includes(created.id) && block.includes("Удалить"),
    );
    assert(deleteForm, "testimonial delete form not found");
    await submitForm("/admin/testimonials", deleteForm, { id: created.id }).then((r) => r.text());

    const removed = await prisma.testimonial.findUnique({ where: { id: created.id } });
    assertEqual(removed, null, "testimonial must be deleted");
  });

  await test("site settings update the public footer without code changes", async () => {
    const previous = await prisma.siteSetting.findUnique({ where: { key: "footer.note" } });
    const page = await getText("/admin/contacts");
    const form = findForm(
      page.text,
      (block) => block.includes('name="group"') && block.includes("footer.note"),
    );
    assert(form, "settings form not found");

    const marker = `Проверка настроек ${RUN}`;
    const response = await submitForm("/admin/contacts", form, {
      group: "contacts",
      "footer.note": marker,
    });
    await response.text();

    const stored = await prisma.siteSetting.findUnique({ where: { key: "footer.note" } });
    assertEqual(stored?.value, marker, "setting must be persisted");

    const home = await getText("/");
    assert(home.text.includes(marker), "new footer note must appear on the public site");

    if (previous) {
      await prisma.siteSetting.update({ where: { key: "footer.note" }, data: { value: previous.value } });
    } else {
      await prisma.siteSetting.deleteMany({ where: { key: "footer.note" } });
    }
  });

  await test("cover upload validates auth, file type and stores a real image", async () => {
    const anonymous = await fetch(`${BASE}/api/admin/upload`, { method: "POST", body: new FormData() });
    assertEqual(anonymous.status, 401, "anonymous upload must be rejected");

    const svg = new FormData();
    svg.set("file", new Blob(["<svg xmlns='http://www.w3.org/2000/svg'></svg>"], { type: "image/svg+xml" }), "x.svg");
    const svgResponse = await request("/api/admin/upload", { method: "POST", body: svg });
    assertEqual(svgResponse.status, 415, "SVG upload must be rejected");

    const png = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
      "base64",
    );
    const form = new FormData();
    form.set("file", new Blob([png], { type: "image/png" }), "cover.png");
    const response = await request("/api/admin/upload", { method: "POST", body: form });
    assertEqual(response.status, 200, "PNG upload status");
    const payload = await response.json();
    assert(payload.url?.startsWith("/uploads/projects/"), "uploaded url");

    const served = await fetch(`${BASE}${payload.url}`);
    assertEqual(served.status, 200, "uploaded file must be served");

    const absolute = resolve(process.cwd(), "public", payload.url.replace(/^\//, ""));
    try {
      unlinkSync(absolute);
    } catch {
      // Cleanup is best effort.
    }
  });

  await test("logout clears the session", async () => {
    const page = await getText("/admin/dashboard");
    const form = findForm(page.text, (block) => block.includes("Выйти"));
    assert(form, "logout form not found");
    const response = await submitForm("/admin/dashboard", form, {});
    await response.text();

    assert(!cookies.has("stacklab_session"), "session cookie must be cleared");

    const dashboard = await request("/admin/dashboard");
    assert([307, 302].includes(dashboard.status), "dashboard must redirect after logout");
  });
}

main()
  .catch((error) => {
    console.error("\nFatal error:", error);
    console.error(serverLog.slice(-3000));
    results.push({ name: "fatal", ok: false, error });
  })
  .finally(async () => {
    // Remove test data that survived a failed assertion.
    try {
      await prisma.lead.deleteMany({ where: { contact: { contains: "e2e-" } } });
      await prisma.project.deleteMany({ where: { slug: { startsWith: "e2e-" } } });
      await prisma.testimonial.deleteMany({ where: { author: { startsWith: "E2E " } } });
      await prisma.adminSession.deleteMany({ where: { expiresAt: { lt: new Date() } } });
    } catch (error) {
      console.error("Cleanup failed:", error);
    }
    await prisma.$disconnect();
    stopServer();

    const failed = results.filter((result) => !result.ok);
    console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
    if (failed.length > 0) {
      console.log("Failed checks:");
      for (const result of failed) console.log(`  - ${result.name}`);
      process.exitCode = 1;
    }
  });
