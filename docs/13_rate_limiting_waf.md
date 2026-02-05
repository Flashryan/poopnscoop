# Rate limiting & WAF

## Vercel WAF
- Configure baseline rate limiting for /api/serviceability, /api/quote, /api/enquiry.
- Tune separately for:
  - read-ish endpoints (serviceability, quote)
  - write endpoint (enquiry) tighter

## CGNAT-safe fallback limiter
- Key by: ip + signed anonymous cookie + route
- Avoid hard blocks on IP-only
- Use sliding window counters
- Return 429 with safe message
