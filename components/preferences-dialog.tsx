"use client"

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
import { useNewsPreferences } from "@/lib/hooks/use-news-preferences"
import { AVAILABLE_CATEGORIES, NEWS_SOURCES } from "@/lib/constants"

export default function PreferencesDialog() {
  const { preferences, updatePreferences } = useNewsPreferences()

  return (
    <Dialog>
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
            <div className="grid gap-4">
              {NEWS_SOURCES.filter((source) => source.enabled).map((source) => (
                <div key={source.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={source.id}
                    checked={preferences.sources.includes(source.id)}
                    onCheckedChange={(checked) => {
                      const newSources = checked
                        ? [...preferences.sources, source.id]
                        : preferences.sources.filter((s) => s !== source.id)
                      updatePreferences({ ...preferences, sources: newSources })
                    }}
                  />
                  <Label htmlFor={source.id}>{source.name}</Label>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="font-medium">Categories</h4>
            <div className="grid grid-cols-2 gap-4">
              {AVAILABLE_CATEGORIES.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={category}
                    checked={preferences.categories.includes(category)}
                    onCheckedChange={(checked) => {
                      const newCategories = checked
                        ? [...preferences.categories, category]
                        : preferences.categories.filter((c) => c !== category)
                      updatePreferences({ ...preferences, categories: newCategories })
                    }}
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

