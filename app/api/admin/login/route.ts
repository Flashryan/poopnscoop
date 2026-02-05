import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { createAdminSession, setAdminSessionCookies } from "@/lib/auth";
import { checkLoginRateLimit, recordLoginAttempt, getClientIp } from "@/lib/ratelimit";

const schema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8),
  })
  .strict();

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_request", message: "Invalid credentials." },
      { status: 400 }
    );
  }

  const ip = getClientIp(request) || "unknown";
  const key = `${ip}:${parsed.data.email}`;
  const limit = checkLoginRateLimit(key);
  if (limit.limited) {
    const response = NextResponse.json(
      { error: "rate_limited", message: "Too many attempts." },
      { status: 429 }
    );
    if (limit.retryAfter) {
      response.headers.set("Retry-After", limit.retryAfter.toString());
    }
    return response;
  }

  const admin = await db.adminUser.findUnique({
    where: { email: parsed.data.email },
  });
  if (!admin) {
    recordLoginAttempt(key, false);
    return NextResponse.json(
      { error: "invalid_credentials", message: "Invalid credentials." },
      { status: 401 }
    );
  }

  const valid = await bcrypt.compare(parsed.data.password, admin.password_hash);
  if (!valid) {
    recordLoginAttempt(key, false);
    return NextResponse.json(
      { error: "invalid_credentials", message: "Invalid credentials." },
      { status: 401 }
    );
  }

  recordLoginAttempt(key, true);
  await db.adminUser.update({
    where: { id: admin.id },
    data: { last_login_at: new Date() },
  });

  const session = await createAdminSession(admin.id);
  const response = NextResponse.json({ success: true, csrf_token: session.csrf_token });
  setAdminSessionCookies(response, session.session_token, session.csrf_token);
  return response;
}
