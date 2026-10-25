"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMotionValueEvent, useScroll } from "motion/react";
import { ArrowUpRight, List, X } from "@phosphor-icons/react";

import { Logo } from "@/components/brand/logo";
import { LeadButton } from "@/components/lead/lead-dialog";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/projects", label: "Проекты" },
  { href: "/services", label: "Услуги" },
  { href: "/#process", label: "Процесс" },
  { href: "/about", label: "О студии" },
  { href: "/contacts", label: "Контакты" },
];

export function Header({ ctaLabel }: { ctaLabel: string }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (value) => {
    setScrolled(value > 24);
  });

  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    firstLinkRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
      if (event.key !== "Tab" || !menuRef.current) return;

      const focusable = menuRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.documentElement.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ease-[var(--ease-out-expo)]",
          scrolled
            ? "border-b border-line bg-base/85 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <div
          className={cn(
            "container-page flex items-center justify-between transition-[height] duration-500 ease-[var(--ease-out-expo)]",
            scrolled ? "h-16" : "h-20 lg:h-[88px]",
          )}
        >
          <Logo />

          <nav aria-label="Основная навигация" className="hidden items-center gap-7 lg:flex">
            {NAV_ITEMS.map((item) => {
              const active =
                item.href.startsWith("/#")
                  ? false
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "link-underline text-[0.82rem] transition-colors duration-300",
                    active ? "text-fg" : "text-muted hover:text-fg",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2.5">
            <LeadButton className="hidden h-11 items-center gap-2 bg-fg px-5 text-[0.8rem] font-medium text-base transition-[background-color,transform] duration-500 ease-[var(--ease-out-expo)] hover:bg-white active:scale-[0.98] sm:inline-flex">
              <span>{ctaLabel}</span>
              <ArrowUpRight size={15} weight="bold" aria-hidden="true" />
            </LeadButton>

            <button
              ref={toggleRef}
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
              className="relative flex h-11 w-11 items-center justify-center border border-line text-fg transition-colors duration-300 hover:border-white/35 lg:hidden"
            >
              {menuOpen ? <X size={20} aria-hidden="true" /> : <List size={20} aria-hidden="true" />}
            </button>
          </div>
        </div>
      </header>

      <div
        id="mobile-menu"
        ref={menuRef}
        role="dialog"
        aria-modal="true"
        aria-label="Меню сайта"
        className={cn(
          "fixed inset-0 z-[70] flex flex-col bg-[#080808] transition-[opacity,visibility] duration-500 ease-[var(--ease-out-expo)] lg:hidden",
          menuOpen ? "visible opacity-100" : "invisible opacity-0",
        )}
      >
        <div className="container-page flex h-20 items-center justify-between border-b border-line">
          <Logo />
          <button
            type="button"
            onClick={() => {
              setMenuOpen(false);
              toggleRef.current?.focus();
            }}
            aria-label="Закрыть меню"
            className="flex h-11 w-11 items-center justify-center border border-line text-fg"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <nav aria-label="Мобильная навигация" className="container-page flex flex-1 flex-col justify-center py-10">
          <ul className="divide-y divide-line border-y border-line">
            {NAV_ITEMS.map((item, index) => (
              <li key={item.href}>
                <Link
                  ref={index === 0 ? firstLinkRef : undefined}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="group flex items-center justify-between py-5 text-[clamp(1.6rem,7vw,2.4rem)] font-medium tracking-tight text-fg"
                >
                  <span>{item.label}</span>
                  <ArrowUpRight
                    size={22}
                    weight="light"
                    aria-hidden="true"
                    className="text-dim transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1"
                  />
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-10">
            <LeadButton className="flex h-13 w-full items-center justify-center gap-3 bg-fg py-4 text-sm font-medium text-base">
              <span>{ctaLabel}</span>
              <ArrowUpRight size={16} weight="bold" aria-hidden="true" />
            </LeadButton>
            <p className="mt-5 text-xs leading-relaxed text-dim">
              Расскажите о задаче - ответим по указанному контакту и предложим следующий шаг.
            </p>
          </div>
        </nav>
      </div>
    </>
  );
}
