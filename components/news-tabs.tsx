"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { usePreferences } from "@/hooks/use-preferences"
import NewsGrid from "./news-grid"
import { useSearchParams, useRouter, usePathname } from "next/navigation"

export function NewsTabs() {
  const { preferences } = usePreferences()
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  // Get current source from URL or default to "all"
  const currentSource = searchParams.get("source") || "all"

  // Define all possible sources
  const allSources = [
    { id: "all", label: "All Sources" },
    { id: "newsapi", label: "NewsAPI" },
    { id: "guardian", label: "The Guardian" },
    { id: "bbc", label: "BBC News" },
  ]

  // Filter sources based on preferences
  const availableSources = allSources.filter((source) => source.id === "all" || preferences.sources.includes(source.id))

  // If current source is not in available sources, default to "all"
  if (!availableSources.find((source) => source.id === currentSource)) {
    const params = new URLSearchParams(searchParams)
    params.set("source", "all")
    router.push(`${pathname}?${params.toString()}`)
  }

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams)
    params.set("source", value)
    router.push(`${pathname}?${params.toString()}`)
  }

  if (availableSources.length <= 1) return null

  return (
    <Tabs defaultValue={currentSource} onValueChange={handleTabChange} className="mb-6">
      <TabsList>
        {availableSources.map((source) => (
          <TabsTrigger key={source.id} value={source.id}>
            {source.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {availableSources.map((source) => (
        <TabsContent key={source.id} value={source.id}>
          <NewsGrid source={source.id} />
        </TabsContent>
      ))}
    </Tabs>
  )
}

