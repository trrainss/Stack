import { Reveal } from "@/components/ui/reveal";

export function PageIntro({
  title,
  subtitle,
  meta,
}: {
  title: string;
  subtitle?: string;
  meta?: string;
}) {
  return (
    <section className="pt-32 lg:pt-40">
      <div className="container-page">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <Reveal>
              <h1 className="max-w-[22ch] text-h2 text-fg">{title}</h1>
            </Reveal>
          </div>
          <div className="lg:col-span-4">
            {subtitle ? (
              <Reveal delay={0.06}>
                <p className="max-w-md text-sm leading-relaxed text-muted">{subtitle}</p>
              </Reveal>
            ) : null}
            {meta ? (
              <Reveal delay={0.1}>
                <p className="mono-label mt-5">{meta}</p>
              </Reveal>
            ) : null}
          </div>
        </div>
        <div className="mt-12 h-px w-full bg-line" />
      </div>
    </section>
  );
}
