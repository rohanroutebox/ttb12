"use client"

import { useState, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { 
  Plane, 
  Car, 
  Train, 
  Ship, 
  Bus, 
  Square, 
  Circle, 
  RectangleHorizontal,
  Download,
  Loader2,
  CheckCircle,
  ImageIcon
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"

const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Argentina", "Australia", "Austria", "Bangladesh", 
  "Belgium", "Brazil", "Cambodia", "Canada", "Chile", "China", "Colombia", "Croatia",
  "Czech Republic", "Denmark", "Egypt", "Finland", "France", "Germany", "Greece", 
  "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", 
  "Italy", "Japan", "Jordan", "Kenya", "Malaysia", "Maldives", "Mexico", "Monaco",
  "Morocco", "Nepal", "Netherlands", "New Zealand", "Norway", "Pakistan", "Peru",
  "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Saudi Arabia",
  "Singapore", "South Africa", "South Korea", "Spain", "Sri Lanka", "Sweden", 
  "Switzerland", "Thailand", "Turkey", "UAE", "UK", "USA", "Vietnam"
]

const TRANSPORT_OPTIONS = [
  { id: "airplane", label: "Airplane", icon: Plane },
  { id: "car", label: "Car", icon: Car },
  { id: "train", label: "Train", icon: Train },
  { id: "ship", label: "Ship", icon: Ship },
  { id: "bus", label: "Bus", icon: Bus },
]

const SHAPE_OPTIONS = [
  { id: "rectangle", label: "Rectangle", icon: RectangleHorizontal },
  { id: "square", label: "Square", icon: Square },
  { id: "round", label: "Round", icon: Circle },
]

const BORDER_STYLES = ["Solid", "Dashed", "Dotted", "Double", "None"]

export function RouteBoxGenerator() {
  const router = useRouter()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const previewCanvasRef = useRef<HTMLCanvasElement>(null)
  
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null)
  const [country, setCountry] = useState("")
  const [origin, setOrigin] = useState("")
  const [destination, setDestination] = useState("")
  const [duration, setDuration] = useState("2h 30m")
  const [transport, setTransport] = useState("airplane")
  const [shape, setShape] = useState("rectangle")
  const [borderStyle, setBorderStyle] = useState("Solid")
  const [boxColor, setBoxColor] = useState("#8b5e3c")
  const [textColor, setTextColor] = useState("#ffffff")
  const [opacity, setOpacity] = useState(82)
  
  const [isGenerated, setIsGenerated] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setBackgroundImage(event.target?.result as string)
        setIsGenerated(false)
      }
      reader.readAsDataURL(file)
    }
  }

  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }

  const drawRouteBox = useCallback((canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, img: HTMLImageElement) => {
    // Set canvas size to match image
    canvas.width = img.width
    canvas.height = img.height
    
    // Draw background image
    ctx.drawImage(img, 0, 0)
    
    // Calculate box dimensions
    const boxWidth = canvas.width * 0.7
    const boxHeight = shape === "square" ? boxWidth * 0.6 : canvas.height * 0.25
    const boxX = (canvas.width - boxWidth) / 2
    const boxY = canvas.height - boxHeight - 40
    
    // Set box style
    ctx.fillStyle = hexToRgba(boxColor, opacity / 100)
    
    // Draw box based on shape
    const borderRadius = shape === "round" ? 30 : shape === "square" ? 15 : 10
    
    ctx.beginPath()
    ctx.roundRect(boxX, boxY, boxWidth, boxHeight, borderRadius)
    ctx.fill()
    
    // Draw border
    if (borderStyle !== "None") {
      ctx.strokeStyle = textColor
      ctx.lineWidth = 2
      if (borderStyle === "Dashed") ctx.setLineDash([10, 5])
      else if (borderStyle === "Dotted") ctx.setLineDash([3, 3])
      else if (borderStyle === "Double") ctx.lineWidth = 4
      else ctx.setLineDash([])
      ctx.stroke()
    }
    
    ctx.setLineDash([])
    
    // Draw content
    const padding = 20
    const contentX = boxX + padding
    const contentY = boxY + padding
    const contentWidth = boxWidth - padding * 2
    
    ctx.fillStyle = textColor
    ctx.textAlign = "left"
    
    // Country flag placeholder and name
    if (country) {
      ctx.font = `bold ${Math.max(16, canvas.width * 0.025)}px sans-serif`
      ctx.fillText(country.toUpperCase(), contentX, contentY + 25)
    }
    
    // Route line with icons
    const routeY = contentY + boxHeight * 0.45
    const iconSize = Math.max(24, canvas.width * 0.035)
    
    // Origin
    ctx.font = `bold ${Math.max(18, canvas.width * 0.03)}px sans-serif`
    ctx.fillText(origin || "Origin", contentX, routeY)
    
    // Dotted line
    const lineStartX = contentX + ctx.measureText(origin || "Origin").width + 20
    const lineEndX = boxX + boxWidth - padding - ctx.measureText(destination || "Destination").width - 20
    
    ctx.strokeStyle = textColor
    ctx.setLineDash([5, 5])
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(lineStartX, routeY - 8)
    ctx.lineTo(lineEndX, routeY - 8)
    ctx.stroke()
    ctx.setLineDash([])
    
    // Transport icon in center
    const iconX = (lineStartX + lineEndX) / 2 - iconSize / 2
    ctx.fillStyle = boxColor
    ctx.beginPath()
    ctx.arc(iconX + iconSize / 2, routeY - 8, iconSize * 0.7, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = textColor
    ctx.font = `${iconSize}px sans-serif`
    const transportEmoji = transport === "airplane" ? "✈" : transport === "car" ? "🚗" : transport === "train" ? "🚂" : transport === "ship" ? "🚢" : "🚌"
    ctx.textAlign = "center"
    ctx.fillText(transportEmoji, iconX + iconSize / 2, routeY - 8 + iconSize * 0.35)
    ctx.textAlign = "left"
    
    // Destination
    ctx.font = `bold ${Math.max(18, canvas.width * 0.03)}px sans-serif`
    ctx.textAlign = "right"
    ctx.fillText(destination || "Destination", boxX + boxWidth - padding, routeY)
    ctx.textAlign = "left"
    
    // Duration
    const durationY = routeY + 35
    ctx.font = `${Math.max(14, canvas.width * 0.02)}px sans-serif`
    ctx.textAlign = "center"
    ctx.fillText(duration, boxX + boxWidth / 2, durationY)
    ctx.textAlign = "left"
  }, [country, origin, destination, duration, transport, shape, borderStyle, boxColor, textColor, opacity])

  const generateRouteBox = () => {
    if (!backgroundImage) return
    
    const canvas = canvasRef.current
    const previewCanvas = previewCanvasRef.current
    if (!canvas || !previewCanvas) return
    
    const ctx = canvas.getContext("2d")
    const previewCtx = previewCanvas.getContext("2d")
    if (!ctx || !previewCtx) return
    
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      drawRouteBox(canvas, ctx, img)
      
      // Draw preview (scaled down)
      const scale = 400 / img.width
      previewCanvas.width = 400
      previewCanvas.height = img.height * scale
      previewCtx.drawImage(canvas, 0, 0, previewCanvas.width, previewCanvas.height)
      
      setIsGenerated(true)
    }
    img.src = backgroundImage
  }

  const downloadAndSaveToGallery = async () => {
    const canvas = canvasRef.current
    if (!canvas || !isGenerated) return
    
    setIsUploading(true)
    
    try {
      // Get the image as base64
      const imageUrl = canvas.toDataURL("image/png")
      
      // Save to Supabase gallery
      const supabase = createClient()
      const title = origin && destination ? `${origin} to ${destination}` : "My Route Box"
      
      const { error: insertError } = await supabase
        .from("gallery")
        .insert({
          image_url: imageUrl,
          title: title,
        })
      
      if (insertError) {
        console.error("Upload error:", insertError)
        alert("Failed to save to gallery. Please try again.")
        setIsUploading(false)
        return
      }
      
      // Also trigger download
      const link = document.createElement("a")
      link.download = `route-box-${Date.now()}.png`
      link.href = imageUrl
      link.click()
      
      setUploadSuccess(true)
      
      // Redirect to homepage after success
      setTimeout(() => {
        router.push("/")
      }, 1500)
    } catch (err) {
      console.error("Error:", err)
      alert("An error occurred. Please try again.")
      setIsUploading(false)
    }
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6">
      {/* Upload/Uploading Overlay */}
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
                <p className="text-lg font-medium text-foreground">Saving to Gallery...</p>
              </>
            )}
          </div>
        </div>
      )}
      
      {/* Controls Panel */}
      <div className="w-full lg:w-96 space-y-5 rounded-xl border border-border bg-card p-5">
        <h2 className="text-xl font-bold text-foreground">Route Box Generator</h2>
        
        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Upload Background Image
          </label>
          <label className="flex items-center justify-center gap-2 w-full h-12 rounded-lg border-2 border-dashed border-border bg-background cursor-pointer hover:border-amber-500 transition-colors">
            <ImageIcon className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {backgroundImage ? "Change Image" : "Choose File"}
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        </div>
        
        {/* Country */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Country</label>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full h-10 rounded-lg border border-border bg-background px-3 text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="">Select Country</option>
            {COUNTRIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        
        {/* Origin & Destination */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Origin</label>
            <input
              type="text"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              placeholder="Origin"
              className="w-full h-10 rounded-lg border border-border bg-background px-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Destination</label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Destination"
              className="w-full h-10 rounded-lg border border-border bg-background px-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>
        
        {/* Duration */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Duration</label>
          <input
            type="text"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="2h 30m"
            className="w-full h-10 rounded-lg border border-border bg-background px-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
        
        {/* Transportation */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Transportation</label>
          <div className="flex flex-wrap gap-2">
            {TRANSPORT_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setTransport(opt.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  transport === opt.id
                    ? "bg-amber-500 text-black"
                    : "bg-background border border-border text-foreground hover:border-amber-500"
                }`}
              >
                <opt.icon className="h-4 w-4" />
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* Box Shape */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Box Shape</label>
          <div className="flex gap-2">
            {SHAPE_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setShape(opt.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  shape === opt.id
                    ? "bg-amber-500 text-black"
                    : "bg-background border border-border text-foreground hover:border-amber-500"
                }`}
              >
                <opt.icon className="h-4 w-4" />
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* Border Style */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Border Style</label>
          <select
            value={borderStyle}
            onChange={(e) => setBorderStyle(e.target.value)}
            className="w-full h-10 rounded-lg border border-border bg-background px-3 text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            {BORDER_STYLES.map((style) => (
              <option key={style} value={style}>{style}</option>
            ))}
          </select>
        </div>
        
        {/* Colors */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Box Color</label>
            <input
              type="color"
              value={boxColor}
              onChange={(e) => setBoxColor(e.target.value)}
              className="w-full h-10 rounded-lg border border-border cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Text Color</label>
            <input
              type="color"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              className="w-full h-10 rounded-lg border border-border cursor-pointer"
            />
          </div>
        </div>
        
        {/* Opacity */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Opacity: {opacity}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={opacity}
            onChange={(e) => setOpacity(parseInt(e.target.value))}
            className="w-full accent-amber-500"
          />
        </div>
        
        {/* Generate Button */}
        <button
          onClick={generateRouteBox}
          disabled={!backgroundImage}
          className="w-full h-12 rounded-lg bg-amber-500 font-semibold text-black transition-all hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Generate Route Box
        </button>
        
        {/* Download Button */}
        <button
          onClick={downloadAndSaveToGallery}
          disabled={!isGenerated}
          className="w-full h-12 rounded-lg bg-green-600 font-semibold text-white transition-all hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Download className="h-5 w-5" />
          Download Final PNG
        </button>
      </div>
      
      {/* Preview Panel */}
      <div className="flex-1 flex items-center justify-center rounded-xl border border-border bg-card p-6 min-h-[500px]">
        {backgroundImage ? (
          <div className="relative">
            <canvas 
              ref={previewCanvasRef}
              className="max-w-full h-auto rounded-lg shadow-lg"
            />
            {!isGenerated && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/60 rounded-lg">
                <p className="text-muted-foreground font-medium">Click &quot;Generate Route Box&quot; to preview</p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center text-muted-foreground">
            <ImageIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p className="font-medium">Upload a background image</p>
            <p className="text-sm">to get started</p>
          </div>
        )}
      </div>
      
      {/* Hidden full-size canvas for export */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}
