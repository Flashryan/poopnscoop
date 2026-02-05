# Poop n Scoop — Production App

Production-ready Next.js App Router build for Poop n Scoop. This repo includes the full flow: serviceability, quote, enquiry, Stripe Checkout, admin portal, and operational tooling.

## Stack
- Next.js App Router + TypeScript
- Prisma + Neon Postgres
- Stripe Checkout + webhooks
- Cloudflare Turnstile
- Vercel WAF + server fallback rate limiting

## Quick start
1. Install dependencies.
2. Create a `.env` file (see Environment Variables below).
3. Run Prisma migrations.
4. Start the dev server.

```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

## Environment variables
Required:
```
DATABASE_URL=
SESSION_SECRET=
ANCHOR_LAT=
ANCHOR_LNG=
COVERAGE_RADIUS_MILES=10
NEEDS_REVIEW_THRESHOLD_MILES=8
TURNSTILE_SITEKEY=
TURNSTILE_SECRET=
PRIVACY_POLICY_VERSION=v1.0
TERMS_VERSION=v1.0
BUSINESS_NOTIFY_EMAIL=
EMAIL_FROM=
APP_URL=https://poopnscoop.co.uk
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_ONE_OFF=
STRIPE_PRICE_SUBSCRIPTION=
```

Email provider (choose one):
```
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
```

or:
```
RESEND_API_KEY=
```

Cron protection:
```
CRON_SECRET=
```

## Admin setup
Create or reset an admin password (uses bcrypt and upserts the admin user):
```bash
npm run reset-admin-password -- admin@example.com "your-strong-password"
```

## Payments
Stripe Checkout is required from day one.
- One-off price must be set to £15 (GBP).
- Subscription price must be set to £30/month (GBP).
- Webhook endpoint: `/api/webhooks/stripe`.

## Vercel + Neon deployment
1. Create Neon DB and set `DATABASE_URL`.
2. Set all environment variables in Vercel.
3. Deploy and run `prisma migrate deploy` during build or via CI.
4. Configure Stripe webhook to point to `/api/webhooks/stripe`.
5. Enable Vercel WAF rate limiting for `/api/*` routes (tighten for `/api/enquiry`).

## Rate limiting
- Primary: Vercel WAF rules for `/api/serviceability`, `/api/quote`, `/api/enquiry`, and `/api/webhooks/stripe`.
- Fallback: server-side limiter keyed by IP + signed anonymous cookie + route.

## Retention job
Create a Vercel Cron job hitting:
```
GET /api/cron/retention
```
Include header:
```
X-Cron-Secret: <CRON_SECRET>
```

## Tests
```bash
npm run test
npm run test:unit
npm run test:integration
```

## Notes
- Public APIs never return exact distances (prevents anchor triangulation).
- Webhooks are idempotent; Stripe event IDs are stored.
- Emails are sent via SMTP or Resend in production; dev logs are allowed.
# poopnscoop
