import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

const CRON_SECRET = process.env.CRON_SECRET;

export async function GET(request: NextRequest) {
  const secret = request.headers.get("x-cron-secret");
  if (!CRON_SECRET || secret !== CRON_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const twelveMonthsAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);

  const deleteResult = await db.enquiry.deleteMany({
    where: {
      lead_status: { not: "Converted" },
      created_at: { lt: thirtyDaysAgo },
    },
  });

  const anonymizeResult = await db.enquiry.updateMany({
    where: {
      lead_status: "Converted",
      created_at: { lt: twelveMonthsAgo },
    },
    data: {
      full_name: "ANONYMIZED",
      house_identifier: "ANONYMIZED",
      postcode: "REDACTED",
      email: null,
      phone: null,
      notes: null,
      ip_hash: null,
      user_agent: null,
    },
  });

  return NextResponse.json({
    deleted: deleteResult.count,
    anonymized: anonymizeResult.count,
  });
}
