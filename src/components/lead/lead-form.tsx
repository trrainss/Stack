"use client";

import { useId, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Check, WarningCircle } from "@phosphor-icons/react";

import { BUDGET_OPTIONS, CONTACT_METHODS, PROJECT_TYPES } from "@/lib/constants";
import { cn } from "@/lib/utils";

type FieldErrors = Record<string, string>;

type FormState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success"; number: number }
  | { status: "error"; message: string; fieldErrors: FieldErrors };

const initialValues = {
  name: "",
  contact: "",
  preferredContactMethod: "telegram",
  projectType: "landing",
  budget: "",
  message: "",
  privacyConsent: false,
};

const inputClasses =
  "h-12 w-full rounded-xl border border-line bg-[#0b0b0b] px-4 text-sm text-fg outline-none transition-all duration-300 placeholder:text-[#6f6f6f] hover:border-white/20 focus:border-[#cbd5e1] focus:bg-[#101010] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/10";

export function LeadForm({
  defaultProjectType,
  compact = false,
}: {
  defaultProjectType?: string;
  compact?: boolean;
}) {
  const uid = useId();
  const [values, setValues] = useState({
    ...initialValues,
    projectType:
      defaultProjectType && PROJECT_TYPES.some((type) => type.value === defaultProjectType)
        ? defaultProjectType
        : initialValues.projectType,
  });
  const [state, setState] = useState<FormState>({ status: "idle" });
  const openedAt = useRef(Date.now());
  const [honeypot, setHoneypot] = useState("");

  const fieldErrors = state.status === "error" ? state.fieldErrors : {};

  function update<K extends keyof typeof values>(key: K, value: (typeof values)[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state.status === "submitting") return;

    const localErrors: FieldErrors = {};
    if (values.name.trim().length < 2) localErrors.name = "Укажите имя";
    if (values.contact.trim().length < 3) localErrors.contact = "Укажите контакт для связи";
    if (!values.privacyConsent) {
      localErrors.privacyConsent = "Нужно согласие на обработку персональных данных";
    }
    if (Object.keys(localErrors).length > 0) {
      setState({
        status: "error",
        message: "Проверьте отмеченные поля",
        fieldErrors: localErrors,
      });
      return;
    }

    setState({ status: "submitting" });

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...values,
          website: honeypot,
          formOpenedAt: openedAt.current,
        }),
      });

      const payload = (await response.json().catch(() => null)) as
        | {
            ok?: boolean;
            number?: number;
            error?: string;
            fieldErrors?: FieldErrors;
          }
        | null;

      if (response.ok && payload?.ok && typeof payload.number === "number") {
        setState({ status: "success", number: payload.number });
        return;
      }

      if (response.status === 429) {
        setState({
          status: "error",
          message:
            payload?.error ??
            "Слишком много попыток. Подождите несколько минут и попробуйте снова.",
          fieldErrors: {},
        });
        return;
      }

      if (response.status === 400) {
        setState({
          status: "error",
          message: payload?.error ?? "Проверьте отмеченные поля",
          fieldErrors: payload?.fieldErrors ?? {},
        });
        return;
      }

      setState({
        status: "error",
        message:
          "Не удалось отправить заявку. Данные сохранены в форме - попробуйте ещё раз через минуту.",
        fieldErrors: {},
      });
    } catch {
      setState({
        status: "error",
        message:
          "Нет связи с сервером. Проверьте интернет и отправьте форму повторно - введённые данные остались на месте.",
        fieldErrors: {},
      });
    }
  }

  if (state.status === "success") {
    return (
      <div className="rounded-2xl border border-line bg-card p-6 sm:p-8" role="status" aria-live="polite">
        <span className="flex h-12 w-12 items-center justify-center border border-white/20 text-fg">
          <Check size={22} weight="light" aria-hidden="true" />
        </span>
        <h3 className="mt-5 text-xl font-medium tracking-tight">
          Заявка отправлена. Мы свяжемся с вами по указанным контактам
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Номер обращения: <span className="font-mono text-fg">№{state.number}</span>. Если нужно
          дополнить задачу, ответьте на наше сообщение - номер поможет быстро найти заявку.
        </p>
        <button
          type="button"
          onClick={() => {
            setValues(initialValues);
            setState({ status: "idle" });
            openedAt.current = Date.now();
          }}
          className="mt-6 inline-flex h-11 items-center rounded-full border border-line px-5 text-sm text-fg transition-all duration-300 hover:border-white/40 hover:bg-white/[0.04]"
        >
          Отправить ещё одну заявку
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className={cn("lead-form grid gap-6", compact && "gap-4")}>
      <div className="grid gap-2">
        <label htmlFor={`${uid}-name`} className="mono-label text-[#b9b9b9]">
          Имя <span aria-hidden="true">*</span>
        </label>
        <input
          id={`${uid}-name`}
          name="name"
          value={values.name}
          onChange={(event) => update("name", event.target.value)}
          autoComplete="name"
          required
          aria-invalid={Boolean(fieldErrors.name)}
          aria-describedby={fieldErrors.name ? `${uid}-name-error` : undefined}
          className={cn(inputClasses, fieldErrors.name && "border-[#c96a6a]")}
          placeholder="Как к вам обращаться"
        />
        {fieldErrors.name ? (
          <p id={`${uid}-name-error`} className="text-xs text-[#e09191]">
            {fieldErrors.name}
          </p>
        ) : null}
      </div>

      <div className="grid gap-2">
        <label htmlFor={`${uid}-contact`} className="mono-label text-[#b9b9b9]">
          Контакт для связи <span aria-hidden="true">*</span>
        </label>
        <input
          id={`${uid}-contact`}
          name="contact"
          value={values.contact}
          onChange={(event) => update("contact", event.target.value)}
          autoComplete="email"
          required
          aria-invalid={Boolean(fieldErrors.contact)}
          aria-describedby={fieldErrors.contact ? `${uid}-contact-error` : undefined}
          className={cn(inputClasses, fieldErrors.contact && "border-[#c96a6a]")}
          placeholder="@username, почта или телефон"
        />
        {fieldErrors.contact ? (
          <p id={`${uid}-contact-error`} className="text-xs text-[#e09191]">
            {fieldErrors.contact}
          </p>
        ) : (
          <p className="text-xs text-dim">Укажите тот контакт, по которому удобно ответить.</p>
        )}
      </div>

      <fieldset className="grid gap-2">
        <legend className="mono-label mb-2 text-[#b9b9b9]">Предпочтительный способ связи</legend>
        <div className="grid grid-cols-3 gap-2">
          {CONTACT_METHODS.map((method) => (
            <label
              key={method.value}
              className={cn(
                "flex h-12 cursor-pointer items-center justify-center rounded-xl border border-line bg-[#0b0b0b] text-[0.78rem] text-muted transition-all duration-300 hover:border-white/35 hover:text-fg",
                values.preferredContactMethod === method.value &&
                  "border-fg bg-fg font-medium text-base shadow-[0_4px_18px_rgba(255,255,255,.08)] hover:border-fg",
              )}
            >
              <input
                type="radio"
                name="preferredContactMethod"
                value={method.value}
                checked={values.preferredContactMethod === method.value}
                onChange={() => update("preferredContactMethod", method.value)}
                className="sr-only"
              />
              <span>{method.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="grid gap-2">
          <label htmlFor={`${uid}-type`} className="mono-label text-[#b9b9b9]">
            Тип проекта <span aria-hidden="true">*</span>
          </label>
          <select
            id={`${uid}-type`}
            name="projectType"
            value={values.projectType}
            onChange={(event) => update("projectType", event.target.value)}
            className={inputClasses}
          >
            {PROJECT_TYPES.map((type) => (
              <option key={type.value} value={type.value} className="bg-[#0c0c0c]">
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-2">
          <label htmlFor={`${uid}-budget`} className="mono-label text-[#b9b9b9]">
            Бюджет
          </label>
          <select
            id={`${uid}-budget`}
            name="budget"
            value={values.budget}
            onChange={(event) => update("budget", event.target.value)}
            className={inputClasses}
          >
            <option value="" className="bg-[#0c0c0c]">
              Не указан
            </option>
            {BUDGET_OPTIONS.map((option) => (
              <option key={option} value={option} className="bg-[#0c0c0c]">
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-2">
        <label htmlFor={`${uid}-message`} className="mono-label text-[#b9b9b9]">
          Комментарий о задаче
        </label>
        <textarea
          id={`${uid}-message`}
          name="message"
          value={values.message}
          onChange={(event) => update("message", event.target.value)}
          rows={compact ? 3 : 5}
          maxLength={2000}
          className={cn(inputClasses, "h-auto min-h-[132px] resize-y py-3.5 leading-relaxed")}
          placeholder="Что нужно сделать, для кого сайт и какой результат важен"
        />
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[-10000px] top-auto h-px w-px overflow-hidden"
      >
        <label htmlFor={`${uid}-website`}>Website</label>
        <input
          id={`${uid}-website`}
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(event) => setHoneypot(event.target.value)}
        />
      </div>

      <div className="grid gap-2">
        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-line/70 bg-[#0b0b0b]/70 p-4 text-[0.8rem] leading-relaxed text-muted">
          <input
            type="checkbox"
            name="privacyConsent"
            checked={values.privacyConsent}
            onChange={(event) => update("privacyConsent", event.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 accent-[#f5f5f5]"
            aria-invalid={Boolean(fieldErrors.privacyConsent)}
          />
          <span>
            Согласен с{" "}
            <Link
              href="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-fg underline decoration-line underline-offset-4 transition-colors hover:decoration-fg"
            >
              политикой конфиденциальности
            </Link>{" "}
            и обработкой персональных данных
          </span>
        </label>
        {fieldErrors.privacyConsent ? (
          <p className="text-xs text-[#e09191]">{fieldErrors.privacyConsent}</p>
        ) : null}
      </div>

      {state.status === "error" ? (
        <div
          role="alert"
          className="flex items-start gap-3 border border-[#4a2a2a] bg-[#1a0f0f] px-4 py-3 text-sm text-[#e7b1b1]"
        >
          <WarningCircle size={18} weight="light" className="mt-0.5 shrink-0" aria-hidden="true" />
          <span>{state.message}</span>
        </div>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={state.status === "submitting"}
          className="group inline-flex min-h-13 items-center justify-center gap-3 rounded-full bg-fg px-7 py-3 text-sm font-semibold text-base shadow-[0_8px_28px_rgba(255,255,255,.07)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white active:scale-[0.99] disabled:cursor-wait disabled:opacity-70"
        >
          <span>{state.status === "submitting" ? "Отправляем" : "Отправить заявку"}</span>
          {state.status === "submitting" ? (
            <span
              aria-hidden="true"
              className="h-3.5 w-3.5 animate-spin rounded-full border border-base/30 border-t-base"
            />
          ) : (
            <ArrowUpRight
              size={16}
              weight="bold"
              aria-hidden="true"
              className="transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          )}
        </button>
        <p className="text-[0.7rem] leading-relaxed text-dim">
          Данные используются только для связи по заявке.
        </p>
      </div>
    </form>
  );
}
