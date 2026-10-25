"use client";

import { useState } from "react";
import { Minus, Plus } from "@phosphor-icons/react";

import type { Faq } from "@prisma/client";
import { cn } from "@/lib/utils";

export function FaqAccordion({ items }: { items: Faq[] }) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  if (items.length === 0) {
    return (
      <div className="border border-line bg-card p-8 text-sm text-muted">
        Вопросы пока не добавлены.
      </div>
    );
  }

  return (
    <div className="border-t border-line">
      {items.map((item) => {
        const open = openId === item.id;
        return (
          <div key={item.id} className="border-b border-line">
            <h3>
              <button
                type="button"
                onClick={() => setOpenId(open ? null : item.id)}
                aria-expanded={open}
                aria-controls={`faq-panel-${item.id}`}
                id={`faq-button-${item.id}`}
                className="group flex w-full items-center justify-between gap-6 py-5 text-left"
              >
                <span className="text-base font-medium leading-snug tracking-tight transition-colors duration-300 group-hover:text-white sm:text-lg">
                  {item.question}
                </span>
                <span className="flex h-7 w-7 shrink-0 items-center justify-center border border-line text-fg transition-colors duration-300 group-hover:border-white/40">
                  {open ? <Minus size={12} aria-hidden="true" /> : <Plus size={12} aria-hidden="true" />}
                </span>
              </button>
            </h3>
            <div
              id={`faq-panel-${item.id}`}
              role="region"
              aria-labelledby={`faq-button-${item.id}`}
              className={cn(
                "grid transition-[grid-template-rows] duration-500 ease-[var(--ease-out-expo)]",
                open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="overflow-hidden">
                <p className="max-w-2xl pb-6 pr-10 text-sm leading-relaxed text-muted">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
