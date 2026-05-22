import { Metadata } from "next"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { ShareActions } from "@/components/share-actions"

interface SharePageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: SharePageProps): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  
  const { data: item } = await supabase
    .from("gallery")
    .select("*")
    .eq("id", id)
    .single()

  if (!item) {
    return {
      title: "Not Found | takethatbreak",
    }
  }

  return {
    title: `${item.title} | takethatbreak`,
    description: `Check out this travel creation on takethatbreak: ${item.title}`,
    openGraph: {
      title: `${item.title} | takethatbreak`,
      description: `Check out this travel creation on takethatbreak`,
      images: [
        {
          url: item.image_url,
          width: 1200,
          height: 630,
          alt: item.title,
        },
      ],
      type: "website",
      siteName: "takethatbreak",
    },
    twitter: {
      card: "summary_large_image",
      title: `${item.title} | takethatbreak`,
      description: `Check out this travel creation on takethatbreak`,
      images: [item.image_url],
    },
  }
}

export default async function SharePage({ params }: SharePageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: item, error } = await supabase
    .from("gallery")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !item) {
    notFound()
  }

  const shareUrl = `https://v0-takethatbreak-landing-page.vercel.app/share/${id}`

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
          <Link
            href="/"
            className="text-lg font-bold tracking-tight text-orange-500 transition-colors hover:text-orange-600"
          >
            takethatbreak
          </Link>
          <Link
            href="/"
            className="rounded-full bg-orange-500 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-orange-600"
          >
            View Gallery
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="overflow-hidden rounded-2xl bg-card shadow-xl ring-1 ring-border">
          {/* Image */}
          <div className="relative aspect-video w-full bg-muted">
            <Image
              src={item.image_url}
              alt={item.title}
              fill
              className="object-contain"
              sizes="(max-width: 1024px) 100vw, 1024px"
              priority
            />
          </div>

          {/* Info section */}
          <div className="p-6">
            <h1 className="mb-4 text-2xl font-bold text-foreground md:text-3xl">
              {item.title}
            </h1>
            
            <p className="mb-6 text-sm text-muted-foreground">
              Created on {new Date(item.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>

            {/* Share buttons */}
            <ShareActions shareUrl={shareUrl} title={item.title} />
          </div>
        </div>

        {/* Back to gallery */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Gallery
          </Link>
        </div>
      </main>
    </div>
  )
}
