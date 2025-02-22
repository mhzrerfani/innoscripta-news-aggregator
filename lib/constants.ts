export const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export const AVAILABLE_CATEGORIES = [
  "World",
  "Politics",
  "Business",
  "Technology",
  "Sports",
  "Entertainment",
  "Science",
  "Health",
] as const

export const DEFAULT_PREFERENCES = {
  sources: ["newsapi", "guardian", "nyt", "bbc"],
  categories: ["World", "Technology", "Business"],
}

export interface NewsSourceConfig {
  id: string
  name: string
  enabled: boolean
}

export const NEWS_SOURCES: NewsSourceConfig[] = [
  { id: "newsapi", name: "NewsAPI", enabled: true },
  { id: "guardian", name: "The Guardian", enabled: true },
  { id: "nyt", name: "New York Times", enabled: true },
  { id: "bbc", name: "BBC News", enabled: true },
]

