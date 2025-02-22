import type { NextRequest } from "next/server"
import { newsService } from "@/lib/services/news-service"
import type { NewsFilters } from "@/lib/types"

export async function GET(request: NextRequest, { params }: { params: { source: string } }) {
  try {
    const { searchParams } = new URL(request.url)
    const filters: NewsFilters = {
      query: searchParams.get("q") || undefined,
      categories: searchParams.get("category")?.split(",") || undefined,
      date: searchParams.get("date") || undefined,
      page: Number.parseInt(searchParams.get("page") || "1"),
      pageSize: Number.parseInt(searchParams.get("pageSize") || "12"),
      source: params.source !== "all" ? params.source : undefined,
    }

    const result = await newsService.getAllNews(filters)
    return Response.json(result)
  } catch (error) {
    console.error("Error in news API:", error)
    return Response.json({ error: "Failed to fetch news" }, { status: 500 })
  }
}

