"use client";

import { useState } from "react";
import TurnstileWidget from "@/components/TurnstileWidget";
import { PlanType } from "@/lib/quote";

export type EnquiryPayload = {
  full_name: string;
  house_identifier: string;
  postcode: string;
  email?: string;
  phone?: string;
  notes?: string;
  plan_type: PlanType;
  extra_visits: number;
  consent_gdpr: boolean;
  consent_terms: boolean;
  privacy_policy_version: string;
  terms_version: string;
  turnstile_token: string;
  honeypot?: string;
};

type Props = {
  postcode: string;
  planType: PlanType;
  extraVisits: number;
  turnstileSiteKey: string;
  privacyVersion: string;
  termsVersion: string;
  onSubmit: (payload: EnquiryPayload) => Promise<void>;
  loading?: boolean;
};

export default function EnquiryForm({
  postcode,
  planType,
  extraVisits,
  turnstileSiteKey,
  privacyVersion,
  termsVersion,
  onSubmit,
  loading,
}: Props) {
  const [fullName, setFullName] = useState("");
  const [houseIdentifier, setHouseIdentifier] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [consentGdpr, setConsentGdpr] = useState(false);
  const [consentTerms, setConsentTerms] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [honeypot, setHoneypot] = useState("");

  const hasContact = Boolean(email.trim() || phone.trim());
  const canSubmit =
    !loading &&
    Boolean(fullName.trim()) &&
    Boolean(houseIdentifier.trim()) &&
    hasContact &&
    Boolean(consentGdpr) &&
    Boolean(consentTerms) &&
    Boolean(turnstileToken);

  return (
    <form
      className="mt-6 grid gap-4"
      onSubmit={async (event) => {
        event.preventDefault();
        await onSubmit({
          full_name: fullName,
          house_identifier: houseIdentifier,
          postcode,
          email: email || undefined,
          phone: phone || undefined,
          notes: notes || undefined,
          plan_type: planType,
          extra_visits: extraVisits,
          consent_gdpr: consentGdpr,
          consent_terms: consentTerms,
          privacy_policy_version: privacyVersion,
          terms_version: termsVersion,
          turnstile_token: turnstileToken,
          honeypot,
        });
      }}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <input className="input" value={postcode} readOnly />
        <input
          className="input"
          value={
            planType === "subscription"
              ? "Subscription"
              : "One-off"
          }
          readOnly
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <input
          className="input"
          placeholder="Full name"
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          required
        />
        <input
          className="input"
          placeholder="House number or name"
          value={houseIdentifier}
          onChange={(event) => setHouseIdentifier(event.target.value)}
          required
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <input
          className="input"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <input
          className="input"
          placeholder="Phone"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
        />
      </div>
      <textarea
        className="input min-h-[100px]"
        placeholder="Notes (optional)"
        value={notes}
        onChange={(event) => setNotes(event.target.value)}
      />
      <input
        className="hidden"
        value={honeypot}
        onChange={(event) => setHoneypot(event.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />
      <div className="grid gap-2 text-sm text-ink/70">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={consentGdpr}
            onChange={(event) => setConsentGdpr(event.target.checked)}
            required
          />
          I agree to the Privacy Policy (v{privacyVersion}).
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={consentTerms}
            onChange={(event) => setConsentTerms(event.target.checked)}
            required
          />
          I agree to the Terms (v{termsVersion}).
        </label>
      </div>
      <TurnstileWidget
        siteKey={turnstileSiteKey}
        onVerify={setTurnstileToken}
      />
      <button className="button-primary" type="submit" disabled={!canSubmit}>
        {loading ? "Submitting..." : "Submit enquiry"}
      </button>
    </form>
  );
}
