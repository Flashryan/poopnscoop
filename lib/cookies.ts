import { createHmac, randomUUID } from "crypto";
import { getEnv } from "@/lib/env";

const ANON_COOKIE = "anon_id";
const ADMIN_SESSION_COOKIE = "admin_session";
const ADMIN_CSRF_COOKIE = "admin_csrf";

function signValue(value: string) {
  const env = getEnv();
  const signature = createHmac("sha256", env.SESSION_SECRET)
    .update(value)
    .digest("hex");
  return `${value}.${signature}`;
}

function verifySignedValue(signed: string) {
  const parts = signed.split(".");
  if (parts.length < 2) return null;
  const value = parts.slice(0, -1).join(".");
  const signature = parts[parts.length - 1];
  const expected = signValue(value).split(".").pop();
  if (!expected || expected !== signature) return null;
  return value;
}

export function getAnonId(cookieValue?: string | null) {
  if (!cookieValue) return null;
  return verifySignedValue(cookieValue);
}

export function createAnonId() {
  return signValue(randomUUID());
}

export function getAnonCookieName() {
  return ANON_COOKIE;
}

export function getAdminSessionCookieName() {
  return ADMIN_SESSION_COOKIE;
}

export function getAdminCsrfCookieName() {
  return ADMIN_CSRF_COOKIE;
}

export function verifyAdminCsrfCookie(value?: string | null) {
  if (!value) return null;
  return verifySignedValue(value);
}

export function signAdminCsrfToken(token: string) {
  return signValue(token);
}
