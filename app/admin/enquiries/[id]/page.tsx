import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getAdminSessionFromCookies } from "@/lib/auth";
import AdminStatusForm from "@/components/AdminStatusForm";
import AdminLogoutButton from "@/components/AdminLogoutButton";

export default async function AdminEnquiryDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getAdminSessionFromCookies();
  if (!session) {
    redirect("/admin/login");
  }

  const enquiry = await db.enquiry.findUnique({
    where: { id: params.id },
    include: { audit_logs: { orderBy: { created_at: "desc" } } },
  });

  if (!enquiry) {
    redirect("/admin/enquiries");
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-title">Enquiry detail</h1>
          <p className="mt-2 text-sm text-ink/70">Reference: {enquiry.id}</p>
        </div>
        <AdminLogoutButton csrfToken={session.csrf_token} />
      </div>

      <div className="mt-6 grid gap-6">
        <div className="card p-6">
          <h2 className="font-display text-lg">Customer</h2>
          <div className="mt-3 text-sm text-ink/70 space-y-1">
            <p>Name: {enquiry.full_name}</p>
            <p>House: {enquiry.house_identifier}</p>
            <p>Postcode: {enquiry.postcode}</p>
            <p>Email: {enquiry.email ?? "—"}</p>
            <p>Phone: {enquiry.phone ?? "—"}</p>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="font-display text-lg">Booking</h2>
          <div className="mt-3 text-sm text-ink/70 space-y-1">
            <p>Plan: {enquiry.plan_type}</p>
            <p>Extra visits: {enquiry.extra_visits}</p>
            <p>Payment method: {enquiry.payment_method ?? "—"}</p>
            <p>Payment status: {enquiry.payment_status}</p>
            <p>Decision: {enquiry.serviceability_decision}</p>
          </div>
          <AdminStatusForm
            enquiryId={enquiry.id}
            currentStatus={enquiry.lead_status}
            csrfToken={session.csrf_token}
          />
        </div>

        <div className="card p-6">
          <h2 className="font-display text-lg">Audit log</h2>
          <div className="mt-3 space-y-2 text-sm text-ink/70">
            {enquiry.audit_logs.length === 0 ? (
              <p>No changes recorded yet.</p>
            ) : (
              enquiry.audit_logs.map((log) => (
                <div key={log.id} className="border-b border-fog pb-2">
                  <p>{log.action}</p>
                  <p className="text-xs text-ink/50">
                    {log.created_at.toISOString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
