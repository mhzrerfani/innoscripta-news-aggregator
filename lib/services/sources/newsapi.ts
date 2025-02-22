import type { NewsFilters, NewsApiResponse, NewsSource } from "@/lib/types"

export const newsApiSource: NewsSource = {
  id: "newsapi",
  name: "NewsAPI",

  async fetchNews(filters?: NewsFilters) {
    try {
      const params = new URLSearchParams({
        apiKey: process.env.NEWSAPI_KEY || "",
        language: "en",
        pageSize: "30",
        page: (filters?.page || 1).toString(),
      })

      // Use top-headlines for better results
      let baseUrl = "https://newsapi.org/v2/top-headlines"
      params.append("country", "us") // Default to US news

      // Switch to everything endpoint for search queries
      if (filters?.query) {
        baseUrl = "https://newsapi.org/v2/everything"
        params.delete("country")
        params.append("q", filters.query)
        params.append("sortBy", "publishedAt")
      }

      // Handle categories for top-headlines
      if (filters?.categories?.length && baseUrl.includes("top-headlines")) {
        const category = filters.categories[0]?.toLowerCase()
        if (category && category !== "general") {
          params.append("category", category)
        }
      }

      // Handle categories for everything endpoint
      if (filters?.categories?.length && baseUrl.includes("everything")) {
        const categoryQuery = filters.categories.map((cat) => `"${cat.toLowerCase()}"`).join(" OR ")
        const currentQuery = params.get("q") || ""
        params.set("q", currentQuery ? `${currentQuery} AND (${categoryQuery})` : categoryQuery)
      }

      // Handle sources
      if (filters?.sources?.length) {
        const domains = filters.sources
          .map((source) => {
            switch (source) {
              case "reuters":
                return "reuters.com"
              case "bloomberg":
                return "bloomberg.com"
              case "business-insider":
                return "businessinsider.com"
              case "techcrunch":
                return "techcrunch.com"
              case "the-verge":
                return "theverge.com"
              case "wired":
                return "wired.com"
              case "cnn":
                return "cnn.com"
              case "bbc-news":
                return "bbc.com"
              case "associated-press":
                return "apnews.com"
              case "the-guardian":
                return "theguardian.com"
              case "the-washington-post":
                return "washingtonpost.com"
              case "wall-street-journal":
                return "wsj.com"
              default:
                return null
            }
          })
          .filter(Boolean)

        if (domains.length > 0 && baseUrl.includes("everything")) {
          params.append("domains", domains.join(","))
        }
      }

      console.log("NewsAPI Request:", {
        url: baseUrl,
        params: params.toString(),
      })

      const response = await fetch(`${baseUrl}?${params.toString()}`, {
        next: { revalidate: 300 },
        headers: {
          "X-Api-Key": process.env.NEWSAPI_KEY || "",
        },
      })

      if (response.status === 429) {
        console.warn("NewsAPI rate limit reached")
        return { articles: [], hasMore: false, totalResults: 0 }
      }

      if (!response.ok) {
        const errorText = await response.text()
        console.error("NewsAPI Error:", {
          status: response.status,
          statusText: response.statusText,
          body: errorText,
          url: baseUrl,
          params: params.toString(),
        })
        throw new Error(`NewsAPI Error: ${response.status} ${response.statusText}`)
      }

      const data: NewsApiResponse = await response.json()

      if (data.status !== "ok") {
        console.error("NewsAPI returned invalid status:", data)
        throw new Error(`NewsAPI returned status: ${data.status}`)
      }

      const articles = data.articles
        .filter((article) => {
          if (!article.title || !article.description) {
            console.warn("Skipping article with missing fields:", article)
            return false
          }
          return true
        })
        .map((article) => {
          // Extract source from URL
          const sourceDomain = new URL(article.url).hostname
          const sourceId = Object.entries({
            reuters: "reuters.com",
            bloomberg: "bloomberg.com",
            "business-insider": "businessinsider.com",
            techcrunch: "techcrunch.com",
            "the-verge": "theverge.com",
            wired: "wired.com",
            cnn: "cnn.com",
            "bbc-news": "bbc.com",
            "associated-press": "apnews.com",
            "the-guardian": "theguardian.com",
            "the-washington-post": "washingtonpost.com",
            "wall-street-journal": "wsj.com",
          }).find(([_, domain]) => sourceDomain.includes(domain.split(".")[0]))?.[0]

          return {
            title: article.title,
            description: article.description,
            url: article.url,
            imageUrl: article.urlToImage || "/placeholder.svg?height=400&width=600",
            source: article.source.name || sourceId || "NewsAPI",
            sourceId: sourceId || article.source.id || "unknown",
            publishedAt: article.publishedAt,
            category: detectCategory(article.title + " " + article.description, filters?.categories),
          }
        })

      const totalPages = Math.ceil(data.totalResults / 30)
      const currentPage = filters?.page || 1

      console.log("NewsAPI Response:", {
        totalArticles: articles.length,
        totalResults: data.totalResults,
        currentPage,
        totalPages,
      })

      return {
        articles,
        hasMore: currentPage < totalPages && currentPage < 5, // NewsAPI free tier limit
        totalResults: Math.min(data.totalResults, 150), // NewsAPI free tier limit
        currentPage,
        totalPages: Math.min(totalPages, 5), // NewsAPI free tier limit
      }
    } catch (error) {
      console.error("Error fetching NewsAPI articles:", error)
      throw error
    }
  },
}

function detectCategory(content: string, preferredCategories?: string[]): string {
  const categoryKeywords: { [key: string]: string[] } = {
    Technology: ["tech", "technology", "software", "ai", "digital", "cyber", "app", "computer", "internet", "mobile"],
    Business: ["business", "economy", "market", "finance", "stock", "trade", "company", "industry", "startup"],
    Entertainment: ["entertainment", "movie", "music", "celebrity", "film", "art", "show", "actor", "tv", "hollywood"],
    Health: ["health", "medical", "covid", "disease", "wellness", "healthcare", "doctor", "hospital", "medicine"],
    Science: ["science", "research", "study", "discovery", "space", "climate", "environment", "scientist", "lab"],
    Sports: [
      "sport",
      "football",
      "basketball",
      "soccer",
      "game",
      "player",
      "team",
      "match",
      "tournament",
      "championship",
    ],
    World: ["world", "global", "international", "country", "nation", "foreign", "europe", "asia", "america", "africa"],
  }

  const contentLower = content.toLowerCase()

  // If preferred categories are provided, check them first
  if (preferredCategories?.length) {
    for (const category of preferredCategories) {
      if (category === "General") continue
      const keywords = categoryKeywords[category as keyof typeof categoryKeywords]
      if (keywords?.some((keyword) => contentLower.includes(keyword))) {
        return category
      }
    }
  }

  // Check all categories if no match found in preferred categories
  const matchedCategories = Object.entries(categoryKeywords)
    .filter(([_, keywords]) => keywords.some((keyword) => contentLower.includes(keyword)))
    .map(([category]) => category)

  return matchedCategories[0] || "General"
}

