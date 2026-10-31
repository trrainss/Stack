import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createSafePrisma(): PrismaClient {
  try {
    return (
      globalForPrisma.prisma ??
      new PrismaClient({
        log: process.env.NODE_ENV === "production" ? ["error"] : ["error"],
      })
    );
  } catch (e) {
    console.warn("[AI Studio] PrismaClient initialization failed, using safe fallback proxy", e);
    const noOp = {
      findMany: async () => [],
      findFirst: async () => null,
      findUnique: async () => null,
      create: async (d: unknown) => (d as { data?: unknown })?.data ?? {},
      update: async (d: unknown) => (d as { data?: unknown })?.data ?? {},
      delete: async () => ({}),
      count: async () => 0,
      upsert: async (d: unknown) => (d as { create?: unknown })?.create ?? {},
    };
    return new Proxy({} as unknown as PrismaClient, {
      get: () => noOp,
    });
  }
}

export const prisma = createSafePrisma();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
