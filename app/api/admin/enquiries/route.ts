import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const session = await getAdminSession(request);
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const enquiries = await db.enquiry.findMany({
    orderBy: { created_at: "desc" },
    select: {
      id: true,
      full_name: true,
      postcode: true,
      plan_type: true,
      payment_status: true,
      lead_status: true,
      created_at: true,
    },
  });

  return NextResponse.json({ enquiries });
}
