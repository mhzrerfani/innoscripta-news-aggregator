"use client"

import { usePreferences } from "@/hooks/use-preferences"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, Settings2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useState } from "react"

const availableCategories = [
  "General",
  "Business",
  "Entertainment",
  "Health",
  "Science",
  "Sports",
  "Technology",
  "World",
]

const availableSources = [
  { id: "newsapi", name: "NewsAPI" },
  { id: "guardian", name: "The Guardian" },
  { id: "bbc", name: "BBC News" },
]

interface PreferencesContentProps {
  className?: string
}

function PreferencesContent({ className }: PreferencesContentProps) {
  const { preferences, savePreferences, isLoaded } = usePreferences()

  if (!isLoaded) return null

  const handleCategoryChange = (category: string, checked: boolean) => {
    const newCategories = checked
      ? [...preferences.categories, category]
      : preferences.categories.filter((c) => c !== category)

    if (newCategories.length === 0) return

    savePreferences({ ...preferences, categories: newCategories })
  }

  const handleSourceChange = (sourceId: string, checked: boolean) => {
    const newSources = checked ? [...preferences.sources, sourceId] : preferences.sources.filter((s) => s !== sourceId)

    if (newSources.length === 0) return

    savePreferences({ ...preferences, sources: newSources })
  }

  return (
    <div className={`space-y-4 py-4 ${className}`}>
      <div className="px-3 py-2">
        <h2 className="mb-2 text-lg font-semibold tracking-tight">News Preferences</h2>
        <p className="text-sm text-muted-foreground">
          Customize your news feed by selecting your preferred sources and categories.
        </p>
      </div>
      <Separator />
      <div className="px-3 py-2">
        <h3 className="mb-2 text-sm font-semibold">News Sources</h3>
        {preferences.sources.length === 1 && (
          <Alert className="mb-3">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>You must keep at least one news source selected.</AlertDescription>
          </Alert>
        )}
        <div className="grid grid-cols-1 gap-4 mb-6">
          {availableSources.map((source) => (
            <div key={source.id} className="flex items-center space-x-2">
              <Checkbox
                id={`source-${source.id}`}
                checked={preferences.sources.includes(source.id)}
                onCheckedChange={(checked) => handleSourceChange(source.id, checked as boolean)}
                disabled={preferences.sources.length === 1 && preferences.sources.includes(source.id)}
              />
              <Label
                htmlFor={`source-${source.id}`}
                className="flex-1 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {source.name}
              </Label>
            </div>
          ))}
        </div>
        <Separator className="mb-6" />
        <h3 className="mb-2 text-sm font-semibold">Categories</h3>
        {preferences.categories.length === 1 && (
          <Alert className="mb-3">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>You must keep at least one category selected.</AlertDescription>
          </Alert>
        )}
        <ScrollArea className="h-[300px] pr-4">
          <div className="grid grid-cols-1 gap-4">
            {availableCategories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category}`}
                  checked={preferences.categories.includes(category)}
                  onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
                  disabled={preferences.categories.length === 1 && preferences.categories.includes(category)}
                />
                <Label
                  htmlFor={`category-${category}`}
                  className="flex-1 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {category}
                </Label>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}

export function PreferencesSidebar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Mobile drawer */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0">
            <Settings2 className="h-5 w-5" />
            <span className="sr-only">Open preferences</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] sm:w-[400px]">
          <SheetHeader>
            <SheetTitle>Preferences</SheetTitle>
          </SheetHeader>
          <PreferencesContent className="px-1" />
        </SheetContent>
      </Sheet>
    </>
  )
}

