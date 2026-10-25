"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { X } from "@phosphor-icons/react";

import { LeadForm } from "@/components/lead/lead-form";

type LeadDialogContextValue = {
  open: (projectType?: string) => void;
  close: () => void;
};

const LeadDialogContext = createContext<LeadDialogContextValue | null>(null);

export function useLeadDialog(): LeadDialogContextValue {
  const context = useContext(LeadDialogContext);
  if (!context) {
    throw new Error("useLeadDialog must be used inside LeadDialogProvider");
  }
  return context;
}

export function LeadDialogProvider({ children }: { children: ReactNode }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [projectType, setProjectType] = useState<string | undefined>(undefined);

  const open = useCallback((nextProjectType?: string) => {
    setProjectType(nextProjectType);
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) {
      dialog.showModal();
      document.documentElement.style.overflow = "hidden";
    }
  }, []);

  const close = useCallback(() => {
    dialogRef.current?.close();
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClose = () => {
      document.documentElement.style.overflow = "";
    };
    const handleClick = (event: MouseEvent) => {
      if (event.target === dialog) dialog.close();
    };

    dialog.addEventListener("close", handleClose);
    dialog.addEventListener("click", handleClick);
    return () => {
      dialog.removeEventListener("close", handleClose);
      dialog.removeEventListener("click", handleClick);
      document.documentElement.style.overflow = "";
    };
  }, []);

  const value = useMemo(() => ({ open, close }), [open, close]);

  return (
    <LeadDialogContext.Provider value={value}>
      {children}
      <dialog
        ref={dialogRef}
        aria-labelledby="lead-dialog-title"
        className="fixed inset-0 z-[80] m-auto h-fit max-h-[92dvh] w-[min(100%-1.5rem,720px)] overflow-y-auto bg-transparent p-0"
      >
        <div className="relative border border-line bg-surface">
          <div className="flex items-start justify-between gap-6 border-b border-line px-6 py-5 sm:px-8">
            <div>
              <p className="mono-label">STACKLAB</p>
              <h2 id="lead-dialog-title" className="mt-2 text-2xl font-medium tracking-tight">
                Обсудить проект
              </h2>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">
                Расскажите о задаче. Ответим по указанному контакту и предложим следующий шаг.
              </p>
            </div>
            <button
              type="button"
              onClick={close}
              aria-label="Закрыть форму"
              className="flex h-10 w-10 shrink-0 items-center justify-center border border-line text-muted transition-colors duration-300 hover:border-fg/40 hover:text-fg"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>
          <div className="px-6 py-6 sm:px-8 sm:py-8">
            <LeadForm defaultProjectType={projectType} compact />
          </div>
        </div>
      </dialog>
    </LeadDialogContext.Provider>
  );
}

export function LeadButton({
  children,
  className,
  projectType,
  ariaLabel,
}: {
  children: ReactNode;
  className?: string;
  projectType?: string;
  ariaLabel?: string;
}) {
  const { open } = useLeadDialog();
  return (
    <button
      type="button"
      onClick={() => open(projectType)}
      className={className}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
