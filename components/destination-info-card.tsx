"use client"

interface DestinationInfoCardProps {
  temperature: number | null
  aqi: number | null
  localTime: string | null
  destination?: string | null
  country?: string | null
}

function getAqiLabel(aqi: number): { label: string; color: string } {
  if (aqi <= 50) return { label: "Good", color: "bg-green-500" }
  if (aqi <= 100) return { label: "Moderate", color: "bg-yellow-500" }
  return { label: "Poor", color: "bg-red-500" }
}

function SkeletonLine({ width = "w-full" }: { width?: string }) {
  return (
    <div className={`h-4 ${width} animate-pulse rounded bg-white/20`} />
  )
}

export function DestinationInfoCard({
  temperature,
  aqi,
  localTime,
  destination,
  country,
}: DestinationInfoCardProps) {
  const hasData = temperature !== null || aqi !== null || localTime !== null
  const aqiInfo = aqi !== null ? getAqiLabel(aqi) : null

  return (
    <div className="h-full w-full rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white">Destination Intelligence</h3>
        {(destination || country) && (
          <p className="mt-1 text-sm text-white/60">
            {destination}{destination && country ? ", " : ""}{country}
          </p>
        )}
      </div>

      {/* Data Grid */}
      <div className="space-y-6">
        {/* Current Weather */}
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/20">
            <svg className="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm text-white/60">Current Weather</p>
            {temperature !== null ? (
              <p className="text-2xl font-bold text-white">{Math.round(temperature)}°C</p>
            ) : (
              <div className="mt-2">
                <SkeletonLine width="w-20" />
              </div>
            )}
          </div>
        </div>

        {/* AQI Score */}
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-500/20">
            <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm text-white/60">AQI Score</p>
            {aqi !== null && aqiInfo ? (
              <div className="flex items-center gap-2 mt-1">
                <p className="text-2xl font-bold text-white">{aqi}</p>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium text-white ${aqiInfo.color}`}>
                  {aqiInfo.label}
                </span>
              </div>
            ) : (
              <div className="mt-2">
                <SkeletonLine width="w-24" />
              </div>
            )}
          </div>
        </div>

        {/* Local Time */}
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/20">
            <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm text-white/60">Local Time</p>
            {localTime !== null ? (
              <p className="text-2xl font-bold text-white">{localTime}</p>
            ) : (
              <div className="mt-2">
                <SkeletonLine width="w-24" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* No Data State */}
      {!hasData && (
        <div className="mt-4 rounded-lg bg-white/5 p-4 text-center">
          <p className="text-sm text-white/40">
            Weather data not available for this destination
          </p>
        </div>
      )}
    </div>
  )
}
