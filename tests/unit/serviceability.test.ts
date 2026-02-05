import { describe, it, expect } from "vitest";
import { decisionFromMiles, isValidPostcode, normalizePostcode } from "@/lib/serviceability";

describe("serviceability decisions", () => {
  it("marks covered at 8 miles", () => {
    expect(decisionFromMiles(8, 8, 10)).toBe("covered");
  });

  it("marks needs_review between thresholds", () => {
    expect(decisionFromMiles(9, 8, 10)).toBe("needs_review");
  });

  it("marks not_covered beyond radius", () => {
    expect(decisionFromMiles(10.1, 8, 10)).toBe("not_covered");
  });
});

describe("postcode validation", () => {
  it("accepts valid postcode", () => {
    expect(isValidPostcode("SW1A 1AA")).toBe(true);
  });

  it("normalizes postcode", () => {
    expect(normalizePostcode("sw1a1aa")).toBe("SW1A 1AA");
  });

  it("rejects invalid postcode", () => {
    expect(isValidPostcode("INVALID")).toBe(false);
  });
});
