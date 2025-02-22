import type { Article, NewsFilters, NewsSource } from "@/lib/types"
import { filterArticles, removeDuplicates, sortByDate } from "@/lib/utils"
import { getGuardianNews } from "./sources/guardian"
import { getNYTNews } from "./sources/nyt"
import { getBBCNews } from "./sources/bbc"
import { getNewsAPIArticles } from "./sources/newsapi"

const newsSources: NewsSource[] = [
  { id: "guardian", name: "The Guardian", fetchNews: getGuardianNews },
  { id: "nyt", name: "New York Times", fetchNews: getNYTNews },
  { id: "bbc", name: "BBC News", fetchNews: getBBCNews },
  { id: "newsapi", name: "NewsAPI", fetchNews: getNewsAPIArticles },
]

export async function getAllNews(filters?: NewsFilters): Promise<Article[]> {
  try {
    const results = await Promise.allSettled(newsSources.map((source) => source.fetchNews(filters)))

    let articles: Article[] = []
    results.forEach((result, index) => {
      if (result.status === "fulfilled") {
        articles = [...articles, ...result.value]
      } else {
        console.error(`Error fetching news from ${newsSources[index].name}:`, result.reason)
      }
    })

    articles = removeDuplicates(articles)
    articles = filterArticles(articles, filters)
    articles = sortByDate(articles)

    return articles
  } catch (error) {
    console.error("Error fetching all news:", error)
    return []
  }
}

export function getNewsSource(sourceId: string): NewsSource | undefined {
  return newsSources.find((source) => source.id === sourceId)
}

