"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { ActionState } from "@/lib/action-state";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { retryLeadNotifications } from "@/lib/notify";
import { firstError, leadUpdateSchema } from "@/lib/validation";

export async function updateLeadAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const parsed = leadUpdateSchema.safeParse({
    leadId: formData.get("leadId"),
    status: formData.get("status"),
    internalNotes: formData.get("internalNotes") ?? "",
  });

  if (!parsed.success) {
    return { error: firstError(parsed.error) };
  }

  try {
    await prisma.lead.update({
      where: { id: parsed.data.leadId },
      data: {
        status: parsed.data.status,
        internalNotes: parsed.data.internalNotes ?? null,
      },
    });
  } catch (error) {
    console.error("[admin] failed to update lead", error);
    return { error: "Не удалось сохранить заявку" };
  }

  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${parsed.data.leadId}`);
  revalidatePath("/admin/dashboard");
  return { ok: true, message: "Заявка обновлена" };
}

export async function deleteLeadAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? formData.get("leadId") ?? "");
  if (!id) redirect("/admin/leads");

  await prisma.lead.delete({ where: { id } }).catch((error) => {
    console.error("[admin] failed to delete lead", error);
  });

  revalidatePath("/admin/leads");
  revalidatePath("/admin/dashboard");
  redirect("/admin/leads?deleted=1");
}

export async function retryNotificationsAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("leadId") ?? "");
  if (!id) redirect("/admin/leads");

  await retryLeadNotifications(id);
  revalidatePath(`/admin/leads/${id}`);
  redirect(`/admin/leads/${id}?retried=1`);
}
