import type { Article, NewsFilters } from "@/lib/types"
import { fetchWithRetry } from "@/lib/utils"

export async function getGuardianNews(filters?: NewsFilters): Promise<Article[]> {
  try {
    const params = new URLSearchParams({
      "api-key": process.env.GUARDIAN_API_KEY || "",
      "show-fields": "thumbnail,trailText",
      "page-size": "20",
    })

    if (filters?.query) {
      params.append("q", filters.query)
    }

    if (filters?.category && filters.category !== "All") {
      params.append("section", filters.category.toLowerCase())
    }

    if (filters?.date) {
      params.append("from-date", new Date(filters.date).toISOString().split("T")[0])
    }

    const response = await fetchWithRetry(`https://content.guardianapis.com/search?${params.toString()}`, {
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      console.error("Guardian API Error:", await response.text())
      return []
    }

    const data = await response.json()

    return data.response.results.map((article: any) => ({
      title: article.webTitle,
      description: article.fields.trailText,
      url: article.webUrl,
      imageUrl: article.fields.thumbnail,
      source: "The Guardian",
      publishedAt: article.webPublicationDate,
      category: article.sectionName,
    }))
  } catch (error) {
    console.error("Error fetching Guardian news:", error)
    return []
  }
}

