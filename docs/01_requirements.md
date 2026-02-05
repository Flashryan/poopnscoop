# Requirements (Production v1)

## Goals
- Fast “instant quote” experience.
- Coverage checks within 10-mile radius.
- Actionable paid bookings (house number/name required).
- Hardened against bots and scraping from day one.

## Functional requirements
### Serviceability
- Input: UK postcode
- Server: validate + lookup lat/lng (Postcodes.io) + compute Haversine miles internally.
- Output: decision bucket + message (no distance).

Decision thresholds:
- covered: miles <= 8.0
- needs_review: 8.0 < miles <= 10.0
- not_covered: miles > 10.0

Payment gate:
- Only `covered` can proceed to payment in v1.
- `needs_review` shows: “Covered — we’ll confirm availability shortly.” and collects enquiry (no payment).

### Quote
Inputs:
- postcode
- plan_type: one_off | subscription
- extra_visits: 0..10 (subscription only)

Server:
- recompute serviceability
- compute totals per LOCKED rules
- return total + breakdown + copy
- for subscription, show included visits: 2 per 30-day service cycle

### Checkout & Payment (Stripe — required)
Flow:
1) User completes enquiry details + consents
2) Server creates Stripe Checkout Session (payment or subscription)
3) User pays on Stripe
4) Stripe redirects to success/cancel URL
5) Stripe webhook finalises:
   - verifies signature
   - idempotently persists payment record
   - marks enquiry as paid / active
   - sends confirmation emails (or sends on success page, but webhook remains source of truth)

Rules:
- one_off:
  - Checkout mode = payment
  - amount = £15
- subscription:
  - Checkout mode = subscription
  - recurring = £30/month

### Enquiry (paid booking request)
Required:
- full_name
- house_identifier (house number/name)
- postcode
- email OR phone (at least one)
- consent_gdpr true
- consent_terms true
- policy versions (privacy + terms)
- turnstile_token

Server:
- verify turnstile
- recompute serviceability + quote (authoritative)
- store enquiry with status “pending_payment” (covered) OR “pending_review” (needs_review)
- if covered:
  - create Stripe checkout session
  - redirect user to Stripe
- if needs_review:
  - no payment; notify business and customer that you’ll confirm then send payment link

### Admin
- Secure login
- Enquiry list + detail
- lead_status updates: New | Contacted | Converted | Closed
- Payment status visibility:
  - pending_payment / paid / failed / refunded
- Audit log on every status change
- CSV export

## Non-functional requirements
- Security: WAF + rate limiting + strict validation + no anchor leakage.
- Payments security: Stripe signature validation + idempotent webhooks.
- Privacy: UK GDPR-friendly minimisation + retention policy.
- Reliability: degrade gracefully if Postcodes.io fails.
- Performance: cache postcode lookups (DB cache).
- Observability: structured logs + error tracking hook.
