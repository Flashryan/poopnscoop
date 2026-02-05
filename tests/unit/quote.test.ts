import { describe, it, expect } from "vitest";
import { computeQuote } from "@/lib/quote";

describe("computeQuote", () => {
  it("returns one-off total", () => {
    const quote = computeQuote("one_off", 0);
    expect(quote.total).toBe(15);
  });

  it("returns subscription total with extras", () => {
    const quote = computeQuote("subscription", 2);
    expect(quote.total).toBe(60);
    expect(quote.extras).toBe(30);
  });
});
