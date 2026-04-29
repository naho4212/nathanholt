import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://nateholt.com/sitemap.xml",
    host: "https://nateholt.com",
  };
}
