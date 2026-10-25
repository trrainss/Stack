import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Space_Grotesk, JetBrains_Mono } from "next/font/google";

import { serverEnv } from "@/lib/env";
import { getSiteContent } from "@/lib/settings";

import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin", "cyrillic"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin", "cyrillic"],
  variable: "--font-space-grotesk",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  variable: "--font-jetbrains",
  display: "swap",
  weight: ["400", "500"],
});

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  const siteName = content["site.name"];

  return {
    metadataBase: new URL(serverEnv.appUrl),
    title: {
      default: content["seo.defaultTitle"],
      template: `%s | ${siteName}`,
    },
    description: content["seo.defaultDescription"],
    applicationName: siteName,
    authors: [{ name: siteName }],
    creator: siteName,
    openGraph: {
      type: "website",
      locale: "ru_RU",
      siteName,
      title: content["seo.defaultTitle"],
      description: content["seo.defaultDescription"],
      url: "/",
    },
    twitter: {
      card: "summary_large_image",
      title: content["seo.defaultTitle"],
      description: content["seo.defaultDescription"],
    },
    icons: {
      icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
      apple: [{ url: "/icon.svg" }],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#080808",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${plusJakarta.variable} ${spaceGrotesk.variable} ${jetbrains.variable}`}>
      <body className="min-h-[100dvh] bg-base text-fg antialiased">{children}</body>
    </html>
  );
}
