import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dog Waste Removal Prices",
  description:
    "Clear, affordable pricing for dog waste removal in Wolverhampton. One-off visits \u00a315, monthly subscriptions from \u00a330 with sanitisation included. No hidden fees.",
};

const pricingFaqs = [
  {
    question: "Is there a minimum contract?",
    answer:
      "No. There are no contracts and no cancellation fees. Cancel your subscription any time.",
  },
  {
    question: "Are there any hidden fees?",
    answer:
      "None at all. The price you see includes waste removal, sanitisation, deodorising, and disposal. What you\u2019re quoted is what you pay.",
  },
  {
    question: "What if I have multiple dogs?",
    answer:
      "Our pricing is per visit, not per dog. Whether you have one dog or five, the price is the same.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept cash, bank transfer, and secure online card payment via Stripe. You choose your preferred method when you book.",
  },
];

export default function PricingPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: pricingFaqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="section-title">Dog Waste Removal Pricing</h1>
      <p className="section-subtitle">
        Transparent, straightforward pricing with no hidden fees. Every visit
        includes full waste removal, veterinary-grade sanitisation, and
        deodorising treatment as standard.
      </p>

      {/* Pricing Cards */}
      <div className="mt-10 grid gap-8 md:grid-cols-2">
        <div className="card p-8">
          <h2 className="font-display text-2xl text-[#1a4f3b]">
            One-Off Visit
          </h2>
          <p className="mt-2 text-[#5c5c5c]">
            A single garden clear, ideal for a quick clean-up before guests, a
            party, or getting your lawn back in shape.
          </p>
          <div className="mt-6 text-4xl font-display text-[#1a4f3b]">
            &pound;15
          </div>
          <p className="mt-1 text-sm text-[#5c5c5c]">One-time payment</p>
          <ul className="mt-6 space-y-3 text-sm text-[#5c5c5c]">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-[#1a4f3b]">&#10003;</span>
              Full garden clear of all dog waste
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-[#1a4f3b]">&#10003;</span>
              Veterinary-grade sanitisation spray
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-[#1a4f3b]">&#10003;</span>
              Deodorising treatment included
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-[#1a4f3b]">&#10003;</span>
              All waste double-bagged and removed
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-[#1a4f3b]">&#10003;</span>
              No contract or commitment
            </li>
          </ul>
          <a href="/#quote" className="button-primary mt-8 w-full text-center">
            Get a Quote
          </a>
        </div>

        <div className="card p-8 border-2 border-[#1a4f3b] relative">
          <div className="absolute -top-3 left-6 rounded-full bg-[#e67e22] px-3 py-1 text-xs font-medium text-white">
            Best Value
          </div>
          <h2 className="font-display text-2xl text-[#1a4f3b]">
            Monthly Subscription
          </h2>
          <p className="mt-2 text-[#5c5c5c]">
            Regular visits to keep your garden clean, safe, and ready to enjoy
            all year round.
          </p>
          <div className="mt-6 text-4xl font-display text-[#1a4f3b]">
            &pound;30
            <span className="text-lg text-[#5c5c5c]">/month</span>
          </div>
          <p className="mt-1 text-sm text-[#5c5c5c]">Cancel any time</p>
          <ul className="mt-6 space-y-3 text-sm text-[#5c5c5c]">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-[#1a4f3b]">&#10003;</span>
              Two scheduled visits every 30 days
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-[#1a4f3b]">&#10003;</span>
              Sanitisation and deodorising at every visit
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-[#1a4f3b]">&#10003;</span>
              Priority scheduling
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-[#1a4f3b]">&#10003;</span>
              Extra visits available at &pound;15 each
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-[#1a4f3b]">&#10003;</span>
              No contract &mdash; cancel any time
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-[#1a4f3b]">&#10003;</span>
              All waste removed from your property
            </li>
          </ul>
          <a href="/#quote" className="button-primary mt-8 w-full text-center">
            Get a Quote
          </a>
        </div>
      </div>

      {/* What's Included Section */}
      <section className="mt-20">
        <h2 className="font-display text-3xl text-[#1a4f3b] text-center">
          What&rsquo;s Included in Every Visit
        </h2>
        <p className="mt-4 text-center text-[#5c5c5c] max-w-2xl mx-auto">
          Whether you choose a one-off visit or a subscription, every service
          includes the full Poop n Scoop treatment.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Complete Waste Removal",
              text: "We clear every piece of dog waste from your garden, no matter how much has built up.",
            },
            {
              title: "Sanitisation Spray",
              text: "Affected areas are treated with veterinary-grade disinfectant to kill bacteria, viruses, and parasites.",
            },
            {
              title: "Deodorising Treatment",
              text: "A deodorising spray eliminates lingering smells, leaving your garden smelling fresh.",
            },
            {
              title: "Equipment Cleaned",
              text: "We sanitise all equipment between every visit to prevent any cross-contamination between properties.",
            },
            {
              title: "Double-Bagged Disposal",
              text: "All waste is double-bagged on-site and removed from your property entirely.",
            },
            {
              title: "Pet-Safe Products",
              text: "Every product we use is pet-safe and child-safe. Safe for your garden once dry.",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-xl bg-stone-50 p-6">
              <h3 className="font-display text-lg font-semibold text-[#1a4f3b]">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-[#5c5c5c] leading-relaxed">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing FAQs */}
      <section className="mt-20">
        <h2 className="font-display text-3xl text-[#1a4f3b] text-center">
          Pricing Questions
        </h2>
        <div className="mt-8 space-y-6 max-w-3xl mx-auto">
          {pricingFaqs.map((faq) => (
            <div key={faq.question} className="card p-6">
              <h3 className="font-display text-lg">{faq.question}</h3>
              <p className="mt-3 text-[#5c5c5c] leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="mt-16 card bg-[#1a4f3b] p-8 text-center text-white">
        <h2 className="font-display text-2xl">
          Get your instant quote in seconds
        </h2>
        <p className="mt-3 text-white/80">
          Enter your postcode and we&rsquo;ll confirm coverage and pricing
          straight away.
        </p>
        <a
          href="/#quote"
          className="mt-6 inline-flex items-center justify-center rounded-xl bg-white px-6 py-4 text-base font-medium text-[#1a4f3b] transition-all hover:bg-stone-100"
        >
          Get Instant Quote
        </a>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </main>
  );
}
