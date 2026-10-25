import type { Metadata } from "next";

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
      <PageIntro title="О студии" subtitle={content["about.intro"]} meta="STACKLAB / digital-студия" />

      <section className="py-16 lg:py-24">
        <div className="container-page grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="mono-label">Подход</p>
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
                Обсудить проект
              </LeadButton>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
