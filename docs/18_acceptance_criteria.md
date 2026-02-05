# Acceptance criteria (Definition of Done)

## Public
- Postcode checker returns covered/needs_review/not_covered (no miles).
- Quote totals always match locked rules.
- Enquiry cannot submit without:
  - house identifier
  - email or phone
  - consents checked
  - valid Turnstile
- If decision=covered:
  - Enquiry stored in DB with payment_status=pending_payment
  - Stripe Checkout session created and user redirected
  - After successful payment, webhook marks enquiry payment_status=paid
  - Success page shows confirmation only if DB indicates paid
- If decision=needs_review:
  - Enquiry stored with payment_status=not_applicable and decision=needs_review
  - Customer + business receive email stating “we’ll confirm then send payment link”

## Payments security
- Stripe webhook signature is verified.
- Webhook handling is idempotent (no duplicates).
- No “success URL spoofing” (success page checks DB).

## Security
- WAF enabled for /api
- Server fallback limiter active
- No distance leakage in any public JSON response
- Admin endpoints require auth + CSRF for mutations
- Audit logs created for every lead_status change

## Operations
- Retention job exists and protected
- Env vars documented
- Prisma migrations run cleanly on deploy

## Tests
- Unit + integration tests pass locally and in CI
- External APIs mocked in tests
- Stripe webhook integration test simulates checkout.session.completed
