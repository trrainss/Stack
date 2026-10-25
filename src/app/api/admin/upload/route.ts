import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { NextResponse } from "next/server";

import { getCurrentAdmin } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_SIZE = 2 * 1024 * 1024;

type ImageType = { ext: "png" | "jpg" | "webp"; mime: string };

function detectImage(buffer: Buffer): ImageType | null {
  if (buffer.length < 12) return null;

  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return { ext: "png", mime: "image/png" };
  }

  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { ext: "jpg", mime: "image/jpeg" };
  }

  if (
    buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
    buffer.subarray(8, 12).toString("ascii") === "WEBP"
  ) {
    return { ext: "webp", mime: "image/webp" };
  }

  return null;
}

export async function POST(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Файл не выбран" }, { status: 400 });
  }
  if (file.size === 0) {
    return NextResponse.json({ error: "Файл пустой" }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "Файл больше 2 МБ" }, { status: 413 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const detected = detectImage(buffer);
  if (!detected) {
    return NextResponse.json(
      { error: "Поддерживаются только PNG, JPEG и WebP. SVG не принимается из соображений безопасности." },
      { status: 415 },
    );
  }

  const filename = `${randomUUID()}.${detected.ext}`;
  const directory = path.join(process.cwd(), "public", "uploads", "projects");

  try {
    await mkdir(directory, { recursive: true });
    await writeFile(path.join(directory, filename), buffer, { mode: 0o644 });
  } catch (error) {
    console.error("[upload] failed to store file", error);
    return NextResponse.json(
      {
        error:
          "Не удалось сохранить файл на сервере. Если проект размещён на serverless-платформе, подключите объектное хранилище и укажите прямую ссылку на изображение.",
      },
      { status: 500 },
    );
  }

  return NextResponse.json({
    url: `/uploads/projects/${filename}`,
    mime: detected.mime,
    size: file.size,
  });
}
