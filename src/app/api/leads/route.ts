import { NextResponse } from "next/server";
import { after } from "next/server";

import { createLeadRecord } from "@/lib/leads";
import { hashIp } from "@/lib/security";
import { rateLimit } from "@/lib/rate-limit";
import { fieldErrors, leadSchema } from "@/lib/validation";
import { sendLeadNotifications } from "@/lib/notify";
import { hashToken } from "@/lib/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 12_000;

function clientIp(request: Request): string | null {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? null;
  return request.headers.get("x-real-ip");
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json(
      { ok: false, error: "Слишком большой объём данных" },
      { status: 413 },
    );
  }

  const ip = clientIp(request);
  const ipHash = hashIp(ip);

  const ipLimit = await rateLimit(`lead:ip:${ipHash ?? "unknown"}`, 6, 10 * 60 * 1000);
  if (!ipLimit.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: "Слишком много заявок с этого адреса. Попробуйте через несколько минут.",
      },
      { status: 429, headers: { "Retry-After": String(ipLimit.retryAfterSeconds) } },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Некорректный запрос" }, { status: 400 });
  }

  if (!payload || typeof payload !== "object") {
    return NextResponse.json({ ok: false, error: "Некорректный запрос" }, { status: 400 });
  }

  const raw = payload as Record<string, unknown>;

  // Honeypot: a real visitor never fills this hidden field.
  if (typeof raw.website === "string" && raw.website.trim().length > 0) {
    return NextResponse.json(
      { ok: false, error: "Не удалось отправить заявку. Обновите страницу и попробуйте снова." },
      { status: 400 },
    );
  }

  // Bots submit forms instantly. Real people need at least a moment to type.
  if (typeof raw.formOpenedAt === "number") {
    const elapsed = Date.now() - raw.formOpenedAt;
    if (elapsed < 900 || elapsed > 1000 * 60 * 60 * 12) {
      return NextResponse.json(
        { ok: false, error: "Не удалось отправить заявку. Обновите страницу и попробуйте снова." },
        { status: 400 },
      );
    }
  }

  const parsed = leadSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "Проверьте отмеченные поля",
        fieldErrors: fieldErrors(parsed.error),
      },
      { status: 400 },
    );
  }

  const contactLimit = await rateLimit(
    `lead:contact:${hashToken(parsed.data.contact.toLowerCase())}`,
    3,
    10 * 60 * 1000,
  );
  if (!contactLimit.ok) {
    return NextResponse.json(
      { ok: false, error: "Заявка с этим контактом уже отправлена. Мы свяжемся с вами." },
      { status: 429, headers: { "Retry-After": String(contactLimit.retryAfterSeconds) } },
    );
  }

  const result = await createLeadRecord(
    { ...parsed.data, privacyConsent: true },
    {
      ipHash,
      userAgent: request.headers.get("user-agent")?.slice(0, 250) ?? null,
      source: "website",
    },
  );

  if (!result.ok) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Не удалось сохранить заявку. Попробуйте ещё раз через минуту - введённые данные останутся в форме.",
      },
      { status: 500 },
    );
  }

  if (!result.duplicate) {
    after(async () => {
      await sendLeadNotifications(result.leadId);
    });
  }

  return NextResponse.json(
    { ok: true, number: result.number, duplicate: result.duplicate },
    { status: 200, headers: { "Cache-Control": "no-store" } },
  );
}

export async function GET() {
  return NextResponse.json({ ok: false, error: "Method not allowed" }, { status: 405 });
}
