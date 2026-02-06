import { z } from "zod";

function stripWrappingQuotes(value: string) {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1).trim();
  }
  return trimmed;
}

const turnstileEnvSchema = z.object({
  TURNSTILE_SECRET: z.preprocess(
    (value) => (typeof value === "string" ? stripWrappingQuotes(value) : value),
    z.string().min(1)
  ),
});

type TurnstileEnv = z.infer<typeof turnstileEnvSchema>;

let cachedEnv: TurnstileEnv | null = null;

function getTurnstileEnv() {
  if (cachedEnv) return cachedEnv;
  const parsed = turnstileEnvSchema.safeParse(process.env);
  if (!parsed.success) return null;
  cachedEnv = parsed.data;
  return cachedEnv;
}

export async function verifyTurnstile(token: string, ip?: string) {
  const env = getTurnstileEnv();
  if (!env) {
    return {
      success: false,
      error: "missing-input-secret",
      errorCodes: ["missing-input-secret"],
    } as const;
  }

  let res: Response;
  try {
    res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          secret: env.TURNSTILE_SECRET,
          response: token.trim(),
          ...(ip ? { remoteip: ip } : {}),
        }),
      }
    );
  } catch {
    return { success: false, error: "turnstile_unreachable", errorCodes: null } as const;
  }

  if (!res.ok) {
    return { success: false, error: "turnstile_unreachable", errorCodes: null } as const;
  }

  const data = (await res.json()) as {
    success: boolean;
    "error-codes"?: string[];
  };

  return {
    success: data.success,
    error: data.success ? null : data["error-codes"]?.[0] ?? "turnstile_failed",
    errorCodes: data.success ? null : data["error-codes"] ?? null,
  } as const;
}
