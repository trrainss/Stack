import { leadStatusLabel } from "@/lib/constants";
import { cn } from "@/lib/utils";

const TONES: Record<string, string> = {
  new: "bg-[#c9c9c9]",
  review: "bg-[#d8b26a]",
  in_progress: "bg-[#7fb3d5]",
  done: "bg-[#8fd3a4]",
  rejected: "bg-[#c98a8a]",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className="inline-flex items-center gap-2 border border-[#2e2e2e] bg-[#131313] px-2 py-1 text-[11px] text-[#d0d0d0]">
      <span
        aria-hidden="true"
        className={cn("h-1.5 w-1.5 rounded-full", TONES[status] ?? "bg-[#7c7c7c]")}
      />
      {leadStatusLabel(status)}
    </span>
  );
}

export function NotifyBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; tone: string }> = {
    sent: { label: "Отправлено", tone: "text-[#8fd3a4]" },
    pending: { label: "Ожидает", tone: "text-[#b9b9b9]" },
    partial: { label: "Частично", tone: "text-[#d8b26a]" },
    failed: { label: "Ошибка", tone: "text-[#e09191]" },
    skipped: { label: "Отключено", tone: "text-[#7c7c7c]" },
  };
  const item = map[status] ?? { label: status, tone: "text-[#9a9a9a]" };
  return <span className={cn("text-[11px]", item.tone)}>{item.label}</span>;
}

export function PublishedBadge({ published }: { published: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 border px-2 py-1 text-[11px]",
        published
          ? "border-[#2c3a2f] bg-[#111713] text-[#a7c9b0]"
          : "border-[#333] bg-[#131313] text-[#8a8a8a]",
      )}
    >
      <span
        aria-hidden="true"
        className={cn("h-1.5 w-1.5 rounded-full", published ? "bg-[#8fd3a4]" : "bg-[#6f6f6f]")}
      />
      {published ? "Опубликовано" : "Черновик"}
    </span>
  );
}
