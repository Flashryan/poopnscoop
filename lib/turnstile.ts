import { getEnv } from "@/lib/env";

export async function verifyTurnstile(token: string, ip?: string) {
  const env = getEnv();
  const res = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        secret: env.TURNSTILE_SECRET,
        response: token,
        ...(ip ? { remoteip: ip } : {}),
      }),
    }
  );

  if (!res.ok) {
    return { success: false, error: "turnstile_unreachable" } as const;
  }

  const data = (await res.json()) as {
    success: boolean;
    "error-codes"?: string[];
  };

  return {
    success: data.success,
    error: data.success ? null : data["error-codes"]?.[0] ?? "turnstile_failed",
  } as const;
}
