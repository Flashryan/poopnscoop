import { redirect } from "next/navigation";
import AdminLoginForm from "@/components/AdminLoginForm";
import { getAdminSessionFromCookies } from "@/lib/auth";

export default async function AdminLoginPage() {
  const session = await getAdminSessionFromCookies();
  if (session) {
    redirect("/admin/enquiries");
  }

  return (
    <main className="mx-auto max-w-md px-6 py-12">
      <h1 className="section-title">Admin login</h1>
      <p className="mt-2 text-sm text-ink/70">
        Use your admin credentials to access enquiries.
      </p>
      <AdminLoginForm />
    </main>
  );
}
