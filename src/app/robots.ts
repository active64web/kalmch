import { MetadataRoute } from "next";
import { BASE_URL } from "@/utils/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/my-library", "/login", "/register", "/profile"],
      },
      {
        userAgent: ["GPTBot", "PerplexityBot", "ClaudeBot", "Google-Extended"],
        allow: "/",
        disallow: ["/my-library", "/login", "/register", "/profile"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}

