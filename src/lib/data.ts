import "server-only";

import { unstable_cache } from "next/cache";

import { prisma } from "@/lib/prisma";

export const CONTENT_TAG = "stacklab-content";

export const getPublishedProjects = unstable_cache(
  async (limit?: number) => {
    return prisma.project.findMany({
      where: { published: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      ...(limit ? { take: limit } : {}),
    });
  },
  ["published-projects"],
  { tags: [CONTENT_TAG], revalidate: 300 },
);

export const getProjectBySlug = unstable_cache(
  async (slug: string) => {
    return prisma.project.findFirst({ where: { slug, published: true } });
  },
  ["project-by-slug"],
  { tags: [CONTENT_TAG], revalidate: 300 },
);

export const getPublishedServices = unstable_cache(
  async () => {
    return prisma.service.findMany({
      where: { published: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
  },
  ["published-services"],
  { tags: [CONTENT_TAG], revalidate: 300 },
);

export const getPublishedFaqs = unstable_cache(
  async () => {
    return prisma.faq.findMany({
      where: { published: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
  },
  ["published-faqs"],
  { tags: [CONTENT_TAG], revalidate: 300 },
);

export const getPublishedTestimonials = unstable_cache(
  async () => {
    return prisma.testimonial.findMany({
      where: { published: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
  },
  ["published-testimonials"],
  { tags: [CONTENT_TAG], revalidate: 300 },
);

export const getPublishedProcessSteps = unstable_cache(
  async () => {
    return prisma.processStep.findMany({
      where: { published: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
  },
  ["published-process-steps"],
  { tags: [CONTENT_TAG], revalidate: 300 },
);

export const getAllProjects = unstable_cache(
  async () => {
    return prisma.project.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
  },
  ["all-projects"],
  { tags: [CONTENT_TAG], revalidate: 60 },
);

export const getAllServices = unstable_cache(
  async () => {
    return prisma.service.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
  },
  ["all-services"],
  { tags: [CONTENT_TAG], revalidate: 60 },
);

export const getAllFaqs = unstable_cache(
  async () => {
    return prisma.faq.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
  },
  ["all-faqs"],
  { tags: [CONTENT_TAG], revalidate: 60 },
);

export const getAllTestimonials = unstable_cache(
  async () => {
    return prisma.testimonial.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
  },
  ["all-testimonials"],
  { tags: [CONTENT_TAG], revalidate: 60 },
);

export const getAllProcessSteps = unstable_cache(
  async () => {
    return prisma.processStep.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
  },
  ["all-process-steps"],
  { tags: [CONTENT_TAG], revalidate: 60 },
);
