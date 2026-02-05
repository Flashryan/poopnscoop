# Phase 3 — Quote (Codex)

Implement:
- POST /api/quote
- recompute serviceability server-side
- compute totals per docs/LOCKED.md
- validate extra_visits 0..10
- return breakdown + included_visits + copy
- block not_covered

DoD:
- Unit tests for totals and validation
- Integration test verifies server recompute (client totals ignored)
