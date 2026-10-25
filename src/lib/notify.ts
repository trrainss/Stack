import "server-only";

import { prisma } from "@/lib/prisma";
import { serverEnv } from "@/lib/env";
import { getSiteContent, isEnabled } from "@/lib/settings";
import { contactMethodLabel, leadStatusLabel, projectTypeLabel } from "@/lib/constants";

type Channel = "telegram" | "email";

function leadMessage(lead: {
  number: number;
  name: string;
  contact: string;
  preferredContactMethod: string;
  projectType: string;
  budget: string | null;
  message: string | null;
  status: string;
  createdAt: Date;
}): string {
  const lines = [
    `Новая заявка №${lead.number}`,
    "",
    `Имя: ${lead.name}`,
    `Контакт: ${lead.contact}`,
    `Способ связи: ${contactMethodLabel(lead.preferredContactMethod)}`,
    `Тип проекта: ${projectTypeLabel(lead.projectType)}`,
    `Бюджет: ${lead.budget ?? "не указан"}`,
    `Статус: ${leadStatusLabel(lead.status)}`,
    `Дата: ${lead.createdAt.toLocaleString("ru-RU", { timeZone: "Europe/Moscow" })}`,
  ];
  if (lead.message) {
    lines.push("", "Задача:", lead.message);
  }
  return lines.join("\n");
}

async function log(
  leadId: string,
  channel: Channel,
  status: "sent" | "failed" | "skipped",
  detail?: string,
): Promise<void> {
  await prisma.notificationLog
    .create({
      data: {
        leadId,
        channel,
        status,
        detail: detail ? detail.slice(0, 500) : null,
      },
    })
    .catch((error) => console.error("[notify] failed to write log", error));
}

async function sendTelegram(text: string): Promise<void> {
  const { token, chatId } = serverEnv.telegram;
  if (!token || !chatId) {
    throw new Error("Telegram credentials are not configured");
  }
  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      disable_web_page_preview: true,
    }),
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) {
    throw new Error(`Telegram API responded with ${response.status}`);
  }
}

async function sendEmail(subject: string, text: string): Promise<void> {
  const { host, port, user, password, from, secure } = serverEnv.email;
  if (!host || !from) {
    throw new Error("Email credentials are not configured");
  }
  const nodemailer = await import("nodemailer");
  const transport = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: user ? { user, pass: password } : undefined,
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 10000,
  });
  await transport.sendMail({
    from,
    to: from,
    subject,
    text,
  });
}

/**
 * Sends notifications for a lead. Never throws: a delivery problem must not
 * lose the order. Every attempt is logged and can be retried from the panel.
 */
export async function sendLeadNotifications(leadId: string): Promise<void> {
  const lead = await prisma.lead.findUnique({ where: { id: leadId } });
  if (!lead) return;

  const content = await getSiteContent();
  const text = leadMessage(lead);
  const subject = `STACKLAB: заявка №${lead.number} - ${lead.name}`;

  const channels: Channel[] = [];

  if (isEnabled(content["notify.telegram.enabled"])) {
    channels.push("telegram");
    try {
      await sendTelegram(text);
      await log(lead.id, "telegram", "sent");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown Telegram error";
      console.error("[notify] telegram failed", message);
      await log(lead.id, "telegram", "failed", message);
    }
  } else {
    await log(lead.id, "telegram", "skipped", "Disabled in settings");
  }

  if (isEnabled(content["notify.email.enabled"])) {
    channels.push("email");
    try {
      await sendEmail(subject, text);
      await log(lead.id, "email", "sent");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown email error";
      console.error("[notify] email failed", message);
      await log(lead.id, "email", "failed", message);
    }
  } else {
    await log(lead.id, "email", "skipped", "Disabled in settings");
  }

  const logs = await prisma.notificationLog.findMany({
    where: { leadId: lead.id },
    orderBy: { createdAt: "desc" },
    take: 4,
  });
  const relevant = logs.filter((entry) => channels.includes(entry.channel as Channel));
  const failed = relevant.some((entry) => entry.status === "failed");
  const sent = relevant.some((entry) => entry.status === "sent");

  const notifyStatus = failed ? (sent ? "partial" : "failed") : sent ? "sent" : "skipped";
  await prisma.lead
    .update({ where: { id: lead.id }, data: { notifyStatus } })
    .catch(() => undefined);
}

export async function retryLeadNotifications(leadId: string): Promise<void> {
  await prisma.lead
    .update({ where: { id: leadId }, data: { notifyStatus: "pending" } })
    .catch(() => undefined);
  await sendLeadNotifications(leadId);
}
