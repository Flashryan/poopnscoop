import { MetadataRoute } from "next";
import { getEnv } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  const env = getEnv();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/admin",
    },
    sitemap: `${env.APP_URL.replace(/\/$/, "")}/sitemap.xml`,
  };
}
