# Testing

## Unit tests
- Quote totals:
  - one_off => 15
  - subscription => 30
  - extras add 15 each
- extra_visits validation 0..10
- serviceability thresholds
- postcode validation edge cases

## Integration tests
- enquiry recomputes totals (ignores any client totals)
- requires house_identifier
- requires email OR phone
- requires consents
- turnstile verification mocked
- stripe webhook handler:
  - validate signature (test mode)
  - idempotency (same event twice)
  - marks enquiry paid on checkout.session.completed

## External HTTP mocking
- Mock Postcodes.io in CI
- Mock Turnstile verification
- Mock email sender
- Stripe: use stripe-mock or construct signed event test fixtures
