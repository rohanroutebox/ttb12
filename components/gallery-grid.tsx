"use client"

import Image from "next/image"
import { useState, useEffect, useCallback, useRef } from "react"

interface GalleryItem {
  id: string
  image_url: string
  title: string
  created_at: string
}

interface GalleryGridProps {
  items: GalleryItem[]
  error?: string
  onDelete?: (id: string) => void
}

const SHARE_BASE_URL = "https://v0-takethatbreak-landing-page.vercel.app"

function ShareMenu({ item, onClose }: { item: GalleryItem; onClose: () => void }) {
  const [copied, setCopied] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const shareUrl = `${SHARE_BASE_URL}/share/${item.id}`
  const shareText = `Check out this travel creation: ${item.title}`
  const encodedText = encodeURIComponent(shareText)
  const encodedUrl = encodeURIComponent(shareUrl)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [onClose])

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => {
        setCopied(false)
        onClose()
      }, 1500)
    } catch {
      // Fallback: use the old-school method
      try {
        const textArea = document.createElement("textarea")
        textArea.value = shareUrl
        textArea.style.position = "fixed"
        textArea.style.opacity = "0"
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand("copy")
        document.body.removeChild(textArea)
        setCopied(true)
        setTimeout(() => {
          setCopied(false)
          onClose()
        }, 1500)
      } catch {
        // If all else fails, open in new tab
        window.open(shareUrl, "_blank")
        onClose()
      }
    }
  }

  const shareTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`
    window.open(url, "_blank", "width=550,height=420")
    onClose()
  }

  const shareWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`
    window.open(url, "_blank")
    onClose()
  }

  const shareFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
    window.open(url, "_blank", "width=550,height=420")
    onClose()
  }

  const shareLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
    window.open(url, "_blank", "width=550,height=420")
    onClose()
  }

  const sharePinterest = () => {
    const url = `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedText}`
    window.open(url, "_blank", "width=550,height=420")
    onClose()
  }

  const shareTelegram = () => {
    const url = `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`
    window.open(url, "_blank")
    onClose()
  }

  const shareEmail = () => {
    const url = `mailto:?subject=${encodeURIComponent(`Check out: ${item.title}`)}&body=${encodeURIComponent(`${item.title}\n\n${shareUrl}`)}`
    window.location.href = url
    onClose()
  }

  return (
    <div
      ref={menuRef}
      className="absolute right-0 top-full z-20 mt-1 min-w-[160px] animate-in fade-in slide-in-from-top-2 duration-200 rounded-lg bg-slate-900 p-1 shadow-xl ring-1 ring-white/10"
    >
      <button
        onClick={copyLink}
        className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm text-white transition-colors hover:bg-white/10"
      >
        {copied ? (
          <>
            <svg className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-green-400">Copied!</span>
          </>
        ) : (
          <>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <span>Copy Link</span>
          </>
        )}
      </button>
      <button
        onClick={shareTwitter}
        className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm text-white transition-colors hover:bg-white/10"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        <span>Share on X</span>
      </button>
      <button
        onClick={shareWhatsApp}
        className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm text-white transition-colors hover:bg-white/10"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        <span>WhatsApp</span>
      </button>
      <button
        onClick={shareFacebook}
        className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm text-white transition-colors hover:bg-white/10"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
        <span>Facebook</span>
      </button>
      <button
        onClick={shareLinkedIn}
        className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm text-white transition-colors hover:bg-white/10"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
        </svg>
        <span>LinkedIn</span>
      </button>
      <button
        onClick={sharePinterest}
        className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm text-white transition-colors hover:bg-white/10"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.937-.2-2.378.042-3.41.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.03-.655 2.569-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
        </svg>
        <span>Pinterest</span>
      </button>
      <button
        onClick={shareTelegram}
        className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm text-white transition-colors hover:bg-white/10"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.365-1.337.185-.437-.148-1.33-.414-1.979-.762-.796-.51-1.428-1.068-1.386-1.648.021-.558.433-.883 1.041-1.175 1.824-.745 3.645-1.374 5.464-2.084.559-.368 1.657-.823 2.213-.715z" />
        </svg>
        <span>Telegram</span>
      </button>
      <button
        onClick={shareEmail}
        className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm text-white transition-colors hover:bg-white/10"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <span>Email</span>
      </button>
    </div>
  )
}

