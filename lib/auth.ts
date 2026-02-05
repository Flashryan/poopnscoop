import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { db } from "@/lib/db";
import {
  getAdminSessionCookieName,
  getAdminCsrfCookieName,
  signAdminCsrfToken,
} from "@/lib/cookies";

const SESSION_TTL_DAYS = 7;

export async function createAdminSession(adminUserId: string) {
  const sessionToken = randomUUID();
  const csrfToken = randomUUID();
  const expiresAt = new Date(
    Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000
  );

  const session = await db.adminSession.create({
    data: {
      session_token: sessionToken,
      csrf_token: csrfToken,
      expires_at: expiresAt,
      admin_user_id: adminUserId,
    },
  });

  return session;
}

export function setAdminSessionCookies(
  response: NextResponse,
  sessionToken: string,
  csrfToken: string
) {
  response.cookies.set({
    name: getAdminSessionCookieName(),
    value: sessionToken,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_DAYS * 24 * 60 * 60,
  });
  response.cookies.set({
    name: getAdminCsrfCookieName(),
    value: signAdminCsrfToken(csrfToken),
    httpOnly: false,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_DAYS * 24 * 60 * 60,
  });
}

export function clearAdminSessionCookies(response: NextResponse) {
  response.cookies.set({
    name: getAdminSessionCookieName(),
    value: "",
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  response.cookies.set({
    name: getAdminCsrfCookieName(),
    value: "",
    httpOnly: false,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export async function getAdminSession(request: NextRequest) {
  const token = request.cookies.get(getAdminSessionCookieName())?.value;
  if (!token) return null;
  const session = await db.adminSession.findUnique({
    where: { session_token: token },
    include: { admin_user: true },
  });
  if (!session) return null;
  if (session.expires_at < new Date()) {
    await db.adminSession.delete({ where: { session_token: token } });
    return null;
  }
  return session;
}

export async function getAdminSessionFromCookies() {
  const token = cookies().get(getAdminSessionCookieName())?.value;
  if (!token) return null;
  const session = await db.adminSession.findUnique({
    where: { session_token: token },
    include: { admin_user: true },
  });
  if (!session) return null;
  if (session.expires_at < new Date()) {
    await db.adminSession.delete({ where: { session_token: token } });
    return null;
  }
  return session;
}
