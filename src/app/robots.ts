import type { MetadataRoute } from "next";

import { serverEnv } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  const base = serverEnv.appUrl;

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/", "/api/"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
