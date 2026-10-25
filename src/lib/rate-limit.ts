import "server-only";

import { prisma } from "@/lib/prisma";

export type RateLimitResult = {
  ok: boolean;
  remaining: number;
  retryAfterSeconds: number;
};

/**
 * Small persistent fixed-window limiter backed by the database.
 * It survives restarts and works across serverless instances that share a DB.
 * Keys are hashed by the caller so no raw IP or email is stored here.
 */
export async function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): Promise<RateLimitResult> {
  const now = new Date();
  try {
    const existing = await prisma.rateLimit.findUnique({ where: { key } });

    if (!existing || now.getTime() - existing.windowStart.getTime() > windowMs) {
      await prisma.rateLimit.upsert({
        where: { key },
        update: { count: 1, windowStart: now },
        create: { key, count: 1, windowStart: now },
      });
      return { ok: true, remaining: limit - 1, retryAfterSeconds: 0 };
    }

    if (existing.count >= limit) {
      const retryAfterMs = windowMs - (now.getTime() - existing.windowStart.getTime());
      return {
        ok: false,
        remaining: 0,
        retryAfterSeconds: Math.max(1, Math.ceil(retryAfterMs / 1000)),
      };
    }

    const updated = await prisma.rateLimit.update({
      where: { key },
      data: { count: { increment: 1 } },
    });
    return {
      ok: true,
      remaining: Math.max(0, limit - updated.count),
      retryAfterSeconds: 0,
    };
  } catch (error) {
    // A limiter failure must not block legitimate submissions, but it is logged.
    console.error("[rate-limit] storage error", error);
    return { ok: true, remaining: limit, retryAfterSeconds: 0 };
  }
}

export async function resetRateLimit(key: string): Promise<void> {
  await prisma.rateLimit.deleteMany({ where: { key } }).catch(() => undefined);
}

export async function cleanupRateLimits(olderThanMs = 1000 * 60 * 60 * 24): Promise<void> {
  await prisma.rateLimit
    .deleteMany({ where: { windowStart: { lt: new Date(Date.now() - olderThanMs) } } })
    .catch(() => undefined);
}
