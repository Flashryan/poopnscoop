# LOCKED — Do not change
Date: 2026-02-05

## Business rules
- One-off visit: **£15** flat
- Subscription: **£30/month** includes **2 visits** per **30-day service cycle**
- Extra visits (requested): **£15** each
- Extra visits cap: **10**

## Payments (Production v1 — REQUIRED)
- Payments are taken online from day one via **Stripe Checkout**.
- Subscription is billed **monthly** via Stripe Billing at **£30/month**.
- One-off is a **one-time payment** at **£15**.
- Only `decision=covered` postcodes can proceed to payment in v1.
  - `needs_review` must submit an enquiry (no payment) and we send a payment link after confirmation.

## Service area
- Covered if within **10.0 miles** radius of the Wolverhampton anchor (Haversine straight-line).
- Public APIs must **not** return exact miles (prevent anchor triangulation). Return decision buckets only:
  - `covered`
  - `needs_review`
  - `not_covered`

## Production stance
- Real database writes, real integrations (Postcodes.io, Stripe, email provider, Turnstile, WAF).
- Tests may mock external APIs (required for reliability).
