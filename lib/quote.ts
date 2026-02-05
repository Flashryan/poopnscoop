export type PlanType = "one_off" | "subscription";

const ONE_OFF_PRICE = 15;
const SUBSCRIPTION_PRICE = 30;
const EXTRA_VISIT_PRICE = 15;
const INCLUDED_VISITS_SUBSCRIPTION = 2;

export function computeQuote(planType: PlanType, extraVisits: number) {
  const base = planType === "one_off" ? ONE_OFF_PRICE : SUBSCRIPTION_PRICE;
  const extras = planType === "subscription" ? extraVisits * EXTRA_VISIT_PRICE : 0;
  const total = base + extras;

  return {
    total,
    base,
    extras,
    includedVisits: planType === "subscription" ? INCLUDED_VISITS_SUBSCRIPTION : 1,
    displayCopy: {
      headline:
        planType === "subscription"
          ? "Two visits included every 30 days."
          : "One-off visit booking.",
      extras:
        planType === "subscription" && extraVisits > 0
          ? `Includes ${extraVisits} extra visit${extraVisits === 1 ? "" : "s"}.`
          : undefined,
    },
  };
}
