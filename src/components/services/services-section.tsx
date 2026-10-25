import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";

import type { Service } from "@prisma/client";
import { ServicesList } from "@/components/services/services-list";

export function ServicesSection({
  services,
  title,
  subtitle,
  ctaLabel,
}: {
  services: Service[];
  title: string;
  subtitle: string;
  ctaLabel: string;
}) {
  return (
    <section id="services" className="border-t border-line py-20 lg:py-28">
      <div className="container-page grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <h2 className="text-h2">{title}</h2>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted">{subtitle}</p>
          <div className="mt-7 border border-line bg-card p-5">
            <p className="mono-label">Нужна нестандартная функция?</p>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Дополнительные страницы, интеграции и другие услуги можно добавить по договорённости.
              Сначала согласуем задачу, сроки и стоимость — никаких обещаний функциональности без оценки.
            </p>
          </div>
          <a
            href="#final-cta"
            className="mt-8 inline-flex items-center gap-2 border-b border-line pb-1 text-sm text-fg transition-colors duration-300 hover:border-fg"
          >
            <span>Обсудить задачу</span>
            <ArrowUpRight size={14} aria-hidden="true" />
          </a>
        </div>
        <div className="lg:col-span-8">
          <ServicesList services={services} ctaLabel={ctaLabel} />
        </div>
      </div>
    </section>
  );
}
