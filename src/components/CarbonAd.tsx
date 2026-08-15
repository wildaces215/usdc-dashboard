import { useEffect, useRef, useState } from 'react'

// ─────────────────────────────────────────────────────────────────────────
// Carbon Ads embed
//
// 1. Apply at https://www.carbonads.net — once approved you'll get a "serve"
//    code (a short alphanumeric string like "CEAIPK7U").
// 2. Replace the placeholder below with your real code.
// 3. Replace the placement with your domain (e.g. "usdcdashboard.vercel.app").
//
// No API keys or secrets are involved — the serve code is a public identifier
// that Carbon validates against your registered domain.
// ─────────────────────────────────────────────────────────────────────────

const CARBON_SERVE = 'CEAIPK7U' // ← replace with your real serve code
const CARBON_PLACEMENT = 'usdcdashboard.vercel.app' // ← replace with your domain

export function CarbonAd() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Remove any previous embed (React StrictMode double-mount in dev)
    container.innerHTML = ''

    const script = document.createElement('script')
    script.async = true
    script.id = '_carbonads_js'
    script.src = `//cdn.carbonads.com/carbon.js?serve=${CARBON_SERVE}&placement=${CARBON_PLACEMENT}`
    script.onload = () => setLoaded(true)
    script.onerror = () => setLoaded(false)

    container.appendChild(script)

    return () => {
      setLoaded(false)
    }
  }, [])

  return (
    <div className="my-8 flex justify-center">
      {/* Placeholder shown until Carbon fills the slot (or if blocked) */}
      <div
        className={`flex min-h-[90px] w-full max-w-[728px] items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/30 ${
          loaded ? 'hidden' : ''
        }`}
      >
        <span className="text-xs text-zinc-600">
          {/* You can remove this placeholder once your Carbon Ads account is
              approved and serving. Until then it just shows muted text. */}
          Ad space — Carbon Ads
        </span>
      </div>
      {/* Carbon injects its markup inside this container */}
      <div ref={containerRef} />
    </div>
  )
}