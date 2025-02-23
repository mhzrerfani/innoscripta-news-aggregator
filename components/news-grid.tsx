"use client";

import { Suspense } from "react";
import NewsCard from "./news-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useInfiniteNews } from "@/hooks/use-news";
import { InfiniteScroll } from "./infinite-scroll";
import type { NewsFilters } from "@/lib/types";
import { useSearchParams } from "next/navigation";

function NewsContent({ source }: { source: string }) {
  const searchParams = useSearchParams();

  const filters: NewsFilters = {
    query: searchParams.get("q") || undefined,
    category: searchParams.get("category") ?? undefined,
    date: searchParams.get("date") || undefined,
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteNews(source, filters);

  if (isLoading) {
    return <NewsGridSkeleton />;
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Failed to load news articles. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  const articles = data?.pages.flatMap((page) => page.articles) || [];

  if (!articles.length) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          {filters.query
            ? `No articles found for "${filters.query}". Try different search terms or filters.`
            : "No articles found. Try adjusting your filters."}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article, index) => (
          <NewsCard
            key={`${article.source}-${article.url}-${index}`}
            article={article}
          />
        ))}
      </div>
      {isFetchingNextPage && (
        <div className="mt-8 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      )}
      <InfiniteScroll
        onLoadMore={() => fetchNextPage()}
        hasMore={!!hasNextPage}
        isLoading={isFetchingNextPage}
      />
    </>
  );
}

export default function NewsGrid({ source }: { source: string }) {
  return (
    <Suspense fallback={<NewsGridSkeleton />}>
      <NewsContent source={source} />
    </Suspense>
  );
}

function NewsGridSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-4">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  );
}
