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
    <section id="services" className="border-t border-line py-20 sm:py-24 lg:py-28">
      <div className="container-page">
        <div className="mb-10 flex flex-col gap-5 border-b border-line pb-7 md:flex-row md:items-end md:justify-between lg:mb-12">
          <div>
            <p className="mono-label mb-3 text-[#cbd5e1]">Услуги студии</p>
            <h2 className="text-h2">{title}</h2>
          </div>
          <div className="max-w-md">
            <p className="text-sm leading-relaxed text-muted">{subtitle}</p>
            <a href="#final-cta" className="mt-4 inline-flex items-center gap-2 text-sm text-fg transition-colors hover:text-white/70">
              Обсудить задачу <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          </div>
        </div>
        <ServicesList services={services} ctaLabel={ctaLabel} />
      </div>
    </section>
  );
}
