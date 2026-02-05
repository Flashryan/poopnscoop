import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";
import { validateCsrf } from "@/lib/csrf";
import { logAudit } from "@/lib/audit";

const patchSchema = z
  .object({
    lead_status: z.enum(["New", "Contacted", "Converted", "Closed"]),
  })
  .strict();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getAdminSession(request);
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const enquiry = await db.enquiry.findUnique({
    where: { id: params.id },
    include: { audit_logs: { orderBy: { created_at: "desc" } } },
  });

  if (!enquiry) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  return NextResponse.json({ enquiry });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getAdminSession(request);
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  if (!validateCsrf(request, session.csrf_token, body)) {
    return NextResponse.json({ error: "csrf_invalid" }, { status: 403 });
  }

  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_request", message: "Invalid status." },
      { status: 400 }
    );
  }

  const enquiry = await db.enquiry.findUnique({
    where: { id: params.id },
  });

  if (!enquiry) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  if (enquiry.lead_status === parsed.data.lead_status) {
    return NextResponse.json({ success: true });
  }

  const updated = await db.enquiry.update({
    where: { id: params.id },
    data: { lead_status: parsed.data.lead_status },
  });

  await logAudit({
    enquiryId: updated.id,
    adminUserId: session.admin_user_id,
    action: "lead_status_updated",
    fromValue: enquiry.lead_status,
    toValue: parsed.data.lead_status,
  });

  return NextResponse.json({ success: true });
}
