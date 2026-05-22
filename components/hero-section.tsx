import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden bg-slate-950 px-4 py-20 text-center">
      {/* Background texture overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,115,85,0.15),transparent_70%)]" />
      
      {/* Content */}
      <div className="relative z-10 mx-auto max-w-4xl">
        <h1 className="mb-6 text-balance text-5xl font-bold tracking-tight md:text-7xl lg:text-8xl">
          <span className="bg-gradient-to-r from-amber-200 via-amber-100 to-orange-200 bg-clip-text text-transparent">
            take that break
          </span>
        </h1>
        
        <p className="mx-auto mb-10 max-w-2xl text-pretty text-lg text-slate-300 md:text-xl">
          Quick destination inspiration with beautiful pictures. 
          Discover your next adventure in seconds.
        </p>
        
        <Link
          href="/create"
          className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 px-10 py-4 text-lg font-semibold text-slate-950 shadow-lg shadow-amber-500/25 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-amber-500/30 focus:outline-none focus:ring-4 focus:ring-amber-500/50"
        >
          <span className="relative z-10 flex items-center gap-2">
            Create
            <svg
              className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
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
      
      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  )
}
