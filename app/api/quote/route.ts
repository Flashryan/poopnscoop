import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getServiceability } from "@/lib/serviceability";
import { computeQuote } from "@/lib/quote";
import { rateLimitRequest, setAnonCookie, applyRateLimitHeaders } from "@/lib/ratelimit";

const schema = z
  .object({
    postcode: z.string().min(2),
    plan_type: z.enum(["one_off", "subscription"]),
    extra_visits: z.number().int().min(0).max(10).optional(),
  })
  .strict()
  .refine(
    (data) =>
      data.plan_type === "subscription" ||
      data.extra_visits === undefined ||
      data.extra_visits === 0,
    {
      message: "extra_visits only allowed for subscription",
      path: ["extra_visits"],
    }
  );

export async function POST(request: NextRequest) {
  const limit = rateLimitRequest(request, "quote", 60);
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

  try {
    const result = await getServiceability(parsed.data.postcode);
    if (result.decision === "not_covered") {
      return NextResponse.json(
        {
          error: "not_covered",
          message: "We’re not in your area yet.",
        },
        { status: 403 }
      );
    }

    const extraVisits = parsed.data.extra_visits ?? 0;
    const quote = computeQuote(parsed.data.plan_type, extraVisits);

    const response = NextResponse.json({
      covered: result.covered,
      decision: result.decision,
      total_price: quote.total,
      breakdown: { base_price: quote.base, extras_price: quote.extras },
      included_visits: quote.includedVisits,
      display_copy: quote.displayCopy,
    });
    if (limit.isNewAnon) setAnonCookie(response, limit.anonId);
    return response;
  } catch (err) {
    if ((err as Error).message === "invalid_postcode") {
      return NextResponse.json(
        { error: "invalid_postcode", message: "Enter a valid postcode." },
        { status: 400 }
      );
    }
    return NextResponse.json(
      {
        error: "lookup_failed",
        message: "We couldn’t confirm coverage right now. Please try again.",
      },
      { status: 503 }
    );
  }
}
