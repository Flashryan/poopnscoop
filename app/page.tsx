import { Metadata } from "next";
import QuoteFlow from "@/components/QuoteFlow";

export const metadata: Metadata = {
  title: "Dog Waste Removal Wolverhampton | Poop n Scoop",
  description:
    "Professional dog waste removal and garden sanitisation in Wolverhampton. One-off visits from \u00a315, monthly plans from \u00a330. Sanitisation included. Book online in 2 minutes.",
};

// Use process.env directly to avoid validation timeout during static build
const APP_URL = process.env.APP_URL || "https://poopnscoop.co.uk";
const ANCHOR_LAT = parseFloat(process.env.ANCHOR_LAT || "52.5862");
const ANCHOR_LNG = parseFloat(process.env.ANCHOR_LNG || "-2.1279");
const TURNSTILE_SITEKEY = process.env.TURNSTILE_SITEKEY || "";
const PRIVACY_POLICY_VERSION = process.env.PRIVACY_POLICY_VERSION || "1.0";
const TERMS_VERSION = process.env.TERMS_VERSION || "1.0";

export default function HomePage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Poop n Scoop",
    url: APP_URL,
    areaServed: {
      "@type": "GeoCircle",
      geoMidpoint: {
        "@type": "GeoCoordinates",
        latitude: ANCHOR_LAT,
        longitude: ANCHOR_LNG,
      },
      geoRadius: 16093.4, // 10 miles in meters
    },
    makesOffer: [
      {
        "@type": "Offer",
        price: "15",
        priceCurrency: "GBP",
        name: "One-off visit",
      },
      {
        "@type": "Offer",
        price: "30",
        priceCurrency: "GBP",
        name: "Subscription (monthly, includes 2 visits)",
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How much does dog waste removal cost in Wolverhampton?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A one-off garden clear costs \u00a315. Our monthly subscription is \u00a330 and includes two visits every 30 days. Extra visits are \u00a315 each. Sanitisation and deodorising are included at no extra cost.",
        },
      },
      {
        "@type": "Question",
        name: "Do you cover my postcode?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "We cover Wolverhampton and surrounding areas within a 10-mile radius, including Tettenhall, Penn, Wednesfield, Bilston, Willenhall, Sedgley, and parts of Dudley, Walsall, and West Bromwich. Enter your postcode to check instantly.",
        },
      },
      {
        "@type": "Question",
        name: "What\u2019s included in a dog waste removal visit?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Every visit includes a full garden clear of all dog waste, treatment with veterinary-grade disinfectant, deodorising spray, and removal of all waste from your property. We double-bag everything and take it away.",
        },
      },
      {
        "@type": "Question",
        name: "What payment methods do you accept?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "We accept cash, bank transfer, and secure online card payment via Stripe. You choose your preferred payment method when you book.",
        },
      },
      {
        "@type": "Question",
        name: "Do I need to be home for the visit?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. As long as we can access your garden, you don\u2019t need to be home. Many of our customers are at work during visits.",
        },
      },
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Dog waste removal",
    areaServed: {
      "@type": "GeoCircle",
      geoMidpoint: {
        "@type": "GeoCoordinates",
        latitude: ANCHOR_LAT,
        longitude: ANCHOR_LNG,
      },
      geoRadius: 16093.4,
    },
    provider: {
      "@type": "LocalBusiness",
      name: "Poop n Scoop",
    },
  };

  return (
    <main>
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        <div className="absolute inset-0 -z-10 gradient-hero" />
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col gap-12 md:flex-row md:items-center">
            <div className="flex-1 max-w-2xl">
              <div className="badge mb-6">
                <span className="h-1.5 w-1.5 rounded-full bg-[#1a4f3b] animate-pulse" />
                Serving Wolverhampton & Surrounding Areas
              </div>
              <h1 className="font-display text-5xl font-bold leading-[1.1] tracking-tight text-[#1a4f3b] md:text-6xl lg:text-7xl">
                A cleaner garden.<br />
                <span className="text-[#e67e22]">Safer for everyone.</span>
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-[#5c5c5c] md:text-xl">
                We don’t just scoop poop. We sanitise your lawn, protecting your family and pets from harmful bacteria. Get a quote in seconds.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <a href="#quote" className="button-primary">
                  Get Instant Quote
                </a>
                <a href="#how-it-works" className="button-secondary">
                  How it works
                </a>
              </div>

              <div className="mt-10 flex items-center gap-4 text-sm font-medium text-[#5c5c5c]">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-8 w-8 rounded-full border-2 border-[#f9f8f4] bg-gray-200" />
                  ))}
                </div>
                <div>Trusted by 50+ local families</div>
              </div>
            </div>

            <div className="w-full max-w-md md:w-[400px] shrink-0">
              <QuoteFlow
                turnstileSiteKey={TURNSTILE_SITEKEY}
                privacyVersion={PRIVACY_POLICY_VERSION}
                termsVersion={TERMS_VERSION}
              />
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM SECTION */}
      <section className="section-wrapper bg-white" id="how-it-works">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="section-title">It’s not just mess. It’s health.</h2>
          <p className="section-subtitle">
            Dog waste isn&rsquo;t fertilizer. It carries millions of harmful bacteria that can linger in your soil for years.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="card p-8 group hover:border-[#1a4f3b]/30">
            <div className="h-12 w-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center mb-6 text-2xl">
              🦠
            </div>
            <h3 className="font-display text-xl font-semibold text-[#1a4f3b]">Harmful Bacteria</h3>
            <p className="mt-3 text-[#5c5c5c] leading-relaxed">
              One gram of dog waste can contain 23 million fecal coliform bacteria, including E. coli and Salmonella.
            </p>
          </div>
          <div className="card p-8 group hover:border-[#1a4f3b]/30">
            <div className="h-12 w-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mb-6 text-2xl">
              🪱
            </div>
            <h3 className="font-display text-xl font-semibold text-[#1a4f3b]">Parasites</h3>
            <p className="mt-3 text-[#5c5c5c] leading-relaxed">
              Roundworm and Hookworm eggs can live in the soil for years, posing a risk to children and other pets.
            </p>
          </div>
          <div className="card p-8 group hover:border-[#1a4f3b]/30">
            <div className="h-12 w-12 rounded-xl bg-yellow-100 text-yellow-600 flex items-center justify-center mb-6 text-2xl">
              🐀
            </div>
            <h3 className="font-display text-xl font-semibold text-[#1a4f3b]">Pest Attraction</h3>
            <p className="mt-3 text-[#5c5c5c] leading-relaxed">
              Leftover waste attracts rats and flies, turning your garden into a breeding ground for pests.
            </p>
          </div>
        </div>
      </section>

      {/* SOLUTION / SANITISATION SECTION */}
      <section className="bg-[#1a4f3b] py-24 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <div>
              <div className="inline-flex rounded-full bg-[#d4e7c5]/20 px-4 py-1.5 text-sm font-medium text-[#d4e7c5] mb-6 border border-[#d4e7c5]/30">
                The Poop n Scoop Standard
              </div>
              <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-6">
                We don’t just scoop.<br />
                We sanitise.
              </h2>
              <p className="text-lg text-white/80 leading-relaxed mb-8 max-w-lg">
                Most services just pick up the waste. We go a step further by treating the area with veterinary-grade disinfectant to kill bacteria and viruses.
              </p>

              <ul className="space-y-4">
                {[
                  "Veterinary-grade, pet-safe disinfectant",
                  "Deodorising treatment included free",
                  "Equipment sanitised between every visit",
                  "Double-bagged and removed from your property"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="h-6 w-6 rounded-full bg-[#d4e7c5] flex items-center justify-center text-[#1a4f3b]">
                      ✓
                    </div>
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl bg-white/10 border border-white/20 p-8 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">✨</div>
                  <p className="font-display text-xl">Your lawn, renewed.</p>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-[#d4e7c5] blur-2xl opacity-20" />
              <div className="absolute -top-6 -left-6 h-32 w-32 rounded-full bg-[#e67e22] blur-3xl opacity-20" />
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section-wrapper bg-white">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">Three simple steps to a cleaner, safer garden.</p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {[
            { step: "1", title: "Get a Quote", text: "Enter your postcode and choose your plan. We\u2019ll confirm coverage and pricing instantly \u2014 it takes less than a minute." },
            { step: "2", title: "We Visit & Scoop", text: "We come to your garden and clear every piece of dog waste. You don\u2019t need to be home \u2014 just ensure we can access the garden." },
            { step: "3", title: "We Sanitise", text: "We treat affected areas with veterinary-grade disinfectant, apply a deodorising spray, then double-bag and remove all waste from your property." },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#1a4f3b] text-xl font-bold text-white">
                {item.step}
              </div>
              <h3 className="font-display text-xl font-semibold text-[#1a4f3b]">{item.title}</h3>
              <p className="mt-3 text-[#5c5c5c] leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* BENEFIT / CONVENIENCE SECTION */}
      <section className="section-wrapper bg-[#f9f8f4]" id="quote">
        <div className="card bg-white p-12 md:p-16 text-center">
          <h2 className="section-title mb-6">Reclaim your garden</h2>
          <p className="section-subtitle mx-auto mb-10">
            No more arguments about whose turn it is. No more dodging landmines. Just a clean, safe space for you, your kids, and your pets to enjoy.
          </p>
          <div className="grid gap-6 md:grid-cols-3 text-left">
            <div className="p-4 rounded-xl bg-stone-50">
              <div className="font-display text-lg font-bold text-[#1a4f3b] mb-2">Safe Play</div>
              <p className="text-sm text-[#5c5c5c]">Let the kids run free without worrying about what they might step in (or fall in!).</p>
            </div>
            <div className="p-4 rounded-xl bg-stone-50">
              <div className="font-display text-lg font-bold text-[#1a4f3b] mb-2">BBQ Ready</div>
              <p className="text-sm text-[#5c5c5c]">Host friends and family with confidence. No embarrassing smells or sights.</p>
            </div>
            <div className="p-4 rounded-xl bg-stone-50">
              <div className="font-display text-lg font-bold text-[#1a4f3b] mb-2">Lawn Health</div>
              <p className="text-sm text-[#5c5c5c]">Dog waste is acidic and kills grass. Regular removal keeps your lawn lush.</p>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="section-wrapper bg-white">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="section-title">Why Choose Poop n Scoop</h2>
          <p className="section-subtitle">We&rsquo;re not just another dog waste removal service. Here&rsquo;s what sets us apart.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {[
            { title: "Local Wolverhampton Business", text: "We\u2019re based in Wolverhampton and know the area inside out. You\u2019re dealing with us directly, not a faceless franchise." },
            { title: "Sanitisation Included", text: "Every visit includes veterinary-grade disinfectant and deodorising spray at no extra cost. Most services just pick up and leave." },
            { title: "Flexible Payment Options", text: "Pay by cash, bank transfer, or secure online card payment. Choose what works best for you \u2014 no extra charges either way." },
            { title: "No Contracts, No Lock-In", text: "Our monthly subscription can be cancelled any time. One-off visits have zero commitment. We earn your business every visit." },
          ].map((item) => (
            <div key={item.title} className="card p-6">
              <h3 className="font-display text-lg font-semibold text-[#1a4f3b]">{item.title}</h3>
              <p className="mt-3 text-[#5c5c5c] leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* LOCAL AREA */}
      <section className="bg-stone-50 py-12">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <h2 className="font-display text-2xl text-[#1a4f3b]">Serving Wolverhampton &amp; the West Midlands</h2>
          <p className="mt-4 text-[#5c5c5c] leading-relaxed max-w-3xl mx-auto">
            Proudly serving Wolverhampton, Tettenhall, Penn, Wednesfield, Bilston, Willenhall, Sedgley, Coseley, Fordhouses, Bushbury, and surrounding areas across the West Midlands including parts of Dudley, Walsall, and West Bromwich. <a href="/service-area" className="text-[#1a4f3b] underline">View our full service area</a>.
          </p>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </main>
  );
}
