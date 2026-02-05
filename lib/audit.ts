import { db } from "@/lib/db";

export async function logAudit(params: {
  enquiryId: string;
  adminUserId: string;
  action: string;
  fromValue?: string | null;
  toValue?: string | null;
}) {
  await db.auditLog.create({
    data: {
      enquiry_id: params.enquiryId,
      admin_user_id: params.adminUserId,
      action: params.action,
      from_value: params.fromValue ?? null,
      to_value: params.toValue ?? null,
    },
  });
}
