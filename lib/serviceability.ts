import { getEnv } from "@/lib/env";
import { haversineMiles } from "@/lib/haversine";
import {
  getPostcodeFromCache,
  lookupPostcode,
  savePostcodeToCache,
} from "@/lib/postcodes";

export type ServiceabilityDecision = "covered" | "needs_review" | "not_covered";

const POSTCODE_REGEX =
  /^(GIR ?0AA|[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2})$/i;

export function normalizePostcode(value: string) {
  const compact = value.trim().toUpperCase().replace(/\s+/g, "");
  if (compact.length <= 3) return compact;
  return `${compact.slice(0, -3)} ${compact.slice(-3)}`;
}

export function isValidPostcode(value: string) {
  return POSTCODE_REGEX.test(value.trim().toUpperCase());
}

export function decisionFromMiles(
  distanceMiles: number,
  needsReview: number,
  radius: number
): ServiceabilityDecision {
  if (distanceMiles <= needsReview) return "covered";
  if (distanceMiles <= radius) return "needs_review";
  return "not_covered";
}

export function decisionMessage(decision: ServiceabilityDecision) {
  switch (decision) {
    case "covered":
      return "Great news — we cover your area.";
    case "needs_review":
      return "Covered — we’ll confirm availability shortly.";
    default:
      return "We’re not in your area yet.";
  }
}

export async function getServiceability(postcodeInput: string) {
  const normalized = normalizePostcode(postcodeInput);
  if (!isValidPostcode(normalized)) {
    throw new Error("invalid_postcode");
  }

  const env = getEnv();
  const cached = await getPostcodeFromCache(normalized);
  let coords: { lat: number; lng: number } | null = cached;

  if (!coords) {
    const result = await lookupPostcode(normalized);
    coords = { lat: result.lat, lng: result.lng };
    await savePostcodeToCache(normalized, result.lat, result.lng);
  }

  const distanceMiles = haversineMiles(
    env.ANCHOR_LAT,
    env.ANCHOR_LNG,
    coords.lat,
    coords.lng
  );

  const decision = decisionFromMiles(
    distanceMiles,
    env.NEEDS_REVIEW_THRESHOLD_MILES,
    env.COVERAGE_RADIUS_MILES
  );

  return {
    normalizedPostcode: normalized,
    distanceMiles,
    decision,
    covered: decision === "covered",
    message: decisionMessage(decision),
  };
}
