import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Poop n Scoop | Pricing | Wolverhampton",
  description: "Clear, simple pricing for dog waste removal in Wolverhampton.",
};

export default function PricingPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="section-title">Pricing</h1>
      <p className="mt-3 text-ink/70">
        Simple, transparent pricing. No hidden fees.
      </p>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="card p-6">
          <h2 className="font-display text-2xl">One-off visit</h2>
          <p className="mt-2 text-ink/70">Perfect for a quick clean-up.</p>
          <div className="mt-4 text-3xl font-display">£15</div>
          <p className="mt-2 text-sm text-ink/60">One-time payment.</p>
        </div>
        <div className="card p-6">
          <h2 className="font-display text-2xl">Subscription</h2>
          <p className="mt-2 text-ink/70">Two visits every 30 days.</p>
          <div className="mt-4 text-3xl font-display">£30 / month</div>
          <p className="mt-2 text-sm text-ink/60">Extra visits are £15 each.</p>
        </div>
      </div>
    </main>
  );
}
