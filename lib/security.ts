import { createHmac } from "crypto";
import { getEnv } from "@/lib/env";

export function hashIp(ip: string) {
  const env = getEnv();
  return createHmac("sha256", env.SESSION_SECRET).update(ip).digest("hex");
}
