"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

import type { ActionState } from "@/lib/action-state";
import { requireAdmin } from "@/lib/auth";
import { CONTENT_TAG } from "@/lib/data";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import {
  faqSchema,
  firstError,
  processStepSchema,
  projectSchema,
  serviceSchema,
  testimonialSchema,
} from "@/lib/validation";

function optionalString(formData: FormData, key: string): string | undefined {
  const value = formData.get(key);
  return typeof value === "string" && value.trim().length > 0 ? value : undefined;
}

function checkbox(formData: FormData, key: string): boolean {
  const value = formData.get(key);
  return value === "on" || value === "true";
}

function refreshPublicPages(extraPaths: string[] = []): void {
  revalidateTag(CONTENT_TAG);
  for (const path of ["/", "/projects", "/services", "/about", "/contacts", ...extraPaths]) {
    revalidatePath(path);
  }
}

async function uniqueProjectSlug(base: string, currentId?: string): Promise<string> {
  let slug = base;
  let suffix = 2;
  for (;;) {
    const conflict = await prisma.project.findFirst({
      where: { slug, ...(currentId ? { NOT: { id: currentId } } : {}) },
      select: { id: true },
    });
    if (!conflict) return slug;
    slug = `${base}-${suffix}`;
    suffix += 1;
  }
}

async function uniqueServiceSlug(base: string, currentId?: string): Promise<string> {
  let slug = base;
  let suffix = 2;
  for (;;) {
    const conflict = await prisma.service.findFirst({
      where: { slug, ...(currentId ? { NOT: { id: currentId } } : {}) },
      select: { id: true },
    });
    if (!conflict) return slug;
    slug = `${base}-${suffix}`;
    suffix += 1;
  }
}

/* ------------------------------- PROJECTS -------------------------------- */

export async function saveProjectAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const parsed = projectSchema.safeParse({
    id: optionalString(formData, "id"),
    title: formData.get("title") ?? "",
    slug: optionalString(formData, "slug"),
    category: formData.get("category") ?? "",
    description: formData.get("description") ?? "",
    challenge: formData.get("challenge") ?? "",
    solution: formData.get("solution") ?? "",
    technologies: formData.get("technologies") ?? "",
    coverImage: formData.get("coverImage") ?? "",
    projectUrl: optionalString(formData, "projectUrl"),
    year: formData.get("year") ?? "",
    isConcept: checkbox(formData, "isConcept"),
    published: checkbox(formData, "published"),
    sortOrder: formData.get("sortOrder") ?? 0,
  });

  if (!parsed.success) {
    return { error: firstError(parsed.error), fieldErrors: {} };
  }

  const data = parsed.data;
  const base = slugify(data.slug || data.title) || `project-${Date.now()}`;
  let projectId = data.id;
  let savedSlug = base;

  try {
    const slug = await uniqueProjectSlug(base, data.id);
    savedSlug = slug;
    const payload = {
      title: data.title,
      slug,
      category: data.category,
      description: data.description,
      challenge: data.challenge,
      solution: data.solution,
      technologies: data.technologies ?? "",
      coverImage: data.coverImage || null,
      projectUrl: data.projectUrl ?? null,
      year: data.year || null,
      isConcept: data.isConcept,
      published: data.published,
      sortOrder: data.sortOrder,
    };

    if (projectId) {
      await prisma.project.update({ where: { id: projectId }, data: payload });
    } else {
      const created = await prisma.project.create({ data: payload });
      projectId = created.id;
    }
  } catch (error) {
    console.error("[admin] failed to save project", error);
    return { error: "Не удалось сохранить проект. Проверьте данные и попробуйте снова." };
  }

  refreshPublicPages([`/projects/${savedSlug}`]);
  revalidatePath("/admin/projects");
  redirect(`/admin/projects/${projectId}?saved=1`);
}

export async function deleteProjectAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (id) {
    await prisma.project.delete({ where: { id } }).catch((error) => {
      console.error("[admin] failed to delete project", error);
    });
  }
  refreshPublicPages();
  revalidatePath("/admin/projects");
  redirect("/admin/projects?deleted=1");
}

export async function toggleProjectAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const published = formData.get("published") === "true";
  if (id) {
    await prisma.project.update({ where: { id }, data: { published } }).catch((error) => {
      console.error("[admin] failed to toggle project", error);
    });
  }
  refreshPublicPages();
  revalidatePath("/admin/projects");
}

/* -------------------------------- SERVICES ------------------------------- */

export async function saveServiceAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const parsed = serviceSchema.safeParse({
    id: optionalString(formData, "id"),
    title: formData.get("title") ?? "",
    slug: optionalString(formData, "slug"),
    description: formData.get("description") ?? "",
    features: formData.get("features") ?? "",
    audience: formData.get("audience") ?? "",
    outcome: formData.get("outcome") ?? "",
    priceLabel: formData.get("priceLabel") ?? "",
    published: checkbox(formData, "published"),
    sortOrder: formData.get("sortOrder") ?? 0,
  });

  if (!parsed.success) {
    return { error: firstError(parsed.error) };
  }

  const data = parsed.data;
  const base = slugify(data.slug || data.title) || `service-${Date.now()}`;
  let serviceId = data.id;

  try {
    const slug = await uniqueServiceSlug(base, data.id);
    const payload = {
      title: data.title,
      slug,
      description: data.description,
      features: data.features ?? "",
      audience: data.audience || null,
      outcome: data.outcome || null,
      priceLabel: data.priceLabel || null,
      published: data.published,
      sortOrder: data.sortOrder,
    };

    if (serviceId) {
      await prisma.service.update({ where: { id: serviceId }, data: payload });
    } else {
      const created = await prisma.service.create({ data: payload });
      serviceId = created.id;
    }
  } catch (error) {
    console.error("[admin] failed to save service", error);
    return { error: "Не удалось сохранить услугу" };
  }

  refreshPublicPages();
  revalidatePath("/admin/services");
  redirect(`/admin/services/${serviceId}?saved=1`);
}

