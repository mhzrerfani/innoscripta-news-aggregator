"use client"

import { useState, useEffect } from "react"
import { DEFAULT_PREFERENCES } from "@/lib/constants"

interface NewsPreferences {
  sources: string[]
  categories: string[]
}

export function useNewsPreferences() {
  const [preferences, setPreferences] = useState<NewsPreferences>(DEFAULT_PREFERENCES)

  useEffect(() => {
    const savedPreferences = localStorage.getItem("newsPreferences")
    if (savedPreferences) {
      setPreferences(JSON.parse(savedPreferences))
    }
  }, [])

  const updatePreferences = (newPreferences: NewsPreferences) => {
    setPreferences(newPreferences)
    localStorage.setItem("newsPreferences", JSON.stringify(newPreferences))
  }

  return { preferences, updatePreferences }
}

