"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowLeft, Loader2, CheckCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export default function CreatePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      // Debug: Log all messages from iframe
      console.log("[v0] Received postMessage:", event.data, "from:", event.origin)

      // Try to extract image from various possible message formats
      let imageUrl: string | null = null
      let title = "Untitled Break"
      
      const data = event.data

      if (!data) {
        return
      }
      
      // Handle string data (could be a base64 image or JSON string)
      if (typeof data === "string") {
        // Check if it's a base64 image
        if (data.startsWith("data:image")) {
          imageUrl = data
        } else {
          // Try to parse as JSON
          try {
            const parsed = JSON.parse(data)
            if (parsed.image_url || parsed.image || parsed.url || parsed.src) {
              imageUrl = parsed.image_url || parsed.image || parsed.url || parsed.src
              title = parsed.title || parsed.name || title
            }
          } catch {
            // Not JSON, ignore
          }
        }
      }
      
      if (typeof data !== "object") {
        if (!imageUrl) return
      }

      // Check various possible structures
      // Format 1: { type: "ADD_TO_GALLERY", data: { image_url, title } }
      if (data.type === "ADD_TO_GALLERY" && data.data) {
        imageUrl = data.data.image_url || data.data.image || data.data.url
        title = data.data.title || title
      }
      // Format 2: { image_url: "...", title: "..." }
      else if (data.image_url || data.image || data.url || data.src) {
        imageUrl = data.image_url || data.image || data.url || data.src
        title = data.title || data.name || title
      }
      // Format 3: { type: "image", payload: { ... } }
      else if (data.type === "image" && data.payload) {
        imageUrl = data.payload.url || data.payload.image_url || data.payload.src
        title = data.payload.title || title
      }
      // Format 4: { action: "export", data: "..." } or similar
      else if (data.action && (data.data || data.image || data.url)) {
        imageUrl = data.data || data.image || data.url
        title = data.title || data.name || title
      }
      // Format 5: Base64 data URL at top level as string
      else if (typeof data === "string" && data.startsWith("data:image")) {
        imageUrl = data
      }

      if (!imageUrl) {
        return
      }

      setIsUploading(true)

      try {
        const supabase = createClient()
        
        const { data: newItem, error: insertError } = await supabase
          .from("gallery") // Using your specific 'gallery' database table
          .insert({
            image_url: imageUrl,
            title: title,
          })
          .select()
          .single()

        if (insertError) {
          setIsUploading(false)
          return
        }

        setUploadSuccess(true)
        
        // Redirect to homepage after a brief success animation
        setTimeout(() => {
          router.push("/")
        }, 1500)
      } catch (err) {
        setIsUploading(false)
      }
    }

    window.addEventListener("message", handleMessage)

    return () => {
      window.removeEventListener("message", handleMessage)
    }
  }, [router])

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Upload Status Overlay */}
      {(isUploading || uploadSuccess) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-8 shadow-2xl">
            {uploadSuccess ? (
              <>
                <CheckCircle className="h-12 w-12 text-green-500" />
                <p className="text-lg font-medium text-foreground">Added to Gallery!</p>
                <p className="text-sm text-muted-foreground">Redirecting to homepage...</p>
              </>
            ) : (
              <>
                <Loader2 className="h-12 w-12 animate-spin text-amber-500" />
                <p className="text-lg font-medium text-foreground">Adding to Gallery...</p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Back to Gallery</span>
          </Link>
          <h1 className="font-serif text-xl font-semibold tracking-tight text-foreground">
            Create
          </h1>
          {/* Logo */}
          <Link href="/" className="transition-transform hover:scale-105">
            <Image
              src="/logo.png"
              alt="Takethatbreak logo"
              width={60}
              height={30}
              className="h-6 w-auto"
            />
          </Link>
        </div>
      </header>

      {/* iFrame Container */}
      <main className="flex flex-1 flex-col p-4">
        <div className="relative mx-auto w-full max-w-7xl flex-1 overflow-hidden rounded-2xl border border-white/10 bg-card shadow-2xl shadow-black/20">
          {/* Loading State */}
          {isLoading && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-card">
              <Loader2 className="h-10 w-10 animate-spin text-amber-500" />
              <p className="text-sm font-medium text-muted-foreground">
                Loading your workspace...
              </p>
            </div>
          )}

          {/* Embedded Application */}
          <iframe
            src="https://premium-travel-route-338i.bolt.host/"
            className="h-full min-h-[85vh] w-full border-0"
            allow="clipboard-write; geolocation; microphone; camera"
            onLoad={() => setIsLoading(false)}
            title="Travel Route Creator"
          />
        </div>
      </main>
    </div>
  )
}
