import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Poop n Scoop | Service Area | Wolverhampton",
  description: "We serve Wolverhampton and nearby postcodes within 10 miles.",
};

export default function ServiceAreaPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="section-title">Service Area</h1>
      <p className="mt-3 text-ink/70">
        We cover Wolverhampton and surrounding postcodes within a 10-mile radius.
        Enter your postcode to check coverage instantly.
      </p>
      <div className="mt-8 card p-6">
        <h2 className="font-display text-xl">Coverage buckets</h2>
        <ul className="mt-3 list-disc pl-5 text-sm text-ink/70">
          <li>Covered: you can book and pay online immediately.</li>
          <li>
            Needs review: we will confirm availability and send a payment link.
          </li>
          <li>Not covered: outside our current service radius.</li>
        </ul>
      </div>
    </main>
  );
}
