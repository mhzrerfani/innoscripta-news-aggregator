import type { Article, NewsFilters } from "@/lib/types"
import { fetchWithRetry } from "@/lib/utils"

// Cache implementation
const cache = new Map<string, { data: Article[]; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export async function getNYTNews(filters?: NewsFilters): Promise<Article[]> {
  // Fallback data in case of rate limiting
  const fallbackArticles: Article[] = [
    {
      title: "Technology Trends in 2024",
      description: "An overview of the latest technology trends shaping our future.",
      url: "https://example.com/tech-trends",
      imageUrl: "/placeholder.svg?height=400&width=600",
      source: "New York Times",
      publishedAt: new Date().toISOString(),
      category: "Technology",
    },
    {
      title: "Global Economic Outlook",
      description: "Analysis of current global economic conditions and future predictions.",
      url: "https://example.com/economic-outlook",
      imageUrl: "/placeholder.svg?height=400&width=600",
      source: "New York Times",
      publishedAt: new Date().toISOString(),
      category: "Business",
    },
    {
      title: "Climate Change Impact Report",
      description: "Latest findings on climate change and its global impact.",
      url: "https://example.com/climate-report",
      imageUrl: "/placeholder.svg?height=400&width=600",
      source: "New York Times",
      publishedAt: new Date().toISOString(),
      category: "Science",
    },
  ]

  try {
    // Generate cache key based on filters
    const cacheKey = JSON.stringify(filters || {})
    const cached = cache.get(cacheKey)

    // Return cached data if it's still valid
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data
    }

    // Build API URL with filters
    const params = new URLSearchParams({
      "api-key": process.env.NYT_API_KEY || "",
    })

    if (filters?.query) {
      params.append("q", filters.query)
    }

    if (filters?.category && filters.category !== "All") {
      params.append("fq", `news_desk:("${filters.category}")`)
    }

    if (filters?.date) {
      const dateStr = new Date(filters.date).toISOString().split("T")[0]
      params.append("begin_date", dateStr.replace(/-/g, ""))
      params.append("end_date", dateStr.replace(/-/g, ""))
    }

    const response = await fetchWithRetry(
      `https://api.nytimes.com/svc/search/v2/articlesearch.json?${params.toString()}`,
      {
        next: { revalidate: 3600 },
        headers: {
          Accept: "application/json",
        },
      },
    )

    if (!response.ok) {
      console.error("NYT API Error:", await response.text())
      return fallbackArticles
    }

    const data = await response.json()

    if (!data.response?.docs) {
      console.error("NYT API returned invalid data:", data)
      return fallbackArticles
    }

    const articles = data.response.docs.map((article: any) => ({
      title: article.headline.main,
      description: article.abstract || article.snippet || article.lead_paragraph,
      url: article.web_url,
      imageUrl: article.multimedia?.[0]?.url
        ? `https://www.nytimes.com/${article.multimedia[0].url}`
        : "/placeholder.svg?height=400&width=600",
      source: "New York Times",
      publishedAt: article.pub_date,
      category: article.news_desk || article.section_name,
    }))

    // Cache the results
    cache.set(cacheKey, {
      data: articles,
      timestamp: Date.now(),
    })

    return articles
  } catch (error) {
    console.error("Error fetching NYT news:", error)
    return fallbackArticles
  }
}

