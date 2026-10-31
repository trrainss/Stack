import type { Metadata } from "next";
import { ArrowUpRight, Lightning, Clock, Sparkle } from "@phosphor-icons/react/dist/ssr";

import { PageIntro } from "@/components/layout/page-intro";
import { LeadButton } from "@/components/lead/lead-dialog";
import { Reveal } from "@/components/ui/reveal";
import { getSiteContent, parsePairs } from "@/lib/settings";
import { splitParagraphs } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  return {
    title: content["seo.aboutTitle"],
    description: content["seo.aboutDescription"],
    alternates: { canonical: "/about" },
    openGraph: {
      title: content["seo.aboutTitle"],
      description: content["seo.aboutDescription"],
      url: "/about",
    },
  };
}

export default async function AboutPage() {
  const content = await getSiteContent();
  const principles = parsePairs(content["about.principles"]);

  return (
    <>
      <PageIntro
        title="О нас"
        subtitle={content["about.intro"]}
        meta="STACKLAB / Веб-разработка"
      />

      <section className="py-16 lg:py-24">
        <div className="container-page grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="mono-label text-[#cbd5e1]">Наш подход</p>
            <div className="mt-6 flex flex-col gap-3">
              <div className="flex items-center gap-2 rounded-xl border border-emerald-500/25 bg-emerald-950/20 px-4 py-2.5 text-xs text-emerald-300">
                <Lightning size={16} weight="fill" className="text-emerald-400" />
                <span>Запуск сайта: до 5 дней</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-line bg-surface px-4 py-2.5 text-xs text-muted">
                <Clock size={16} className="text-sky-400" />
                <span>Ответ за 2 часа в любое время</span>
              </div>
            </div>
          </div>
          <div className="lg:col-span-8">
            <Reveal>
              <p className="max-w-3xl text-[clamp(1.4rem,2.6vw,2.1rem)] font-medium leading-[1.25] tracking-[-0.02em]">
                {content["about.approach"]}
              </p>
            </Reveal>
            <div className="mt-10 grid gap-5">
              {splitParagraphs(content["about.body"]).map((paragraph, index) => (
                <Reveal key={index} delay={index * 0.04}>
                  <p className="max-w-2xl text-base leading-relaxed text-muted">{paragraph}</p>
                </Reveal>
              ))}
            </div>

            <div className="mt-10 flex items-start gap-3.5 rounded-2xl border border-emerald-500/30 bg-emerald-950/25 p-5">
              <Sparkle size={18} weight="fill" className="mt-0.5 shrink-0 text-emerald-400" />
              <div>
                <p className="text-sm font-medium text-emerald-200">
                  Сайт, на котором вы находитесь — наша собственная разработка
                </p>
                <p className="mt-1 text-xs leading-relaxed text-emerald-300/80">
                  Мы создали STACKLAB с нуля: от структуры и визуальной концепции до чистой
                  разработки на современном стеке. Такой же уровень мы обеспечиваем для всех наших
                  клиентов.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-surface py-20 lg:py-28">
        <div className="container-page">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <h2 className="text-h2">Принципы</h2>
            </div>
            <div className="lg:col-span-8">
              <div className="grid gap-x-12 md:grid-cols-2">
                {principles.map((item, index) => (
                  <Reveal key={item.title} delay={(index % 2) * 0.04}>
                    <div className="grid grid-cols-[auto_1fr] gap-5 border-t border-line py-7">
                      <span className="font-mono text-sm tracking-[0.14em] text-emerald-400">
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
          </div>
        </div>
      </section>

      <section className="border-t border-line">
        <div className="container-page py-20 lg:py-28">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <h2 className="max-w-[22ch] text-h2">{content["about.ctaTitle"]}</h2>
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted">
                {content["about.ctaText"]}
              </p>
            </div>
            <div className="lg:col-span-4">
              <LeadButton className="group inline-flex h-12 items-center gap-3 bg-fg px-6 text-sm font-medium text-base transition-[background-color,transform] duration-500 ease-[var(--ease-out-expo)] hover:bg-white active:scale-[0.98]">
                <span>Обсудить проект</span>
                <ArrowUpRight size={16} weight="bold" />
              </LeadButton>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
