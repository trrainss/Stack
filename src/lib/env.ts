import "server-only";

/**
 * Validated access to environment variables.
 * Secrets never leave the server: this module is imported by server code only.
 */

function readSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (secret && secret.length >= 32) return secret;
  if (process.env.NODE_ENV === "production") {
    throw new Error("AUTH_SECRET is missing or too short (min 32 characters).");
  }
  console.warn("[env] AUTH_SECRET is not set. Using an insecure development fallback.");
  return "development-only-insecure-secret-value-please-replace";
}

export const serverEnv = {
  get authSecret(): string {
    return readSecret();
  },
  get appUrl(): string {
    const raw = process.env.APP_URL?.trim() || "http://localhost:3000";
    return raw.replace(/\/+$/, "");
  },
  get isProduction(): boolean {
    return process.env.NODE_ENV === "production";
  },
  telegram: {
    get token(): string {
      return process.env.TELEGRAM_BOT_TOKEN?.trim() ?? "";
    },
    get chatId(): string {
      return process.env.TELEGRAM_CHAT_ID?.trim() ?? "";
    },
  },
  email: {
    get host(): string {
      return process.env.EMAIL_SERVER_HOST?.trim() ?? "";
    },
    get port(): number {
      const parsed = Number(process.env.EMAIL_SERVER_PORT ?? "587");
      return Number.isFinite(parsed) ? parsed : 587;
    },
    get user(): string {
      return process.env.EMAIL_SERVER_USER?.trim() ?? "";
    },
    get password(): string {
      return process.env.EMAIL_SERVER_PASSWORD ?? "";
    },
    get from(): string {
      return process.env.EMAIL_FROM?.trim() ?? "";
    },
    get secure(): boolean {
      return process.env.EMAIL_SERVER_SECURE === "true";
    },
  },
};
