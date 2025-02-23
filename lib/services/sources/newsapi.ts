import { config } from "@/lib/config";
import type { NewsFilters, NewsApiResponse, NewsSource } from "@/lib/types";

const newsApiConfig = config.sources.newsapi;

export const newsApiSource: NewsSource = {
  id: "newsapi",
  name: "NewsAPI",

  async fetchNews(filters?: NewsFilters) {
    try {
      const pageSize = 12;
      const currentPage = filters?.page || 1;

      const params = new URLSearchParams({
        apiKey: newsApiConfig.key,
        language: newsApiConfig.language,
        pageSize: pageSize.toString(),
        page: currentPage.toString(),
      });

      const baseUrl = `${newsApiConfig.baseUrl}/everything`;

      const queryParts: string[] = [];

      if (filters?.query) {
        queryParts.push(`(${filters.query})`);
      }

      if (filters?.category) {
        const categoryKeywords = newsApiConfig.categoryMap[filters.category];
        if (categoryKeywords) {
          queryParts.push(`(${categoryKeywords.join(" OR ")})`);
        }
      }

      params.append("q", queryParts.join(" AND "));
      params.append("sortBy", "publishedAt");

      if (filters?.date) {
        const selectedDate = new Date(filters.date);
        const dateStr = selectedDate.toISOString().split("T")[0];
        params.append("from", `${dateStr}T00:00:00Z`);
        params.append("to", `${dateStr}T23:59:59Z`);
      }

      params.append("domains", newsApiConfig.domains.join(","));

      const response = await fetch(`${baseUrl}?${params.toString()}`, {
        next: { revalidate: 300 },
        headers: {
          "X-Api-Key": newsApiConfig.key,
        },
      });

      if (response.status === 429) {
        throw new Error("NewsAPI rate limit exceeded");
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error("NewsAPI Error:", {
          status: response.status,
          statusText: response.statusText,
          body: errorText,
          url: baseUrl,
          params: params.toString(),
        });
        throw new Error(
          `NewsAPI Error: ${response.status} ${response.statusText}`,
        );
      }

      const data: NewsApiResponse = await response.json();

      if (data.status !== "ok") {
        console.error("NewsAPI returned invalid status:", data);
        throw new Error(`NewsAPI returned status: ${data.status}`);
      }

      const articles = data.articles
        .filter(
          (article) =>
            !(!article.title || !article.description || !article.publishedAt),
        )
        .map((article) => ({
          title: article.title,
          description: article.description,
          url: article.url,
          imageUrl: article.urlToImage,
          source: article.source.name || "NewsAPI",
          publishedAt: article.publishedAt,
          category: filters?.category,
        }));

      const totalResults = Math.min(data.totalResults, 100);
      const totalPages = Math.ceil(totalResults / pageSize);
      const hasMore = currentPage < totalPages && currentPage < 5;

      return {
        articles,
        hasMore,
        totalResults,
        currentPage,
        totalPages: Math.min(totalPages, 5),
      };
    } catch (error) {
      console.error("Error fetching NewsAPI articles:", error);
      return { articles: [], hasMore: false, totalResults: 0 };
    }
  },
};
