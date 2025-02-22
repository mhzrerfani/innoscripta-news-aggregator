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
  categories?: string[]
  date?: string
  page?: number
  pageSize?: number
  source?: string
  sources?: string[]
}

export interface NewsSource {
  id: string
  name: string
  fetchNews: (filters?: NewsFilters) => Promise<{
    articles: Article[]
    hasMore: boolean
    totalResults: number
    currentPage?: number
    totalPages?: number
  }>
}

export interface NewsApiResponse {
  status: string
  totalResults: number
  articles: NewsApiArticle[]
}

export interface NewsApiArticle {
  source: {
    id: string
    name: string
  }
  author: string
  title: string
  description: string
  url: string
  urlToImage: string
  publishedAt: string
  content: string
}

