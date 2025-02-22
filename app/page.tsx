import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Newspaper } from "lucide-react"
import NewsGrid from "@/components/news-grid"
import SearchFilters from "@/components/search-filters"
import PreferencesDialog from "@/components/preferences-dialog"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Newspaper className="h-6 w-6" />
              <h1 className="text-2xl font-bold">News Aggregator</h1>
            </div>
            <PreferencesDialog />
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <SearchFilters />
        <Tabs defaultValue="all" className="mt-6 w-full">
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="all">All Sources</TabsTrigger>
            <TabsTrigger value="newsapi">NewsAPI</TabsTrigger>
            <TabsTrigger value="guardian">The Guardian</TabsTrigger>
            <TabsTrigger value="nyt">New York Times</TabsTrigger>
            <TabsTrigger value="bbc">BBC News</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-6">
            <NewsGrid source="all" />
          </TabsContent>
          <TabsContent value="newsapi" className="mt-6">
            <NewsGrid source="newsapi" />
          </TabsContent>
          <TabsContent value="guardian" className="mt-6">
            <NewsGrid source="guardian" />
          </TabsContent>
          <TabsContent value="nyt" className="mt-6">
            <NewsGrid source="nyt" />
          </TabsContent>
          <TabsContent value="bbc" className="mt-6">
            <NewsGrid source="bbc" />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

