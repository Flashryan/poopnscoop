import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "@/app/api/enquiry/route";

const { createMock, updateMock, upsertMock } = vi.hoisted(() => ({
  createMock: vi.fn(),
  updateMock: vi.fn(),
  upsertMock: vi.fn(),
}));

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

const validBody = {
  full_name: "Test User",
  house_identifier: "12",
  postcode: "WV1 1AA",
  email: "test@example.com",
  plan_type: "one_off",
  extra_visits: 0,
  payment_method: "online",
  consent_gdpr: true,
  consent_terms: true,
  privacy_policy_version: "v1",
  terms_version: "v1",
  turnstile_token: "token",
};

beforeEach(() => {
  createMock.mockResolvedValue({
    id: "enq_1",
    full_name: "Test User",
    postcode: "WV1 1AA",
    serviceability_decision: "covered",
    payment_status: "pending_payment",
    payment_method: "online",
  });
  updateMock.mockResolvedValue({});
  upsertMock.mockResolvedValue({ id: "cust_1" });
});

describe("POST /api/enquiry", () => {
  it("requires house identifier", async () => {
    const res = await POST(
      makeRequest({ ...validBody, house_identifier: "" }),
    );
    expect(res.status).toBe(400);
  });

  it("requires email or phone", async () => {
    const { email, ...noEmail } = validBody;
    const res = await POST(makeRequest(noEmail));
    expect(res.status).toBe(400);
  });

  it("requires consents", async () => {
    const res = await POST(
      makeRequest({ ...validBody, consent_gdpr: false }),
    );
    expect(res.status).toBe(400);
  });

  it("accepts valid enquiry with online payment and returns checkout", async () => {
    const res = await POST(makeRequest(validBody));
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.checkout_url).toBe("https://checkout.test/session");
  });

  it("rejects unknown fields", async () => {
    const res = await POST(
      makeRequest({ ...validBody, quoted_total_price: 999 }),
    );
    expect(res.status).toBe(400);
  });

  it("accepts cash payment and returns no checkout_url", async () => {
    createMock.mockResolvedValue({
      id: "enq_2",
      full_name: "Cash User",
      postcode: "WV1 1AA",
      serviceability_decision: "covered",
      payment_status: "not_applicable",
      payment_method: "cash",
    });
    const res = await POST(
      makeRequest({ ...validBody, payment_method: "cash" }),
    );
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.checkout_url).toBeNull();
    expect(data.message).toContain("Booking received");
  });

  it("accepts bank_transfer payment and returns no checkout_url", async () => {
    createMock.mockResolvedValue({
      id: "enq_3",
      full_name: "Transfer User",
      postcode: "WV1 1AA",
      serviceability_decision: "covered",
      payment_status: "not_applicable",
      payment_method: "bank_transfer",
    });
    const res = await POST(
      makeRequest({ ...validBody, payment_method: "bank_transfer" }),
    );
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.checkout_url).toBeNull();
    expect(data.message).toContain("bank transfer");
  });

  it("rejects invalid payment_method", async () => {
    const res = await POST(
      makeRequest({ ...validBody, payment_method: "bitcoin" }),
    );
    expect(res.status).toBe(400);
  });

  it("requires payment_method field", async () => {
    const { payment_method, ...noMethod } = validBody;
    const res = await POST(makeRequest(noMethod));
    expect(res.status).toBe(400);
  });
});
