# Phase 4 — Enquiry (Codex)

Implement:
- Enquiry form UI (prefilled postcode/plan from quote)
- POST /api/enquiry
- Turnstile verification required
- Honeypot check
- Rate limiting middleware fallback (ip+cookie+route)
- Store enquiry in Postgres with authoritative totals and decisions
- Send emails (customer + business) via provider-agnostic mailer

DoD:
- Integration tests:
  - requires house_identifier
  - requires email OR phone
  - requires consents
  - ignores client totals
- Emails sent in prod mode; safe mail sink allowed in dev only
