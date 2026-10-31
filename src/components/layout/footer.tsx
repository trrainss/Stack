import Link from "next/link";
import { ArrowUpRight, EnvelopeSimple, Phone, TiktokLogo, TelegramLogo, Clock, Lightning } from "@phosphor-icons/react/dist/ssr";

import { Logo } from "@/components/brand/logo";
import type { SiteContent } from "@/lib/settings";
import { normalizeTelegram, normalizeTikTok } from "@/lib/utils";

const FOOTER_NAV = [
  { href: "/projects", label: "Проекты" },
  { href: "/services", label: "Услуги" },
  { href: "/about", label: "О нас" },
  { href: "/contacts", label: "Контакты" },
  { href: "/privacy", label: "Политика конфиденциальности" },
];

export function Footer({ content }: { content: SiteContent }) {
  const year = new Date().getFullYear();
  const email = content["contacts.email"].trim() || "stacklab7@gmail.com";
  const telegram = content["contacts.telegram"].trim() || "https://t.me/StackLabb";
  const tiktok = content["contacts.tiktok"].trim() || "https://www.tiktok.com/@nikitrkkls4";
  const phone = content["contacts.phone"].trim();

  return (
    <footer className="border-t border-line bg-surface">
      <div className="container-page py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Logo />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted">
              {content["footer.description"] ||
                "Разработка быстрых и современных сайтов для бизнеса со сроком запуска до 5 дней."}
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <p className="flex items-center gap-2 font-mono text-xs text-emerald-400">
                <Lightning size={14} weight="fill" />
                Срок разработки: до 5 дней
              </p>
              <p className="flex items-center gap-2 font-mono text-xs text-sky-400">
                <Clock size={14} />
                Ответ в течение 2 часов в любое время
              </p>
            </div>
          </div>

          <nav aria-label="Навигация в подвале" className="lg:col-span-3">
            <h2 className="mono-label">Навигация</h2>
            <ul className="mt-5 grid gap-3">
              {FOOTER_NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="link-underline text-sm text-muted transition-colors duration-300 hover:text-fg"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-4">
            <h2 className="mono-label">Контакты</h2>
            <ul className="mt-5 grid gap-3 text-sm">
              <li>
                <a
                  href={`mailto:${email}`}
                  className="group inline-flex items-center gap-2.5 text-fg transition-opacity duration-300 hover:opacity-70"
                >
                  <EnvelopeSimple size={16} weight="light" aria-hidden="true" />
                  <span>{email}</span>
                </a>
              </li>

              {telegram ? (
                <li>
                  <a
                    href={normalizeTelegram(telegram)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 text-fg transition-opacity duration-300 hover:opacity-70"
                  >
                    <TelegramLogo size={16} weight="light" aria-hidden="true" />
                    <span>Telegram (@StackLabb)</span>
                    <ArrowUpRight size={12} aria-hidden="true" className="text-dim" />
                  </a>
                </li>
              ) : null}

              {tiktok ? (
                <li>
                  <a
                    href={normalizeTikTok(tiktok)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 text-fg transition-opacity duration-300 hover:opacity-70"
                  >
                    <TiktokLogo size={16} weight="light" aria-hidden="true" />
                    <span>TikTok</span>
                    <ArrowUpRight size={12} aria-hidden="true" className="text-dim" />
                  </a>
                </li>
              ) : null}

              {phone ? (
                <li>
                  <a
                    href={`tel:${phone.replace(/[^+\d]/g, "")}`}
                    className="inline-flex items-center gap-2.5 text-fg transition-opacity duration-300 hover:opacity-70"
                  >
                    <Phone size={16} weight="light" aria-hidden="true" />
                    <span>{phone}</span>
                  </a>
                </li>
              ) : null}
            </ul>

            <div className="mt-6 rounded-xl border border-line bg-card p-4">
              <p className="text-xs leading-relaxed text-muted">
                Сайт STACKLAB, на котором вы находитесь — наша собственная разработка. Готовы
                запустить проект для вас в срок до 5 дней.
              </p>
              <Link
                href="/contacts"
                className="mt-3 inline-flex items-center gap-1.5 border-b border-line pb-0.5 text-xs text-fg transition-colors hover:border-fg"
              >
                Оставить заявку
                <ArrowUpRight size={12} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom copyright line without legalistic claims */}
        <div className="mt-16 flex flex-col gap-4 border-t border-line pt-6 text-xs text-dim sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} STACKLAB</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link href="/privacy" className="link-underline transition-colors hover:text-fg">
              Политика конфиденциальности
            </Link>
            <Link href="/contacts" className="link-underline transition-colors hover:text-fg">
              Обсудить проект
            </Link>
          </div>
        </div>
      </div>

      <div aria-hidden="true" className="container-page overflow-hidden pb-6">
        <p className="select-none text-[clamp(3.4rem,12vw,11rem)] font-semibold uppercase leading-[0.8] tracking-[-0.04em] text-white/[0.045]">
          Stacklab
        </p>
      </div>
    </footer>
  );
}
