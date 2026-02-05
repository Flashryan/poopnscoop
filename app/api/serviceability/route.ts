import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getServiceability } from "@/lib/serviceability";
import { rateLimitRequest, setAnonCookie, applyRateLimitHeaders } from "@/lib/ratelimit";

const schema = z
  .object({
    postcode: z.string().min(2),
  })
  .strict();

export async function POST(request: NextRequest) {
  const limit = rateLimitRequest(request, "serviceability", 60);
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
      { error: "invalid_postcode", message: "Enter a valid postcode." },
      { status: 400 }
    );
  }

  try {
    const result = await getServiceability(parsed.data.postcode);
    const response = NextResponse.json({
      covered: result.covered,
      decision: result.decision,
      message: result.message,
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
