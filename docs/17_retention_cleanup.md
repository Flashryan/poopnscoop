# Data retention cleanup

Policy:
- Non-converted leads delete after 30 days.
- Converted leads review/delete after 12 months.

Implementation:
- Scheduled route (Vercel Cron) that:
  - deletes/encrypts/anonymizes as per policy
  - logs counts (no PII)
- Protect cron route with secret header/token.
