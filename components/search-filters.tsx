"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const categories = [
  "All",
  "World",
  "Politics",
  "Business",
  "Technology",
  "Sports",
  "Entertainment",
  "Science",
  "Health",
]

export default function SearchFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [date, setDate] = useState<Date>()

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const searchQuery = formData.get("search")
    const category = formData.get("category")

    const params = new URLSearchParams(searchParams)
    if (searchQuery) params.set("q", searchQuery.toString())
    if (category) params.set("category", category.toString())
    if (date) params.set("date", date.toISOString())

    router.push(`/?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSearch} className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            name="search"
            placeholder="Search articles..."
            className="pl-9"
            defaultValue={searchParams.get("q") ?? ""}
          />
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">Category</h4>
                <Select name="category" defaultValue={searchParams.get("category") ?? "All"}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Date</h4>
                <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <Button type="submit">Search</Button>
      </div>
    </form>
  )
}

