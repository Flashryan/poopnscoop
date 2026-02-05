import { MetadataRoute } from "next";

const APP_URL = process.env.APP_URL || "https://poopnscoop.co.uk";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/admin",
    },
    sitemap: `${APP_URL.replace(/\/$/, "")}/sitemap.xml`,
  };
}
