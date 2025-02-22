"use client"

import { useState } from "react"
import { Settings2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { usePreferences } from "@/hooks/use-preferences"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

const availableSources = [
  { id: "newsapi", name: "NewsAPI" },
  { id: "guardian", name: "The Guardian" },
  { id: "bbc", name: "BBC News" },
]

const availableCategories = [
  "World",
  "Politics",
  "Business",
  "Technology",
  "Sports",
  "Entertainment",
  "Science",
  "Health",
]

export default function PreferencesDialog() {
  const { preferences, savePreferences, isLoaded } = usePreferences()
  const [tempPreferences, setTempPreferences] = useState(preferences)
  const [open, setOpen] = useState(false)

  if (!isLoaded) return null

  const handleSourceChange = (sourceId: string, checked: boolean) => {
    const newSources = checked
      ? [...tempPreferences.sources, sourceId]
      : tempPreferences.sources.filter((s) => s !== sourceId)

    if (newSources.length === 0) {
      return // Prevent removing all sources
    }

    setTempPreferences({ ...tempPreferences, sources: newSources })
  }

  const handleCategoryChange = (category: string, checked: boolean) => {
    const newCategories = checked
      ? [...tempPreferences.categories, category]
      : tempPreferences.categories.filter((c) => c !== category)

    if (newCategories.length === 0) {
      return // Prevent removing all categories
    }

    setTempPreferences({ ...tempPreferences, categories: newCategories })
  }

  const handleOpenChange = (open: boolean) => {
    if (open) {
      // When opening, initialize temp preferences with current preferences
      setTempPreferences(preferences)
    } else {
      // When closing, save the temp preferences
      savePreferences(tempPreferences)
    }
    setOpen(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings2 className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>News Preferences</DialogTitle>
          <DialogDescription>
            Customize your news feed by selecting your preferred sources and categories.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <h4 className="font-medium">News Sources</h4>
            {tempPreferences.sources.length === 1 && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>You must keep at least one news source selected.</AlertDescription>
              </Alert>
            )}
            <div className="grid gap-4">
              {availableSources.map((source) => (
                <div key={source.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={source.id}
                    checked={tempPreferences.sources.includes(source.id)}
                    onCheckedChange={(checked) => handleSourceChange(source.id, checked as boolean)}
                    disabled={tempPreferences.sources.length === 1 && tempPreferences.sources.includes(source.id)}
                  />
                  <Label htmlFor={source.id}>{source.name}</Label>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="font-medium">Categories</h4>
            {tempPreferences.categories.length === 1 && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>You must keep at least one category selected.</AlertDescription>
              </Alert>
            )}
            <div className="grid grid-cols-2 gap-4">
              {availableCategories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={category}
                    checked={tempPreferences.categories.includes(category)}
                    onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
                    disabled={tempPreferences.categories.length === 1 && tempPreferences.categories.includes(category)}
                  />
                  <Label htmlFor={category}>{category}</Label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

