# Cloudflare Turnstile

## Where used
- Required on /api/enquiry
- Optional on /api/quote if attacked

## Verification
- Server verifies token with Turnstile secret
- If verification fails: return 422 spam_detected

## UX
- Keep invisible / managed mode if possible
