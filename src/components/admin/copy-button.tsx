"use client";

import { useState } from "react";
import { Check, Copy } from "@phosphor-icons/react";

export function CopyButton({ value, label = "Копировать" }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex h-8 items-center gap-1.5 border border-[#2f2f2f] px-2.5 text-[11px] text-[#b0b0b0] transition-colors duration-300 hover:border-white/30 hover:text-fg"
    >
      {copied ? (
        <Check size={13} weight="light" aria-hidden="true" />
      ) : (
        <Copy size={13} weight="light" aria-hidden="true" />
      )}
      <span>{copied ? "Скопировано" : label}</span>
      <span className="sr-only" role="status" aria-live="polite">
        {copied ? "Скопировано" : ""}
      </span>
    </button>
  );
}
