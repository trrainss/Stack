import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Quotes } from "@phosphor-icons/react/dist/ssr";

import { FaqAccordion } from "@/components/home/faq-accordion";
import { HeroVisual } from "@/components/home/hero-visual";
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
  getPublishedTestimonials,
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
  const [projects, services, faqs, testimonials, steps] = await Promise.all([
    getPublishedProjects(4),
    getPublishedServices(),
    getPublishedFaqs(),
    getPublishedTestimonials(),
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

      {/* HERO */}
      <section className="relative overflow-hidden pt-32 lg:pt-40">
        <div className="container-page">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-8">
            <div className="lg:col-span-8">
              <Reveal>
                <p className="mono-label">{content["home.hero.label"]}</p>
              </Reveal>
              <Reveal delay={0.05}>
                <h1 className="mt-6 max-w-[17ch] text-display text-fg">
                  {content["home.hero.title"]}
                </h1>
              </Reveal>
            </div>

            <div className="lg:col-span-4">
              <Reveal delay={0.12}>
                <p className="max-w-md text-lead text-muted">{content["home.hero.subtitle"]}</p>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <LeadButton className="group inline-flex h-12 items-center gap-3 bg-fg px-6 text-sm font-medium text-base transition-[background-color,transform] duration-500 ease-[var(--ease-out-expo)] hover:bg-white active:scale-[0.98]">
                    <span>{content["home.hero.primaryCta"]}</span>
                    <ArrowUpRight
                      size={16}
                      weight="bold"
                      aria-hidden="true"
                      className="transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </LeadButton>
                  <ButtonLink href="/projects" variant="outline" size="md">
                    {content["home.hero.secondaryCta"]}
                  </ButtonLink>
                </div>
              </Reveal>
            </div>
          </div>

          <Reveal delay={0.18}>
            <HeroVisual />
          </Reveal>
        </div>
      </section>

      {/* PROJECTS */}
      {isEnabled(content["home.sections.projects"]) ? (
        <section id="projects" className="py-24 lg:py-32">
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
                  <p className="mt-3 inline-flex items-center gap-2 border border-line bg-card px-3 py-2 text-xs text-muted">
                    <span className="h-1.5 w-1.5 rounded-full bg-fg/60" aria-hidden="true" />
                    Демонстрационные концепты, не заявленные как реальные клиентские проекты
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
              <div className="mt-14 grid gap-10 lg:grid-cols-2 lg:gap-x-12 lg:gap-y-4">
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
        <section className="border-t border-line py-24 lg:py-32">
          <div className="container-page">
            <div className="grid gap-10 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <Reveal>
                  <h2 className="text-h2">{content["home.advantages.title"]}</h2>
                </Reveal>
              </div>
              <div className="lg:col-span-8">
                <Reveal>
                  <p className="max-w-xl text-sm leading-relaxed text-muted">
                    {content["home.advantages.subtitle"]}
                  </p>
                </Reveal>
              </div>
            </div>

            <div className="mt-14 grid gap-x-14 md:grid-cols-2">
              {advantages.map((item, index) => (
                <Reveal key={item.title} delay={(index % 2) * 0.05}>
                  <div className="grid grid-cols-[auto_1fr] gap-5 border-t border-line py-7">
                    <span className="font-mono text-[10px] tracking-[0.14em] text-dim">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="text-lg font-medium tracking-tight">{item.title}</h3>
                      <p className="mt-2.5 text-sm leading-relaxed text-muted">{item.text}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* PROCESS */}
      {isEnabled(content["home.sections.process"]) ? (
        <section id="process" className="border-t border-line bg-surface py-24 lg:py-32">
          <div className="container-page grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-28">
                <Reveal>
                  <h2 className="text-h2">{content["home.process.title"]}</h2>
                </Reveal>
                <Reveal delay={0.05}>
                  <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted">
                    {content["home.process.subtitle"]}
                  </p>
                </Reveal>
                <Reveal delay={0.1}>
                  <div className="mt-8 border border-line bg-card p-5">
                    <p className="mono-label">Что нужно от вас</p>
                    <p className="mt-3 text-sm leading-relaxed text-muted">
                      Задача, примеры ориентиров и контакт для согласования. Остальное берём на себя.
                    </p>
                  </div>
                </Reveal>
              </div>
            </div>

            <ol className="lg:col-span-8">
              {steps.map((step, index) => (
                <Reveal key={step.id} as="li" delay={index * 0.03}>
                  <div className="grid grid-cols-[auto_1fr] gap-6 border-t border-line py-8 sm:gap-10">
                    <span className="font-mono text-[11px] tracking-[0.16em] text-dim">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="text-xl font-medium tracking-tight sm:text-2xl">{step.title}</h3>
                      <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>
      ) : null}

      {/* ABOUT */}
      {isEnabled(content["home.sections.about"]) ? (
        <section id="about" className="border-t border-line py-24 lg:py-32">
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

      {/* TESTIMONIALS — show only genuine, approved client feedback */}
      {isEnabled(content["home.sections.testimonials"]) && testimonials.length > 0 ? (
        <section className="border-t border-line py-24 lg:py-32">
          <div className="container-page">
            <Reveal>
              <h2 className="text-h2">{content["home.testimonials.title"]}</h2>
            </Reveal>

            {testimonials.length > 0 ? (
              <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {testimonials.slice(0, 6).map((testimonial, index) => (
                  <Reveal key={testimonial.id} delay={index * 0.04}>
                    <figure className="flex h-full flex-col justify-between border border-line bg-card p-6">
                      <Quotes size={22} weight="light" aria-hidden="true" className="text-dim" />
                      <blockquote className="mt-5 text-sm leading-relaxed text-fg">
                        {testimonial.content}
                      </blockquote>
                      <figcaption className="mt-6 border-t border-line pt-4 text-xs text-muted">
                        <span className="text-fg">{testimonial.author}</span>
                        {testimonial.company ? <span>, {testimonial.company}</span> : null}
                      </figcaption>
                    </figure>
                  </Reveal>
                ))}
              </div>
            ) : (
              <Reveal delay={0.05}>
                <div className="mt-10 border border-line bg-card p-8 sm:p-10">
                  <p className="max-w-xl text-lg font-medium tracking-tight">
                    {content["home.testimonials.emptyTitle"]}
                  </p>
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
                    {content["home.testimonials.emptyText"]}
                  </p>
                </div>
              </Reveal>
            )}
          </div>
        </section>
      ) : null}

      {/* FAQ */}
      {isEnabled(content["home.sections.faq"]) ? (
        <section id="faq" className="border-t border-line py-24 lg:py-32">
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
