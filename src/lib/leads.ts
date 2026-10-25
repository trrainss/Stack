import "server-only";

import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { LEAD_STATUSES, LEADS_PAGE_SIZE } from "@/lib/constants";
import type { LeadInput } from "@/lib/validation";

export type LeadMeta = {
  ipHash: string | null;
  userAgent: string | null;
  source?: string;
};

export type CreateLeadResult =
  | { ok: true; leadId: string; number: number; duplicate: boolean }
  | { ok: false; error: "storage" };

async function nextLeadNumber(): Promise<number> {
  const last = await prisma.lead.findFirst({
    orderBy: { number: "desc" },
    select: { number: true },
  });
  return Math.max(1000, last?.number ?? 1000) + 1;
}

/**
 * Persists a lead. Numbers are allocated from the current maximum; on a rare
 * unique conflict the insert is retried with a fresh number.
 * A repeated submission from the same contact within 10 minutes is treated as
 * the same request and returns the existing record instead of duplicating it.
 */
export async function createLeadRecord(
  input: LeadInput & { privacyConsent: true },
  meta: LeadMeta,
): Promise<CreateLeadResult> {
  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

  const duplicate = await prisma.lead.findFirst({
    where: {
      contact: input.contact,
      projectType: input.projectType,
      createdAt: { gte: tenMinutesAgo },
    },
    orderBy: { createdAt: "desc" },
  });

  if (duplicate) {
    return { ok: true, leadId: duplicate.id, number: duplicate.number, duplicate: true };
  }

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const number = await nextLeadNumber();
      const lead = await prisma.lead.create({
        data: {
          number,
          name: input.name,
          contact: input.contact,
          preferredContactMethod: input.preferredContactMethod,
          projectType: input.projectType,
          budget: input.budget ?? null,
          message: input.message ?? null,
          privacyConsent: true,
          status: "new",
          source: meta.source ?? "website",
          ipHash: meta.ipHash,
          userAgent: meta.userAgent,
          notifyStatus: "pending",
        },
        select: { id: true, number: true },
      });
      return { ok: true, leadId: lead.id, number: lead.number, duplicate: false };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        continue;
      }
      console.error("[leads] failed to persist lead", error);
      return { ok: false, error: "storage" };
    }
  }

  console.error("[leads] could not allocate a unique lead number");
  return { ok: false, error: "storage" };
}

export type LeadFilters = {
  query?: string;
  status?: string;
  sort?: string;
  page?: number;
};

export async function listLeads(filters: LeadFilters) {
  const page = Math.max(1, filters.page ?? 1);
  const query = filters.query?.trim();
  const status = LEAD_STATUSES.some((item) => item.value === filters.status)
    ? filters.status
    : undefined;

  const where: Prisma.LeadWhereInput = {
    ...(status ? { status } : {}),
    ...(query
      ? {
          OR: [
            { name: { contains: query } },
            { contact: { contains: query } },
            { message: { contains: query } },
            { budget: { contains: query } },
          ],
        }
      : {}),
  };

  const orderBy: Prisma.LeadOrderByWithRelationInput =
    filters.sort === "oldest"
      ? { createdAt: "asc" }
      : filters.sort === "status"
        ? { status: "asc" }
        : { createdAt: "desc" };

  const [total, items] = await Promise.all([
    prisma.lead.count({ where }),
    prisma.lead.findMany({
      where,
      orderBy: [orderBy, { createdAt: "desc" }],
      skip: (page - 1) * LEADS_PAGE_SIZE,
      take: LEADS_PAGE_SIZE,
    }),
  ]);

  return {
    items,
    total,
    page,
    pageCount: Math.max(1, Math.ceil(total / LEADS_PAGE_SIZE)),
  };
}

export async function getLead(id: string) {
  return prisma.lead.findUnique({
    where: { id },
    include: {
      notifications: { orderBy: { createdAt: "desc" }, take: 10 },
    },
  });
}

export async function getLeadStats() {
  const since = new Date(Date.now() - 13 * 24 * 60 * 60 * 1000);
  since.setHours(0, 0, 0, 0);

  const [total, grouped, recent, daily] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.lead.findMany({
      where: { createdAt: { gte: since } },
      select: { createdAt: true },
    }),
  ]);

  const byStatus: Record<string, number> = {};
  for (const row of grouped) {
    byStatus[row.status] = row._count._all;
  }

  const days: { label: string; date: string; count: number }[] = [];
  for (let index = 13; index >= 0; index -= 1) {
    const day = new Date();
    day.setHours(0, 0, 0, 0);
    day.setDate(day.getDate() - index);
    const key = day.toISOString().slice(0, 10);
    days.push({
      label: `${String(day.getDate()).padStart(2, "0")}.${String(day.getMonth() + 1).padStart(2, "0")}`,
      date: key,
      count: daily.filter((item) => item.createdAt.toISOString().slice(0, 10) === key).length,
    });
  }

  return {
    total,
    new: byStatus.new ?? 0,
    review: byStatus.review ?? 0,
    inProgress: byStatus.in_progress ?? 0,
    done: byStatus.done ?? 0,
    rejected: byStatus.rejected ?? 0,
    recent,
    days,
  };
}
