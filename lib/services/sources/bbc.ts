import { XMLParser } from "fast-xml-parser";
import type { NewsFilters, NewsSource, RSSFeed } from "@/lib/types";
import { Category, config } from "@/lib/config";

const bbcConfig = config.sources.bbc;

export const bbcSource: NewsSource = {
  id: "bbc",
  name: "BBC News",

  async fetchNews(filters?: NewsFilters) {
    try {
      const baseUrl = bbcConfig.baseUrl;
      const feeds = bbcConfig.categoryMap;

      let feedPath: string = feeds.general as string;
      if (filters?.category) {
        const category = filters.category as Category;

        if (feeds[category]) {
          feedPath = feeds[category];
        }
      }

      const feedUrl = `${baseUrl}${feedPath}`;

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

      const articles = data.rss.channel.item.map((article) => {
        const thumbnail = article["media:thumbnail"]?.["@_url"];

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
