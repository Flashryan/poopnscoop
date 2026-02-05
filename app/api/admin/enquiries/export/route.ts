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
  });

  const headers = [
    "id",
    "created_at",
    "full_name",
    "postcode",
    "email",
    "phone",
    "plan_type",
    "extra_visits",
    "payment_status",
    "lead_status",
  ];

  const rows = enquiries.map((enquiry) => [
    enquiry.id,
    enquiry.created_at.toISOString(),
    enquiry.full_name,
    enquiry.postcode,
    enquiry.email ?? "",
    enquiry.phone ?? "",
    enquiry.plan_type,
    enquiry.extra_visits.toString(),
    enquiry.payment_status,
    enquiry.lead_status,
  ]);

  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=enquiries.csv",
    },
  });
}
