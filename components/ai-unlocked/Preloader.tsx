'use client'

import { useEffect, useRef, useState } from 'react'

interface PreloaderProps {
  onComplete: () => void
}

export function Preloader({ onComplete }: PreloaderProps) {
  const [count, setCount] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    // Count 0 → 100 over ~1.2s
    const start = performance.now()
    const duration = 1200

    intervalRef.current = setInterval(() => {
      const elapsed = performance.now() - start
      const progress = Math.min(elapsed / duration, 1)
      // Ease in-out
      const eased = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress
      setCount(Math.floor(eased * 100))

      if (progress >= 1) {
        setCount(100)
        clearInterval(intervalRef.current!)
        // Trigger clip-path reveal
        setTimeout(() => {
          setRevealed(true)
          setTimeout(onComplete, 1500)
        }, 150)
      }
    }, 16)

    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [onComplete])

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black"
      style={{
        clipPath: revealed
          ? 'circle(0% at 50% 50%)'
          : 'circle(150% at 50% 50%)',
        transition: revealed ? 'clip-path 1.4s cubic-bezier(0.76, 0, 0.24, 1)' : 'none',
        pointerEvents: revealed ? 'none' : 'all',
      }}
      aria-live="polite"
      aria-label={`Loading ${count}%`}
    >
      <span
        className="font-display select-none"
        style={{
          fontSize: 'clamp(4rem, 12vw, 10rem)',
          color: '#ffffff',
          fontWeight: 800,
          letterSpacing: '-0.04em',
          lineHeight: 1,
          opacity: revealed ? 0 : 1,
          transition: 'opacity 0.3s ease',
        }}
      >
        {count}
        <span style={{ fontSize: '0.5em', color: 'rgba(255,255,255,0.4)' }}>%</span>
      </span>
    </div>
  )
}
