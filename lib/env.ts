import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  SESSION_SECRET: z.string().min(16),
  ANCHOR_LAT: z.coerce.number(),
  ANCHOR_LNG: z.coerce.number(),
  COVERAGE_RADIUS_MILES: z.coerce.number().default(10),
  NEEDS_REVIEW_THRESHOLD_MILES: z.coerce.number().default(8),
  TURNSTILE_SITEKEY: z.string().min(1),
  TURNSTILE_SECRET: z.string().min(1),
  PRIVACY_POLICY_VERSION: z.string().default("v1.0"),
  TERMS_VERSION: z.string().default("v1.0"),
  BUSINESS_NOTIFY_EMAIL: z.string().email(),
  EMAIL_FROM: z.string().email(),
  APP_URL: z.string().url(),
  STRIPE_SECRET_KEY: z.string().min(1),
  STRIPE_WEBHOOK_SECRET: z.string().min(1),
  STRIPE_PRICE_ONE_OFF: z.string().min(1),
  STRIPE_PRICE_SUBSCRIPTION: z.string().min(1),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  CRON_SECRET: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

let cachedEnv: Env | null = null;

export function getEnv(): Env {
  if (cachedEnv) return cachedEnv;
  const parsed = envSchema.parse(process.env);
  cachedEnv = parsed;
  return cachedEnv;
}

export function getPublicEnv() {
  const env = getEnv();
  return {
    APP_URL: env.APP_URL,
    TURNSTILE_SITEKEY: env.TURNSTILE_SITEKEY,
    PRIVACY_POLICY_VERSION: env.PRIVACY_POLICY_VERSION,
    TERMS_VERSION: env.TERMS_VERSION,
    ANCHOR_LAT: env.ANCHOR_LAT,
    ANCHOR_LNG: env.ANCHOR_LNG,
  };
}
