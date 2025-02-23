import type { NewsFilters, NewsApiResponse, NewsSource } from "@/lib/types";

export const newsApiSource: NewsSource = {
  id: "newsapi",
  name: "NewsAPI",

  async fetchNews(filters?: NewsFilters) {
    try {
      const pageSize = 12;
      const currentPage = filters?.page || 1;

      const params = new URLSearchParams({
        apiKey: process.env.NEWSAPI_KEY || "",
        language: "en",
        pageSize: pageSize.toString(),
        page: currentPage.toString(),
      });

      const baseUrl = "https://newsapi.org/v2/everything";

      const queryParts: string[] = [];

      if (filters?.query) {
        queryParts.push(`(${filters.query})`);
      }

      if (filters?.category && filters.category !== "General") {
        const categoryMap: { [key: string]: string[] } = {
          Business: ["business", "economy", "market", "finance", "trade"],
          Culture: ["entertainment", "movie", "music", "celebrity", "culture"],
          Wellness: ["health", "medical", "medicine", "healthcare"],
          Science: ["science", "research", "discovery", "space"],
          Sport: ["sport", "sports", "game", "match", "tournament"],
          Technology: ["tech", "technology", "digital", "software", "cyber"],
          World: ["world", "international", "global", "foreign"],
        };

        const categoryKeywords = categoryMap[filters.category];
        if (categoryKeywords) {
          queryParts.push(`(${categoryKeywords.join(" OR ")})`);
        }
      }

      if (queryParts.length === 0) {
        queryParts.push("(world OR news OR breaking)");
      }

      params.append("q", queryParts.join(" AND "));
      params.append("sortBy", "publishedAt");

      if (filters?.date) {
        const selectedDate = new Date(filters.date);
        const dateStr = selectedDate.toISOString().split("T")[0];
        params.append("from", `${dateStr}T00:00:00Z`);
        params.append("to", `${dateStr}T23:59:59Z`);
      }

      params.append(
        "domains",
        [
          "reuters.com",
          "bloomberg.com",
          "businessinsider.com",
          "techcrunch.com",
          "theverge.com",
          "wired.com",
          "cnn.com",
          "bbc.com",
          "apnews.com",
        ].join(","),
      );

      console.log("NewsAPI Request:", {
        url: baseUrl,
        params: params.toString(),
        query: queryParts,
        page: currentPage,
        pageSize,
      });

      const response = await fetch(`${baseUrl}?${params.toString()}`, {
        next: { revalidate: 300 },
        headers: {
          "X-Api-Key": process.env.NEWSAPI_KEY || "",
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

      let articles = data.articles
        .filter((article) => {
          if (!article.title || !article.description || !article.publishedAt) {
            return false;
          }

          if (filters?.date) {
            const articleDate = new Date(article.publishedAt).toDateString();
            const filterDate = new Date(filters.date).toDateString();
            if (articleDate !== filterDate) {
              return false;
            }
          }

          if (filters?.query) {
            const searchLower = filters.query.toLowerCase();
            const titleLower = article.title.toLowerCase();
            const descLower = article.description.toLowerCase();
            if (
              !titleLower.includes(searchLower) &&
              !descLower.includes(searchLower)
            ) {
              return false;
            }
          }

          return true;
        })
        .map((article) => ({
          title: article.title,
          description: article.description,
          url: article.url,
          imageUrl:
            article.urlToImage || "/placeholder.svg?height=400&width=600",
          source: article.source.name || "NewsAPI",
          publishedAt: article.publishedAt,
          category: filters?.category,
        }));

      articles = articles.sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
      );

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
