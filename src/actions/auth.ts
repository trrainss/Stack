"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

import type { ActionState } from "@/lib/action-state";
import { CSRF_COOKIE, createSession, destroySession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { rateLimit, resetRateLimit } from "@/lib/rate-limit";
import {
  constantTimeEqual,
  hashIp,
  hashPassword,
  hashToken,
  verifyPassword,
} from "@/lib/security";
import { firstError, loginSchema } from "@/lib/validation";

// Used to keep the response time similar when the email does not exist.
const DUMMY_HASH = hashPassword("stacklab-timing-equalizer-not-a-real-password");

function safeNextPath(value: FormDataEntryValue | null): string {
  const next = typeof value === "string" ? value : "";
  if (next.startsWith("/admin/") && !next.startsWith("/admin/login")) return next;
  return "/admin/dashboard";
}

export async function loginAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    csrf: formData.get("csrf"),
  });

  if (!parsed.success) {
    return { error: firstError(parsed.error) };
  }

  const cookieStore = await cookies();
  const csrfCookie = cookieStore.get(CSRF_COOKIE)?.value ?? "";
  if (!csrfCookie || !constantTimeEqual(parsed.data.csrf, csrfCookie)) {
    return { error: "Форма устарела. Обновите страницу и попробуйте снова." };
  }

  const headerList = await headers();
  const forwarded = headerList.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() ?? headerList.get("x-real-ip");
  const ipHash = hashIp(ip) ?? "unknown";
  const emailHash = hashToken(parsed.data.email.toLowerCase());

  const ipLimit = await rateLimit(`login:ip:${ipHash}`, 12, 15 * 60 * 1000);
  if (!ipLimit.ok) {
    return {
      error: "Слишком много попыток входа. Повторите попытку через несколько минут.",
    };
  }

  const emailLimit = await rateLimit(`login:email:${emailHash}`, 5, 15 * 60 * 1000);
  if (!emailLimit.ok) {
    return {
      error: "Слишком много попыток для этого аккаунта. Подождите несколько минут.",
    };
  }

  const user = await prisma.adminUser.findUnique({
    where: { email: parsed.data.email.toLowerCase() },
  });

  const passwordOk = user
    ? verifyPassword(parsed.data.password, user.passwordHash)
    : verifyPassword(parsed.data.password, DUMMY_HASH);

  if (!user || !passwordOk) {
    return { error: "Неверный email или пароль" };
  }

  await resetRateLimit(`login:email:${emailHash}`);
  await prisma.adminSession.deleteMany({
    where: { expiresAt: { lt: new Date() } },
  });
  await prisma.adminUser.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  await createSession(user.id);
  redirect(safeNextPath(formData.get("next")));
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/admin/login");
}
