import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession, clearAdminSessionCookies } from "@/lib/auth";
import { validateCsrf } from "@/lib/csrf";
import { db } from "@/lib/db";

const schema = z
  .object({
    csrf_token: z.string().min(1),
  })
  .strict();

export async function POST(request: NextRequest) {
  const session = await getAdminSession(request);
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: unknown = undefined;
  try {
    body = await request.json();
  } catch {
    body = undefined;
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_request", message: "Invalid request." },
      { status: 400 }
    );
  }

  if (!validateCsrf(request, session.csrf_token, parsed.data)) {
    return NextResponse.json({ error: "csrf_invalid" }, { status: 403 });
  }

  await db.adminSession.delete({
    where: { session_token: session.session_token },
  });
  const response = NextResponse.json({ success: true });
  clearAdminSessionCookies(response);
  return response;
}
