"use client";

import { useRef } from "react";
import { Trash, X } from "@phosphor-icons/react";

export function DeleteForm({
  action,
  id,
  title,
  description,
  label = "Удалить",
}: {
  action: (formData: FormData) => Promise<void>;
  id: string;
  title: string;
  description: string;
  label?: string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        className="inline-flex h-8 items-center gap-1.5 border border-[#332424] px-2.5 text-[11px] text-[#d99a9a] transition-colors duration-300 hover:border-[#6b3a3a] hover:text-[#f0b6b6]"
      >
        <Trash size={13} weight="light" aria-hidden="true" />
        {label}
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby={`delete-title-${id}`}
        className="fixed inset-0 z-[90] m-auto h-fit w-[min(100%-1.5rem,440px)] bg-transparent p-0"
      >
        <div className="border border-[#2f2f2f] bg-[#101010]">
          <div className="flex items-start justify-between gap-4 border-b border-[#242424] px-5 py-4">
            <h2 id={`delete-title-${id}`} className="text-sm font-medium text-fg">
              {title}
            </h2>
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              aria-label="Закрыть"
              className="text-[#8a8a8a] transition-colors hover:text-fg"
            >
              <X size={16} aria-hidden="true" />
            </button>
          </div>
          <div className="px-5 py-4">
            <p className="text-xs leading-relaxed text-[#a1a1a1]">{description}</p>
          </div>
          <form action={action} className="flex items-center justify-end gap-3 border-t border-[#242424] px-5 py-4">
            <input type="hidden" name="id" value={id} />
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className="h-9 border border-[#333] px-4 text-xs text-fg transition-colors hover:border-white/40"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="h-9 bg-[#b4554f] px-4 text-xs font-medium text-white transition-colors hover:bg-[#c4615a]"
            >
              Удалить
            </button>
          </form>
        </div>
      </dialog>
    </>
  );
}
