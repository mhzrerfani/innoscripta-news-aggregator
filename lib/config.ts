import { env } from "./env";

export const config = {
  sources: {
    newsapi: {
      key: env.NEWSAPI_KEY,
      baseUrl: env.NEWSAPI_BASE_URL,
      rateLimit: 100, // requests per day
      maxPages: 5, // max pages per request (free tier)
      domains: [
        "reuters.com",
        "bloomberg.com",
        "businessinsider.com",
        "techcrunch.com",
        "theverge.com",
        "wired.com",
        "cnn.com",
        "bbc.com",
        "apnews.com",
      ],
      categoryMap: {
        general: ["news", "breaking", "world"],
        business: ["business", "economy", "market", "finance", "trade"],
        culture: ["entertainment", "movie", "music", "celebrity", "culture"],
        wellness: ["health", "medical", "medicine", "healthcare"],
        science: ["science", "research", "discovery", "space"],
        sport: ["sport", "sports", "game", "match", "tournament"],
        technology: ["tech", "technology", "digital", "software", "cyber"],
        world: ["world", "international", "global", "foreign"],
      } as CategoryMap<string[]>,
      language: "en",
    },
    guardian: {
      key: env.GUARDIAN_API_KEY,
      baseUrl: env.GUARDIAN_BASE_URL,
      rateLimit: 500, // requests per day
      categoryMap: {
        general: "general",
        business: "business",
        culture: "culture",
        wellness: "wellness",
        science: "science",
        sport: "sport",
        technology: "technology",
        world: "world",
      } as CategoryMap<string>,
    },
    bbc: {
      baseUrl: env.BBC_RSS_URL,
      categoryMap: {
        general: "/news/rss.xml",
        world: "/news/world/rss.xml",
        technology: "/news/technology/rss.xml",
        business: "/news/business/rss.xml",
        science: "/news/science_and_environment/rss.xml",
        sport: "/sport/rss.xml",
        culture: "/news/entertainment_and_arts/rss.xml",
        wellness: "/news/health/rss.xml",
      } as CategoryMap<string>,
      rateLimit: Number.POSITIVE_INFINITY,
    },
  },
  isDevelopment: env.NODE_ENV === "development",
} as const;

export type Config = typeof config;

export const categories = [
  "general",
  "business",
  "culture",
  "wellness",
  "science",
  "sport",
  "technology",
  "world",
] as const;

export type Category = (typeof categories)[number];

type CategoryMap<T> = Record<Category, T>;
