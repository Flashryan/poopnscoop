import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { getServiceability } from "@/lib/serviceability";
import { computeQuote } from "@/lib/quote";
import { verifyTurnstile } from "@/lib/turnstile";
import { rateLimitRequest, setAnonCookie, applyRateLimitHeaders, getClientIp } from "@/lib/ratelimit";
import { createCheckoutSession } from "@/lib/stripe";
import { sendEmail } from "@/lib/email";
import {
  businessNotificationEmail,
  customerNeedsReviewEmail,
} from "@/lib/email/templates";
import { hashIp } from "@/lib/security";
import { getEnv } from "@/lib/env";

const schema = z
  .object({
    full_name: z.string().min(2),
    house_identifier: z.string().min(1),
    postcode: z.string().min(2),
    email: z.string().email().optional(),
    phone: z.string().min(6).optional(),
    notes: z.string().max(500).optional(),
    plan_type: z.enum(["one_off", "subscription"]),
    extra_visits: z.number().int().min(0).max(10),
    consent_gdpr: z.boolean(),
    consent_terms: z.boolean(),
    privacy_policy_version: z.string().min(1),
    terms_version: z.string().min(1),
    turnstile_token: z.string().min(1),
    honeypot: z.string().optional(),
  })
  .strict()
  .refine((data) => data.email || data.phone, {
    message: "Email or phone required",
    path: ["email"],
  })
  .refine((data) => data.consent_gdpr === true, {
    message: "Consent required",
    path: ["consent_gdpr"],
  })
  .refine((data) => data.consent_terms === true, {
    message: "Consent required",
    path: ["consent_terms"],
  })
  .refine(
    (data) =>
      data.plan_type === "subscription" ||
      data.extra_visits === 0,
    {
      message: "Extra visits only valid for subscription",
      path: ["extra_visits"],
    }
  );

export async function POST(request: NextRequest) {
  const limit = rateLimitRequest(request, "enquiry", 10);
  if (limit.limited) {
    const response = NextResponse.json(
      { error: "rate_limited", message: "Too many requests." },
      { status: 429 }
    );
    applyRateLimitHeaders(response, limit.retryAfter);
    if (limit.isNewAnon) setAnonCookie(response, limit.anonId);
    return response;
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_request", message: "Check your inputs." },
      { status: 400 }
    );
  }

  if (parsed.data.honeypot) {
    return NextResponse.json(
      { error: "spam_detected", message: "Unable to process request." },
      { status: 422 }
    );
  }

  const ip = getClientIp(request);
  const turnstile = await verifyTurnstile(parsed.data.turnstile_token, ip);
  if (!turnstile.success) {
    return NextResponse.json(
      { error: "spam_detected", message: "Turnstile verification failed." },
      { status: 422 }
    );
  }

  try {
    const serviceability = await getServiceability(parsed.data.postcode);
    if (serviceability.decision === "not_covered") {
      return NextResponse.json(
        { error: "not_covered", message: "We’re not in your area yet." },
        { status: 403 }
      );
    }

    const quote = computeQuote(
      parsed.data.plan_type,
      parsed.data.extra_visits
    );

    const env = getEnv();

    const customer = parsed.data.email
      ? await db.customer.upsert({
          where: { email: parsed.data.email },
          update: {
            full_name: parsed.data.full_name,
            phone: parsed.data.phone ?? undefined,
          },
          create: {
            email: parsed.data.email,
            full_name: parsed.data.full_name,
            phone: parsed.data.phone ?? undefined,
          },
        })
      : null;

    const enquiry = await db.enquiry.create({
      data: {
        plan_type: parsed.data.plan_type,
        extra_visits: parsed.data.extra_visits,
        quoted_total_price: new Prisma.Decimal(quote.total),
        quoted_base_price: new Prisma.Decimal(quote.base),
        quoted_extras_price: new Prisma.Decimal(quote.extras),
        included_visits: quote.includedVisits,
        full_name: parsed.data.full_name,
        house_identifier: parsed.data.house_identifier,
        postcode: serviceability.normalizedPostcode,
        email: parsed.data.email ?? null,
        phone: parsed.data.phone ?? null,
        notes: parsed.data.notes ?? null,
        serviceability_decision: serviceability.decision,
        covered_at_submission: serviceability.decision === "covered",
        internal_distance_miles: new Prisma.Decimal(serviceability.distanceMiles),
        consent_gdpr: parsed.data.consent_gdpr,
        consent_terms: parsed.data.consent_terms,
        consented_at: new Date(),
        privacy_policy_version: parsed.data.privacy_policy_version,
        terms_version: parsed.data.terms_version,
        payment_status:
          serviceability.decision === "covered"
            ? "pending_payment"
            : "not_applicable",
        ip_hash: ip ? hashIp(ip) : null,
        user_agent: request.headers.get("user-agent"),
        customer_id: customer?.id ?? null,
        currency: "gbp",
      },
    });

    if (serviceability.decision === "needs_review") {
      const customerEmail = parsed.data.email;
      if (customerEmail) {
        const template = customerNeedsReviewEmail(enquiry);
        await sendEmail({
          to: customerEmail,
          subject: template.subject,
          text: template.text,
          html: template.html,
        });
      }
      const businessTemplate = businessNotificationEmail(enquiry);
      await sendEmail({
        to: env.BUSINESS_NOTIFY_EMAIL,
        subject: businessTemplate.subject,
        text: businessTemplate.text,
        html: businessTemplate.html,
      });

      const response = NextResponse.json({
        success: true,
        enquiry_reference: enquiry.id,
        checkout_url: null,
        message: "Covered — we’ll confirm availability shortly.",
      });
      if (limit.isNewAnon) setAnonCookie(response, limit.anonId);
      return response;
    }

    const session = await createCheckoutSession({
      enquiryId: enquiry.id,
      planType: parsed.data.plan_type,
      customerEmail: parsed.data.email ?? null,
      extraVisits: parsed.data.extra_visits,
    });
    if (!session.url) {
      throw new Error("checkout_url_missing");
    }

    await db.enquiry.update({
      where: { id: enquiry.id },
      data: {
        stripe_checkout_session_id: session.id,
      },
    });

    const response = NextResponse.json({
      success: true,
      enquiry_reference: enquiry.id,
      checkout_url: session.url,
    });
    if (limit.isNewAnon) setAnonCookie(response, limit.anonId);
    return response;
  } catch (err) {
    const message = (err as Error).message;
    if (message === "invalid_postcode") {
      return NextResponse.json(
        { error: "invalid_postcode", message: "Enter a valid postcode." },
        { status: 400 }
      );
    }
    if (message === "postcodes_lookup_failed" || message === "postcodes_not_found") {
      return NextResponse.json(
        {
          error: "lookup_failed",
          message: "We couldn’t confirm coverage right now. Please try again.",
        },
        { status: 503 }
      );
    }
    return NextResponse.json(
      { error: "server_error", message: "Unable to submit enquiry." },
      { status: 500 }
    );
  }
}
