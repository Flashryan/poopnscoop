import { NextRequest } from "next/server";
import { getAdminCsrfCookieName, verifyAdminCsrfCookie } from "@/lib/cookies";

export function extractCsrfToken(request: NextRequest, body?: any) {
  const headerToken = request.headers.get("x-csrf-token") ?? undefined;
  const bodyToken = body?.csrf_token as string | undefined;
  return headerToken ?? bodyToken;
}

export function validateCsrf(
  request: NextRequest,
  sessionToken: string,
  body?: any
) {
  const csrfCookie = request.cookies.get(getAdminCsrfCookieName())?.value;
  const cookieToken = verifyAdminCsrfCookie(csrfCookie) ?? undefined;
  const supplied = extractCsrfToken(request, body);
  if (!cookieToken || !supplied) return false;
  return cookieToken === supplied && cookieToken === sessionToken;
}
