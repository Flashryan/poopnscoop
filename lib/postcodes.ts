import { db } from "@/lib/db";

export type PostcodeLookup = {
  postcode: string;
  lat: number;
  lng: number;
};

const TTL_DAYS = 30;

export async function getPostcodeFromCache(postcode: string) {
  const cached = await db.postcodeCache.findUnique({ where: { postcode } });
  if (!cached) return null;
  if (cached.ttl_expires_at && cached.ttl_expires_at < new Date()) {
    return null;
  }
  return { lat: cached.lat, lng: cached.lng };
}

export async function savePostcodeToCache(postcode: string, lat: number, lng: number) {
  const now = new Date();
  const ttl = new Date(now.getTime() + TTL_DAYS * 24 * 60 * 60 * 1000);
  await db.postcodeCache.upsert({
    where: { postcode },
    update: {
      lat,
      lng,
      fetched_at: now,
      ttl_expires_at: ttl,
    },
    create: {
      postcode,
      lat,
      lng,
      fetched_at: now,
      ttl_expires_at: ttl,
    },
  });
}

export async function lookupPostcode(postcode: string): Promise<PostcodeLookup> {
  const url = `https://api.postcodes.io/postcodes/${encodeURIComponent(postcode)}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error("postcodes_lookup_failed");
  }
  const data = (await res.json()) as {
    status: number;
    result?: { latitude: number; longitude: number; postcode: string };
  };
  if (!data.result) {
    throw new Error("postcodes_not_found");
  }
  return {
    postcode: data.result.postcode,
    lat: data.result.latitude,
    lng: data.result.longitude,
  };
}
