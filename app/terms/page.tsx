import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Poop n Scoop | Terms",
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="section-title">Terms &amp; Conditions</h1>
      <p className="mt-3 text-ink/70">Version 1.0</p>
      <div className="mt-6 space-y-4 text-sm text-ink/70">
        <p>
          Bookings are confirmed upon payment. Subscription visits are delivered
          within each 30-day cycle. Extra visits are billed at £15 each.
        </p>
        <p>
          For coverage confirmation or cancellations, contact us at
          hello@poopnscoop.co.uk.
        </p>
      </div>
    </main>
  );
}
