# Phase 5 — Admin (Codex)

Implement:
- Admin auth (either a small custom auth or a library; must be secure)
- Session cookies httpOnly/secure/sameSite=strict
- CSRF protection on mutations
- Login rate limit + backoff
- Enquiries list + detail view
- lead_status update endpoint
- audit_logs table and logging on every status change
- CSV export

DoD:
- Unauthorized requests blocked
- Audit logs created for each status change
- Status values restricted to New/Contacted/Converted/Closed
