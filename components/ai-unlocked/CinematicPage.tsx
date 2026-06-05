'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useLenis } from '@/contexts/LenisContext'
import { CinematicEngine } from './CinematicEngine'

interface Props {
  scrollRef: React.MutableRefObject<number>
  onChapterChange: (chapter: number) => void
  onReady: () => void
}

function MobileFallback() {
  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        background: [
          'radial-gradient(ellipse 80% 60% at 50% 20%, rgba(123,63,228,0.35) 0%, rgba(70,35,211,0.12) 50%, transparent 80%)',
          'radial-gradient(ellipse 40% 40% at 70% 70%, rgba(255,51,102,0.12) 0%, transparent 60%)',
          '#000',
        ].join(', '),
      }}
      aria-hidden="true"
    />
  )
}

export function CinematicPage({ scrollRef, onChapterChange, onReady }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const engineRef = useRef<CinematicEngine | null>(null)
  const lenis = useLenis()

  // SSR-safe mobile detection (council finding: no window.* in component body)
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
  }, [])

  const stableOnReady = useCallback(onReady, [onReady])
  const stableOnChapter = useCallback(onChapterChange, [onChapterChange])

  useEffect(() => {
    if (isMobile || !containerRef.current) return

    engineRef.current = new CinematicEngine({
      container: containerRef.current,
      onReady: stableOnReady,
      onChapterChange: stableOnChapter,
      scrollProgress: scrollRef,
      lenis,
    })

    return () => {
      engineRef.current?.destroy()
      engineRef.current = null
    }
  }, [isMobile, lenis, stableOnReady, stableOnChapter, scrollRef])

  if (isMobile) return <MobileFallback />

  return (
    <div
      ref={containerRef}
      style={{ position: 'fixed', inset: 0, zIndex: 0 }}
      aria-hidden="true"
      role="presentation"
    />
  )
}
