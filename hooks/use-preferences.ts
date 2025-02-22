"use client"

import { useCallback, useEffect, useState } from "react"
import { useQueryClient } from "@tanstack/react-query"

export interface Preferences {
  categories: string[]
  sources: string[]
}

const defaultPreferences: Preferences = {
  categories: ["General", "Technology", "Business"],
  sources: ["newsapi", "guardian", "bbc"],
}

export function usePreferences() {
  const [preferences, setPreferences] = useState<Preferences>(defaultPreferences)
  const [isLoaded, setIsLoaded] = useState(false)
  const queryClient = useQueryClient()

  useEffect(() => {
    function loadPreferences() {
      // Try to get preferences from cookies first
      const cookiePreferences = document.cookie
        .split("; ")
        .find((row) => row.startsWith("newsPreferences="))
        ?.split("=")[1]

      if (cookiePreferences) {
        try {
          const parsed = JSON.parse(decodeURIComponent(cookiePreferences))
          if (parsed.categories?.length && parsed.sources?.length) {
            setPreferences(parsed)
            return
          }
        } catch (e) {
          console.error("Error parsing preferences from cookie:", e)
        }
      }

      // Fallback to localStorage if no cookie exists
      const savedPreferences = localStorage.getItem("newsPreferences")
      if (savedPreferences) {
        try {
          const parsed = JSON.parse(savedPreferences)
          if (parsed.categories?.length && parsed.sources?.length) {
            setPreferences(parsed)
            return
          }
        } catch (e) {
          console.error("Error parsing preferences from localStorage:", e)
        }
      }

      // If no valid preferences found, use defaults
      setPreferences(defaultPreferences)
    }

    loadPreferences()
    setIsLoaded(true)
  }, [])

  const savePreferences = useCallback(
    (newPreferences: Preferences) => {
      // Validate preferences
      if (!newPreferences.categories?.length) {
        newPreferences.categories = defaultPreferences.categories
      }
      if (!newPreferences.sources?.length) {
        newPreferences.sources = defaultPreferences.sources
      }

      // Save to state
      setPreferences(newPreferences)

      // Save to localStorage
      localStorage.setItem("newsPreferences", JSON.stringify(newPreferences))

      // Save to cookie for SSR
      document.cookie = `newsPreferences=${encodeURIComponent(
        JSON.stringify(newPreferences),
      )}; path=/; max-age=31536000` // 1 year expiry

      // Invalidate queries to refetch with new preferences
      queryClient.invalidateQueries({ queryKey: ["news"] })
    },
    [queryClient],
  )

  return {
    preferences,
    savePreferences,
    isLoaded,
  }
}

