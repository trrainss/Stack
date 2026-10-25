#!/usr/bin/env node
/**
 * Creates (or updates) the first administrator.
 *
 * Usage:
 *   npm run admin:create
 *
 * Reads ADMIN_EMAIL and ADMIN_PASSWORD from .env / environment.
 * If ADMIN_PASSWORD is empty, a strong password is generated and printed once.
 * No password is ever stored in the repository.
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { randomBytes, scryptSync } from "node:crypto";
import { PrismaClient } from "@prisma/client";

function loadEnvFile() {
  const path = resolve(process.cwd(), ".env");
  if (!existsSync(path)) return;
  const raw = readFileSync(path, "utf8");
  for (const line of raw.split(/\r?\n/)) {
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

function hashPassword(password) {
  const salt = randomBytes(16);
  const derived = scryptSync(password.normalize("NFKC"), salt, 64, {
    N: 16384,
    r: 8,
    p: 1,
    maxmem: 64 * 1024 * 1024,
  });
  return [
    "scrypt",
    16384,
    8,
    1,
    salt.toString("base64url"),
    derived.toString("base64url"),
  ].join("$");
}

async function main() {
  loadEnvFile();

  const email = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  let password = process.env.ADMIN_PASSWORD || "";

  if (!email) {
    console.error("ADMIN_EMAIL is not set. Add it to .env or the environment.");
    process.exitCode = 1;
    return;
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    console.error("ADMIN_EMAIL does not look like a valid email address.");
    process.exitCode = 1;
    return;
  }

  let generated = false;
  if (!password) {
    password = randomBytes(18).toString("base64url");
    generated = true;
  }
  if (password.length < 12) {
    console.error("ADMIN_PASSWORD must contain at least 12 characters.");
    process.exitCode = 1;
    return;
  }

  const prisma = new PrismaClient();
  try {
    const existing = await prisma.adminUser.findUnique({ where: { email } });
    const passwordHash = hashPassword(password);

    if (existing) {
      await prisma.adminUser.update({ where: { email }, data: { passwordHash } });
      await prisma.adminSession.deleteMany({ where: { userId: existing.id } });
      console.log(`Updated administrator ${email}. All existing sessions were revoked.`);
    } else {
      await prisma.adminUser.create({
        data: { email, passwordHash, role: "owner" },
      });
      console.log(`Created administrator ${email}.`);
    }

    if (generated) {
      console.log("");
      console.log("Generated password (shown once, store it in a password manager):");
      console.log(`  ${password}`);
      console.log("");
      console.log("Set ADMIN_PASSWORD in .env and re-run this script to change it.");
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error("Failed to create administrator", error);
  process.exitCode = 1;
});
