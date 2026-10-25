import type { Metadata } from "next";

import { LoginForm } from "@/components/admin/login-form";
import { Logo } from "@/components/brand/logo";
import { getCsrfToken } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Вход в панель управления",
  robots: { index: false, follow: false, nocache: true },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const csrf = await getCsrfToken();

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[#080808]">
      <div className="container-page flex h-20 items-center justify-between border-b border-line">
        <Logo />
        <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-dim">
          Private area
        </span>
      </div>

      <div className="flex flex-1 items-center justify-center px-5 py-14">
        <div className="w-full max-w-[420px]">
          <p className="mono-label">Панель управления</p>
          <h1 className="mt-4 text-3xl font-medium tracking-tight">Вход для владельца</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Доступ только по учётным данным администратора. Все действия проверяются на сервере.
          </p>

          <div className="mt-8 border border-line bg-surface p-6">
            {csrf ? (
              <LoginForm csrf={csrf} next={next} />
            ) : (
              <p className="text-sm text-[#e09191]">
                Не удалось получить защитный токен. Обновите страницу.
              </p>
            )}
          </div>

          <p className="mt-6 text-[11px] leading-relaxed text-dim">
            Защита от перебора: после нескольких неудачных попыток вход временно блокируется.
          </p>
        </div>
      </div>
    </div>
  );
}
