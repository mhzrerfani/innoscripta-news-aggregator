"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import type { Article, NewsFilters } from "@/lib/types";

interface NewsResponse {
  articles: Article[];
  hasMore: boolean;
  totalResults: number;
}

async function fetchNews(
  filters?: NewsFilters,
  pageParam = 1,
): Promise<NewsResponse> {
  try {
    const params = new URLSearchParams();

    if (filters?.query) {
      params.set("q", filters.query);
    }

    if (filters?.category) {
      params.set("category", filters.category);
    }

    if (filters?.date) {
      params.set("date", filters.date);
    }

    params.set("page", pageParam.toString());
    params.set("pageSize", "12");

    const response = await fetch(
      `/api/news/${filters?.source}?${params.toString()}`,
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.details || `HTTP error! status: ${response.status}`,
      );
    }

    const data = await response.json();

    if (!data || !Array.isArray(data.articles)) {
      console.error("Invalid response format:", data);
      throw new Error("Invalid response format from API");
    }

    return data;
  } catch (error) {
    console.error("Error fetching news:", error);
    throw error;
  }
}

export function useInfiniteNews(
  filters?: Omit<NewsFilters, "page" | "pageSize">,
) {
  return useInfiniteQuery({
    queryKey: ["news", filters?.source, filters?.category, filters?.query],
    queryFn: ({ pageParam }) => fetchNews(filters, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _, lastPageParam) =>
      lastPage.hasMore ? lastPageParam + 1 : undefined,
    getPreviousPageParam: (_, __, firstPageParam) =>
      firstPageParam > 1 ? firstPageParam - 1 : undefined,
  });
}
