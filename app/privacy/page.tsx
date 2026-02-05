import { Metadata } from "next";
import { getPublicEnv } from "@/lib/env";

export const metadata: Metadata = {
  title: "Poop n Scoop | Privacy Policy",
};

export default function PrivacyPage() {
  const env = getPublicEnv();

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="section-title">Privacy Policy</h1>
      <p className="mt-3 text-ink/70">Version {env.PRIVACY_POLICY_VERSION}</p>
      <div className="mt-6 space-y-4 text-sm text-ink/70">
        <p>
          We collect only the information needed to confirm coverage, provide
          quotes, and fulfil bookings. We never share your information with
          third parties beyond essential service providers (payments, email).
        </p>
        <p>
          You can request data access or deletion by contacting us at
          hello@poopnscoop.co.uk.
        </p>
      </div>
    </main>
  );
}
