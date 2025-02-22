import clsx, { ClassValue } from "clsx"
import type { Article, NewsFilters } from "./types"
import { twMerge } from "tailwind-merge";

export function filterArticles(articles: Article[], filters?: NewsFilters): Article[] {
  if (!filters) return articles

  return articles.filter((article) => {
    if (filters.sources?.length && !filters.sources.includes(article.source.toLowerCase().replace(/ /g, ""))) {
      return false
    }

    if (
      filters.category &&
      filters.category !== "All" &&
      article.category?.toLowerCase() !== filters.category.toLowerCase()
    ) {
      return false
    }

    if (filters.date) {
      const filterDate = new Date(filters.date).toDateString()
      return new Date(article.publishedAt).toDateString() === filterDate
    }

    return true
  })
}

export function removeDuplicates(articles: Article[]): Article[] {
  return articles.filter((article, index, self) => index === self.findIndex((a) => a.url === article.url))
}

export function sortByDate(articles: Article[]): Article[] {
  return [...articles].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
}

export async function fetchWithRetry(url: string, options: RequestInit, maxRetries = 3): Promise<Response> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options)

      if (response.status === 429) {
        const retryAfter = response.headers.get("retry-after")
        const waitTime = retryAfter ? Number.parseInt(retryAfter) * 1000 : Math.min(1000 * Math.pow(2, i), 10000)
        await new Promise((resolve) => setTimeout(resolve, waitTime))
        continue
      }

      return response
    } catch (error) {
      if (i === maxRetries - 1) throw error
      await new Promise((resolve) => setTimeout(resolve, 1000 * Math.pow(2, i)))
    }
  }
  throw new Error("Max retries reached")
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