export async function deleteServiceAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (id) {
    await prisma.service.delete({ where: { id } }).catch((error) => {
      console.error("[admin] failed to delete service", error);
    });
  }
  refreshPublicPages();
  revalidatePath("/admin/services");
  redirect("/admin/services?deleted=1");
}

export async function toggleServiceAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const published = formData.get("published") === "true";
  if (id) {
    await prisma.service.update({ where: { id }, data: { published } }).catch((error) => {
      console.error("[admin] failed to toggle service", error);
    });
  }
  refreshPublicPages();
  revalidatePath("/admin/services");
}

/* ----------------------------------- FAQ --------------------------------- */

export async function saveFaqAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const parsed = faqSchema.safeParse({
    id: optionalString(formData, "id"),
    question: formData.get("question") ?? "",
    answer: formData.get("answer") ?? "",
    published: checkbox(formData, "published"),
    sortOrder: formData.get("sortOrder") ?? 0,
  });

  if (!parsed.success) {
    return { error: firstError(parsed.error) };
  }

  const data = parsed.data;
  try {
    if (data.id) {
      await prisma.faq.update({
        where: { id: data.id },
        data: {
          question: data.question,
          answer: data.answer,
          published: data.published,
          sortOrder: data.sortOrder,
        },
      });
    } else {
      await prisma.faq.create({
        data: {
          question: data.question,
          answer: data.answer,
          published: data.published,
          sortOrder: data.sortOrder,
        },
      });
    }
  } catch (error) {
    console.error("[admin] failed to save faq", error);
    return { error: "Не удалось сохранить вопрос" };
  }

  refreshPublicPages();
  revalidatePath("/admin/faq");
  return { ok: true, message: "Вопрос сохранён" };
}

export async function deleteFaqAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (id) {
    await prisma.faq.delete({ where: { id } }).catch((error) => {
      console.error("[admin] failed to delete faq", error);
    });
  }
  refreshPublicPages();
  revalidatePath("/admin/faq");
}

/* ------------------------------ TESTIMONIALS ----------------------------- */

export async function saveTestimonialAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const parsed = testimonialSchema.safeParse({
    id: optionalString(formData, "id"),
    author: formData.get("author") ?? "",
    company: formData.get("company") ?? "",
    content: formData.get("content") ?? "",
    published: checkbox(formData, "published"),
    sortOrder: formData.get("sortOrder") ?? 0,
  });

  if (!parsed.success) {
    return { error: firstError(parsed.error) };
  }

  const data = parsed.data;
  try {
    if (data.id) {
      await prisma.testimonial.update({
        where: { id: data.id },
        data: {
          author: data.author,
          company: data.company || null,
          content: data.content,
          published: data.published,
          sortOrder: data.sortOrder,
        },
      });
    } else {
      await prisma.testimonial.create({
        data: {
          author: data.author,
          company: data.company || null,
          content: data.content,
          published: data.published,
          sortOrder: data.sortOrder,
        },
      });
    }
  } catch (error) {
    console.error("[admin] failed to save testimonial", error);
    return { error: "Не удалось сохранить отзыв" };
  }

  refreshPublicPages();
  revalidatePath("/admin/testimonials");
  return { ok: true, message: "Отзыв сохранён" };
}

export async function deleteTestimonialAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (id) {
    await prisma.testimonial.delete({ where: { id } }).catch((error) => {
      console.error("[admin] failed to delete testimonial", error);
    });
  }
  refreshPublicPages();
  revalidatePath("/admin/testimonials");
}

/* ------------------------------- PROCESS --------------------------------- */

export async function saveProcessStepAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const parsed = processStepSchema.safeParse({
    id: optionalString(formData, "id"),
    title: formData.get("title") ?? "",
    description: formData.get("description") ?? "",
    published: checkbox(formData, "published"),
    sortOrder: formData.get("sortOrder") ?? 0,
  });

  if (!parsed.success) {
    return { error: firstError(parsed.error) };
  }

  const data = parsed.data;
  try {
    if (data.id) {
      await prisma.processStep.update({
        where: { id: data.id },
        data: {
          title: data.title,
          description: data.description,
          published: data.published,
          sortOrder: data.sortOrder,
        },
      });
    } else {
      await prisma.processStep.create({
        data: {
          title: data.title,
          description: data.description,
          published: data.published,
          sortOrder: data.sortOrder,
        },
      });
    }
  } catch (error) {
    console.error("[admin] failed to save process step", error);
    return { error: "Не удалось сохранить этап" };
  }

  refreshPublicPages();
  revalidatePath("/admin/process");
  return { ok: true, message: "Этап сохранён" };
}

export async function deleteProcessStepAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (id) {
    await prisma.processStep.delete({ where: { id } }).catch((error) => {
      console.error("[admin] failed to delete process step", error);
    });
  }
  refreshPublicPages();
  revalidatePath("/admin/process");
}
