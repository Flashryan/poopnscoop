CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create enums
CREATE TYPE "LeadStatus" AS ENUM ('New', 'Contacted', 'Converted', 'Closed');
CREATE TYPE "PlanType" AS ENUM ('one_off', 'subscription');
CREATE TYPE "ServiceabilityDecision" AS ENUM ('covered', 'needs_review', 'not_covered');
CREATE TYPE "PaymentStatus" AS ENUM ('pending_payment', 'paid', 'failed', 'refunded', 'not_applicable');

-- Enquiries
CREATE TABLE "Enquiry" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "lead_status" "LeadStatus" NOT NULL DEFAULT 'New',
  "plan_type" "PlanType" NOT NULL,
  "extra_visits" INTEGER NOT NULL DEFAULT 0,
  "quoted_total_price" DECIMAL(10,2) NOT NULL,
  "quoted_base_price" DECIMAL(10,2) NOT NULL,
  "quoted_extras_price" DECIMAL(10,2) NOT NULL,
  "included_visits" INTEGER NOT NULL,
  "full_name" TEXT NOT NULL,
  "house_identifier" TEXT NOT NULL,
  "postcode" TEXT NOT NULL,
  "email" TEXT,
  "phone" TEXT,
  "notes" TEXT,
  "serviceability_decision" "ServiceabilityDecision" NOT NULL,
  "covered_at_submission" BOOLEAN NOT NULL,
  "internal_distance_miles" DECIMAL(10,4),
  "consent_gdpr" BOOLEAN NOT NULL,
  "consent_terms" BOOLEAN NOT NULL,
  "consented_at" TIMESTAMPTZ NOT NULL,
  "privacy_policy_version" TEXT NOT NULL,
  "terms_version" TEXT NOT NULL,
  "payment_status" "PaymentStatus" NOT NULL,
  "stripe_checkout_session_id" TEXT UNIQUE,
  "stripe_payment_intent_id" TEXT,
  "stripe_subscription_id" TEXT,
  "amount_paid" DECIMAL(10,2),
  "currency" TEXT NOT NULL DEFAULT 'gbp',
  "ip_hash" TEXT,
  "user_agent" TEXT,
  "customer_id" UUID
);

-- Customers
CREATE TABLE "Customer" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "email" TEXT UNIQUE NOT NULL,
  "full_name" TEXT NOT NULL,
  "phone" TEXT,
  "stripe_customer_id" TEXT,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Admin users
CREATE TABLE "AdminUser" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "email" TEXT UNIQUE NOT NULL,
  "password_hash" TEXT NOT NULL,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "last_login_at" TIMESTAMPTZ
);

-- Admin sessions
CREATE TABLE "AdminSession" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "session_token" TEXT UNIQUE NOT NULL,
  "csrf_token" TEXT NOT NULL,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "expires_at" TIMESTAMPTZ NOT NULL,
  "admin_user_id" UUID NOT NULL
);

-- Audit logs
CREATE TABLE "AuditLog" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "enquiry_id" UUID NOT NULL,
  "admin_user_id" UUID NOT NULL,
  "action" TEXT NOT NULL,
  "from_value" TEXT,
  "to_value" TEXT,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Postcode cache
CREATE TABLE "PostcodeCache" (
  "postcode" TEXT PRIMARY KEY,
  "lat" DOUBLE PRECISION NOT NULL,
  "lng" DOUBLE PRECISION NOT NULL,
  "fetched_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "ttl_expires_at" TIMESTAMPTZ
);

-- Stripe events
CREATE TABLE "StripeEvent" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "event_id" TEXT UNIQUE NOT NULL,
  "event_type" TEXT NOT NULL,
  "processed_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Foreign keys
ALTER TABLE "Enquiry"
  ADD CONSTRAINT "Enquiry_customer_id_fkey"
  FOREIGN KEY ("customer_id") REFERENCES "Customer"("id") ON DELETE SET NULL;

ALTER TABLE "AdminSession"
  ADD CONSTRAINT "AdminSession_admin_user_id_fkey"
  FOREIGN KEY ("admin_user_id") REFERENCES "AdminUser"("id") ON DELETE CASCADE;

ALTER TABLE "AuditLog"
  ADD CONSTRAINT "AuditLog_enquiry_id_fkey"
  FOREIGN KEY ("enquiry_id") REFERENCES "Enquiry"("id") ON DELETE CASCADE;

ALTER TABLE "AuditLog"
  ADD CONSTRAINT "AuditLog_admin_user_id_fkey"
  FOREIGN KEY ("admin_user_id") REFERENCES "AdminUser"("id") ON DELETE CASCADE;
