import type { Metadata } from "next";
import { ArrowUpRight, Lightning, Clock } from "@phosphor-icons/react/dist/ssr";

import { PageIntro } from "@/components/layout/page-intro";
import { LeadButton } from "@/components/lead/lead-dialog";
import { Reveal } from "@/components/ui/reveal";
import { getPublishedServices } from "@/lib/data";
import { getSiteContent } from "@/lib/settings";
import { parseLines } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  return {
    title: content["seo.servicesTitle"],
    description: content["seo.servicesDescription"],
    alternates: { canonical: "/services" },
    openGraph: {
      title: content["seo.servicesTitle"],
      description: content["seo.servicesDescription"],
      url: "/services",
    },
  };
}

export default async function ServicesPage() {
  const content = await getSiteContent();
  const services = await getPublishedServices();

  return (
    <>
      <PageIntro
        title="Услуги"
        subtitle={content["services.intro"]}
        meta={`${services.length} форматов · Запуск до 5 дней`}
      />

      <section className="py-16 lg:py-24">
        <div className="container-page">
          {/* Note callout banner */}
          <div className="mb-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-emerald-500/25 bg-emerald-950/20 p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                <Lightning size={18} weight="fill" />
              </span>
              <div>
                <p className="text-sm font-medium text-emerald-200">
                  Все форматы сайтов запускаем в срок до 5 дней
                </p>
                <p className="text-xs text-emerald-300/80">
                  Без затягивания, лишней бюрократии и с прозрачным ежедневным процессом.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs text-sky-400">
              <Clock size={16} />
              <span>Ответ за 2 часа в любое время</span>
            </div>
          </div>

          {services.length === 0 ? (
            <div className="border border-line bg-card p-8 text-sm text-muted">
              Услуги загружаются...
            </div>
          ) : (
            <div className="grid gap-6">
              {services.map((service, index) => {
                const features = parseLines(service.features);
                return (
                  <Reveal key={service.id} delay={index * 0.03}>
                    <article className="grid gap-8 rounded-2xl border border-line bg-card px-6 py-8 sm:px-8 lg:grid-cols-12 lg:gap-12 lg:py-10">
                      <div className="lg:col-span-4">
                        <div className="flex items-baseline gap-4">
                          <span className="font-mono text-sm tracking-[0.14em] text-emerald-400">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <h2 className="text-h3">{service.title}</h2>
                        </div>
                        <div className="mt-4">
                          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-surface px-3 py-1 font-mono text-[11px] uppercase tracking-[0.1em] text-emerald-300">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                            {service.priceLabel || "Срок: до 5 дней"}
                          </span>
                        </div>
                      </div>

                      <div className="lg:col-span-8">
                        <p className="max-w-2xl text-base leading-relaxed text-fg">
                          {service.description}
                        </p>

                        <div className="mt-8 grid gap-8 sm:grid-cols-2">
                          <div>
                            <p className="mono-label text-emerald-400">Что входит в работу</p>
                            <ul className="mt-3 grid gap-2">
                              {features.map((feature) => (
                                <li
                                  key={feature}
                                  className="flex gap-2.5 text-sm leading-relaxed text-muted"
                                >
                                  <span
                                    aria-hidden="true"
                                    className="mt-2 h-px w-3 shrink-0 bg-emerald-500/60"
                                  />
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="grid gap-6">
                            {service.audience ? (
                              <div>
                                <p className="mono-label">Кому подходит</p>
                                <p className="mt-2 text-sm leading-relaxed text-muted">
                                  {service.audience}
                                </p>
                              </div>
                            ) : null}
                            {service.outcome ? (
                              <div>
                                <p className="mono-label">Результат</p>
                                <p className="mt-2 text-sm leading-relaxed text-muted">
                                  {service.outcome}
                                </p>
                              </div>
                            ) : null}
                          </div>
                        </div>

                        <LeadButton
                          projectType={service.slug}
                          className="group mt-8 inline-flex h-11 items-center gap-2.5 rounded-full border border-line bg-surface px-6 text-xs font-semibold text-fg transition-all duration-300 hover:border-white/50 hover:bg-white hover:text-black"
                        >
                          <span>Заказать сайт</span>
                          <ArrowUpRight
                            size={14}
                            weight="bold"
                            aria-hidden="true"
                            className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                          />
                        </LeadButton>
                      </div>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          )}

          <p className="mt-8 max-w-2xl rounded-xl border border-line bg-surface p-5 text-sm leading-relaxed text-muted">
            {content["services.note"]}
          </p>
        </div>
      </section>

      <section className="border-t border-line bg-surface">
        <div className="container-page py-20 lg:py-28">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <h2 className="max-w-[22ch] text-h2">Не нашли подходящий формат?</h2>
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted">
                Опишите вашу задачу своими словами. Мы ответим в течение 2 часов, рассчитаем план
                работ и запустим сайт за срок до 5 дней.
              </p>
            </div>
            <div className="lg:col-span-4">
              <LeadButton className="group inline-flex h-12 items-center gap-3 rounded-full bg-fg px-6 text-sm font-semibold text-base transition-[background-color,transform] duration-500 ease-[var(--ease-out-expo)] hover:bg-white active:scale-[0.98]">
                <span>Обсудить задачу</span>
                <ArrowUpRight size={16} weight="bold" />
              </LeadButton>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
