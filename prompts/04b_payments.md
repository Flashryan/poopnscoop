# Phase 4B — Stripe Checkout + Webhooks (Codex)

Implement mandatory payments:

1) Create Stripe client utilities (server-side only).
2) Update /api/enquiry to:
   - for decision=covered:
     - create Stripe Checkout Session (mode=payment or subscription)
     - attach enquiry_id and plan_type as metadata
     - store stripe_checkout_session_id + payment_status=pending_payment
     - return checkout_url
   - for decision=needs_review:
     - do NOT create checkout; set payment_status=not_applicable; email business/customer

3) Implement /api/webhooks/stripe:
   - verify signature STRIPE_WEBHOOK_SECRET
   - idempotency: store event ids processed
   - handle checkout.session.completed:
     - update enquiry.payment_status=paid
     - store payment_intent or subscription id
     - send confirmation emails

4) Implement /checkout/success and /checkout/cancel pages:
   - success page reads DB by session_id and shows confirmation only if paid

DoD:
- Webhook test simulates checkout.session.completed and updates DB
- No reliance on query params for payment confirmation
- Security review: no secrets leaked, logs are safe
