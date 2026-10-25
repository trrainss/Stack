"use client";

import { useActionState } from "react";
import Link from "next/link";

import { loginAction } from "@/actions/auth";

export function LoginForm({ csrf, next }: { csrf: string; next?: string }) {
  const [state, formAction, pending] = useActionState(loginAction, null);

  return (
    <form action={formAction} className="grid gap-4">
      <input type="hidden" name="csrf" value={csrf} />
      <input type="hidden" name="next" value={next ?? ""} />

      <div className="grid gap-1.5">
        <label
          htmlFor="login-email"
          className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#9a9a9a]"
        >
          Email
        </label>
        <input
          id="login-email"
          name="email"
          type="email"
          autoComplete="username"
          required
          className="h-11 w-full border border-[#2c2c2c] bg-[#0c0c0c] px-3 text-sm text-fg outline-none transition-colors focus:border-white/55"
        />
      </div>

      <div className="grid gap-1.5">
        <label
          htmlFor="login-password"
          className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#9a9a9a]"
        >
          Пароль
        </label>
        <input
          id="login-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          minLength={8}
          className="h-11 w-full border border-[#2c2c2c] bg-[#0c0c0c] px-3 text-sm text-fg outline-none transition-colors focus:border-white/55"
        />
      </div>

      {state?.error ? (
        <p role="alert" className="border border-[#3f2727] bg-[#170f0f] px-3 py-2 text-xs text-[#e09191]">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 inline-flex h-11 items-center justify-center bg-fg px-5 text-sm font-medium text-base transition-colors duration-300 hover:bg-white disabled:cursor-wait disabled:opacity-70"
      >
        {pending ? "Проверяем..." : "Войти"}
      </button>

      <p className="text-[11px] leading-relaxed text-[#6f6f6f]">
        Публичной регистрации нет. Доступ выдаётся владельцу через серверную команду{" "}
        <code className="font-mono text-[#9a9a9a]">npm run admin:create</code>.
      </p>

      <Link
        href="/"
        className="mt-2 text-[11px] text-[#9a9a9a] underline decoration-[#333] underline-offset-4 transition-colors hover:text-fg"
      >
        Вернуться на сайт
      </Link>
    </form>
  );
}
