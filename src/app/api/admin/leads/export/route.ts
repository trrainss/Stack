import { NextResponse } from "next/server";

import { getCurrentAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { LEAD_STATUSES, contactMethodLabel, leadStatusLabel, projectTypeLabel } from "@/lib/constants";
import { formatDate, toCsv } from "@/lib/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const statusParam = url.searchParams.get("status") ?? "";
  const status = LEAD_STATUSES.some((item) => item.value === statusParam) ? statusParam : undefined;

  const leads = await prisma.lead.findMany({
    where: status ? { status } : {},
    orderBy: { createdAt: "desc" },
  });

  const rows: Array<Array<string | number | boolean | null | undefined>> = [
    [
      "Номер",
      "Дата",
      "Имя",
      "Контакт",
      "Способ связи",
      "Тип проекта",
      "Бюджет",
      "Статус",
      "Комментарий",
      "Внутренние заметки",
      "Согласие",
      "Статус уведомления",
    ],
  ];

  for (const lead of leads) {
    rows.push([
      lead.number,
      formatDate(lead.createdAt, true),
      lead.name,
      lead.contact,
      contactMethodLabel(lead.preferredContactMethod),
      projectTypeLabel(lead.projectType),
      lead.budget,
      leadStatusLabel(lead.status),
      lead.message,
      lead.internalNotes,
      lead.privacyConsent ? "да" : "нет",
      lead.notifyStatus,
    ]);
  }

  // UTF-8 BOM keeps Cyrillic readable in Excel.
  const csv = `\uFEFF${toCsv(rows)}`;
  const filename = `stacklab-leads-${new Date().toISOString().slice(0, 10)}.csv`;

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="${filename}"`,
      "cache-control": "no-store",
      "x-robots-tag": "noindex, nofollow",
    },
  });
}
