# Threat Model (STRIDE-lite)

## Spoofing
- Admin brute force / credential stuffing
Mitigation: rate limit + strong hashing + secure sessions + optional 2FA future.

## Tampering
- Client tampers with totals / coverage
Mitigation: server recompute serviceability + quote; ignore client totals.

## Repudiation
- Admin changes lead status without trace
Mitigation: audit_logs records on every mutation.

## Information disclosure
- Anchor triangulation via distance
Mitigation: never return distance to public; use decision buckets.

## Denial of service
- Bot floods /api
Mitigation: Vercel WAF + server fallback limiter + Turnstile (enquiry).

## Elevation of privilege
- Unauthenticated access to admin endpoints
Mitigation: auth guard, role checks, CSRF, secure cookies.
