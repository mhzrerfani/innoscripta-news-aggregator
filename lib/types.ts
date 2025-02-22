export interface Article {
  title: string
  description: string
  url: string
  imageUrl: string
  source: string
  publishedAt: string
  category?: string
}

export interface NewsFilters {
  query?: string
  category?: string
  date?: string
  sources?: string[]
}

export interface NewsSource {
  id: string
  name: string
  fetchNews: (filters?: NewsFilters) => Promise<Article[]>
}

export interface NewsSourceConfig {
  id: string
  name: string
  enabled: boolean
}

