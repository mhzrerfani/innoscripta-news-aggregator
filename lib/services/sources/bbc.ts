import type { Article, NewsFilters } from "@/lib/types"
import { fetchWithRetry } from "@/lib/utils"
import { XMLParser } from "fast-xml-parser"

export async function getBBCNews(filters?: NewsFilters): Promise<Article[]> {
  try {
    const response = await fetchWithRetry("https://feeds.bbci.co.uk/news/rss.xml", { next: { revalidate: 3600 } })

    if (!response.ok) {
      console.error("BBC API Error:", await response.text())
      return []
    }

    const xml = await response.text()
    const parser = new XMLParser()
    const data = parser.parse(xml)

    let articles = data.rss.channel.item.map((article: any) => ({
      title: article.title,
      description: article.description,
      url: article.link,
      imageUrl: article.media?.thumbnail?.url || "/placeholder.svg?height=400&width=600",
      source: "BBC News",
      publishedAt: article.pubDate,
      category: article.category || "General",
    }))

    // Apply filters
    if (filters?.query) {
      const searchQuery = filters.query.toLowerCase()
      articles = articles.filter(
        (article) =>
          article.title.toLowerCase().includes(searchQuery) || article.description.toLowerCase().includes(searchQuery),
      )
    }

    if (filters?.category && filters.category !== "All") {
      articles = articles.filter((article) => article.category.toLowerCase() === filters.category.toLowerCase())
    }

    if (filters?.date) {
      const filterDate = new Date(filters.date).toDateString()
      articles = articles.filter((article) => new Date(article.publishedAt).toDateString() === filterDate)
    }

    return articles
  } catch (error) {
    console.error("Error fetching BBC news:", error)
    return []
  }
}

