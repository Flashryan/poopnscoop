# Security (Production)

## Boundary validation
- Zod schemas on every endpoint.
- Strict mode: reject unknown fields.
- Explicit refinement:
  - require email OR phone (at least one)
  - require house_identifier
  - require consents true

## Bot protection
- Turnstile required on /api/enquiry (and therefore on checkout creation).
- Optional on /api/quote if under attack.

## Rate limiting
- Baseline: Vercel WAF rate limiting for /api/*
  - include /api/enquiry and /api/webhooks/stripe (webhook allowlist may be needed)
- Fallback: server-side limiter keyed by (ip + signed cookie + route), to reduce CGNAT false positives.

## Stripe payments security
- Never handle card data directly (Stripe Checkout only).
- Webhook signature validation required (STRIPE_WEBHOOK_SECRET).
- Idempotent webhook handlers (store event ids processed).
- Enquiry must be the source of truth for paid state (written by webhook).
- Protect against “success URL spoofing” by verifying paid state from DB.

## Anchor privacy
- Public APIs must not return distance.
- Anchor must not be a private home address.

## Admin security
- Password hashing (modern slow hash).
- Session cookie: httpOnly, secure, sameSite=strict.
- CSRF protection for admin mutations.
- Brute force mitigation:
  - login rate limits
  - backoff
- Audit logs for status changes.

## Logging
- Mask PII in logs.
- Do not log raw addresses, phone numbers, or full emails.
- Do not log Stripe secrets; only log event ids and high-level statuses.
