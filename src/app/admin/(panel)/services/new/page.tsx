import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";

import { ServiceForm } from "@/components/admin/service-form";

export const metadata: Metadata = { title: "Новая услуга" };

export default function NewServicePage() {
  return (
    <div className="grid gap-5">
      <div>
        <Link
          href="/admin/services"
          className="inline-flex items-center gap-2 text-[11px] text-[#9a9a9a] hover:text-fg"
        >
          <ArrowLeft size={13} aria-hidden="true" />
          Услуги
        </Link>
        <h1 className="mt-3 text-xl font-medium tracking-tight">Новая услуга</h1>
      </div>
      <ServiceForm />
    </div>
  );
}
