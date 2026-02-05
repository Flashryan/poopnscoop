# Deployment (Vercel + Neon + Prisma)

## Neon
- Create Neon project + DB
- Set DATABASE_URL in Vercel env

## Prisma
- Use migrations (prisma migrate deploy in CI/build)
- Never run dev migrations in production

## Vercel
- Connect repo
- Set env vars
- Enable WAF rules for /api/*
- Configure custom domain and SSL

## Vercel Cron (retention cleanup)
- Schedule retention job route (e.g. /api/cron/retention)
- Protect with secret header/token
