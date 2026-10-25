"use client";

import { useActionState } from "react";

import type { ActionState } from "@/lib/action-state";
import { cn } from "@/lib/utils";

type FormAction = (previous: ActionState, formData: FormData) => Promise<ActionState>;

export function ActionForm({
  action,
  children,
  submitLabel = "Сохранить",
  className,
  compact = false,
  submitVariant = "primary",
}: {
  action: FormAction;
  children: React.ReactNode;
  submitLabel?: string;
  className?: string;
  compact?: boolean;
  submitVariant?: "primary" | "outline";
}) {
  const [state, formAction, pending] = useActionState(action, null);

  return (
    <form action={formAction} className={cn("grid", compact ? "gap-4" : "gap-6", className)}>
      {children}

      <div
        className={cn(
          "flex flex-wrap items-center gap-4",
          !compact && "border-t border-[#242424] pt-5",
        )}
      >
        <button
          type="submit"
          disabled={pending}
          className={cn(
            "inline-flex h-10 items-center justify-center px-5 text-[0.8rem] font-medium transition-[background-color,color,transform] duration-300 active:scale-[0.99] disabled:cursor-wait disabled:opacity-60",
            submitVariant === "primary"
              ? "bg-fg text-base hover:bg-white"
              : "border border-[#333] text-fg hover:border-white/40",
          )}
        >
          {pending ? "Сохраняем..." : submitLabel}
        </button>

        {state?.error ? (
          <p role="alert" className="text-[11px] text-[#e09191]">
            {state.error}
          </p>
        ) : null}
        {state?.message ? (
          <p role="status" className="text-[11px] text-[#8fd3a4]">
            {state.message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