export function GalleryGrid({ items, error, onDelete }: GalleryGridProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [shareMenuId, setShareMenuId] = useState<string | null>(null)
  const selected = selectedIndex !== null ? items[selectedIndex] : null
  const hasMultiple = items.length > 1

  const close = useCallback(() => setSelectedIndex(null), [])

  const prev = useCallback(() => {
    setSelectedIndex((i) => (i !== null ? (i - 1 + items.length) % items.length : null))
  }, [items.length])

  const next = useCallback(() => {
    setSelectedIndex((i) => (i !== null ? (i + 1) % items.length : null))
  }, [items.length])

  const downloadImage = async (item: GalleryItem) => {
    try {
      const response = await fetch(item.image_url)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${item.title || "takethatbreak"}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch {
      // Fallback: open in new tab
      window.open(item.image_url, "_blank")
    }
  }

  useEffect(() => {
    if (selectedIndex === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close()
      if (e.key === "ArrowLeft") prev()
      if (e.key === "ArrowRight") next()
    }
    document.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [selectedIndex, close, prev, next])

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-12 text-center">
        <div className="mb-4 rounded-full bg-destructive/10 p-4">
          <svg className="h-8 w-8 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <p className="text-muted-foreground">Something went wrong loading the gallery.</p>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 p-16 text-center">
        <div className="mb-4 rounded-full bg-muted p-4">
          <svg className="h-8 w-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
        </div>
        <h3 className="mb-2 text-lg font-medium text-foreground">No creations yet</h3>
        <p className="text-muted-foreground">Be the first to create something beautiful!</p>
      </div>
    )
  }

  return (
    <>
      {/* Masonry grid */}
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="group relative mb-4 break-inside-avoid overflow-hidden rounded-xl bg-card shadow-sm transition-all duration-300 hover:shadow-lg"
          >
            {/* Action buttons */}
            <div className="absolute right-2 top-2 z-10 flex items-center gap-1.5 opacity-0 transition-all group-hover:opacity-100">
              {/* Download button */}
              <button
                onClick={(e) => { e.stopPropagation(); downloadImage(item) }}
                className="rounded-full bg-slate-950/70 p-1.5 text-white backdrop-blur-sm transition-all hover:bg-orange-500"
                aria-label="Download"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>

              {/* Share button */}
              <div className="relative">
                <button
                  onClick={(e) => { e.stopPropagation(); setShareMenuId(shareMenuId === item.id ? null : item.id) }}
                  className="rounded-full bg-slate-950/70 p-1.5 text-white backdrop-blur-sm transition-all hover:bg-orange-500"
                  aria-label="Share"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </button>
                {shareMenuId === item.id && (
                  <ShareMenu item={item} onClose={() => setShareMenuId(null)} />
                )}
              </div>

              {/* Delete button */}
              {onDelete && (
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(item.id) }}
                  className="rounded-full bg-slate-950/70 p-1.5 text-white backdrop-blur-sm transition-all hover:bg-red-500"
                  aria-label="Delete"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>

            {/* Clickable image */}
            <button
              onClick={() => setSelectedIndex(items.indexOf(item))}
              className="block w-full cursor-zoom-in text-left"
              aria-label={`View ${item.title} fullscreen`}
            >
              <div className="relative aspect-auto">
                <Image
                  src={item.image_url}
                  alt={item.title}
                  width={400}
                  height={300}
                  className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                />
               
              </div>
            </button>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-4 backdrop-blur-md"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label={selected.title}
        >
          {/* Lightbox action buttons */}
          <div className="absolute right-4 top-4 z-10 flex items-center gap-2">
            {/* Download */}
            <button
              onClick={(e) => { e.stopPropagation(); downloadImage(selected) }}
              className="rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
              aria-label="Download"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
            {/* Close */}
            <button
              onClick={close}
              className="rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
              aria-label="Close"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Prev arrow */}
          {hasMultiple && (
            <button
              onClick={(e) => { e.stopPropagation(); prev() }}
              className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition-all hover:bg-white/25 hover:scale-110"
              aria-label="Previous image"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
          )}

          {/* Next arrow */}
          {hasMultiple && (
            <button
              onClick={(e) => { e.stopPropagation(); next() }}
              className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition-all hover:bg-white/25 hover:scale-110"
              aria-label="Next image"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          )}

          {/* Image container */}
          <div
            className="relative flex max-h-[90vh] max-w-[90vw] flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10">
              <Image
                src={selected.image_url}
                alt={selected.title}
                width={1200}
                height={900}
                className="max-h-[80vh] w-auto object-contain"
                sizes="90vw"
                priority
              />
            </div>
            <div className="mt-4 flex items-center gap-3">
              
              {hasMultiple && (
                <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-white/50">
                  {(selectedIndex ?? 0) + 1} / {items.length}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
