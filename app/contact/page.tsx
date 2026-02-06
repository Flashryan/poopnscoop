import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Poop n Scoop. Questions about dog waste removal in Wolverhampton? Email, call, or use our online quote tool.",
};

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="section-title">Contact Poop n Scoop</h1>
      <p className="section-subtitle">
        Have a question about our dog waste removal service in Wolverhampton?
        We&rsquo;re here to help. Get in touch using any of the methods below.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        <div className="card p-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#d4e7c5] text-2xl">
            &#9993;
          </div>
          <h2 className="font-display text-lg text-[#1a4f3b]">Email</h2>
          <p className="mt-2 text-sm text-[#5c5c5c]">
            For general enquiries. We typically respond within a few hours.
          </p>
          <a
            href="mailto:hello@poopnscoop.co.uk"
            className="mt-3 block text-sm font-medium text-[#1a4f3b]"
          >
            hello@poopnscoop.co.uk
          </a>
        </div>

        <div className="card p-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#d4e7c5] text-2xl">
            &#9742;
          </div>
          <h2 className="font-display text-lg text-[#1a4f3b]">
            Phone / Text
          </h2>
          <p className="mt-2 text-sm text-[#5c5c5c]">
            Call or text for a quick response or urgent enquiries.
          </p>
          <p className="mt-3 text-sm font-medium text-[#1a4f3b]">
            {/* Replace with your actual phone number */}
            Phone number coming soon
          </p>
        </div>

        <div className="card p-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#d4e7c5] text-2xl">
            &#9889;
          </div>
          <h2 className="font-display text-lg text-[#1a4f3b]">
            Instant Quote
          </h2>
          <p className="mt-2 text-sm text-[#5c5c5c]">
            Get a price and book online in under two minutes.
          </p>
          <a
            href="/#quote"
            className="mt-3 block text-sm font-medium text-[#1a4f3b]"
          >
            Get a quote &rarr;
          </a>
        </div>
      </div>

      <section className="mt-16">
        <h2 className="font-display text-2xl text-[#1a4f3b]">
          Before You Get in Touch
        </h2>
        <p className="mt-3 text-[#5c5c5c] leading-relaxed">
          Many common questions are answered on our{" "}
          <a href="/faq" className="text-[#1a4f3b] underline">
            FAQ page
          </a>
          , including details about pricing, what&rsquo;s included in each
          visit, our service area, and payment methods. It&rsquo;s worth a quick
          look before reaching out.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl text-[#1a4f3b]">
          Where We&rsquo;re Based
        </h2>
        <p className="mt-3 text-[#5c5c5c] leading-relaxed">
          Poop n Scoop is based in Wolverhampton, serving the city and
          surrounding areas within a 10-mile radius across the West Midlands.
          See our full{" "}
          <a href="/service-area" className="text-[#1a4f3b] underline">
            service area
          </a>{" "}
          for details on the areas and postcodes we cover.
        </p>
      </section>

      <div className="mt-16 card bg-[#1a4f3b] p-8 text-center text-white">
        <h2 className="font-display text-2xl">
          Ready to book?
        </h2>
        <p className="mt-3 text-white/80">
          Skip the back and forth. Get an instant price and book your visit
          online.
        </p>
        <a
          href="/#quote"
          className="mt-6 inline-flex items-center justify-center rounded-xl bg-white px-6 py-4 text-base font-medium text-[#1a4f3b] transition-all hover:bg-stone-100"
        >
          Get Instant Quote
        </a>
      </div>
    </main>
  );
}
