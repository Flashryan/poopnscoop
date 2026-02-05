import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "@/app/api/enquiry/route";

const createMock = vi.fn();
const updateMock = vi.fn();
const upsertMock = vi.fn();

vi.mock("@/lib/db", () => ({
  db: {
    enquiry: {
      create: createMock,
      update: updateMock,
    },
    customer: {
      upsert: upsertMock,
    },
  },
}));

vi.mock("@/lib/turnstile", () => ({
  verifyTurnstile: vi.fn().mockResolvedValue({ success: true }),
}));

vi.mock("@/lib/serviceability", () => ({
  getServiceability: vi.fn().mockResolvedValue({
    normalizedPostcode: "WV1 1AA",
    distanceMiles: 5,
    decision: "covered",
    covered: true,
    message: "covered",
  }),
}));

vi.mock("@/lib/stripe", () => ({
  createCheckoutSession: vi.fn().mockResolvedValue({
    id: "cs_test_123",
    url: "https://checkout.test/session",
  }),
}));

vi.mock("@/lib/email", () => ({
  sendEmail: vi.fn().mockResolvedValue(undefined),
}));

function makeRequest(body: any) {
  return new NextRequest("http://localhost/api/enquiry", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": "1.2.3.4",
    },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  createMock.mockResolvedValue({
    id: "enq_1",
    full_name: "Test User",
    postcode: "WV1 1AA",
    serviceability_decision: "covered",
    payment_status: "pending_payment",
  });
  updateMock.mockResolvedValue({});
  upsertMock.mockResolvedValue({ id: "cust_1" });
});

describe("POST /api/enquiry", () => {
  it("requires house identifier", async () => {
    const res = await POST(
      makeRequest({
        full_name: "Test User",
        house_identifier: "",
        postcode: "WV1 1AA",
        email: "test@example.com",
        plan_type: "one_off",
        extra_visits: 0,
        consent_gdpr: true,
        consent_terms: true,
        privacy_policy_version: "v1",
        terms_version: "v1",
        turnstile_token: "token",
      })
    );
    expect(res.status).toBe(400);
  });

  it("requires email or phone", async () => {
    const res = await POST(
      makeRequest({
        full_name: "Test User",
        house_identifier: "12",
        postcode: "WV1 1AA",
        plan_type: "one_off",
        extra_visits: 0,
        consent_gdpr: true,
        consent_terms: true,
        privacy_policy_version: "v1",
        terms_version: "v1",
        turnstile_token: "token",
      })
    );
    expect(res.status).toBe(400);
  });

  it("requires consents", async () => {
    const res = await POST(
      makeRequest({
        full_name: "Test User",
        house_identifier: "12",
        postcode: "WV1 1AA",
        email: "test@example.com",
        plan_type: "one_off",
        extra_visits: 0,
        consent_gdpr: false,
        consent_terms: true,
        privacy_policy_version: "v1",
        terms_version: "v1",
        turnstile_token: "token",
      })
    );
    expect(res.status).toBe(400);
  });

  it("accepts valid enquiry and returns checkout", async () => {
    const res = await POST(
      makeRequest({
        full_name: "Test User",
        house_identifier: "12",
        postcode: "WV1 1AA",
        email: "test@example.com",
        plan_type: "one_off",
        extra_visits: 0,
        consent_gdpr: true,
        consent_terms: true,
        privacy_policy_version: "v1",
        terms_version: "v1",
        turnstile_token: "token",
      })
    );
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.checkout_url).toBe("https://checkout.test/session");
  });

  it("rejects unknown fields", async () => {
    const res = await POST(
      makeRequest({
        full_name: "Test User",
        house_identifier: "12",
        postcode: "WV1 1AA",
        email: "test@example.com",
        plan_type: "one_off",
        extra_visits: 0,
        consent_gdpr: true,
        consent_terms: true,
        privacy_policy_version: "v1",
        terms_version: "v1",
        turnstile_token: "token",
        quoted_total_price: 999,
      })
    );
    expect(res.status).toBe(400);
  });
});
