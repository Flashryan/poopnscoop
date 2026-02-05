# Codex Kickoff Prompt (paste into Codex)

You are Codex running locally in this repository.

1) READ ALL DOCS under ./docs.
2) Propose an implementation plan (task list) and the folder structure.
3) Then implement the plan **phase by phase**.

NON-NEGOTIABLES:
- Follow docs/LOCKED.md exactly.
- Use Next.js App Router + TypeScript.
- Use Prisma + Neon Postgres (DATABASE_URL).
- Use Route Handlers for /api endpoints.
- Zod validation on every endpoint (strict, reject unknown fields).
- Public APIs must not return exact distance miles.
- Turnstile required on /api/enquiry (and checkout creation).
- Payments REQUIRED from day one:
  - Stripe Checkout for one-off and subscription
  - Webhook signature validation + idempotency
  - Success page must verify paid state from DB
- Add Vercel WAF rate limiting guidance + server fallback limiter keyed by ip+cookie.
- No dummy data in production. Use real DB writes.
- Tests must mock external services (Postcodes.io, Turnstile, email, Stripe).

Deliver:
- Working app: home/quote/enquiry + Stripe checkout + success/cancel + admin portal
- Prisma schema + migrations
- Unit + integration tests (including webhook test)
- README updated with run/deploy steps

Start by outputting the plan and waiting for me to confirm before scaffolding.
