import type { Metadata } from "next";

import { PageIntro } from "@/components/layout/page-intro";
import { getSiteContent } from "@/lib/settings";
import { formatDate } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  return {
    title: content["legal.privacyTitle"],
    description:
      "Какие данные собирает сайт STACKLAB, зачем они нужны и как их удалить. Условия обработки персональных данных.",
    alternates: { canonical: "/privacy" },
    robots: { index: true, follow: true },
  };
}

export default async function PrivacyPage() {
  const content = await getSiteContent();

  return (
    <>
      <PageIntro
        title={content["legal.privacyTitle"]}
        subtitle="Документ описывает, какие данные получает сайт и как они используются."
        meta={`Обновлено ${formatDate(content["legal.privacyUpdated"])}`}
      />

      <section className="py-16 lg:py-24">
        <div className="container-page">
          <div className="max-w-3xl">
            {content["legal.privacyBody"]
              .split("\n")
              .map((line) => line.trim())
              .filter(Boolean)
              .map((line, index) => {
                const isHeading = /^\d+\.\s/.test(line) && line.length < 90;
                return isHeading ? (
                  <h2 key={index} className="mt-10 text-lg font-medium tracking-tight first:mt-0">
                    {line}
                  </h2>
                ) : (
                  <p key={index} className="mt-4 text-sm leading-relaxed text-muted">
                    {line}
                  </p>
                );
              })}
          </div>
        </div>
      </section>
    </>
  );
}
