import type { MetadataRoute } from "next";
import { SITE_URL, absoluteUrl } from "@/app/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/eve/", "/.well-known/workflow/"],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: SITE_URL.origin,
  };
}
