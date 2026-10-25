"use client";

import { useState } from "react";
import { ArrowUpRight, Minus, Plus } from "@phosphor-icons/react";

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
  const [openId, setOpenId] = useState<string | null>(services[0]?.id ?? null);

  if (services.length === 0) {
    return (
      <div className="border border-line bg-card p-8 text-sm text-muted">
        Список услуг пока пуст. Добавьте услуги в панели управления.
      </div>
    );
  }

  return (
    <div className="border-t border-line">
      {services.map((service, index) => {
        const open = openId === service.id;
        const features = parseLines(service.features);
        return (
          <div key={service.id} className="border-b border-line">
            <h3>
              <button
                type="button"
                onClick={() => setOpenId(open ? null : service.id)}
                aria-expanded={open}
                aria-controls={`service-panel-${service.id}`}
                className="group flex w-full items-start justify-between gap-6 py-6 text-left"
              >
                <span className="flex min-w-0 items-start gap-4 sm:gap-6">
                  <span className="pt-1 font-mono text-[10px] tracking-[0.14em] text-dim">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xl font-medium tracking-tight transition-colors duration-300 group-hover:text-white sm:text-2xl">
                      {service.title}
                    </span>
                    <span className="mt-2 block max-w-xl text-sm leading-relaxed text-muted">
                      {service.description}
                    </span>
                  </span>
                </span>
                <span className="flex shrink-0 items-center gap-4 pt-1">
                  <span className="hidden font-mono text-[10px] uppercase tracking-[0.12em] text-dim sm:block">
                    Стоимость по договорённости
                  </span>
                  <span className="flex h-8 w-8 items-center justify-center border border-line text-fg transition-colors duration-300 group-hover:border-white/40">
                    {open ? (
                      <Minus size={14} aria-hidden="true" />
                    ) : (
                      <Plus size={14} aria-hidden="true" />
                    )}
                  </span>
                </span>
              </button>
            </h3>

            <div
              id={`service-panel-${service.id}`}
              hidden={!open}
              className="grid gap-6 pb-8 pl-0 sm:grid-cols-2 sm:pl-[3.1rem]"
            >
              <div>
                <p className="mono-label">Что входит</p>
                <ul className="mt-3 grid gap-2">
                  {features.length > 0 ? (
                    features.map((feature) => (
                      <li key={feature} className="flex gap-2.5 text-sm leading-relaxed text-muted">
                        <span aria-hidden="true" className="mt-2 h-px w-3 shrink-0 bg-dim" />
                        <span>{feature}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-sm text-dim">Состав работ уточняется после обсуждения.</li>
                  )}
                </ul>
              </div>

              <div className="grid gap-5">
                {service.audience ? (
                  <div>
                    <p className="mono-label">Кому подходит</p>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{service.audience}</p>
                  </div>
                ) : null}
                {service.outcome ? (
                  <div>
                    <p className="mono-label">Результат</p>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{service.outcome}</p>
                  </div>
                ) : null}
                <div className="flex flex-wrap items-center gap-4">
                  <LeadButton
                    projectType={service.slug}
                    className="group inline-flex h-11 items-center gap-2.5 bg-fg px-5 text-[0.8rem] font-medium text-base transition-[background-color,transform] duration-500 ease-[var(--ease-out-expo)] hover:bg-white active:scale-[0.98]"
                  >
                    <span>{ctaLabel}</span>
                    <ArrowUpRight
                      size={14}
                      weight="bold"
                      aria-hidden="true"
                      className="transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </LeadButton>
                  <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-dim sm:hidden">
                    Стоимость по договорённости
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
