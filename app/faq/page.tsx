import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dog Waste Removal FAQ",
  description:
    "Common questions about dog poop pickup and garden cleaning in Wolverhampton. Pricing, service areas, what\u2019s included, and more.",
};

const faqs = [
  // About Our Service
  {
    category: "About Our Service",
    question: "What does your dog waste removal service include?",
    answer:
      "Every visit includes a full garden clear of all dog waste, treatment of affected areas with veterinary-grade disinfectant, a deodorising spray, and removal of all waste from your property. We double-bag everything and take it away with us \u2014 nothing gets left behind.",
  },
  {
    category: "About Our Service",
    question:
      "How is Poop n Scoop different from other dog waste removal services?",
    answer:
      "Most services just pick up the mess and leave. We go further by sanitising every area where waste was found using a veterinary-grade, pet-safe disinfectant. We also deodorise your lawn and sanitise our own equipment between every visit to prevent cross-contamination.",
  },
  {
    category: "About Our Service",
    question: "Do I need to be at home when you visit?",
    answer:
      "No. As long as we can access your garden, you don\u2019t need to be home. Many of our customers are at work during visits. Just let us know how to access your garden when you book and we\u2019ll take care of the rest.",
  },
  {
    category: "About Our Service",
    question: "What happens to the waste after you collect it?",
    answer:
      "All waste is double-bagged on-site and removed from your property. We dispose of it responsibly in line with local waste regulations. Nothing is left in your bins or on your property.",
  },
  {
    category: "About Our Service",
    question: "Do you sanitise the areas where waste was found?",
    answer:
      "Yes. After removing the waste, we spray every affected area with a veterinary-grade disinfectant that kills bacteria, viruses, and parasites. The product is completely safe for pets and children once dry, which typically takes a few minutes.",
  },

  // Pricing & Payment
  {
    category: "Pricing & Payment",
    question: "How much does dog waste removal cost in Wolverhampton?",
    answer:
      "A one-off garden clear costs \u00a315. Our monthly subscription is \u00a330 and includes two visits every 30 days. If you need more frequent visits, extra visits on the subscription are \u00a315 each. Sanitisation and deodorising are included in every visit at no extra cost.",
  },
  {
    category: "Pricing & Payment",
    question: "What payment methods do you accept?",
    answer:
      "We accept three payment methods: cash on the day of service, bank transfer, or secure online card payment through Stripe. You choose your preferred method when you book. There are no extra charges regardless of how you pay.",
  },
  {
    category: "Pricing & Payment",
    question: "Is there a minimum contract for the monthly subscription?",
    answer:
      "No. There is no minimum contract and no cancellation fee. You can cancel your subscription at any time. We believe in earning your business every month, not locking you in.",
  },
  {
    category: "Pricing & Payment",
    question: "Do you charge extra if I have more than one dog?",
    answer:
      "No. Our pricing is per visit, not per dog. Whether you have one dog or five, the price stays the same. We clear the entire garden regardless of how many dogs use it.",
  },

  // Coverage & Booking
  {
    category: "Coverage & Booking",
    question: "What areas do you cover in Wolverhampton?",
    answer:
      "We cover Wolverhampton city centre and surrounding areas within approximately 10 miles, including Tettenhall, Penn, Wednesfield, Bilston, Willenhall, Sedgley, Coseley, Fordhouses, Bushbury, and parts of Dudley, Walsall, and West Bromwich. Use our online postcode checker to confirm coverage instantly.",
  },
  {
    category: "Coverage & Booking",
    question: "How quickly can you come for a one-off visit?",
    answer:
      "We aim to schedule one-off visits within 48 hours of booking, subject to availability. For subscription customers, visits are pre-scheduled on a regular cycle so you always know when to expect us.",
  },
  {
    category: "Coverage & Booking",
    question: "How do I book a dog waste removal visit?",
    answer:
      "Use our online quote tool on the homepage. Enter your postcode, choose your plan, fill in your details, and select how you\u2019d like to pay. The whole process takes less than two minutes. We\u2019ll then be in touch to confirm your first visit.",
  },

  // Health & Safety
  {
    category: "Health & Safety",
    question: "Is dog waste really dangerous?",
    answer:
      "Yes. A single gram of dog waste can contain up to 23 million fecal coliform bacteria, including E. coli and Salmonella. Dog faeces can also carry roundworm and hookworm eggs that survive in soil for years. These parasites are especially dangerous for young children who play on the ground.",
  },
  {
    category: "Health & Safety",
    question: "Is the disinfectant you use safe for pets and children?",
    answer:
      "Absolutely. We use a veterinary-grade disinfectant that is specifically formulated to be safe for animals and children once dry. It is the same type of product used in veterinary surgeries and animal shelters across the UK. Drying typically takes just a few minutes.",
  },
  {
    category: "Health & Safety",
    question:
      "Why shouldn\u2019t I just leave dog waste to decompose naturally?",
    answer:
      "Dog waste does not break down safely like other organic matter. It can take over a year to fully decompose, and during that time it leaches harmful bacteria and parasites into your soil and local waterways. It also attracts rats and flies, kills grass, and creates an unpleasant environment. Regular removal and sanitisation is the safest approach for your family, pets, and garden.",
  },
];

const categories = [...new Set(faqs.map((f) => f.category))];

export default function FaqPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
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
      <h1 className="section-title">
        Frequently Asked Questions About Dog Waste Removal
      </h1>
      <p className="section-subtitle">
        Everything you need to know about our professional dog waste removal and
        garden sanitisation service in Wolverhampton. Can&rsquo;t find your
        answer?{" "}
        <a href="/contact" className="text-[#1a4f3b] underline">
          Get in touch
        </a>
        .
      </p>

      {categories.map((category) => (
        <section key={category} className="mt-12">
          <h2 className="font-display text-2xl text-[#1a4f3b] mb-6">
            {category}
          </h2>
          <div className="space-y-6">
            {faqs
              .filter((f) => f.category === category)
              .map((faq) => (
                <div key={faq.question} className="card p-6">
                  <h3 className="font-display text-lg">{faq.question}</h3>
                  <p className="mt-3 text-[#5c5c5c] leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
          </div>
        </section>
      ))}

      <div className="mt-16 card bg-[#1a4f3b] p-8 text-center text-white">
        <h2 className="font-display text-2xl">Ready to get started?</h2>
        <p className="mt-3 text-white/80">
          Get an instant quote and book your first visit in under two minutes.
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
