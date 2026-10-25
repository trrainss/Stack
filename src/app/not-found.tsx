import Link from "next/link";

import { Logo } from "@/components/brand/logo";

export default function NotFound() {
  return (
    <div className="flex min-h-[100dvh] flex-col">
      <div className="container-page flex h-20 items-center border-b border-line lg:h-[88px]">
        <Logo />
      </div>

      <div className="container-page flex flex-1 flex-col justify-center py-20">
        <p className="mono-label">404 / страница не найдена</p>
        <h1 className="mt-6 max-w-[18ch] text-display">
          Такой страницы здесь нет
        </h1>
        <p className="mt-6 max-w-lg text-sm leading-relaxed text-muted">
          Возможно, адрес изменился или в ссылке опечатка. Вернитесь на главную или посмотрите
          услуги студии.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex h-12 items-center bg-fg px-6 text-sm font-medium text-base transition-colors duration-300 hover:bg-white"
          >
            На главную
          </Link>
          <Link
            href="/services"
            className="inline-flex h-12 items-center border border-line px-6 text-sm text-fg transition-colors duration-300 hover:border-white/40"
          >
            Посмотреть услуги
          </Link>
          <Link
            href="/contacts"
            className="inline-flex h-12 items-center border border-line px-6 text-sm text-fg transition-colors duration-300 hover:border-white/40"
          >
            Обсудить проект
          </Link>
        </div>
      </div>
    </div>
  );
}
