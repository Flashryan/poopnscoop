# Phase 2 — Serviceability (Codex)

Implement:
- Postcode validation (UK formats)
- postcode_cache table + lookup function
- Postcodes.io integration (server-side fetch)
- Haversine calculation internally
- Decision buckets:
  - covered <= 8.0
  - needs_review 8.0..10.0
  - not_covered > 10.0
- POST /api/serviceability returns ONLY covered/decision/message (no miles)

DoD:
- Unit tests for thresholds
- Public response never includes distance
- Caching works (no repeated external calls for same postcode within TTL)
