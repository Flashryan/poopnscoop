import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Poop n Scoop | FAQ | Wolverhampton",
  description: "Answers to common questions about our dog waste removal service.",
};

export default function FaqPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="section-title">FAQ</h1>
      <div className="mt-8 space-y-6">
        <div className="card p-6">
          <h2 className="font-display text-lg">How much is dog waste removal?</h2>
          <p className="mt-2 text-ink/70">
            One-off visits are £15. Subscriptions are £30/month and include two
            visits every 30 days.
          </p>
        </div>
        <div className="card p-6">
          <h2 className="font-display text-lg">Do you cover my postcode?</h2>
          <p className="mt-2 text-ink/70">
            We cover Wolverhampton within a 10-mile radius. Use the quote tool to
            check instantly.
          </p>
        </div>
        <div className="card p-6">
          <h2 className="font-display text-lg">What’s included in the subscription?</h2>
          <p className="mt-2 text-ink/70">
            Two visits per 30-day service cycle are included. Extra visits cost
            £15 each.
          </p>
        </div>
      </div>
    </main>
  );
}
