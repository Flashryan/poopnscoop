# API Spec (Route Handlers)

## POST /api/serviceability
Request:
- { postcode: string }

Response:
- { covered: boolean, decision: "covered"|"needs_review"|"not_covered", message: string }

Rules:
- Validate postcode.
- Lookup lat/lng via cache then Postcodes.io.
- Compute internal miles.
- Do not return miles.

Errors:
- 400 invalid_postcode
- 503 lookup_failed (message must allow fallback lead capture)

## POST /api/quote
Request:
- { postcode: string, plan_type: "one_off"|"subscription", extra_visits?: number }

Response:
- {
    covered: boolean,
    decision: "covered"|"needs_review",
    total_price: number,
    breakdown: { base_price: number, extras_price: number },
    included_visits: number,
    display_copy: { headline: string, extras?: string }
  }

Rules:
- Recompute serviceability server-side.
- Reject if decision is not_covered.
- Enforce extra_visits 0..10.
- Public response must not include distance.

## POST /api/enquiry
Purpose: creates an enquiry and (if eligible) returns a Stripe Checkout URL.

Request includes:
- full_name, house_identifier, postcode, email?, phone?, notes?
- plan_type, extra_visits
- consent_gdpr, consent_terms, privacy_policy_version, terms_version
- turnstile_token
- honeypot (hidden)

Response (covered):
- { success: true, enquiry_reference: string, checkout_url: string }

Response (needs_review):
- { success: true, enquiry_reference: string, checkout_url: null, message: string }

Rules:
- Verify Turnstile (required).
- Honeypot must be empty.
- Rate limit.
- Recompute serviceability + quote totals; store authoritative values.
- If decision=covered: create Stripe Checkout Session and return URL.
- If decision=needs_review: do not create checkout; notify business + customer.

## POST /api/webhooks/stripe
Purpose: authoritative payment finalisation.

Requirements:
- Verify Stripe webhook signature using STRIPE_WEBHOOK_SECRET.
- Idempotency: repeated events must not create duplicates.

Events to handle:
- checkout.session.completed
- payment_intent.succeeded (one-off)
- invoice.payment_succeeded (subscription)
- invoice.payment_failed (subscription)
- customer.subscription.deleted (subscription cancel)

Updates:
- Link event to enquiry by stripe_checkout_session_id (preferred) or metadata.
- Set enquiry.payment_status accordingly.
- Store stripe ids (payment_intent_id / subscription_id).
- Trigger customer/business emails (if not already).

## GET /checkout/success (page)
- Shows “Payment received” only after verifying via DB (webhook-written state).
- Avoid trusting query params alone.

## GET /checkout/cancel (page)
- Shows “Payment cancelled” and guidance.

## Admin
- POST /api/admin/login
- POST /api/admin/logout
- GET /api/admin/enquiries
- GET /api/admin/enquiries/:id
- PATCH /api/admin/enquiries/:id  (lead_status only; creates audit log)
