import { Suspense } from "react"
import { getAllNews, getNewsSource } from "@/lib/services/news-service"
import NewsCard from "./news-card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"
import type { NewsFilters } from "@/lib/types"

export default async function NewsGrid({
  source,
  searchParams,
}: {
  source: string
  searchParams?: { [key: string]: string }
}) {
  const filters: NewsFilters = {
    query: searchParams?.q,
    category: searchParams?.category,
    date: searchParams?.date,
    sources: source === "all" ? undefined : [source],
  }

  const news = source === "all" ? await getAllNews(filters) : (await getNewsSource(source)?.fetchNews(filters)) || []

  return (
    <Suspense fallback={<NewsGridSkeleton />}>
      {news.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {news.map((article, index) => (
            <NewsCard key={`${article.source}-${index}`} article={article} />
          ))}
        </div>
      ) : (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>No articles found. Try adjusting your search filters.</AlertDescription>
        </Alert>
      )}
    </Suspense>
  )
}

function NewsGridSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-4">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  )
}

