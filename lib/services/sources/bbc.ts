import { XMLParser } from "fast-xml-parser"
import type { NewsFilters, NewsSource } from "@/lib/types"

export const bbcSource: NewsSource = {
  id: "bbc",
  name: "BBC News",

  async fetchNews(filters?: NewsFilters) {
    try {
      // BBC RSS feeds for different categories
      const feedUrls = {
        general: "https://feeds.bbci.co.uk/news/rss.xml",
        world: "https://feeds.bbci.co.uk/news/world/rss.xml",
        technology: "https://feeds.bbci.co.uk/news/technology/rss.xml",
        business: "https://feeds.bbci.co.uk/news/business/rss.xml",
        entertainment: "https://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml",
        health: "https://feeds.bbci.co.uk/news/health/rss.xml",
        science: "https://feeds.bbci.co.uk/news/science_and_environment/rss.xml",
        sports: "https://feeds.bbci.co.uk/sport/rss.xml",
      }

      // Determine which feed to use based on category
      let feedUrl = feedUrls.general
      if (filters?.categories?.length) {
        const category = filters.categories[0].toLowerCase()
        if (feedUrls[category as keyof typeof feedUrls]) {
          feedUrl = feedUrls[category as keyof typeof feedUrls]
        }
      }

      const response = await fetch(feedUrl, {
        next: { revalidate: 3600 },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch BBC news")
      }

      const xml = await response.text()
      const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: "@_",
      })
      const data = parser.parse(xml)

      let articles = data.rss.channel.item.map((article: any) => {
        // Extract the first media:thumbnail URL if it exists
        const thumbnail = article["media:thumbnail"]?.[0]?.["@_url"] || 
                         article["media:thumbnail"]?.["@_url"] ||
                         "/placeholder.svg?height=400&width=600"

        return {
          title: article.title,
          description: article.description,
          url: article.link,
          imageUrl: thumbnail,
          source: "BBC News",
          publishedAt: article.pubDate,
          category: this.mapCategory(article.category || "General"),
        }
      })

      // Apply filters
      if (filters?.query) {
        const query = filters.query.toLowerCase()
        articles = articles.filter(
          article =>
            article.title.toLowerCase().includes(query) ||
            article.description.toLowerCase().includes(query)
        )
      }

      if (filters?.date) {
        const filterDate = new Date(filters.date).toDateString()
        articles = articles.filter(
          article => new Date(article.publishedAt).toDateString() === filterDate
        )
      }

      // Ensure we have an array
      if (!Array.isArray(articles)) {
        articles = [articles].filter(Boolean)
      }

      return {
        articles,
        hasMore: false, // RSS feeds don't support pagination
        totalResults: articles.length,
      }
    } catch (error) {
      console.error("Error fetching BBC news:", error)
      return { articles: [], hasMore: false, totalResults: 0 }
    }
  },

  private mapCategory(category: string): string {
    const categoryMap: { [key: string]: string } = {
      "Technology": "Technology",
      "Business": "Business",
      "Entertainment & Arts": "Entertainment",
      "Health": "Health",
      "Science & Environment": "Science",
      "Sport": "Sports",
      "World": "World",
    }

    return categoryMap[category] || "General"
  }
}

