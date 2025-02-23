"use client"

import { Button } from "@/components/ui/button"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

const availableCategories = [
  "General",
  "Business",
  "Culture",
  "Wellness",
  "Science",
  "Sport",
  "Technology",
  "World",
]

export function CategoryFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const queryClient = useQueryClient()
  const currentCategory = searchParams.get("category")

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams)

    if (category === currentCategory || (category === "General" && !currentCategory)) {
      // If clicking the current category or General when no category is selected, remove the filter
      params.delete("category")
    } else {
      params.set("category", category)
    }

    // Reset to first page when changing category
    params.delete("page")

    router.push(`${pathname}?${params.toString()}`)
    queryClient.invalidateQueries({ queryKey: ["news"] })
  }

  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex space-x-2 pb-2">
        {availableCategories.map((category) => (
          <Button
            key={category}
            variant={
              currentCategory === category || (!currentCategory && category === "General") ? "default" : "outline"
            }
            size="sm"
            onClick={() => handleCategoryChange(category)}
            className="min-w-[80px]"
          >
            {category}
          </Button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}

