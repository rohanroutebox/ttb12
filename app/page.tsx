import { createClient } from "@/lib/supabase/server"
import { GalleryWithListener } from "@/components/gallery-with-listener"
import { TopBar } from "@/components/top-bar"
import Link from "next/link"

export default async function HomePage() {
  const supabase = await createClient()

  const { data: galleryItems, error } = await supabase
    .from("gallery")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <>
      <TopBar />

      <main className="min-h-screen pt-16">
        {/* Gallery section — front and center */}
        <section className="px-4 py-10 md:px-8 lg:px-12">
          <div className="mx-auto max-w-7xl">
            {/* Subtle page label */}
            <p className="mb-6 text-xs font-medium uppercase tracking-widest text-muted-foreground">
              recent creations
            </p>

            <GalleryWithListener initialItems={galleryItems ?? []} error={error?.message} />

            {/* Bottom Create button */}
            <div className="mt-14 flex justify-center">
              <Link
                href="/create"
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 px-12 py-4 text-base font-semibold text-slate-950 shadow-lg shadow-amber-500/20 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-amber-500/30 focus:outline-none focus:ring-4 focus:ring-amber-500/50"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Create
                  <svg
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
