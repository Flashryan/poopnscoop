import { db } from "@/lib/db";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  const sessionId = searchParams.session_id;

  if (!sessionId) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="section-title">Payment pending</h1>
        <p className="mt-3 text-ink/70">
          We didn’t receive a session reference. If you’ve paid, please contact
          support with your details.
        </p>
      </main>
    );
  }

  const enquiry = await db.enquiry.findUnique({
    where: { stripe_checkout_session_id: sessionId },
  });

  const paid = enquiry?.payment_status === "paid";

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="section-title">
        {paid ? "Payment received" : "Payment pending"}
      </h1>
      {paid ? (
        <div className="mt-4 card p-6">
          <p className="text-ink/70">
            Thanks! Your booking is confirmed. We’ll follow up shortly with next
            steps.
          </p>
          <p className="mt-3 text-sm text-ink/60">
            Reference: {enquiry?.id}
          </p>
        </div>
      ) : (
        <div className="mt-4 card p-6">
          <p className="text-ink/70">
            We haven’t confirmed payment yet. If you’ve just paid, check back in
            a minute. Otherwise, contact us and we’ll help.
          </p>
        </div>
      )}
    </main>
  );
}
