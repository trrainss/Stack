#!/usr/bin/env node
/**
 * Runs a Prisma command against the schema that matches DATABASE_URL.
 *
 * The project ships two identical schemas:
 *   prisma/schema.prisma          -> SQLite, used for local development
 *   prisma/postgres/schema.prisma -> PostgreSQL, used in production (Vercel)
 *
 * Prisma requires the provider to be hard-coded per schema file, so the right
 * file is selected here from the connection string protocol.
 *
 * Usage: node scripts/prisma-target.mjs <generate|check|migrate-deploy|migrate-dev|db-seed>
 */
import { existsSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

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

loadEnvFile();

const databaseUrl = (process.env.DATABASE_URL ?? "").trim();
const isPostgres = /^postgres(ql)?:\/\//i.test(databaseUrl);
const schema = isPostgres ? "prisma/postgres/schema.prisma" : "prisma/schema.prisma";
const label = isPostgres ? "PostgreSQL" : "SQLite";

const command = process.argv[2] ?? "generate";

function fail(message) {
  console.error(`\n${message}\n`);
  process.exit(1);
}

if (!databaseUrl) {
  fail(
    [
      "DATABASE_URL is not set.",
      "",
      "Local development: copy .env.example to .env and use DATABASE_URL=\"file:./dev.db\".",
      "Vercel: add DATABASE_URL in Project Settings -> Environment Variables",
      "and point it at a PostgreSQL database (Supabase, Neon, Vercel Postgres).",
    ].join("\n"),
  );
}

// Prisma reads directUrl for migrations. Supabase (and other poolers) give two
// connection strings; when only one is provided we reuse it for both, which is
// correct for direct connections and still lets `prisma generate` run on CI.
const hasDirectUrl = Boolean(process.env.DIRECT_URL);
if (isPostgres && !hasDirectUrl) {
  process.env.DIRECT_URL = databaseUrl;
}

const isPooler = /pooler\.supabase\.com:6543/.test(databaseUrl);

if (command !== "check") {
  if (isPooler && !/[?&]pgbouncer=true/.test(databaseUrl)) {
    console.warn(
      "[prisma-target] Supabase transaction pooler detected without `pgbouncer=true` in DATABASE_URL.\n" +
        "                Append `?pgbouncer=true&connection_limit=1` to avoid prepared-statement errors.",
    );
  }
  if (isPooler && !hasDirectUrl) {
    console.warn(
      "[prisma-target] DIRECT_URL is not set while DATABASE_URL points at a pooler.\n" +
        "                Migrations need the direct (or session) connection string.",
    );
  }
}

if (command === "check") {
  if (isPostgres && !process.env.AUTH_SECRET) {
    console.warn("[prisma-target] AUTH_SECRET is not set; production will refuse to start.");
  }
  if (isPostgres && !process.env.APP_URL) {
    console.warn("[prisma-target] APP_URL is not set; canonical URLs will fall back to localhost.");
  }
  console.log(`[prisma-target] ${label} schema: ${schema}`);
  process.exit(0);
}

const commands = {
  generate: ["generate", "--schema", schema],
  "migrate-deploy": ["migrate", "deploy", "--schema", schema],
  "migrate-dev": ["migrate", "dev", "--schema", schema],
  "db-seed": ["db", "seed", "--schema", schema],
};

function runPrisma(cliArgs) {
  const result = spawnSync("npx", ["prisma", ...cliArgs], {
    stdio: "inherit",
    shell: process.platform === "win32",
    env: process.env,
  });
  return result.status ?? 1;
}

// A failed `migrate deploy` leaves a row with finished_at = NULL in
// _prisma_migrations, and every later attempt refuses to run (P3018).
// This clears such rows so the fixed migration can be applied again. It is
// only safe when the failed migration did not change anything, which is why
// the caller retries the deploy immediately and reports the result.
if (command === "migrate-recover") {
  const { PrismaClient } = await import("@prisma/client");
  const prisma = new PrismaClient();
  try {
    const rows = await prisma.$queryRawUnsafe(
      'SELECT migration_name FROM "_prisma_migrations" WHERE finished_at IS NULL AND rolled_back_at IS NULL',
    );
    if (rows.length === 0) {
      console.log("[prisma-target] no failed migrations to recover.");
      process.exit(0);
    }
    for (const row of rows) {
      console.log(`[prisma-target] marking failed migration as rolled back: ${row.migration_name}`);
      const status = runPrisma([
        "migrate",
        "resolve",
        "--rolled-back",
        row.migration_name,
        "--schema",
        schema,
      ]);
      if (status !== 0) process.exit(status);
    }
    process.exit(0);
  } finally {
    await prisma.$disconnect();
  }
}

const args = commands[command];
if (!args) {
  fail(`Unknown command "${command}". Use one of: ${Object.keys(commands).join(", ")}.`);
}

// Forward extra CLI arguments, e.g. `npm run db:migrate -- --name add_field`.
const extraArgs = process.argv.slice(3);
const finalArgs = [...args, ...extraArgs];

// The generated client is provider-specific: switching DATABASE_URL from
// SQLite to PostgreSQL (or back) requires regenerating it before any script
// that talks to the database through @prisma/client.
if (command !== "generate") {
  console.log(`[prisma-target] ${label} -> prisma generate --schema ${schema}`);
  const generateStatus = runPrisma(["generate", "--schema", schema]);
  if (generateStatus !== 0) process.exit(generateStatus);
}

console.log(`[prisma-target] ${label} -> prisma ${finalArgs.join(" ")}`);
process.exit(runPrisma(finalArgs));
