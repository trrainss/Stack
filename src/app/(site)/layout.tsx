import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { LeadDialogProvider } from "@/components/lead/lead-dialog";
import { getSiteContent } from "@/lib/settings";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const content = await getSiteContent();

  return (
    <LeadDialogProvider>
      <a href="#main" className="skip-link">
        Перейти к содержимому
      </a>
      <Header ctaLabel={content["home.hero.primaryCta"]} />
      <main id="main" className="min-h-[60dvh]">
        {children}
      </main>
      <Footer content={content} />
    </LeadDialogProvider>
  );
}
