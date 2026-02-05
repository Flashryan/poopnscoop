import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "@/app/api/webhooks/stripe/route";

const findUniqueMock = vi.fn();
const createEventMock = vi.fn();
const findFirstMock = vi.fn();
const updateMock = vi.fn();

vi.mock("@/lib/db", () => ({
  db: {
    stripeEvent: {
      findUnique: findUniqueMock,
      create: createEventMock,
    },
    enquiry: {
      findFirst: findFirstMock,
      update: updateMock,
      updateMany: vi.fn(),
    },
  },
}));

vi.mock("@/lib/email", () => ({
  sendEmail: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@/lib/stripe", () => ({
  getStripe: () => ({
    webhooks: {
      constructEvent: () => ({
        id: "evt_1",
        type: "checkout.session.completed",
        data: {
          object: {
            id: "cs_test_123",
            metadata: { enquiry_id: "enq_1" },
            payment_intent: "pi_1",
            amount_total: 1500,
            mode: "payment",
          },
        },
      }),
    },
  }),
}));

function makeRequest() {
  return new NextRequest("http://localhost/api/webhooks/stripe", {
    method: "POST",
    headers: {
      "stripe-signature": "test",
    },
    body: "{}",
  });
}

beforeEach(() => {
  findUniqueMock.mockResolvedValue(null);
  findFirstMock.mockResolvedValue({
    id: "enq_1",
    email: "test@example.com",
    payment_status: "pending_payment",
  });
  updateMock.mockResolvedValue({
    id: "enq_1",
    email: "test@example.com",
    payment_status: "paid",
    full_name: "Test User",
    postcode: "WV1 1AA",
    plan_type: "one_off",
    extra_visits: 0,
    serviceability_decision: "covered",
  });
});

describe("Stripe webhook", () => {
  it("processes checkout.session.completed", async () => {
    const res = await POST(makeRequest());
    expect(res.status).toBe(200);
    expect(createEventMock).toHaveBeenCalled();
    expect(updateMock).toHaveBeenCalled();
  });
});
