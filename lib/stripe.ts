import Stripe from "stripe";
import { getEnv } from "@/lib/env";
import { PlanType } from "@/lib/quote";

let stripeClient: Stripe | null = null;

export function getStripe() {
  if (stripeClient) return stripeClient;
  const env = getEnv();
  stripeClient = new Stripe(env.STRIPE_SECRET_KEY, {
    apiVersion: "2024-04-10",
  });
  return stripeClient;
}

export async function createCheckoutSession(params: {
  enquiryId: string;
  planType: PlanType;
  customerEmail?: string | null;
  extraVisits: number;
}) {
  const env = getEnv();
  const stripe = getStripe();

  const successUrl = `${env.APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${env.APP_URL}/checkout/cancel`;

  if (params.planType === "one_off") {
    return stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price: env.STRIPE_PRICE_ONE_OFF,
          quantity: 1,
        },
      ],
      payment_intent_data: {
        metadata: {
          enquiry_id: params.enquiryId,
          plan_type: params.planType,
        },
      },
      customer_email: params.customerEmail ?? undefined,
      success_url: successUrl,
      cancel_url: cancelUrl,
      client_reference_id: params.enquiryId,
      metadata: {
        enquiry_id: params.enquiryId,
        plan_type: params.planType,
      },
    });
  }

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
    {
      price: env.STRIPE_PRICE_SUBSCRIPTION,
      quantity: 1,
    },
  ];

  if (params.extraVisits > 0) {
    lineItems.push({
      price_data: {
        currency: "gbp",
        product_data: {
          name: "Extra visit",
        },
        unit_amount: 1500,
      },
      quantity: params.extraVisits,
    });
  }

  return stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: lineItems,
    subscription_data: {
      metadata: {
        enquiry_id: params.enquiryId,
        plan_type: params.planType,
      },
    },
    customer_email: params.customerEmail ?? undefined,
    success_url: successUrl,
    cancel_url: cancelUrl,
    client_reference_id: params.enquiryId,
    metadata: {
      enquiry_id: params.enquiryId,
      plan_type: params.planType,
    },
  });
}
