import { Newspaper } from "lucide-react"
import SearchFilters from "@/components/search-filters"
import { PreferencesSidebar } from "@/components/preferences-sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { NewsTabs } from "@/components/news-tabs"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Newspaper className="h-6 w-6" />
              <h1 className="text-xl font-bold sm:text-2xl">News Aggregator</h1>
            </div>
            <div className="flex items-center gap-2">
              <PreferencesSidebar />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>
      <main className="container mx-auto min-h-[calc(100vh-73px)] px-4 py-6">
        <SearchFilters />
        <div className="mt-6">
          <NewsTabs />
        </div>
      </main>
    </div>
  )
}

