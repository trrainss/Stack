import type { MetadataRoute } from "next";

import { prisma } from "@/lib/prisma";
import { serverEnv } from "@/lib/env";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = serverEnv.appUrl;

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/projects`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/services`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/about`, changeFrequency: "yearly", priority: 0.6 },
    { url: `${base}/contacts`, changeFrequency: "yearly", priority: 0.8 },
    { url: `${base}/privacy`, changeFrequency: "yearly", priority: 0.2 },
  ];

  try {
    const projects = await prisma.project.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
      orderBy: { sortOrder: "asc" },
    });

    return [
      ...staticRoutes,
      ...projects.map((project) => ({
        url: `${base}/projects/${project.slug}`,
        lastModified: project.updatedAt,
        changeFrequency: "yearly" as const,
        priority: 0.7,
      })),
    ];
  } catch (error) {
    console.error("[sitemap] failed to read projects", error);
    return staticRoutes;
  }
}
