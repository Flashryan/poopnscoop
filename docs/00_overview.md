# Poop n Scoop — Production Build Docs (Codex Pack)
Date: 2026-02-05
Service Area: Wolverhampton, UK (10-mile radius)

This folder is the **single source of truth** for Codex to build the system.

## Stack (production)
- Next.js (App Router) + TypeScript
- Postgres (Neon) + Prisma
- Vercel hosting + WAF rate limiting
- Cloudflare Turnstile on enquiry (and checkout session creation)
- Stripe Checkout (payments from day one)
- Transactional email (provider-agnostic)

## In scope (v1)
- Serviceability check (postcodes.io → decision buckets)
- Quote engine (server authoritative)
- Checkout flow (Stripe) for one-off and subscription
- Webhook processing (Stripe) with idempotency + signature validation
- Enquiry/booking request (house number/name required + consents)
- Admin portal (secure auth, lead status, audit logs, paid status)
- Retention cleanup job
- SEO + schema.org

## Out of scope (v1)
- Automated scheduling/calendar booking (jobs/visits are arranged operationally)
- Driving-time coverage determination (still manual near boundary)

Start here:
1) Read `docs/LOCKED.md`
2) Read `docs/01_requirements.md`
3) Run Codex with `prompts/00_codex_kickoff.md`
