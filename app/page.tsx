import QuoteFlow from "@/components/QuoteFlow";
import { getPublicEnv } from "@/lib/env";

export default function HomePage() {
  const env = getPublicEnv();

  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Poop n Scoop",
    url: env.APP_URL,
    areaServed: {
      "@type": "GeoCircle",
      geoMidpoint: {
        "@type": "GeoCoordinates",
        latitude: env.ANCHOR_LAT,
        longitude: env.ANCHOR_LNG,
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
        name: "How much is dog waste removal?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "One-off visits are £15. Subscriptions are £30/month and include two visits per 30-day cycle.",
        },
      },
      {
        "@type": "Question",
        name: "Do you cover my postcode?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "We cover Wolverhampton within a 10-mile radius. Enter your postcode to check instantly.",
        },
      },
      {
        "@type": "Question",
        name: "What’s included in the subscription?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The subscription includes two visits every 30 days. Extra visits are £15 each.",
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
        latitude: env.ANCHOR_LAT,
        longitude: env.ANCHOR_LNG,
      },
      geoRadius: 16093.4,
    },
    provider: {
      "@type": "LocalBusiness",
      name: "Poop n Scoop",
    },
  };

  return (
    <main className="gradient-hero">
      <section className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-16 md:flex-row md:items-center">
        <div className="max-w-xl">
          <div className="badge">Wolverhampton · 10-mile service radius</div>
          <h1 className="mt-4 font-display text-4xl leading-tight md:text-5xl">
            Fast, tidy dog waste removal with instant pricing.
          </h1>
          <p className="mt-4 text-lg text-ink/70">
            Check coverage, get a quote, and book a visit in minutes. No distance
            leakage — just clear decisions and clear prices.
          </p>
          <div className="mt-6 flex gap-3">
            <a href="#quote" className="button-primary">
              Get my quote
            </a>
            <a href="/pricing" className="button-secondary">
              Pricing details
            </a>
          </div>
        </div>
        <div className="w-full max-w-xl">
          <QuoteFlow
            turnstileSiteKey={env.TURNSTILE_SITEKEY}
            privacyVersion={env.PRIVACY_POLICY_VERSION}
            termsVersion={env.TERMS_VERSION}
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16" id="quote">
        <div className="card p-8">
          <h2 className="section-title">Why locals choose us</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            <div>
              <h3 className="font-display text-lg">Clear coverage</h3>
              <p className="mt-2 text-sm text-ink/70">
                We check postcodes instantly and confirm edge cases quickly.
              </p>
            </div>
            <div>
              <h3 className="font-display text-lg">Transparent pricing</h3>
              <p className="mt-2 text-sm text-ink/70">
                One-off visits are £15. Subscriptions are £30/month with two
                visits included.
              </p>
            </div>
            <div>
              <h3 className="font-display text-lg">Secure payments</h3>
              <p className="mt-2 text-sm text-ink/70">
                Stripe Checkout handles payments securely from day one.
              </p>
            </div>
          </div>
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
