# Data Model (Prisma-friendly)

## enquiries (lead + booking intent)
- id (uuid)
- created_at
- lead_status: New | Contacted | Converted | Closed
- plan_type: one_off | subscription
- extra_visits (int default 0)

Authoritative quote:
- quoted_total_price (numeric)
- quoted_base_price (numeric)
- quoted_extras_price (numeric)
- included_visits (int)

Customer:
- full_name (text)
- house_identifier (text)  // REQUIRED
- postcode (text)
- email (text nullable)
- phone (text nullable)
- notes (text nullable)

Serviceability (internal only):
- serviceability_decision: covered | needs_review | not_covered
- covered_at_submission (boolean)
- internal_distance_miles (numeric nullable)  // INTERNAL ONLY

Consent:
- consent_gdpr (boolean)
- consent_terms (boolean)
- consented_at (timestamp)
- privacy_policy_version (text)
- terms_version (text)

Payments linkage:
- payment_status: pending_payment | paid | failed | refunded | not_applicable
- stripe_checkout_session_id (text nullable)
- stripe_payment_intent_id (text nullable)     // one-off
- stripe_subscription_id (text nullable)       // subscription
- amount_paid (numeric nullable)
- currency (text default "gbp")

Abuse/Ops metadata:
- ip_hash (text nullable)  // salted hash
- user_agent (text nullable)

## customers (optional, for reuse)
Purpose: link repeat customers and stripe customer id.
- id
- email unique
- full_name
- phone nullable
- stripe_customer_id nullable
- created_at

## admin_users
- id
- email unique
- password_hash
- created_at
- last_login_at

## audit_logs
- id
- enquiry_id
- admin_user_id
- action
- from_value
- to_value
- created_at

## postcode_cache
- postcode (pk)
- lat
- lng
- fetched_at
- ttl_expires_at
