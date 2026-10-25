#!/usr/bin/env node
/**
 * Prepares the Supabase database from a local, git-ignored .env.supabase file.
 *
 *   npm run db:supabase              migrations + demo content + admin
 *   npm run db:supabase -- --check   only validate the file
 *   npm run db:supabase -- --skip-seed
 *
 * The file must contain DATABASE_URL (transaction pooler, port 6543) and
 * DIRECT_URL (session pooler or direct connection, port 5432). ADMIN_EMAIL and
 * ADMIN_PASSWORD are used to create the first administrator.
 */
import { existsSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

const FILE = resolve(process.cwd(), ".env.supabase");
const args = process.argv.slice(2);
const checkOnly = args.includes("--check");
const skipSeed = args.includes("--skip-seed");
const skipAdmin = args.includes("--skip-admin");

function fail(message) {
  console.error(`\n${message}\n`);
  process.exit(1);
}

if (!existsSync(FILE)) {
  fail(
    [
      ".env.supabase not found.",
      "",
      "Create it next to package.json with the values from",
      "Supabase -> Project Settings -> Database -> Connection string:",
      "",
      "  DATABASE_URL=postgresql://postgres.<ref>:<password>@aws-0-<region>.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1",
      "  DIRECT_URL=postgresql://postgres.<ref>:<password>@aws-0-<region>.pooler.supabase.com:5432/postgres",
      "  AUTH_SECRET=<48 random bytes, base64url>",
      "  APP_URL=https://<your-domain>",
      "  ADMIN_EMAIL=owner@studio.ru",
      "  ADMIN_PASSWORD=<at least 12 characters>",
      "",
      "The file is git-ignored and never leaves this machine.",
    ].join("\n"),
  );
}

const env = { ...process.env };

for (const line of readFileSync(FILE, "utf8").split(/\r?\n/)) {
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
  env[key] = value;
}

const databaseUrl = (env.DATABASE_URL ?? "").trim();
const directUrl = (env.DIRECT_URL ?? "").trim();
const problems = [];

// Catches the most common mistake: pasting the dashboard string as-is, with the
// password placeholder still in it. Prisma would answer with a bare P1000.
const placeholder = /\[YOUR-PASSWORD\]|<ПАРОЛЬ>|ВАШ_ПАРОЛЬ|ВАШ_REF|PROJECT_REF|PASSWORD@/;
for (const [name, value] of [
  ["DATABASE_URL", databaseUrl],
  ["DIRECT_URL", directUrl],
]) {
  if (placeholder.test(value)) {
    problems.push(
      `${name} still contains a placeholder. Replace it with the real database password ` +
        "(Supabase -> Settings -> Database -> Reset database password if you do not have it).",
    );
  }
}

if (!/^postgres(ql)?:\/\//i.test(databaseUrl)) {
  problems.push("DATABASE_URL must be a postgresql:// connection string.");
}
if (!/^postgres(ql)?:\/\//i.test(directUrl)) {
  problems.push(
    "DIRECT_URL is missing. Use the Session pooler (port 5432) or Direct connection string.",
  );
}
if (/:6543\//.test(directUrl)) {
  problems.push("DIRECT_URL points at the transaction pooler (6543); migrations need port 5432.");
}
if (/:6543\//.test(databaseUrl) && !/[?&]pgbouncer=true/.test(databaseUrl)) {
  problems.push(
    "DATABASE_URL uses the transaction pooler but has no pgbouncer=true; append `?pgbouncer=true&connection_limit=1`.",
  );
}

// A password with raw special characters breaks URL parsing and shows up as
// P1000 too, so point it out instead of letting Prisma fail mysteriously.
function passwordProblem(url) {
  const atCount = (url.match(/@/g) ?? []).length;
  if (atCount === 0) return "the connection string has no password";
  if (atCount > 1) {
    return "the password contains an unencoded @; write it as %40 or reset the password to letters and digits only";
  }
  if (url.includes("#")) {
    return "the password contains an unencoded #; write it as %23 or reset the password to letters and digits only";
  }

  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return "the connection string is not a valid URL";
  }
  if (!parsed.password) return "the password is empty";
  if (parsed.pathname.split("/").filter(Boolean).length > 1) {
    return "the password contains an unencoded /; write it as %2F or reset the password to letters and digits only";
  }
  return null;
}

for (const [name, value] of [
  ["DATABASE_URL", databaseUrl],
  ["DIRECT_URL", directUrl],
]) {
  const issue = passwordProblem(value);
  if (issue) problems.push(`${name}: ${issue}.`);
}
if (!env.AUTH_SECRET || env.AUTH_SECRET.length < 32) {
  problems.push("AUTH_SECRET must be at least 32 characters.");
}
if (!env.APP_URL) {
  problems.push("APP_URL is required for canonical URLs and sitemap.");
}
if (!skipAdmin) {
  if (!env.ADMIN_EMAIL) problems.push("ADMIN_EMAIL is required unless you pass --skip-admin.");
  if (!env.ADMIN_PASSWORD || env.ADMIN_PASSWORD.length < 12) {
    problems.push("ADMIN_PASSWORD must be at least 12 characters unless you pass --skip-admin.");
  }
}

if (problems.length > 0) {
  fail(["Fix .env.supabase:", ...problems.map((item) => `  - ${item}`)].join("\n"));
}

const host = databaseUrl.replace(/^postgres(ql)?:\/\/[^@]*@/, "").split(/[/?]/)[0];
console.log(`[db:supabase] target: ${host}`);

if (checkOnly) {
  console.log("[db:supabase] configuration looks valid.");
  process.exit(0);
}

function run(command, label, options = {}) {
  console.log(`\n[db:supabase] ${label}`);
  const result = spawnSync(command[0], command.slice(1), {
    stdio: "inherit",
    shell: process.platform === "win32",
    env,
  });
  const status = result.status ?? 1;
  if (status !== 0 && !options.allowFailure) {
    fail(`${label} failed. See the output above.`);
  }
  return status;
}

// A failed migration leaves a row in _prisma_migrations that blocks every later
// run with P3018. Clear it and retry once, so a fixed migration file (or a
// transient connection problem) does not require manual recovery.
const deployStatus = run(
  ["node", "scripts/prisma-target.mjs", "migrate-deploy"],
  "applying migrations",
  { allowFailure: true },
);

if (deployStatus !== 0) {
  console.log("\n[db:supabase] migration failed, clearing the failed record and retrying once");
  run(["node", "scripts/prisma-target.mjs", "migrate-recover"], "recovering failed migrations", {
    allowFailure: true,
  });
  run(["node", "scripts/prisma-target.mjs", "migrate-deploy"], "applying migrations again");
}

if (!skipSeed) {
  run(["node", "scripts/prisma-target.mjs", "db-seed"], "seeding demo content");
}

if (!skipAdmin) {
  run(["node", "scripts/create-admin.mjs"], "creating the administrator");
}

console.log("\n[db:supabase] done. Add the same DATABASE_URL, DIRECT_URL, AUTH_SECRET and APP_URL to Vercel.");
