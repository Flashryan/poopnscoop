import { describe, it, expect, vi } from "vitest";
import { lookupPostcode } from "@/lib/postcodes";

describe("lookupPostcode", () => {
  it("parses postcode lookup response", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        status: 200,
        result: {
          latitude: 52.586,
          longitude: -2.12,
          postcode: "WV1 1AA",
        },
      }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await lookupPostcode("WV1 1AA");
    expect(result.postcode).toBe("WV1 1AA");
    expect(result.lat).toBe(52.586);
  });
});
