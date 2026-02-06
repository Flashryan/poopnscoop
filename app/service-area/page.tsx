import { Metadata } from "next";

const APP_URL = process.env.APP_URL || "https://poopnscoop.co.uk";
const ANCHOR_LAT = parseFloat(process.env.ANCHOR_LAT || "52.5862");
const ANCHOR_LNG = parseFloat(process.env.ANCHOR_LNG || "-2.1279");

export const metadata: Metadata = {
  title: "Service Areas \u2014 Wolverhampton",
  description:
    "Poop n Scoop covers Wolverhampton and surrounding areas within 10 miles. Check coverage for WV, DY, WS, and nearby postcodes instantly.",
};

const areas = [
  {
    heading: "Wolverhampton",
    places: [
      "City Centre",
      "Tettenhall",
      "Penn",
      "Finchfield",
      "Compton",
      "Fordhouses",
      "Bushbury",
      "Oxley",
      "Fallings Park",
      "Low Hill",
      "Park Village",
      "Whitmore Reans",
      "Dunstall Hill",
    ],
  },
  {
    heading: "East",
    places: [
      "Wednesfield",
      "Willenhall",
      "Short Heath",
      "New Invention",
      "Ashmore Park",
    ],
  },
  {
    heading: "South",
    places: [
      "Bilston",
      "Ettingshall",
      "Coseley",
      "Sedgley",
      "Gornal",
      "Upper Gornal",
      "Lower Gornal",
    ],
  },
  {
    heading: "Wider West Midlands",
    places: [
      "Parts of Dudley",
      "Parts of Walsall",
      "Parts of West Bromwich",
      "Darlaston",
      "Tipton",
      "Wednesbury",
      "Bloxwich",
      "Pelsall",
    ],
  },
];

const postcodeAreas = [
  { code: "WV1\u2013WV14", label: "Wolverhampton postcodes" },
  { code: "DY1\u2013DY3", label: "Parts of Dudley" },
  { code: "WS1\u2013WS10", label: "Parts of Walsall" },
  { code: "B70\u2013B71", label: "Parts of West Bromwich" },
];

export default function ServiceAreaPage() {
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Dog waste removal",
    url: `${APP_URL}/service-area`,
    areaServed: [
      {
        "@type": "GeoCircle",
        geoMidpoint: {
          "@type": "GeoCoordinates",
          latitude: ANCHOR_LAT,
          longitude: ANCHOR_LNG,
        },
        geoRadius: 16093.4,
      },
      ...areas.flatMap((group) =>
        group.places.map((place) => ({
          "@type": "Place",
          name: `${place}, West Midlands`,
        })),
      ),
    ],
    provider: {
      "@type": "LocalBusiness",
      name: "Poop n Scoop",
    },
  };

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="section-title">
        Dog Waste Removal &mdash; Wolverhampton &amp; Surrounding Areas
      </h1>
      <p className="section-subtitle">
        We provide professional dog waste removal and garden sanitisation across
        Wolverhampton and the wider West Midlands, covering postcodes within
        approximately 10 miles of central Wolverhampton. Enter your postcode on
        our{" "}
        <a href="/#quote" className="text-[#1a4f3b] underline">
          homepage
        </a>{" "}
        to check coverage instantly.
      </p>

      {/* Coverage Tiers */}
      <section className="mt-12">
        <h2 className="font-display text-2xl text-[#1a4f3b]">
          How Coverage Works
        </h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <div className="card p-6">
            <div className="h-10 w-10 rounded-lg bg-[#d4e7c5] flex items-center justify-center text-[#1a4f3b] font-bold mb-4">
              1
            </div>
            <h3 className="font-display text-lg text-[#1a4f3b]">
              Instantly Bookable
            </h3>
            <p className="mt-2 text-sm text-[#5c5c5c] leading-relaxed">
              Within approximately 8 miles of Wolverhampton city centre. You can
              book and pay online straight away, choose to pay by cash or bank
              transfer, and schedule your first visit immediately.
            </p>
          </div>
          <div className="card p-6">
            <div className="h-10 w-10 rounded-lg bg-[#e67e22]/10 flex items-center justify-center text-[#e67e22] font-bold mb-4">
              2
            </div>
            <h3 className="font-display text-lg text-[#1a4f3b]">
              Subject to Confirmation
            </h3>
            <p className="mt-2 text-sm text-[#5c5c5c] leading-relaxed">
              Between 8 and 10 miles out. We&rsquo;ll review your enquiry and
              confirm availability within 24 hours, then send you details on how
              to proceed with payment and scheduling.
            </p>
          </div>
          <div className="card p-6">
            <div className="h-10 w-10 rounded-lg bg-stone-100 flex items-center justify-center text-[#5c5c5c] font-bold mb-4">
              3
            </div>
            <h3 className="font-display text-lg text-[#1a4f3b]">
              Not Currently Covered
            </h3>
            <p className="mt-2 text-sm text-[#5c5c5c] leading-relaxed">
              Beyond 10 miles from Wolverhampton. We&rsquo;re expanding, so if
              you&rsquo;re just outside our range, submit an enquiry anyway
              &mdash; we may be able to accommodate you.
            </p>
          </div>
        </div>
      </section>

      {/* Areas We Serve */}
      <section className="mt-16">
        <h2 className="font-display text-2xl text-[#1a4f3b]">
          Areas We Serve
        </h2>
        <p className="mt-3 text-[#5c5c5c]">
          We regularly visit the following areas. If your area isn&rsquo;t
          listed, use the postcode checker &mdash; we may still cover you.
        </p>
        <div className="mt-8 grid gap-8 md:grid-cols-2">
          {areas.map((group) => (
            <div key={group.heading}>
              <h3 className="font-display text-lg text-[#1a4f3b] mb-3">
                {group.heading}
              </h3>
              <div className="flex flex-wrap gap-2">
                {group.places.map((place) => (
                  <span
                    key={place}
                    className="rounded-full bg-stone-100 px-3 py-1 text-sm text-[#5c5c5c]"
                  >
                    {place}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Postcode Areas */}
      <section className="mt-16">
        <h2 className="font-display text-2xl text-[#1a4f3b]">
          Postcode Areas Covered
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {postcodeAreas.map((area) => (
            <div
              key={area.code}
              className="flex items-center gap-4 rounded-xl bg-stone-50 p-4"
            >
              <span className="font-display text-lg font-semibold text-[#1a4f3b]">
                {area.code}
              </span>
              <span className="text-sm text-[#5c5c5c]">{area.label}</span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-[#5c5c5c]">
          Coverage within these postcode areas depends on exact distance from
          our base. Use the postcode checker for an instant answer.
        </p>
      </section>

      {/* Not in our area */}
      <section className="mt-16 card p-8">
        <h2 className="font-display text-xl text-[#1a4f3b]">
          Not in our area yet?
        </h2>
        <p className="mt-3 text-[#5c5c5c] leading-relaxed">
          We&rsquo;re a growing service and regularly expand our coverage. If
          you&rsquo;re just outside the 10-mile radius, submit an enquiry
          anyway. We review borderline postcodes on a case-by-case basis and may
          be able to accommodate you, especially if there are other customers
          nearby.
        </p>
        <a href="/#quote" className="button-primary mt-6">
          Check Your Postcode
        </a>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
    </main>
  );
}
