import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/tips";
// Search and AI crawlers are all welcome: the tips are meant to be quoted (with the safety note).
const AI_BOTS = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-User", "Claude-SearchBot", "anthropic-ai", "PerplexityBot", "Perplexity-User", "Google-Extended", "Googlebot", "Bingbot", "Applebot", "Applebot-Extended", "CCBot", "Amazonbot", "Meta-ExternalAgent", "DuckAssistBot", "cohere-ai", "MistralAI-User", "YouBot"];
export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: "*", allow: "/" }, { userAgent: AI_BOTS, allow: "/" }], sitemap: `${SITE_URL}/sitemap.xml`, host: SITE_URL };
}
