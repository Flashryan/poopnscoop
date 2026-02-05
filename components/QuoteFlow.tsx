"use client";

import { useState } from "react";
import EnquiryForm, { EnquiryPayload } from "@/components/EnquiryForm";
import { PlanType } from "@/lib/quote";

type QuoteResponse = {
  covered: boolean;
  decision: "covered" | "needs_review";
  total_price: number;
  breakdown: { base_price: number; extras_price: number };
  included_visits: number;
  display_copy: { headline: string; extras?: string };
};

type Props = {
  turnstileSiteKey: string;
  privacyVersion: string;
  termsVersion: string;
};

export default function QuoteFlow({
  turnstileSiteKey,
  privacyVersion,
  termsVersion,
}: Props) {
  const [postcode, setPostcode] = useState("");
  const [planType, setPlanType] = useState<PlanType>("one_off");
  const [extraVisits, setExtraVisits] = useState(0);
  const [quote, setQuote] = useState<QuoteResponse | null>(null);
  const [decisionMessage, setDecisionMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingQuote, setLoadingQuote] = useState(false);
  const [loadingEnquiry, setLoadingEnquiry] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  async function fetchQuote() {
    setLoadingQuote(true);
    setError(null);
    setStatusMessage(null);
    setDecisionMessage(null);
    if (!postcode.trim()) {
      setError("Please enter a postcode.");
      setLoadingQuote(false);
      return;
    }
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postcode,
          plan_type: planType,
          extra_visits: planType === "subscription" ? extraVisits : 0,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.message ?? "Unable to fetch quote.");
        setQuote(null);
        return;
      }
      setQuote(data);
      setDecisionMessage(
        data.decision === "needs_review"
          ? "Covered — we’ll confirm availability shortly."
          : "Great news — you’re covered."
      );
    } catch (err) {
      setError("Unable to fetch quote.");
      setQuote(null);
    } finally {
      setLoadingQuote(false);
    }
  }

  async function submitEnquiry(payload: EnquiryPayload) {
    setLoadingEnquiry(true);
    setError(null);
    setStatusMessage(null);
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.message || data?.error || "Unable to submit enquiry.");
        return;
      }
      if (data.checkout_url) {
        window.location.href = data.checkout_url;
        return;
      }
      setStatusMessage(data.message ?? "Thanks! We’ll confirm availability.");
    } catch (err: any) {
      setError(err?.message || "Unable to submit enquiry.");
    } finally {
      setLoadingEnquiry(false);
    }
  }

  return (
    <div className="card p-6">
      <h2 className="font-display text-2xl">Get your instant quote</h2>
      <div className="mt-4 grid gap-4">
        <input
          className="input"
          placeholder="Enter your postcode"
          value={postcode}
          onChange={(event) => setPostcode(event.target.value)}
          required
        />
        <div className="grid gap-3 md:grid-cols-2">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="plan"
              checked={planType === "one_off"}
              onChange={() => {
                setPlanType("one_off");
                setExtraVisits(0);
              }}
            />
            One-off (£15)
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="plan"
              checked={planType === "subscription"}
              onChange={() => setPlanType("subscription")}
            />
            Subscription (£30/month)
          </label>
        </div>
        {planType === "subscription" && (
          <div>
            <label className="text-sm text-ink/70">Extra visits (0-10)</label>
            <input
              className="input mt-2"
              type="number"
              min={0}
              max={10}
              value={extraVisits}
              onChange={(event) =>
                setExtraVisits(
                  Math.min(10, Math.max(0, Number(event.target.value)))
                )
              }
            />
          </div>
        )}
        <button
          className="button-primary"
          type="button"
          onClick={fetchQuote}
          disabled={loadingQuote}
        >
          {loadingQuote ? "Checking..." : "Get quote"}
        </button>
        {decisionMessage && (
          <div className="rounded-xl bg-sky/60 px-4 py-3 text-sm">
            {decisionMessage}
          </div>
        )}
        {quote && (
          <div className="rounded-xl border border-fog bg-white p-4 text-sm">
            <div className="font-display text-lg">£{quote.total_price}</div>
            <div className="text-ink/70">
              Base £{quote.breakdown.base_price} · Extras £{quote.breakdown.extras_price}
            </div>
            <div className="mt-2 text-ink/70">{quote.display_copy.headline}</div>
            {quote.display_copy.extras && (
              <div className="text-ink/70">{quote.display_copy.extras}</div>
            )}
          </div>
        )}
        {error && <div className="text-sm text-red-600">{error}</div>}
        {statusMessage && (
          <div className="rounded-xl bg-grass/10 px-4 py-3 text-sm">
            {statusMessage}
          </div>
        )}
      </div>
      {quote && (
        <EnquiryForm
          postcode={postcode}
          planType={planType}
          extraVisits={planType === "subscription" ? extraVisits : 0}
          turnstileSiteKey={turnstileSiteKey}
          privacyVersion={privacyVersion}
          termsVersion={termsVersion}
          onSubmit={submitEnquiry}
          loading={loadingEnquiry}
        />
      )}
    </div>
  );
}
