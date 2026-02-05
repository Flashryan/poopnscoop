import { MetadataRoute } from "next";
import { getEnv } from "@/lib/env";

export default function sitemap(): MetadataRoute.Sitemap {
  const env = getEnv();
  const base = env.APP_URL.replace(/\/$/, "");
  return [
    { url: `${base}/`, lastModified: new Date() },
    { url: `${base}/pricing`, lastModified: new Date() },
    { url: `${base}/service-area`, lastModified: new Date() },
    { url: `${base}/faq`, lastModified: new Date() },
    { url: `${base}/contact`, lastModified: new Date() },
    { url: `${base}/privacy`, lastModified: new Date() },
    { url: `${base}/terms`, lastModified: new Date() },
  ];
}
