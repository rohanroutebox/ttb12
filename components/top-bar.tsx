import Link from "next/link"
import Image from "next/image"

export function TopBar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/40 bg-background/80 px-5 py-3 backdrop-blur-md md:px-10">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Wordmark - Orange text */}
        <Link
          href="/"
          className="text-lg font-bold tracking-tight text-orange-500 transition-colors hover:text-orange-600 md:text-xl"
        >
          takethatbreak
        </Link>

        {/* Centered Logo */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <Link href="/" className="block transition-transform hover:scale-110">
            <Image
              src="/logo.png"
              alt="Takethatbreak logo"
              width={80}
              height={40}
              className="h-8 w-auto md:h-10"
              priority
            />
          </Link>
        </div>

        {/* Create button - Solid orange */}
        <Link
          href="/create"
          className="inline-flex items-center justify-center gap-1.5 rounded-full bg-orange-500 px-5 py-2 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:bg-orange-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50"
        >
          <svg
            className="h-3.5 w-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Create
        </Link>
      </div>
    </header>
  )
}
