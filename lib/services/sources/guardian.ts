import type { GuardianApiResponse, NewsFilters, NewsSource } from "@/lib/types";

export const guardianSource: NewsSource = {
  id: "guardian",
  name: "The Guardian",

  async fetchNews(filters?: NewsFilters) {
    try {
      const params = new URLSearchParams({
        "api-key": process.env.GUARDIAN_API_KEY || "",
        "show-fields": "thumbnail,trailText",
        "page-size": "30",
      });

      if (filters?.query) {
        params.append("q", filters.query);
      }

      if (filters?.category) {
        const category = filters.category.toLowerCase();
        if (category !== "general") {
          params.append("section", category);
        }
      }

      if (filters?.date) {
        const selectedDate = new Date(filters.date);
        const dateStr = selectedDate.toISOString().split("T")[0];
        params.append("from-date", dateStr);
        params.append("order-by", "oldest");
        const nextDay = new Date(selectedDate);
        nextDay.setDate(nextDay.getDate() + 1);
        params.append("to-date", nextDay.toISOString().split("T")[0]);
      }

      const response = await fetch(
        `https://content.guardianapis.com/search?${params.toString()}`,
        {
          next: { revalidate: 3600 },
        },
      );

      if (!response.ok) {
        console.error("Guardian API Error:", await response.text());
        return { articles: [], hasMore: false, totalResults: 0 };
      }

      const data: GuardianApiResponse = await response.json();

      const articles = data.response.results.map((article) => ({
        title: article.webTitle,
        description: article.fields?.trailText || "",
        url: article.webUrl,
        imageUrl:
          article.fields?.thumbnail || "/placeholder.svg?height=400&width=600",
        source: "The Guardian",
        publishedAt: article.webPublicationDate,
        category: article.sectionName,
      }));

      return {
        articles,
        hasMore: data.response.currentPage < data.response.pages,
        totalResults: data.response.total,
      };
    } catch (error) {
      console.error("Error fetching Guardian news:", error);
      return { articles: [], hasMore: false, totalResults: 0 };
    }
  },
};
