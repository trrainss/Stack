import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";

import { DeleteForm } from "@/components/admin/delete-form";
import { ServiceForm } from "@/components/admin/service-form";
import { deleteServiceAction } from "@/actions/content";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Редактирование услуги" };
export const dynamic = "force-dynamic";

export default async function EditServicePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const { id } = await params;
  const { saved } = await searchParams;
  const service = await prisma.service.findUnique({ where: { id } });
  if (!service) notFound();

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link
            href="/admin/services"
            className="inline-flex items-center gap-2 text-[11px] text-[#9a9a9a] hover:text-fg"
          >
            <ArrowLeft size={13} aria-hidden="true" />
            Услуги
          </Link>
          <h1 className="mt-3 text-xl font-medium tracking-tight">{service.title}</h1>
          <p className="mt-1 font-mono text-[10px] text-[#6f6f6f]">{service.slug}</p>
        </div>
        <DeleteForm
          action={deleteServiceAction}
          id={service.id}
          title={`Удалить «${service.title}»?`}
          description="Услуга будет удалена из базы. Заявки сохранятся."
        />
      </div>

      {saved ? (
        <p className="border border-[#2c3a2f] bg-[#101610] px-4 py-2.5 text-xs text-[#a7c9b0]">
          Услуга сохранена. Изменения опубликованы.
        </p>
      ) : null}

      <ServiceForm service={service} />
    </div>
  );
}
