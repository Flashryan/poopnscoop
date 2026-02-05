# Payments (Stripe — mandatory)

## Overview
Payments are taken online from day one using Stripe Checkout.

### One-off
- Stripe Checkout `mode=payment`
- Price: STRIPE_PRICE_ONE_OFF (must represent £15, gbp)

### Subscription
- Stripe Checkout `mode=subscription`
- Price: STRIPE_PRICE_SUBSCRIPTION (must represent £30/month, gbp)

## Creating checkout sessions
- Endpoint: POST /api/enquiry (preferred) returns checkout_url for covered postcodes.
- Stripe Checkout Session must include:
  - customer_email (if available)
  - metadata linking to enquiry_id and plan_type
  - success_url = {APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}
  - cancel_url  = {APP_URL}/checkout/cancel

## Webhooks (authoritative state)
Endpoint: POST /api/webhooks/stripe

### Requirements
- Verify signature using STRIPE_WEBHOOK_SECRET.
- Idempotency:
  - store processed event ids
  - ignore duplicates safely

### Events to handle
- checkout.session.completed
  - mark enquiry.payment_status=paid
  - store stripe_checkout_session_id
  - store stripe_payment_intent_id OR stripe_subscription_id depending on mode
  - send confirmation emails
- invoice.payment_succeeded (subscription renewals)
  - update subscription status (if tracked)
- invoice.payment_failed
  - mark payment_status=failed (and notify)
- customer.subscription.deleted
  - reflect cancelled status (if tracked)

## Success page hardening
- Success page must fetch session status from DB (written by webhook).
- Do not trust query params as proof of payment.

## Refunds and disputes (operational)
- MVP does not automate refunds. Admin handles via Stripe dashboard.
- Store refund events if added later.
