import type { Article, NewsFilters } from "@/lib/types"
import { fetchWithRetry } from "@/lib/utils"

export async function getNewsAPIArticles(filters?: NewsFilters): Promise<Article[]> {
  try {
    const params = new URLSearchParams({
      apiKey: process.env.NEWSAPI_KEY || "",
      language: "en",
      pageSize: "20",
    })

    if (filters?.query) {
      params.append("q", filters.query)
    }

    if (filters?.category && filters.category !== "All") {
      params.append("category", filters.category.toLowerCase())
    }

    if (filters?.date) {
      const dateStr = new Date(filters.date).toISOString().split("T")[0]
      params.append("from", dateStr)
      params.append("to", dateStr)
    }

    const response = await fetchWithRetry(`https://newsapi.org/v2/top-headlines?${params.toString()}`, {
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      console.error("NewsAPI Error:", await response.text())
      return []
    }

    const data = await response.json()

    return data.articles.map((article: any) => ({
      title: article.title,
      description: article.description,
      url: article.url,
      imageUrl: article.urlToImage || "/placeholder.svg?height=400&width=600",
      source: article.source.name || "NewsAPI",
      publishedAt: article.publishedAt,
      category: article.category || "General",
    }))
  } catch (error) {
    console.error("Error fetching NewsAPI articles:", error)
    return []
  }
}

