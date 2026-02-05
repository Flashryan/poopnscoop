import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getAdminSessionFromCookies } from "@/lib/auth";
import AdminTable from "@/components/AdminTable";
import AdminLogoutButton from "@/components/AdminLogoutButton";

export default async function AdminEnquiriesPage() {
  const session = await getAdminSessionFromCookies();
  if (!session) {
    redirect("/admin/login");
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

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="section-title">Enquiries</h1>
      <p className="mt-2 text-sm text-ink/70">
        Manage lead status and payment visibility.
      </p>
      <div className="mt-4 flex items-center gap-4">
        <a className="button-secondary" href="/api/admin/enquiries/export">
          Export CSV
        </a>
        <AdminLogoutButton csrfToken={session.csrf_token} />
      </div>
      <AdminTable
        enquiries={enquiries.map((enquiry) => ({
          ...enquiry,
          created_at: enquiry.created_at.toISOString(),
        }))}
        csrfToken={session.csrf_token}
      />
    </main>
  );
}
