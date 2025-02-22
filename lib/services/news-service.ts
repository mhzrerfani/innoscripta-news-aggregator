import type { Article, NewsFilters, NewsSource } from "@/lib/types"
import { newsApiSource } from "./sources/newsapi"
import { guardianSource } from "./sources/guardian"
import { bbcSource } from "./sources/bbc"

export class NewsAggregatorService {
  private sources: { [key: string]: NewsSource }

  constructor() {
    this.sources = {
      newsapi: newsApiSource,
      guardian: guardianSource,
      bbc: bbcSource,
    }
  }

  async getAllNews(filters?: NewsFilters) {
    try {
      console.log("Fetching news with filters:", filters)

      // If a specific source is requested, only use that source
      if (filters?.source && this.sources[filters.source]) {
        const result = await this.sources[filters.source].fetchNews(filters)
        return {
          articles: result.articles || [],
          hasMore: result.hasMore,
          totalResults: result.totalResults,
        }
      }

      // Otherwise, fetch from all enabled sources
      const enabledSources = Object.values(this.sources)

      const results = await Promise.allSettled(
        enabledSources.map(async (source) => {
          try {
            const result = await source.fetchNews(filters)
            return {
              articles: Array.isArray(result.articles) ? result.articles : [],
              hasMore: !!result.hasMore,
            }
          } catch (error) {
            console.error(`Error fetching from ${source.name}:`, error)
            return { articles: [], hasMore: false }
          }
        }),
      )

      let allArticles: Article[] = []
      const errors: string[] = []

      results.forEach((result, index) => {
        const sourceName = enabledSources[index].name
        if (result.status === "fulfilled" && Array.isArray(result.value.articles)) {
          allArticles = [...allArticles, ...result.value.articles]
        } else {
          const errorMessage =
            result.status === "rejected"
              ? `Failed to fetch from ${sourceName}: ${result.reason}`
              : `Invalid response from ${sourceName}`
          console.error(errorMessage)
          errors.push(errorMessage)
        }
      })

      console.log(`Fetched ${allArticles.length} articles total`)
      if (errors.length > 0) {
        console.warn(`Encountered ${errors.length} errors while fetching:`, errors)
      }

      const processed = this.processArticles(allArticles, filters)
      const pageSize = filters?.pageSize || 12
      const page = filters?.page || 1
      const startIndex = (page - 1) * pageSize
      const endIndex = startIndex + pageSize

      const paginatedArticles = processed.slice(startIndex, endIndex)

      return {
        articles: paginatedArticles,
        hasMore: endIndex < processed.length,
        totalResults: processed.length,
      }
    } catch (error) {
      console.error("Error in getAllNews:", error)
      return { articles: [], hasMore: false, totalResults: 0 }
    }
  }

  private processArticles(articles: Article[], filters?: NewsFilters): Article[] {
    try {
      if (!Array.isArray(articles)) return []

      let processed = this.removeDuplicates(articles)

      if (filters) {
        processed = this.applyFilters(processed, filters)
      }

      return this.sortByDate(processed)
    } catch (error) {
      console.error("Error processing articles:", error)
      return []
    }
  }

  private removeDuplicates(articles: Article[]): Article[] {
    return articles.filter((article, index, self) => index === self.findIndex((a) => a.url === article.url))
  }

  private applyFilters(articles: Article[], filters: NewsFilters): Article[] {
    let filtered = articles

    if (filters.categories?.length) {
      filtered = filtered.filter(
        (article) =>
          article.category && filters.categories?.some((cat) => article.category?.toLowerCase() === cat.toLowerCase()),
      )
    }

    if (filters.date) {
      const filterDate = new Date(filters.date).toDateString()
      filtered = filtered.filter((article) => new Date(article.publishedAt).toDateString() === filterDate)
    }

    if (filters.query) {
      const query = filters.query.toLowerCase()
      filtered = filtered.filter(
        (article) => article.title.toLowerCase().includes(query) || article.description?.toLowerCase().includes(query),
      )
    }

    return filtered
  }

  private sortByDate(articles: Article[]): Article[] {
    return [...articles].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
  }
}

export const newsService = new NewsAggregatorService()

