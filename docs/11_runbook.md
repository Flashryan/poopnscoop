# Runbook (Ops)

## Backups
- Use Neon backup/restore features and confirm restore procedure.

## Retention
- Delete non-converted leads after 30 days.
- Review converted after 12 months.
- Implement scheduled job and log counts (no PII).

## Stripe operations
- Monitor webhook failures (Vercel logs + Stripe dashboard).
- Ensure webhook endpoint is reachable and signature secret matches.
- If payments appear “stuck”:
  - check Stripe event delivery
  - replay events after fixing
  - check idempotency store for event ids

## Incident response (quick)
- Spam spike:
  - tighten WAF limits
  - enable Turnstile on /api/quote (optional)
- Suspected admin compromise:
  - rotate SESSION_SECRET and email/stripe keys
  - force admin password reset
  - review audit logs

## Admin password reset
- Provide a CLI script in repo to reset admin password (requires repo access).
