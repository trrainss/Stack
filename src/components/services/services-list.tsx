"use client";

import { ArrowUpRight, Check } from "@phosphor-icons/react";

import type { Service } from "@prisma/client";
import { LeadButton } from "@/components/lead/lead-dialog";
import { parseLines } from "@/lib/utils";

export function ServicesList({
  services,
  ctaLabel,
}: {
  services: Service[];
  ctaLabel: string;
}) {
  if (services.length === 0) {
    return (
      <div className="rounded-2xl border border-line bg-card p-8 text-sm text-muted">
        Услуги пока не опубликованы. Напишите нам — обсудим задачу индивидуально.
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {services.map((service, index) => {
        const features = parseLines(service.features).slice(0, 3);
        return (
          <article
            key={service.id}
            className="service-card group flex h-full flex-col rounded-2xl border border-line bg-card p-5 sm:p-6"
          >
            <div className="flex items-center justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-surface font-mono text-xs text-[#cbd5e1]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <ArrowUpRight size={18} weight="light" aria-hidden="true" className="text-dim transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg" />
            </div>
            <h3 className="mt-6 text-xl font-medium tracking-tight sm:text-2xl">{service.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">{service.description}</p>
            <ul className="mt-5 grid gap-2.5 border-t border-line pt-5">
              {features.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5 text-xs leading-relaxed text-muted">
                  <Check size={14} weight="light" aria-hidden="true" className="mt-0.5 shrink-0 text-[#cbd5e1]" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <div className="mt-auto pt-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-dim">Стоимость по договорённости</p>
              <LeadButton
                projectType={service.slug}
                className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-line px-4 text-xs font-medium text-fg transition-all duration-300 hover:border-white/40 hover:bg-white/[0.04]"
              >
                {ctaLabel || "Обсудить формат"}
                <ArrowUpRight size={14} aria-hidden="true" />
              </LeadButton>
            </div>
          </article>
        );
      })}
      <article className="flex h-full min-h-[260px] flex-col justify-between rounded-2xl border border-dashed border-white/20 bg-white/[0.02] p-5 sm:p-6">
        <div>
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-surface text-xl text-[#cbd5e1]">+</span>
          <h3 className="mt-6 text-xl font-medium tracking-tight sm:text-2xl">Нестандартная задача</h3>
          <p className="mt-3 text-sm leading-relaxed text-muted">Нужна дополнительная функция или отдельная услуга? Состав работ можно расширить по договорённости после обсуждения задачи.</p>
        </div>
        <LeadButton className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-fg px-5 text-xs font-semibold text-base transition-all hover:bg-white">
          Обсудить идею <ArrowUpRight size={14} aria-hidden="true" />
        </LeadButton>
      </article>
    </div>
  );
}
