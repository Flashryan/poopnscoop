import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Poop n Scoop is a local Wolverhampton dog waste removal service offering professional garden cleaning with sanitisation included.",
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="section-title">About Poop n Scoop</h1>
      <p className="section-subtitle">
        A local Wolverhampton dog waste removal service built around one simple
        idea: your garden should be clean, safe, and something you actually want
        to use.
      </p>

      {/* Story */}
      <section className="mt-12">
        <h2 className="font-display text-2xl text-[#1a4f3b]">Who We Are</h2>
        <div className="mt-4 text-[#5c5c5c] leading-relaxed space-y-4">
          <p>
            {/* Replace this section with your own background story */}
            Poop n Scoop was started in Wolverhampton to solve a problem every
            dog owner knows too well &mdash; keeping on top of the mess. Whether
            it&rsquo;s a busy schedule, a large garden, or just a job nobody
            wants to do, we take the hassle out of it.
          </p>
          <p>
            We&rsquo;re not a franchise or a national chain. We&rsquo;re a local
            business that knows the area, lives in the community, and takes
            pride in doing the job properly.
          </p>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="mt-16">
        <h2 className="font-display text-2xl text-[#1a4f3b]">
          What Makes Us Different
        </h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="card p-6">
            <h3 className="font-display text-lg text-[#1a4f3b]">
              Sanitisation Included
            </h3>
            <p className="mt-3 text-sm text-[#5c5c5c] leading-relaxed">
              We don&rsquo;t just scoop and leave. Every visit includes
              treatment with a veterinary-grade disinfectant that kills bacteria,
              viruses, and parasites. Plus a deodorising spray to eliminate
              lingering smells.
            </p>
          </div>
          <div className="card p-6">
            <h3 className="font-display text-lg text-[#1a4f3b]">
              Truly Local
            </h3>
            <p className="mt-3 text-sm text-[#5c5c5c] leading-relaxed">
              Based in Wolverhampton, serving the city and surrounding areas
              within 10 miles. We know the area, the postcodes, and the
              community. You&rsquo;re not dealing with a call centre &mdash;
              you&rsquo;re dealing with us directly.
            </p>
          </div>
          <div className="card p-6">
            <h3 className="font-display text-lg text-[#1a4f3b]">
              Flexible Payment
            </h3>
            <p className="mt-3 text-sm text-[#5c5c5c] leading-relaxed">
              Pay the way that suits you &mdash; cash, bank transfer, or secure
              online card payment. No pressure, no upselling, and no hidden
              fees. The price you&rsquo;re quoted is what you pay.
            </p>
          </div>
          <div className="card p-6">
            <h3 className="font-display text-lg text-[#1a4f3b]">
              No Contracts
            </h3>
            <p className="mt-3 text-sm text-[#5c5c5c] leading-relaxed">
              Our monthly subscription can be cancelled any time with no fee. We
              believe in earning your custom every month, not trapping you in a
              commitment. One-off visits are also available with no obligation.
            </p>
          </div>
        </div>
      </section>

      {/* Our Commitment */}
      <section className="mt-16">
        <h2 className="font-display text-2xl text-[#1a4f3b]">
          Our Commitment
        </h2>
        <div className="mt-6 space-y-4 text-[#5c5c5c] leading-relaxed">
          <p>
            Every product we use is pet-safe and child-safe. We sanitise our own
            equipment between every single property to prevent
            cross-contamination. All waste is double-bagged on-site and removed
            from your property entirely.
          </p>
          <p>
            We treat every garden as if it were our own. Consistent quality,
            reliable scheduling, and honest communication &mdash; that&rsquo;s
            what we&rsquo;re about.
          </p>
        </div>
      </section>

      {/* Service Area Link */}
      <section className="mt-16 card p-8">
        <h2 className="font-display text-xl text-[#1a4f3b]">
          Where We Work
        </h2>
        <p className="mt-3 text-[#5c5c5c] leading-relaxed">
          We serve Wolverhampton and surrounding areas across the West Midlands,
          including Tettenhall, Penn, Wednesfield, Bilston, Willenhall, Sedgley,
          and parts of Dudley, Walsall, and West Bromwich. Check our full{" "}
          <a href="/service-area" className="text-[#1a4f3b] underline">
            service area
          </a>{" "}
          for details.
        </p>
      </section>

      {/* CTA */}
      <div className="mt-16 card bg-[#1a4f3b] p-8 text-center text-white">
        <h2 className="font-display text-2xl">
          See if we cover your area
        </h2>
        <p className="mt-3 text-white/80">
          Enter your postcode for an instant quote and coverage check.
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
