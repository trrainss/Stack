import type { Metadata } from "next";
import {
  ArrowUpRight,
  Clock,
  EnvelopeSimple,
  Phone,
  TiktokLogo,
  TelegramLogo,
  Lightning,
} from "@phosphor-icons/react/dist/ssr";

import { PageIntro } from "@/components/layout/page-intro";
import { LeadForm } from "@/components/lead/lead-form";
import { getSiteContent } from "@/lib/settings";
import { normalizeTelegram, normalizeTikTok } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  return {
    title: content["seo.contactsTitle"],
    description: content["seo.contactsDescription"],
    alternates: { canonical: "/contacts" },
    openGraph: {
      title: content["seo.contactsTitle"],
      description: content["seo.contactsDescription"],
      url: "/contacts",
    },
  };
}

export default async function ContactsPage() {
  const content = await getSiteContent();
  const email = content["contacts.email"].trim() || "stacklab7@gmail.com";
  const telegram = content["contacts.telegram"].trim() || "https://t.me/StackLabb";
  const tiktok = content["contacts.tiktok"].trim() || "https://www.tiktok.com/@nikitrkkls4";
  const phone = content["contacts.phone"].trim();

  return (
    <>
      <PageIntro
        title={content["contacts.title"]}
        subtitle={content["contacts.subtitle"]}
        meta="Ответ в течение 2 часов в любое время"
      />

      <section className="contacts-section py-12 sm:py-16 lg:py-24">
        <div className="container-page grid items-start gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <div
              id="lead-form"
              className="lead-panel relative overflow-hidden rounded-3xl border border-line bg-surface p-5 sm:p-8 lg:p-10"
            >
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="mono-label text-[#cbd5e1]">01 / Заявка на сайт</span>
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-2.5 py-0.5 font-mono text-[10px] text-emerald-300">
                  <Lightning size={12} weight="fill" /> Срок запуска: до 5 дней
                </span>
              </div>
              <h2 className="text-h3">{content["contacts.formTitle"]}</h2>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted">
                {content["contacts.formNote"]}
              </p>
              <div className="mt-8">
                <LeadForm />
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="contacts-aside rounded-3xl border border-line bg-card p-6 sm:p-8">
              <p className="mono-label mb-3 text-[#cbd5e1]">02 / Прямая связь</p>
              <h2 className="text-2xl font-medium tracking-tight">
                {content["contacts.directTitle"]}
              </h2>

              <ul className="mt-6 grid gap-4 text-sm">
                <li>
                  <a
                    href={`mailto:${email}`}
                    className="group flex items-center justify-between gap-4 border-b border-line pb-4 transition-colors hover:border-fg/40"
                  >
                    <span className="flex items-center gap-3">
                      <EnvelopeSimple size={18} weight="light" aria-hidden="true" />
                      <span className="font-mono text-xs sm:text-sm">{email}</span>
                    </span>
                    <ArrowUpRight
                      size={14}
                      aria-hidden="true"
                      className="text-dim transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </a>
                </li>
                {telegram ? (
                  <li>
                    <a
                      href={normalizeTelegram(telegram)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between gap-4 border-b border-line pb-4 transition-colors hover:border-fg/40"
                    >
                      <span className="flex items-center gap-3">
                        <TelegramLogo size={18} weight="light" aria-hidden="true" />
                        <span>Telegram (@StackLabb)</span>
                      </span>
                      <ArrowUpRight
                        size={14}
                        aria-hidden="true"
                        className="text-dim transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      />
                    </a>
                  </li>
                ) : null}
                {tiktok ? (
                  <li>
                    <a
                      href={normalizeTikTok(tiktok)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between gap-4 border-b border-line pb-4 transition-colors hover:border-fg/40"
                    >
                      <span className="flex items-center gap-3">
                        <TiktokLogo size={18} weight="light" aria-hidden="true" />
                        <span>TikTok</span>
                      </span>
                      <ArrowUpRight
                        size={14}
                        aria-hidden="true"
                        className="text-dim transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      />
                    </a>
                  </li>
                ) : null}
                {phone ? (
                  <li>
                    <a
                      href={`tel:${phone.replace(/[^+\d]/g, "")}`}
                      className="group flex items-center justify-between gap-4 border-b border-line pb-4 transition-colors hover:border-fg/40"
                    >
                      <span className="flex items-center gap-3">
                        <Phone size={18} weight="light" aria-hidden="true" />
                        <span>{phone}</span>
                      </span>
                      <ArrowUpRight
                        size={14}
                        aria-hidden="true"
                        className="text-dim transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      />
                    </a>
                  </li>
                ) : null}
              </ul>

              <div className="mt-8 flex items-start gap-3 rounded-2xl border border-line bg-surface p-5">
                <Clock size={18} weight="light" aria-hidden="true" className="mt-0.5 text-sky-400" />
                <div>
                  <p className="text-sm font-medium text-fg">Ответ в течение 2 часов</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted">
                    Отвечаем в течение 2 часов в любое время — независимо от дня недели или времени
                    суток.
                  </p>
                </div>
              </div>

              <div className="mt-8 rounded-2xl border border-line bg-surface p-5">
                <p className="mono-label text-emerald-400">Что ускорит старт проекта</p>
                <ul className="mt-4 grid gap-3 text-sm leading-relaxed text-muted">
                  <li>Краткое описание вашего бизнеса или продукта.</li>
                  <li>Ссылки на примеры сайтов, которые вам нравятся.</li>
                  <li>Ссылка на текущий сайт (если есть).</li>
                  <li>Желаемая дата запуска (делаем в срок до 5 дней).</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
