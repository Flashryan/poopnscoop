import { NextRequest, NextResponse } from "next/server";
import { getAnonCookieName, getAnonId, createAnonId } from "@/lib/cookies";

type RateLimitResult = {
  limited: boolean;
  retryAfter: number | null;
};

const store = new Map<string, number[]>();

function prune(now: number, windowMs: number, timestamps: number[]) {
  const cutoff = now - windowMs;
  while (timestamps.length && timestamps[0] < cutoff) {
    timestamps.shift();
  }
}

export function checkRateLimit(
  key: string,
  max: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  const timestamps = store.get(key) ?? [];
  prune(now, windowMs, timestamps);
  if (timestamps.length >= max) {
    const retryAfter = Math.ceil((timestamps[0] + windowMs - now) / 1000);
    store.set(key, timestamps);
    return { limited: true, retryAfter };
  }
  timestamps.push(now);
  store.set(key, timestamps);
  return { limited: false, retryAfter: null };
}

export function getClientIp(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0]?.trim() ?? "";
  return request.headers.get("x-real-ip") ?? "";
}

export function rateLimitRequest(request: NextRequest, route: string, max = 20) {
  const ip = getClientIp(request) || "unknown";
  const anonCookie = request.cookies.get(getAnonCookieName())?.value;
  const existingAnon = getAnonId(anonCookie);
  const anonId = existingAnon ?? createAnonId();
  const key = `${route}:${ip}:${anonId}`;
  const result = checkRateLimit(key, max, 60_000);
  return { ...result, anonId, isNewAnon: !anonCookie || !existingAnon };
}

export function applyRateLimitHeaders(
  response: NextResponse,
  retryAfter: number | null
) {
  if (retryAfter !== null) {
    response.headers.set("Retry-After", retryAfter.toString());
  }
}

export function setAnonCookie(response: NextResponse, anonId: string) {
  response.cookies.set({
    name: getAnonCookieName(),
    value: anonId,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
}

const loginStore = new Map<string, { attempts: number; blockedUntil: number }>();

export function checkLoginRateLimit(key: string) {
  const now = Date.now();
  const current = loginStore.get(key) ?? { attempts: 0, blockedUntil: 0 };
  if (current.blockedUntil > now) {
    return {
      limited: true,
      retryAfter: Math.ceil((current.blockedUntil - now) / 1000),
    };
  }

  if (current.attempts >= 5) {
    const blockMs = 15 * 60 * 1000;
    const blockedUntil = now + blockMs;
    loginStore.set(key, { attempts: current.attempts, blockedUntil });
    return { limited: true, retryAfter: Math.ceil(blockMs / 1000) };
  }

  return { limited: false, retryAfter: null };
}

export function recordLoginAttempt(key: string, success: boolean) {
  const current = loginStore.get(key) ?? { attempts: 0, blockedUntil: 0 };
  if (success) {
    loginStore.set(key, { attempts: 0, blockedUntil: 0 });
    return;
  }
  loginStore.set(key, { attempts: current.attempts + 1, blockedUntil: 0 });
}
