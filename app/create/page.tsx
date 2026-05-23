"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import { RouteBoxGenerator } from "@/components/route-box-generator"

export default function CreatePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
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

      {/* Main Content */}
      <main className="flex-1">
        <RouteBoxGenerator />
      </main>
    </div>
  )
}
