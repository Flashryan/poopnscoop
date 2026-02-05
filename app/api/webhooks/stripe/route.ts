import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { getEnv } from "@/lib/env";
import { getStripe } from "@/lib/stripe";
import { sendEmail } from "@/lib/email";
import {
  businessNotificationEmail,
  customerPaymentConfirmedEmail,
} from "@/lib/email/templates";

export async function POST(request: NextRequest) {
  const env = getEnv();
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "missing_signature" }, { status: 400 });
  }

  const rawBody = await request.text();
  const stripe = getStripe();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return NextResponse.json({ error: "invalid_signature" }, { status: 400 });
  }

  const existing = await db.stripeEvent.findUnique({
    where: { event_id: event.id },
  });
  if (existing) {
    return NextResponse.json({ received: true });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const orConditions: { stripe_checkout_session_id?: string; id?: string }[] = [
          { stripe_checkout_session_id: session.id },
        ];
        if (session.metadata?.enquiry_id) {
          orConditions.push({ id: session.metadata.enquiry_id });
        }
        const enquiry = await db.enquiry.findFirst({
          where: {
            OR: orConditions,
          },
        });
        if (enquiry) {
          const updateData: Record<string, any> = {
            payment_status: "paid",
          };
          if (session.payment_intent) {
            updateData.stripe_payment_intent_id = String(session.payment_intent);
          }
          if (session.subscription) {
            updateData.stripe_subscription_id = String(session.subscription);
          }
          if (session.amount_total) {
            updateData.amount_paid = new Prisma.Decimal(
              (session.amount_total / 100).toFixed(2)
            );
          }

          const updated = await db.enquiry.update({
            where: { id: enquiry.id },
            data: updateData,
          });

          if (updated.email) {
            const template = customerPaymentConfirmedEmail(updated);
            await sendEmail({
              to: updated.email,
              subject: template.subject,
              text: template.text,
              html: template.html,
            });
          }
          const businessTemplate = businessNotificationEmail(updated);
          await sendEmail({
            to: env.BUSINESS_NOTIFY_EMAIL,
            subject: businessTemplate.subject,
            text: businessTemplate.text,
            html: businessTemplate.html,
          });
        }
        break;
      }
      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = invoice.subscription?.toString();
        if (subscriptionId) {
          await db.enquiry.updateMany({
            where: { stripe_subscription_id: subscriptionId },
            data: { payment_status: "paid" },
          });
        }
        break;
      }
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = invoice.subscription?.toString();
        if (subscriptionId) {
          await db.enquiry.updateMany({
            where: { stripe_subscription_id: subscriptionId },
            data: { payment_status: "failed" },
          });
        }
        break;
      }
      case "payment_intent.succeeded": {
        const intent = event.data.object as Stripe.PaymentIntent;
        const enquiryId = intent.metadata?.enquiry_id;
        if (enquiryId) {
          await db.enquiry.updateMany({
            where: { id: enquiryId },
            data: {
              payment_status: "paid",
              stripe_payment_intent_id: intent.id,
            },
          });
        } else {
          await db.enquiry.updateMany({
            where: { stripe_payment_intent_id: intent.id },
            data: { payment_status: "paid" },
          });
        }
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await db.enquiry.updateMany({
          where: { stripe_subscription_id: subscription.id },
          data: { payment_status: "failed" },
        });
        break;
      }
      default:
        break;
    }

    await db.stripeEvent.create({
      data: {
        event_id: event.id,
        event_type: event.type,
      },
    });

    return NextResponse.json({ received: true });
  } catch (err) {
    return NextResponse.json({ error: "webhook_error" }, { status: 500 });
  }
}
