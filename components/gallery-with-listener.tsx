"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { GalleryGrid } from "./gallery-grid"

interface GalleryItem {
  id: string
  image_url: string
  title: string
  created_at: string
}

interface PostMessagePayload {
  type: "ADD_TO_GALLERY"
  data: {
    image_url?: string
    image?: string // base64 string
    title?: string
  }
}

function isValidGalleryMessage(data: unknown): data is PostMessagePayload {
  if (!data || typeof data !== "object") return false
  const payload = data as Record<string, unknown>
  
  if (payload.type !== "ADD_TO_GALLERY") {
    if (!payload.data || typeof payload.data !== "object") {
      const hasImageUrl = typeof payload.image_url === "string" && (payload.image_url as string).length > 0
      const hasBase64 = typeof payload.image === "string" && (payload.image as string).length > 0
      if (hasImageUrl || hasBase64) {
        return true
      }
      return false
    }
  }
  
  const messageData = payload.data as Record<string, unknown>
  const hasImageUrl = typeof messageData.image_url === "string" && messageData.image_url.length > 0
  const hasBase64 = typeof messageData.image === "string" && messageData.image.length > 0
  const hasUrl = typeof messageData.url === "string" && (messageData.url as string).length > 0
  
  return hasImageUrl || hasBase64 || hasUrl
}

interface GalleryWithListenerProps {
  initialItems: GalleryItem[]
  error?: string
}

export function GalleryWithListener({ initialItems, error }: GalleryWithListenerProps) {
  const [items, setItems] = useState<GalleryItem[]>(initialItems)
  const [isAdding, setIsAdding] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      const supabase = createClient()
      const { error: deleteError } = await supabase
        .from("gallery")
        .delete()
        .eq("id", id)

      if (deleteError) {
        return
      }

      setItems((prev) => prev.filter((item) => item.id !== id))
    } finally {
      setDeletingId(null)
    }
  }

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      // Validate the message structure
      if (!isValidGalleryMessage(event.data)) {
        return
      }

      const payload = event.data as Record<string, unknown>
      const messageData = (payload.data as Record<string, unknown>) || payload
      
      // Try to extract image from various possible locations
      let imageUrl = (messageData.image_url as string) || 
                     (messageData.url as string) || 
                     (messageData.image as string) || 
                     (payload.image_url as string) ||
                     (payload.url as string)
      
      const title = (messageData.title as string) || 
                    (payload.title as string) || 
                    "Untitled Break"

      if (!imageUrl) {
        return
      }

      setIsAdding(true)

      try {
        const supabase = createClient()
        
        const { data: newItem, error: insertError } = await supabase
          .from("gallery")
          .insert({
            image_url: imageUrl,
            title: title,
          })
          .select()
          .single()

        if (insertError) {
          return
        }

        // Prepend the new item to show it at the top
        setItems((prev) => [newItem, ...prev])
      } catch (err) {
        // Silently fail
      } finally {
        setIsAdding(false)
      }
    }

    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [])

  return (
    <div className="relative">
      {/* Adding indicator */}
      {isAdding && (
        <div className="absolute -top-12 left-1/2 z-10 -translate-x-1/2 transform">
          <div className="flex items-center gap-2 rounded-full bg-amber-500/20 px-4 py-2 text-sm text-amber-400">
            <svg
              className="h-4 w-4 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Adding to gallery...
          </div>
        </div>
      )}
      
      <GalleryGrid items={items} error={error} onDelete={handleDelete} />
    </div>
  )
}
