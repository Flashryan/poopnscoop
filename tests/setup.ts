import { vi } from "vitest";

process.env.DATABASE_URL = "postgresql://user:pass@localhost:5432/db";
process.env.SESSION_SECRET = "test_session_secret_123456";
process.env.ANCHOR_LAT = "52.585";
process.env.ANCHOR_LNG = "-2.12";
process.env.COVERAGE_RADIUS_MILES = "10";
process.env.NEEDS_REVIEW_THRESHOLD_MILES = "8";
process.env.TURNSTILE_SITEKEY = "test";
process.env.TURNSTILE_SECRET = "test";
process.env.PRIVACY_POLICY_VERSION = "v1.0";
process.env.TERMS_VERSION = "v1.0";
process.env.BUSINESS_NOTIFY_EMAIL = "business@example.com";
process.env.EMAIL_FROM = "hello@example.com";
process.env.APP_URL = "https://example.com";
process.env.STRIPE_SECRET_KEY = "sk_test_123";
process.env.STRIPE_WEBHOOK_SECRET = "whsec_test";
process.env.STRIPE_PRICE_ONE_OFF = "price_one_off";
process.env.STRIPE_PRICE_SUBSCRIPTION = "price_sub";

vi.stubGlobal("fetch", vi.fn());
