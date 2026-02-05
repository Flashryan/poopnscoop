# UI Spec (Production)

## Public pages
- / (Home)
- /pricing
- /service-area
- /faq
- /contact
- /privacy
- /terms
- /checkout/success
- /checkout/cancel

## Quote → Enquiry → Payment flow (recommended UX)
1) Postcode checker on home → shows covered/needs_review/not_covered (no miles).
2) Plan selection + extras
3) Quote display
4) Enquiry form (postcode prefilled, plan prefilled, consents required)
5) If decision=covered:
   - Submit enquiry → redirect to Stripe Checkout
6) Stripe success → /checkout/success (verify paid in DB) → show confirmation + reference.
7) Stripe cancel → /checkout/cancel → show next steps.

Needs review:
- Collect enquiry, no payment; “We’ll confirm availability shortly and send a payment link.”

## Enquiry fields
Required:
- Full name
- House number/name
- Postcode (prefilled)
- Email or phone (at least one)
- Consent checkbox: Privacy Policy (required)
- Consent checkbox: Terms (required)
- Turnstile

Optional:
- Notes

## Admin UI
- /admin/login
- /admin/enquiries
- /admin/enquiries/:id
- Lead status update (New/Contacted/Converted/Closed)
- Payment status display (pending_payment/paid/failed/refunded)
- Audit trail display
