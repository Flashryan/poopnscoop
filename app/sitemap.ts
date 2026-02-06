import { MetadataRoute } from "next";

const APP_URL = process.env.APP_URL || "https://poopnscoop.co.uk";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = APP_URL.replace(/\/$/, "");
  return [
    { url: `${base}/`, lastModified: new Date() },
    { url: `${base}/pricing`, lastModified: new Date() },
    { url: `${base}/service-area`, lastModified: new Date() },
    { url: `${base}/faq`, lastModified: new Date() },
    { url: `${base}/contact`, lastModified: new Date() },
    { url: `${base}/about`, lastModified: new Date() },
    { url: `${base}/privacy`, lastModified: new Date() },
    { url: `${base}/terms`, lastModified: new Date() },
  ];
}
