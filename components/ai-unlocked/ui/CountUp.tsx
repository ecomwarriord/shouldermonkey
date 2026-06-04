'use client'

import { useEffect, useRef, useState } from 'react'

interface CountUpProps {
  target: number
  suffix?: string
  prefix?: string
  duration?: number
  className?: string
}

export function CountUp({ target, suffix = '', prefix = '', duration = 2, className = '' }: CountUpProps) {
  const [value, setValue] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const hasRun = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el || hasRun.current) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) { setValue(target); return }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasRun.current) return
        hasRun.current = true
        observer.disconnect()

        const start = performance.now()
        function tick(now: number) {
          const elapsed = (now - start) / (duration * 1000)
          const progress = Math.min(1, elapsed)
          const eased = 1 - Math.pow(1 - progress, 3)
          setValue(Math.round(eased * target))
          if (progress < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      },
      { threshold: 0.5 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [target, duration])

  return (
    <span ref={ref} className={className} aria-label={`${prefix}${target}${suffix}`}>
      {prefix}{value}{suffix}
    </span>
  )
}
