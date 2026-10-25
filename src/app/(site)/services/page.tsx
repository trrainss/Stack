import type { Metadata } from "next";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";

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
        meta={`${services.length} форматов работы`}
      />

      <section className="py-16 lg:py-24">
        <div className="container-page">
          {services.length === 0 ? (
            <div className="border border-line bg-card p-8 text-sm text-muted">
              Услуги пока не добавлены. Настройте список в панели управления.
            </div>
          ) : (
            <div className="border-t border-line">
              {services.map((service, index) => {
                const features = parseLines(service.features);
                return (
                  <Reveal key={service.id} delay={index * 0.03}>
                    <article className="grid gap-8 border-b border-line py-10 lg:grid-cols-12 lg:gap-12 lg:py-14">
                      <div className="lg:col-span-4">
                        <div className="flex items-baseline gap-4">
                          <span className="font-mono text-[10px] tracking-[0.14em] text-dim">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <h2 className="text-h3">{service.title}</h2>
                        </div>
                        <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
                          Стоимость по договорённости
                        </p>
                      </div>

                      <div className="lg:col-span-8">
                        <p className="max-w-2xl text-base leading-relaxed text-fg">
                          {service.description}
                        </p>

                        <div className="mt-8 grid gap-8 sm:grid-cols-2">
                          <div>
                            <p className="mono-label">Что входит</p>
                            <ul className="mt-3 grid gap-2">
                              {features.map((feature) => (
                                <li
                                  key={feature}
                                  className="flex gap-2.5 text-sm leading-relaxed text-muted"
                                >
                                  <span
                                    aria-hidden="true"
                                    className="mt-2 h-px w-3 shrink-0 bg-dim"
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
                          className="group mt-8 inline-flex h-11 items-center gap-2.5 border border-line px-5 text-[0.8rem] text-fg transition-colors duration-300 hover:border-white/40"
                        >
                          <span>Заказать услугу</span>
                          <ArrowUpRight
                            size={14}
                            weight="light"
                            aria-hidden="true"
                            className="transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                          />
                        </LeadButton>
                      </div>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          )}

          <p className="mt-8 max-w-2xl text-xs leading-relaxed text-dim">
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
                Опишите задачу своими словами. Предложим состав работ и честно скажем, если
                задача решается проще или иначе.
              </p>
            </div>
            <div className="lg:col-span-4">
              <LeadButton className="group inline-flex h-12 items-center gap-3 bg-fg px-6 text-sm font-medium text-base transition-[background-color,transform] duration-500 ease-[var(--ease-out-expo)] hover:bg-white active:scale-[0.98]">
                Обсудить задачу
              </LeadButton>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
