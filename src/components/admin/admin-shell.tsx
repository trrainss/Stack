"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AddressBook,
  ArrowUpRight,
  FolderOpen,
  Gear,
  House,
  List,
  Path,
  Question,
  Quotes,
  SignOut,
  SquaresFour,
  Stack,
  Tray,
  X,
} from "@phosphor-icons/react";

import { logoutAction } from "@/actions/auth";
import { Logo } from "@/components/brand/logo";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin/dashboard", label: "Обзор", icon: SquaresFour },
  { href: "/admin/leads", label: "Заявки", icon: Tray },
  { href: "/admin/projects", label: "Проекты", icon: FolderOpen },
  { href: "/admin/services", label: "Услуги", icon: Stack },
  { href: "/admin/homepage", label: "Главная страница", icon: House },
  { href: "/admin/process", label: "Этапы работы", icon: Path },
  { href: "/admin/testimonials", label: "Отзывы", icon: Quotes },
  { href: "/admin/faq", label: "FAQ", icon: Question },
  { href: "/admin/contacts", label: "Контакты", icon: AddressBook },
  { href: "/admin/settings", label: "Настройки", icon: Gear },
];

export function AdminShell({
  email,
  children,
}: {
  email: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const current = NAV.find(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
  );

  return (
    <div className="min-h-[100dvh] bg-[#090909]">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[252px] flex-col border-r border-[#222] bg-[#0c0c0c] transition-transform duration-300 ease-[var(--ease-out-expo)] lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
        aria-label="Навигация панели управления"
      >
        <div className="flex h-16 items-center justify-between border-b border-[#222] px-5">
          <Logo />
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Закрыть меню"
            className="text-[#9a9a9a] transition-colors hover:text-fg lg:hidden"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <p className="px-2 pb-3 font-mono text-[9px] uppercase tracking-[0.18em] text-[#5f5f5f]">
            Управление
          </p>
          <ul className="grid gap-0.5">
            {NAV.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 border-l-2 px-2.5 py-2 text-[13px] transition-colors duration-200",
                      active
                        ? "border-fg bg-white/[0.06] text-fg"
                        : "border-transparent text-[#9a9a9a] hover:bg-white/[0.03] hover:text-fg",
                    )}
                    aria-current={active ? "page" : undefined}
                  >
                    <Icon size={16} weight="light" aria-hidden="true" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-[#222] p-3">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between gap-2 px-2.5 py-2 text-[12px] text-[#9a9a9a] transition-colors hover:text-fg"
          >
            <span>Открыть сайт</span>
            <ArrowUpRight size={13} aria-hidden="true" />
          </Link>
          <form action={logoutAction} className="mt-1">
            <button
              type="submit"
              className="flex w-full items-center gap-2 px-2.5 py-2 text-left text-[12px] text-[#9a9a9a] transition-colors hover:text-fg"
            >
              <SignOut size={14} weight="light" aria-hidden="true" />
              Выйти
            </button>
          </form>
        </div>
      </aside>

      {open ? (
        <button
          type="button"
          aria-label="Закрыть меню"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
        />
      ) : null}

      <div className="lg:pl-[252px]">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-[#222] bg-[#090909]/90 px-4 backdrop-blur-md sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Открыть меню"
              aria-expanded={open}
              className="flex h-9 w-9 items-center justify-center border border-[#2c2c2c] text-fg lg:hidden"
            >
              <List size={18} aria-hidden="true" />
            </button>
            <p className="truncate text-sm text-fg">{current?.label ?? "Панель управления"}</p>
          </div>

          <div className="flex min-w-0 items-center gap-3">
            <span className="hidden max-w-[220px] truncate font-mono text-[10px] tracking-[0.06em] text-[#7c7c7c] sm:block">
              {email}
            </span>
            <span className="h-6 w-px bg-[#262626]" aria-hidden="true" />
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-1.5 text-[11px] text-[#9a9a9a] transition-colors hover:text-fg sm:flex"
            >
              Сайт
              <ArrowUpRight size={12} aria-hidden="true" />
            </Link>
          </div>
        </header>

        <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </div>
      </div>
    </div>
  );
}
