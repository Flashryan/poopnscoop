import { createHmac, randomUUID } from "crypto";

const ANON_COOKIE = "anon_id";
const ADMIN_SESSION_COOKIE = "admin_session";
const ADMIN_CSRF_COOKIE = "admin_csrf";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function getSessionSecretOptional() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 16) return null;
  return secret;
}

function getSessionSecretRequired() {
  const secret = getSessionSecretOptional();
  if (!secret) {
    throw new Error("SESSION_SECRET must be set (minimum 16 characters).");
  }
  return secret;
}

function isUuid(value: string) {
  return UUID_REGEX.test(value);
}

function signatureFor(value: string, secret: string) {
  return createHmac("sha256", secret).update(value).digest("hex");
}

function signValue(value: string, secret: string) {
  return `${value}.${signatureFor(value, secret)}`;
}

function verifySignedValue(signed: string, secret: string) {
  const parts = signed.split(".");
  if (parts.length < 2) return null;
  const value = parts.slice(0, -1).join(".");
  const signature = parts[parts.length - 1];
  const expected = signatureFor(value, secret);
  if (expected !== signature) return null;
  return value;
}

export function getAnonId(cookieValue?: string | null) {
  if (!cookieValue) return null;
  if (cookieValue.length > 256) return null;

  const secret = getSessionSecretOptional();
  if (secret) {
    const verified = verifySignedValue(cookieValue, secret);
    if (!verified || !isUuid(verified)) return null;
    // Return the signed cookie value so rate-limit keys stay stable.
    return cookieValue;
  }

  // No secret configured: accept a raw UUID (or the value part of a signed cookie).
  if (isUuid(cookieValue)) return cookieValue;
  const valuePart = cookieValue.split(".")[0] ?? "";
  if (isUuid(valuePart)) return valuePart;
  return null;
}

export function createAnonId() {
  const raw = randomUUID();
  const secret = getSessionSecretOptional();
  return secret ? signValue(raw, secret) : raw;
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
  const secret = getSessionSecretOptional();
  if (!secret) return null;
  return verifySignedValue(value, secret);
}

export function signAdminCsrfToken(token: string) {
  const secret = getSessionSecretRequired();
  return signValue(token, secret);
}
