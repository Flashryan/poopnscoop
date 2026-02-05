# Architecture (Production)

## High-level
- Next.js App Router for UI and API route handlers.
- Prisma for DB access.
- Neon Postgres as production DB.
- Edge/WAF protections at Vercel.
- Bot challenge (Turnstile) at enquiry.

## Modules
1) serviceability
- postcode validation
- geocode lookup (Postcodes.io)
- internal distance calc (Haversine)
- decision bucket (covered/needs_review/not_covered)

2) quote
- uses serviceability decision
- computes totals (locked)

3) enquiry
- validates inputs
- verifies Turnstile
- recomputes serviceability + quote
- persists authoritative record
- sends emails

4) admin
- auth
- list/detail/status update
- audit log

5) ops
- retention cleanup scheduled job
- observability

## Key design constraints
- Public API responses never include distance.
- Anchor configured by env; must be a public location (not private home).
- Tests must mock external HTTP calls (Postcodes.io, Turnstile, email).
