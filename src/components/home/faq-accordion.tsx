"use client";

import { useState } from "react";
import { ArrowDownRight, Minus, Plus } from "@phosphor-icons/react";
import type { Faq } from "@prisma/client";

export function FaqAccordion({ items }: { items: Faq[] }) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  if (items.length === 0) {
    return (
      <div className="faq-empty rounded-2xl border border-line p-7 sm:p-9">
        <p className="mono-label">FAQ / 00</p>
        <p className="mt-3 text-sm leading-relaxed text-muted">Вопросы скоро появятся. Пока можно задать свой вопрос напрямую — ответим в Telegram.</p>
        <a className="mt-5 inline-flex items-center gap-2 text-sm text-fg underline decoration-white/25 underline-offset-4 hover:decoration-white" href="https://t.me/StackLabb" target="_blank" rel="noreferrer">Написать в Telegram <ArrowDownRight size={15} aria-hidden="true" /></a>
      </div>
    );
  }

  return (
    <div className="faq-list">
      {items.map((item, index) => {
        const open = openId === item.id;
        const panelId = `faq-panel-${item.id}`;
        const buttonId = `faq-button-${item.id}`;
        return (
          <article
            key={item.id}
            className={`faq-item ${open ? "is-open" : ""}`}
            onMouseEnter={() => setOpenId(item.id)}
            onFocusCapture={() => setOpenId(item.id)}
          >
            <h3 className="m-0">
              <button
                type="button"
                onClick={() => setOpenId(open ? null : item.id)}
                aria-expanded={open}
                aria-controls={panelId}
                id={buttonId}
                className="faq-trigger group"
              >
                <span className="faq-index">{String(index + 1).padStart(2, "0")}</span>
                <span className="faq-question">{item.question}</span>
                <span className="faq-icon" aria-hidden="true">
                  {open ? <Minus size={16} weight="bold" /> : <Plus size={16} weight="bold" />}
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              aria-hidden={!open}
              className={`faq-answer ${open ? "faq-answer-open" : "faq-answer-closed"}`}
            >
              <div className="faq-answer-inner">
                <p>{item.answer}</p>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
