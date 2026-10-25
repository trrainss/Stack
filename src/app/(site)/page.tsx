import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";

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
    getPublishedProjects(4),
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
    "@type": "ProfessionalService",
    name: content["site.name"],
    description: content["site.description"],
    url: serverEnv.appUrl,
    areaServed: "RU",
    knowsAbout: ["Веб-разработка", "Дизайн интерфейсов", "Лендинги", "Интернет-магазины"],
    ...(content["contacts.email"] ? { email: content["contacts.email"] } : {}),
    ...(content["contacts.phone"] ? { telephone: content["contacts.phone"] } : {}),
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

      {/* HERO — visual direction aligned with the STACKLAB reference site */}
      <section className="relative isolate overflow-hidden pt-32 sm:pt-36 lg:pt-40">
        <div aria-hidden="true" className="hero-glow pointer-events-none absolute left-1/2 top-16 -z-10 h-[26rem] w-[min(90vw,70rem)] -translate-x-1/2 rounded-full" />
        <div className="container-page">
          <div className="mx-auto max-w-5xl text-center">
            <Reveal>
              <p className="hero-eyebrow mono-label mx-auto inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-[10px] tracking-[0.14em] text-[#cbd5e1]">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,.6)]" />
                {content["home.hero.label"] || "STACKLAB · ВЕБ-РАЗРАБОТКА ДЛЯ БИЗНЕСА"}
              </p>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="hero-title mx-auto mt-7 max-w-5xl text-balance text-[clamp(2.8rem,7.4vw,6.4rem)] font-semibold leading-[0.98] tracking-[-0.065em] text-fg">
                {content["home.hero.title"] || "Сайты, которые превращают интерес в заявки"}
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-muted sm:text-lg sm:leading-8">
                {content["home.hero.subtitle"] || "Проектируем понятные, быстрые и выразительные сайты для бизнеса. От первой идеи до запуска — с прозрачным процессом и вниманием к деталям."}
              </p>
            </Reveal>
            <Reveal delay={0.14}>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <LeadButton className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-fg px-8 text-sm font-semibold text-base shadow-[0_12px_40px_rgba(255,255,255,.08)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white active:scale-[.98]">
                  <span>{content["home.hero.primaryCta"] || "Обсудить проект"}</span>
                  <ArrowUpRight size={17} weight="bold" aria-hidden="true" className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </LeadButton>
                <ButtonLink href="/services" variant="outline" size="md" className="min-h-14 rounded-full px-8">
                  {content["home.hero.secondaryCta"] || "Услуги и форматы"}
                </ButtonLink>
              </div>
            </Reveal>
            <Reveal delay={0.18}>
              <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5">
                <a href="https://t.me/StackLabb" target="_blank" rel="noopener noreferrer" className="social-chip inline-flex items-center gap-2 rounded-full border border-line bg-surface/90 px-4 py-2.5 text-xs text-muted transition-all hover:border-white/35 hover:text-fg">
                  <span className="h-2 w-2 rounded-full bg-sky-400" /> Telegram <ArrowUpRight size={13} aria-hidden="true" />
                </a>
                <a href="https://www.tiktok.com/@nikitrkkls4" target="_blank" rel="noopener noreferrer" className="social-chip inline-flex items-center gap-2 rounded-full border border-line bg-surface/90 px-4 py-2.5 text-xs text-muted transition-all hover:border-white/35 hover:text-fg">
                  <span className="font-bold text-pink-300">TT</span> TikTok <ArrowUpRight size={13} aria-hidden="true" />
                </a>
                <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/90 px-4 py-2.5 text-xs text-muted"><span className="h-2 w-2 rounded-full bg-emerald-400" /> Индивидуальный подход</span>
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.2}>
            <div className="hero-showcase mt-14 overflow-hidden rounded-2xl border border-line bg-card p-2 sm:mt-16 sm:p-3">
              <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-[#0b0b0b]">
                <div className="flex items-center justify-between border-b border-line px-4 py-3 sm:px-6">
                  <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#4b4b4b]"/><span className="h-2 w-2 rounded-full bg-[#4b4b4b]"/><span className="h-2 w-2 rounded-full bg-[#4b4b4b]"/></div>
                  <span className="font-mono text-[9px] tracking-[0.18em] text-dim sm:text-[10px]">DIGITAL EXPERIENCE / 001</span>
                  <span className="hidden font-mono text-[10px] text-dim sm:block">STACKLAB®</span>
                </div>
                <div className="grid min-h-[210px] gap-6 p-6 sm:min-h-[270px] sm:grid-cols-[1.1fr_.9fr] sm:items-center sm:p-10 lg:p-14">
                  <div>
                    <p className="mono-label text-[#cbd5e1]">Стратегия · Дизайн · Разработка</p>
                    <p className="mt-4 max-w-xl text-3xl font-medium leading-[1.05] tracking-[-0.05em] text-fg sm:text-5xl">Цифровой образ, которому доверяют.</p>
                    <p className="mt-4 max-w-md text-sm leading-6 text-muted">Каждый элемент работает на ясность, удобство и цель вашего бизнеса.</p>
                  </div>
                  <div className="showcase-art relative mx-auto flex aspect-[1.5/1] w-full max-w-md items-center justify-center overflow-hidden rounded-xl border border-white/[0.08] bg-[#111]">
                    <div className="showcase-orbit absolute h-[72%] aspect-square rounded-full border border-white/[0.12]" />
                    <div className="showcase-orbit absolute h-[48%] aspect-square rounded-full border border-white/[0.18]" />
                    <div className="showcase-core relative flex h-24 w-24 items-center justify-center rounded-2xl border border-white/20 bg-[#e8e8e8] text-[#080808] shadow-[0_0_70px_rgba(255,255,255,.12)] sm:h-32 sm:w-32">
                      <span className="text-3xl font-semibold tracking-[-0.08em] sm:text-5xl">S<span className="text-[#777]">/</span>L</span>
                    </div>
                    <span className="absolute left-4 top-4 font-mono text-[9px] tracking-widest text-dim sm:left-6 sm:top-6">BUILT AROUND YOU</span>
                    <span className="absolute bottom-4 right-4 font-mono text-[9px] tracking-widest text-dim sm:bottom-6 sm:right-6">01 — 04</span>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
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


      {/* PROJECTS */}
      {isEnabled(content["home.sections.projects"]) ? (
        <section id="projects" className="py-20 sm:py-24 lg:py-28">
          <div className="container-page">
            <div className="flex flex-wrap items-end justify-between gap-8">
              <div>
                <Reveal>
                  <h2 className="max-w-2xl text-h2">{content["home.projects.title"]}</h2>
                </Reveal>
                <Reveal delay={0.05}>
                  <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted">
                    {content["home.projects.subtitle"]}
                  </p>
                </Reveal>
              </div>
              <Reveal delay={0.1}>
                <ButtonLink
                  href="/projects"
                  variant="outline"
                  size="sm"
                  icon={<ArrowUpRight size={14} weight="light" aria-hidden="true" />}
                >
                  {content["home.projects.linkLabel"]}
                </ButtonLink>
              </Reveal>
            </div>

            {projects.length > 0 ? (
              <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-2 lg:gap-7">
                {projects.map((project, index) => (
                  <Reveal key={project.id} delay={index * 0.05} as="div">
                    <ProjectCard project={project} index={index} priority={index < 2} />
                  </Reveal>
                ))}
              </div>
            ) : (
              <div className="mt-14 border border-line bg-card p-8">
                <p className="text-sm text-muted">
                  Проекты пока не опубликованы. Добавьте их в панели управления.
                </p>
              </div>
            )}
          </div>
        </section>
      ) : null}

      {/* ADVANTAGES */}
      {isEnabled(content["home.sections.advantages"]) ? (
        <section className="py-8 sm:py-10">
          <div className="container-page">
            <div className="advantages-panel overflow-hidden rounded-3xl border border-line bg-surface p-6 sm:p-10 lg:p-14">
              <div className="mb-10 max-w-2xl sm:mb-12">
                <p className="mono-label mb-3 text-[#cbd5e1]">Принципы инженерии</p>
                <Reveal>
                  <h2 className="text-h2">{content["home.advantages.title"]}</h2>
                </Reveal>
                <Reveal delay={0.05}>
                  <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">{content["home.advantages.subtitle"]}</p>
                </Reveal>
              </div>
              <div className="grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
                {advantages.map((item, index) => (
                  <Reveal key={item.title} delay={(index % 3) * 0.04}>
                    <div className="h-full">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-card font-mono text-xs text-[#cbd5e1]">{String(index + 1).padStart(2, "0")}</div>
                      <h3 className="mt-4 text-lg font-medium tracking-tight">{item.title}</h3>
                      <p className="mt-2.5 text-sm leading-relaxed text-muted">{item.text}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* PROCESS */}
      {isEnabled(content["home.sections.process"]) ? (
        <section id="process" className="py-20 sm:py-24 lg:py-28">
          <div className="container-page">
            <div className="mb-10 border-b border-line pb-7 sm:mb-12">
              <p className="mono-label mb-3 text-[#cbd5e1]">Прозрачный цикл</p>
              <h2 className="text-h2">{content["home.process.title"]}</h2>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">{content["home.process.subtitle"]}</p>
            </div>
            <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {steps.map((step, index) => (
                <Reveal key={step.id} as="li" delay={(index % 3) * 0.04}>
                  <div className="process-card h-full rounded-2xl border border-line bg-card p-6 sm:p-7">
                    <span className="font-mono text-3xl font-medium tracking-[-0.06em] text-[#3a3a3a]">{String(index + 1).padStart(2, "0")}</span>
                    <h3 className="mt-5 text-xl font-medium tracking-tight">{step.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted">{step.description}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
            <div className="mt-5 rounded-2xl border border-line bg-surface p-5 sm:flex sm:items-center sm:justify-between sm:gap-8">
              <div>
                <p className="mono-label">Что нужно от вас</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">Задача, примеры сайтов, которые нравятся, и контакт для согласования. Остальное обсудим вместе.</p>
              </div>
              <Link href="/contacts" className="mt-4 inline-flex shrink-0 items-center gap-2 text-sm text-fg transition-colors hover:text-white/70 sm:mt-0">Перейти к форме <ArrowUpRight size={14} aria-hidden="true" /></Link>
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

      {/* TRUST — no invented testimonials */}
      {isEnabled(content["home.sections.testimonials"]) ? (
        <section className="border-t border-line py-20 sm:py-24 lg:py-28">
          <div className="container-page">
            <div className="rounded-2xl border border-line bg-card p-8 sm:p-10 lg:flex lg:items-end lg:justify-between lg:gap-10">
              <div>
                <p className="mono-label text-[#cbd5e1]">Принцип работы</p>
                <h2 className="mt-4 max-w-2xl text-h2">Без выдуманных отзывов и обещаний</h2>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
                  Мы не публикуем неподтверждённые истории от клиентов. Вместо этого показываем концепты, объясняем решения и заранее согласуем состав работ, сроки и стоимость.
                </p>
              </div>
              <Link href="/contacts" className="mt-7 inline-flex shrink-0 items-center gap-2 rounded-full border border-line px-5 py-3 text-sm transition-colors hover:border-white/40 lg:mt-0">
                Обсудить задачу <ArrowUpRight size={15} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      {/* FAQ */}
      {isEnabled(content["home.sections.faq"]) ? (
        <section id="faq" className="border-t border-line py-20 sm:py-24 lg:py-28">
          <div className="container-page grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Reveal>
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
                  <h2 className="max-w-[20ch] text-display">{content["home.cta.title"]}</h2>
                </Reveal>
              </div>
              <div className="lg:col-span-4">
                <Reveal delay={0.08}>
                  <p className="max-w-sm text-lead text-muted">{content["home.cta.subtitle"]}</p>
                  <LeadButton className="group mt-8 inline-flex h-14 items-center gap-3 bg-fg px-7 text-sm font-medium text-base transition-[background-color,transform] duration-500 ease-[var(--ease-out-expo)] hover:bg-white active:scale-[0.98]">
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
