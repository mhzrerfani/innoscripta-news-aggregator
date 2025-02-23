import { XMLParser } from "fast-xml-parser";
import type { NewsFilters, NewsSource, RSSFeed } from "@/lib/types";

export const bbcSource: NewsSource = {
  id: "bbc",
  name: "BBC News",

  async fetchNews(filters?: NewsFilters) {
    try {
      const feedUrls = {
        general: "https://feeds.bbci.co.uk/news/rss.xml",
        world: "https://feeds.bbci.co.uk/news/world/rss.xml",
        technology: "https://feeds.bbci.co.uk/news/technology/rss.xml",
        business: "https://feeds.bbci.co.uk/news/business/rss.xml",
        culture: "https://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml",
        wellness: "https://feeds.bbci.co.uk/news/health/rss.xml",
        science:
          "https://feeds.bbci.co.uk/news/science_and_environment/rss.xml",
        sport: "https://feeds.bbci.co.uk/sport/rss.xml",
      };

      let feedUrl = feedUrls.general;
      if (filters?.category) {
        const category = filters.category.toLowerCase();
        if (feedUrls[category as keyof typeof feedUrls]) {
          feedUrl = feedUrls[category as keyof typeof feedUrls];
        }
      }

      const response = await fetch(feedUrl, {
        next: { revalidate: 3600 },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch BBC news");
      }

      const xml = await response.text();
      const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: "@_",
      });
      const data: RSSFeed = parser.parse(xml);

      let articles = data.rss.channel.item.map((article) => {
        const thumbnail =
          article["media:thumbnail"]?.["@_url"] ||
          article["media:thumbnail"]?.["@_url"] ||
          "/placeholder.svg?height=400&width=600";

        return {
          title: article.title,
          description: article.description,
          url: article.link,
          imageUrl: thumbnail,
          source: "BBC News",
          publishedAt: article.pubDate,
          category: data.rss.channel.description.split(" - ")[1],
        };
      });

      if (filters?.query) {
        const query = filters.query.toLowerCase();
        articles = articles.filter(
          (article) =>
            article.title.toLowerCase().includes(query) ||
            article.description.toLowerCase().includes(query),
        );
      }

      if (filters?.date) {
        const filterDate = new Date(filters.date).toDateString();
        articles = articles.filter(
          (article) =>
            new Date(article.publishedAt).toDateString() === filterDate,
        );
      }

      if (!Array.isArray(articles)) {
        articles = [articles].filter(Boolean);
      }

      return {
        articles,
        hasMore: false,
        totalResults: articles.length,
      };
    } catch (error) {
      console.error("Error fetching BBC news:", error);
      return { articles: [], hasMore: false, totalResults: 0 };
    }
  },
};
