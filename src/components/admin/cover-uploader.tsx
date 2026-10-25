"use client";

import { useRef, useState } from "react";
import { ImageSquare, UploadSimple } from "@phosphor-icons/react";

export function CoverUploader({
  name,
  defaultValue,
}: {
  name: string;
  defaultValue?: string | null;
}) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [status, setStatus] = useState<{ type: "idle" | "uploading" | "error" | "ok"; message?: string }>(
    { type: "idle" },
  );
  const inputRef = useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    setStatus({ type: "uploading" });
    const body = new FormData();
    body.append("file", file);

    try {
      const response = await fetch("/api/admin/upload", { method: "POST", body });
      const payload = (await response.json().catch(() => null)) as
        | { url?: string; error?: string }
        | null;

      if (response.ok && payload?.url) {
        setUrl(payload.url);
        setStatus({ type: "ok", message: "Файл загружен и подставлен в поле обложки" });
      } else {
        setStatus({ type: "error", message: payload?.error ?? "Не удалось загрузить файл" });
      }
    } catch {
      setStatus({ type: "error", message: "Нет связи с сервером" });
    } finally {
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="grid gap-2">
      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#9a9a9a]">
        Обложка проекта
      </span>

      <div className="flex flex-wrap items-start gap-3">
        <div className="h-[72px] w-[96px] shrink-0 overflow-hidden border border-[#2a2a2a] bg-[#0c0c0c]">
          {url ? (
            <img src={url} alt="Предпросмотр обложки" className="h-full w-full object-cover" />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-[#5f5f5f]">
              <ImageSquare size={20} weight="light" aria-hidden="true" />
            </span>
          )}
        </div>

        <div className="grid flex-1 gap-2">
          <input type="hidden" name={name} value={url} />
          <div className="flex flex-wrap items-center gap-2">
            <input
              ref={inputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void upload(file);
              }}
              className="sr-only"
              id={`upload-${name}`}
            />
            <label
              htmlFor={`upload-${name}`}
              className="inline-flex h-9 cursor-pointer items-center gap-2 border border-[#333] px-3 text-[11px] text-fg transition-colors hover:border-white/40"
            >
              <UploadSimple size={13} weight="light" aria-hidden="true" />
              {status.type === "uploading" ? "Загружаем..." : "Загрузить файл"}
            </label>
            <span className="text-[10px] text-[#6f6f6f]">PNG, JPEG или WebP, до 2 МБ</span>
          </div>

          <input
            type="text"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="/projects/aster-cover.svg или https://..."
            aria-label="Путь к обложке"
            className="h-9 w-full border border-[#2a2a2a] bg-[#0d0d0d] px-3 font-mono text-[11px] text-fg outline-none focus:border-white/50"
          />
        </div>
      </div>

      {status.type === "error" ? (
        <p className="text-[10px] leading-relaxed text-[#e09191]" role="alert">
          {status.message}
        </p>
      ) : null}
      {status.type === "ok" ? (
        <p className="text-[10px] leading-relaxed text-[#8fd3a4]" role="status">
          {status.message}
        </p>
      ) : null}
    </div>
  );
}
