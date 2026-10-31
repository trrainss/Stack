import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Clock, Lightning, Sparkle, TelegramLogo, TiktokLogo, EnvelopeSimple } from "@phosphor-icons/react/dist/ssr";

import { FaqAccordion } from "@/components/home/faq-accordion";
import { LeadButton } from "@/components/lead/lead-dialog";
import { ProjectCard } from "@/components/projects/project-card";
import { ServicesSection } from "@/components/services/services-section";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import {
  getPublishedFaqs,
  getPublishedProcessSteps,
  getPublishedProjects,
  getPublishedServices,
} from "@/lib/data";
import { isEnabled, getSiteContent, parsePairs } from "@/lib/settings";
import { serverEnv } from "@/lib/env";
import { splitParagraphs } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  return {
    title: content["seo.defaultTitle"],
    description: content["seo.defaultDescription"],
    alternates: { canonical: "/" },
    openGraph: {
      title: content["seo.defaultTitle"],
      description: content["seo.defaultDescription"],
      url: serverEnv.appUrl,
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: content["site.name"] }],
    },
  };
}

export default async function HomePage() {
  const content = await getSiteContent();
  const [projects, services, faqs, steps] = await Promise.all([
    getPublishedProjects(),
    getPublishedServices(),
    getPublishedFaqs(),
    getPublishedProcessSteps(),
  ]);

  const advantages = parsePairs(content["home.advantages.items"]);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.slice(0, 10).map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: content["site.name"],
    description: content["site.description"],
    url: serverEnv.appUrl,
    areaServed: "RU",
    knowsAbout: ["Веб-разработка", "Лендинги за 5 дней", "Интернет-магазины", "Корпоративные сайты"],
    email: "stacklab7@gmail.com",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      {faqs.length > 0 ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      ) : null}

      {/* HERO SECTION */}
      <section className="relative isolate overflow-hidden pt-32 sm:pt-36 lg:pt-40">
        <div
          aria-hidden="true"
          className="hero-glow pointer-events-none absolute left-1/2 top-16 -z-10 h-[26rem] w-[min(90vw,70rem)] -translate-x-1/2 rounded-full"
        />
        <div className="container-page">
          <div className="mx-auto max-w-5xl text-center">
            <Reveal>
              <p className="hero-eyebrow mono-label mx-auto inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-[10px] tracking-[0.14em] text-[#cbd5e1]">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,.6)]" />
                {content["home.hero.label"] || "STACKLAB · САЙТЫ ДЛЯ БИЗНЕСА ЗА 5 ДНЕЙ"}
              </p>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="hero-title mx-auto mt-7 max-w-5xl text-balance text-[clamp(2.6rem,7vw,6rem)] font-semibold leading-[0.98] tracking-[-0.065em] text-fg">
                {content["home.hero.title"] ||
                  "Сайты, которые превращают интерес в заявки — за 5 дней"}
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-muted sm:text-lg sm:leading-8">
                {content["home.hero.subtitle"] ||
                  "Проектируем понятные, быстрые и выразительные сайты для бизнеса. От первой идеи до запуска — всего до 5 дней с прозрачным процессом и вниманием к деталям."}
              </p>
            </Reveal>
            <Reveal delay={0.14}>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <LeadButton className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-fg px-8 text-sm font-semibold text-base shadow-[0_12px_40px_rgba(255,255,255,.08)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white active:scale-[.98]">
                  <span>{content["home.hero.primaryCta"] || "Обсудить проект"}</span>
                  <ArrowUpRight
                    size={17}
                    weight="bold"
                    aria-hidden="true"
                    className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </LeadButton>
                <ButtonLink href="#projects" variant="outline" size="md" className="min-h-14 rounded-full px-8">
                  {content["home.hero.secondaryCta"] || "Примеры работ"}
                </ButtonLink>
              </div>
            </Reveal>
            <Reveal delay={0.18}>
              <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5">
                <span className="social-chip inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-surface/90 px-4 py-2.5 text-xs text-emerald-300">
                  <Lightning size={14} weight="fill" className="text-emerald-400" /> Срок запуска: до 5 дней
                </span>
                <span className="social-chip inline-flex items-center gap-2 rounded-full border border-line bg-surface/90 px-4 py-2.5 text-xs text-muted">
                  <Clock size={14} className="text-sky-400" /> Ответ за 2 часа
                </span>
                <a
                  href="https://t.me/StackLabb"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-chip inline-flex items-center gap-2 rounded-full border border-line bg-surface/90 px-4 py-2.5 text-xs text-muted transition-all hover:border-white/35 hover:text-fg"
                >
                  <TelegramLogo size={14} className="text-sky-400" /> Telegram <ArrowUpRight size={13} aria-hidden="true" />
                </a>
                <a
                  href="mailto:stacklab7@gmail.com"
                  className="social-chip inline-flex items-center gap-2 rounded-full border border-line bg-surface/90 px-4 py-2.5 text-xs text-muted transition-all hover:border-white/35 hover:text-fg"
                >
                  <EnvelopeSimple size={14} className="text-amber-400" /> stacklab7@gmail.com
                </a>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.2}>
            <div className="hero-showcase mt-14 overflow-hidden rounded-2xl border border-line bg-card p-2 sm:mt-16 sm:p-3">
              <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-[#0b0b0b]">
                <div className="flex items-center justify-between border-b border-line px-4 py-3 sm:px-6">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#4b4b4b]" />
                    <span className="h-2 w-2 rounded-full bg-[#4b4b4b]" />
                    <span className="h-2 w-2 rounded-full bg-[#4b4b4b]" />
                  </div>
                  <span className="font-mono text-[9px] tracking-[0.18em] text-dim sm:text-[10px]">
                    ВЕБ-РАЗРАБОТКА ДЛЯ БИЗНЕСА · ЗАПУСК ДО 5 ДНЕЙ
                  </span>
                  <span className="hidden font-mono text-[10px] text-dim sm:block">STACKLAB</span>
                </div>
                <div className="grid min-h-[210px] gap-6 p-6 sm:min-h-[270px] sm:grid-cols-[1.1fr_.9fr] sm:items-center sm:p-10 lg:p-14">
                  <div>
                    <p className="mono-label text-[#cbd5e1]">Продуманная структура · Дизайн · Чистый код</p>
                    <p className="mt-4 max-w-xl text-3xl font-medium leading-[1.05] tracking-[-0.05em] text-fg sm:text-5xl">
                      Сайт, на котором вы находитесь — наша разработка.
                    </p>
                    <p className="mt-4 max-w-md text-sm leading-6 text-muted">
                      Мы создали этот сайт с нуля, чтобы показать на практике внимание к деталям,
                      скорость и уровень исполнения для каждого клиента.
                    </p>
                    <div className="mt-6 flex flex-wrap items-center gap-3">
                      <span className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-950/40 px-3 py-1.5 font-mono text-[11px] text-emerald-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        Собственная разработка STACKLAB
                      </span>
                    </div>
                  </div>
                  <div className="showcase-art relative mx-auto flex aspect-[1.5/1] w-full max-w-md items-center justify-center overflow-hidden rounded-xl border border-white/[0.08] bg-[#111]">
                    <div className="showcase-orbit absolute h-[72%] aspect-square rounded-full border border-white/[0.12]" />
                    <div className="showcase-orbit absolute h-[48%] aspect-square rounded-full border border-white/[0.18]" />
                    <div className="showcase-core relative flex h-24 w-24 items-center justify-center rounded-2xl border border-white/20 bg-[#e8e8e8] text-[#080808] shadow-[0_0_70px_rgba(255,255,255,.12)] sm:h-32 sm:w-32">
                      <span className="text-3xl font-semibold tracking-[-0.08em] sm:text-5xl">
                        S<span className="text-[#777]">/</span>L
                      </span>
                    </div>
                    <span className="absolute left-4 top-4 font-mono text-[9px] tracking-widest text-dim sm:left-6 sm:top-6">
                      СРОК: ДО 5 ДНЕЙ
                    </span>
                    <span className="absolute bottom-4 right-4 font-mono text-[9px] tracking-widest text-emerald-400 sm:bottom-6 sm:right-6">
                      ● ОНЛАЙН / ОТВЕТ 2 ЧАСА
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* PROJECTS SECTION — Real live projects */}
      <section id="projects" className="py-20 sm:py-24 lg:py-28">
        <div className="container-page">
          <div className="mb-12 border-b border-line pb-8 sm:flex sm:items-end sm:justify-between sm:gap-6">
            <div>
              <p className="mono-label mb-3 text-[#cbd5e1]">01 / Портфолио и примеры</p>
              <h2 className="text-h2">{content["home.projects.title"] || "Примеры наших работ"}</h2>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
                {content["home.projects.subtitle"] ||
                  "Сайт, на котором вы сейчас находитесь — одна из наших собственных разработок. Ниже представлены живые сайты, созданные для наших клиентов."}
              </p>
            </div>
            <Link
              href="/projects"
              className="group mt-6 inline-flex shrink-0 items-center gap-2 border-b border-line pb-1 text-sm text-fg transition-colors hover:border-fg sm:mt-0"
            >
              <span>Смотреть все проекты</span>
              <ArrowUpRight
                size={14}
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </div>

          {/* Note callout banner */}
          <div className="mb-10 flex items-start gap-3.5 rounded-2xl border border-emerald-500/20 bg-emerald-950/20 p-5">
            <Sparkle size={18} weight="fill" className="mt-0.5 shrink-0 text-emerald-400" />
            <p className="text-sm leading-relaxed text-emerald-200">
              <strong className="font-medium text-emerald-100">Обратите внимание:</strong> сайт, на котором вы сейчас находитесь, разработан нашей командой. Каждый проект ниже можно открыть по прямой ссылке и проверить его вживую.
            </p>
          </div>

          <div className="grid gap-12 sm:gap-14 md:grid-cols-2">
            {projects.map((project, index) => (
              <Reveal key={project.id} delay={(index % 2) * 0.05}>
                <ProjectCard project={project} index={index} priority={index < 2} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      {isEnabled(content["home.sections.services"]) ? (
        <ServicesSection
          services={services}
          title={content["home.services.title"]}
          subtitle={content["home.services.subtitle"]}
          ctaLabel={content["home.services.ctaLabel"]}
        />
      ) : null}

      {/* ADVANTAGES */}
      {isEnabled(content["home.sections.advantages"]) ? (
        <section className="py-8 sm:py-10">
          <div className="container-page">
            <div className="advantages-panel overflow-hidden rounded-3xl border border-line bg-surface p-6 sm:p-10 lg:p-14">
              <div className="mb-10 max-w-2xl sm:mb-12">
                <p className="mono-label mb-3 text-[#cbd5e1]">02 / Преимущества STACKLAB</p>
                <Reveal>
                  <h2 className="text-h2">{content["home.advantages.title"]}</h2>
                </Reveal>
                <Reveal delay={0.05}>
                  <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">
                    {content["home.advantages.subtitle"]}
                  </p>
                </Reveal>
              </div>
              <div className="grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
                {advantages.map((item, index) => (
                  <Reveal key={item.title} delay={(index % 3) * 0.04}>
                    <div className="h-full rounded-2xl border border-line/60 bg-card/60 p-6 transition-colors hover:border-line hover:bg-card">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-surface font-mono text-xs text-[#cbd5e1]">
                        {String(index + 1).padStart(2, "0")}
                      </div>
                      <h3 className="mt-4 text-lg font-medium tracking-tight text-fg">{item.title}</h3>
                      <p className="mt-2.5 text-sm leading-relaxed text-muted">{item.text}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* PROCESS — 5-day sprint */}
      {isEnabled(content["home.sections.process"]) ? (
        <section id="process" className="py-20 sm:py-24 lg:py-28">
          <div className="container-page">
            <div className="mb-10 border-b border-line pb-7 sm:mb-12">
              <p className="mono-label mb-3 text-[#cbd5e1]">03 / Спринт за 5 дней</p>
              <h2 className="text-h2">{content["home.process.title"]}</h2>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
                {content["home.process.subtitle"]}
              </p>
            </div>
            <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              {steps.map((step, index) => (
                <Reveal key={step.id} as="li" delay={(index % 5) * 0.04}>
                  <div className="process-card h-full rounded-2xl border border-line bg-card p-6 sm:p-7">
                    <span className="font-mono text-2xl font-medium tracking-[-0.06em] text-emerald-400">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-4 text-lg font-medium tracking-tight">{step.title}</h3>
                    <p className="mt-2.5 text-xs leading-relaxed text-muted">{step.description}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
            <div className="mt-6 rounded-2xl border border-line bg-surface p-5 sm:flex sm:items-center sm:justify-between sm:gap-8">
              <div>
                <p className="mono-label text-emerald-400">Что требуется от вас</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  Задача, референсы сайтов (если есть) и контакт для связи. Всё остальное мы берём на себя и запускаем сайт в срок до 5 дней.
                </p>
              </div>
              <LeadButton className="mt-4 inline-flex shrink-0 items-center gap-2 rounded-full bg-fg px-6 py-3 text-xs font-semibold text-black transition-colors hover:bg-white sm:mt-0">
                Запустить сайт за 5 дней <ArrowUpRight size={14} aria-hidden="true" />
              </LeadButton>
            </div>
          </div>
        </section>
      ) : null}

      {/* ABOUT */}
      {isEnabled(content["home.sections.about"]) ? (
        <section id="about" className="border-t border-line py-20 sm:py-24 lg:py-28">
          <div className="container-page grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <Reveal>
                <p className="mono-label mb-3 text-[#cbd5e1]">04 / О нас</p>
                <h2 className="max-w-md text-h2">{content["home.about.title"]}</h2>
              </Reveal>
              <Reveal delay={0.05}>
                <Link
                  href="/about"
                  className="group mt-8 inline-flex items-center gap-2 border-b border-line pb-1 text-sm text-fg transition-colors duration-300 hover:border-fg"
                >
                  <span>{content["home.about.linkLabel"]}</span>
                  <ArrowUpRight
                    size={14}
                    aria-hidden="true"
                    className="transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </Link>
              </Reveal>
            </div>
            <div className="lg:col-span-7">
              <div className="grid gap-6">
                {splitParagraphs(content["home.about.body"]).map((paragraph, index) => (
                  <Reveal key={index} delay={index * 0.04}>
                    <p className="max-w-2xl text-lead leading-relaxed text-muted">{paragraph}</p>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* FAQ */}
      {isEnabled(content["home.sections.faq"]) ? (
        <section id="faq" className="faq-section border-t border-line py-20 sm:py-24 lg:py-28">
          <div className="container-page grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Reveal>
                <p className="mono-label mb-4 text-[#cbd5e1]">05 / Ответы на вопросы</p>
                <h2 className="text-h2">{content["home.faq.title"]}</h2>
              </Reveal>
              <Reveal delay={0.05}>
                <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted">
                  {content["home.faq.subtitle"]}
                </p>
              </Reveal>
            </div>
            <div className="lg:col-span-8">
              <Reveal delay={0.05}>
                <FaqAccordion items={faqs} />
              </Reveal>
            </div>
          </div>
        </section>
      ) : null}

      {/* FINAL CTA */}
      {isEnabled(content["home.sections.cta"]) ? (
        <section id="final-cta" className="border-t border-line bg-surface">
          <div className="container-page py-24 lg:py-36">
            <div className="grid gap-12 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-8">
                <Reveal>
                  <p className="mono-label mb-4 text-emerald-400">Свяжитесь с нами сегодня</p>
                  <h2 className="max-w-[20ch] text-display">{content["home.cta.title"]}</h2>
                </Reveal>
              </div>
              <div className="lg:col-span-4">
                <Reveal delay={0.08}>
                  <p className="max-w-sm text-lead text-muted">{content["home.cta.subtitle"]}</p>
                  <LeadButton className="group mt-8 inline-flex h-14 items-center gap-3 rounded-full bg-fg px-8 text-sm font-semibold text-base transition-[background-color,transform] duration-500 ease-[var(--ease-out-expo)] hover:bg-white active:scale-[0.98]">
                    <span>{content["home.cta.button"]}</span>
                    <ArrowUpRight
                      size={17}
                      weight="bold"
                      aria-hidden="true"
                      className="transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </LeadButton>
                </Reveal>
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
