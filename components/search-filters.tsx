"use client"

import type React from "react"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, Filter, Loader2, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Calendar } from "@/components/ui/calendar"
import { useQueryClient } from "@tanstack/react-query"
import { format } from "date-fns"

export default function SearchFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, setIsPending] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const queryClient = useQueryClient()

  const [date, setDate] = useState<Date | undefined>(() => {
    const dateParam = searchParams.get("date")
    return dateParam ? new Date(dateParam) : undefined
  })

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsPending(true)

    const formData = new FormData(e.currentTarget)
    const params = new URLSearchParams(searchParams)

    const searchQuery = formData.get("search")
    if (searchQuery) {
      params.set("q", searchQuery.toString())
    } else {
      params.delete("q")
    }

    if (date) {
      params.set("date", date.toISOString())
    } else {
      params.delete("date")
    }

    setIsOpen(false)

    queryClient.invalidateQueries({ queryKey: ["news"] })

    router.push(`/?${params.toString()}`)
    setIsPending(false)
  }

  const handleReset = () => {
    setDate(undefined)
    setIsPending(true)
    const params = new URLSearchParams(searchParams)
    params.delete("q")
    params.delete("date")
    router.push(`/?${params.toString()}`)
    queryClient.invalidateQueries({ queryKey: ["news"] })
    setIsPending(false)
  }

  const hasFilters = searchParams.get("q") || searchParams.get("date")

  return (
    <form onSubmit={handleSearch} className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            name="search"
            placeholder="Search news..."
            className="pl-9 pr-12"
            defaultValue={searchParams.get("q") ?? ""}
          />
          {searchParams.get("q") && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 h-7 w-7 -translate-y-1/2 p-0"
              onClick={() => {
                const params = new URLSearchParams(searchParams)
                params.delete("q")
                router.push(`/?${params.toString()}`)
              }}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear search</span>
            </Button>
          )}
        </div>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filters
              {date && (
                <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                  {format(date, "MMM d, yyyy")}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Search Filters</SheetTitle>
            </SheetHeader>
            <div className="mt-4 space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">Date</h4>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border w-full max-w-[20rem]"
                  disabled={(date) => date > new Date() || date < new Date("2000-01-01")}
                />
              </div>
            </div>
          </SheetContent>
        </Sheet>
        <Button type="submit" disabled={isPending}>
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
        </Button>
        {hasFilters && (
          <Button type="button" variant="outline" onClick={handleReset} disabled={isPending}>
            Reset
          </Button>
        )}
      </div>
    </form>
  )
}

