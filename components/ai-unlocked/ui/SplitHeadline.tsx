'use client'

import { useEffect, useRef } from 'react'

interface SplitHeadlineProps {
  text: string
  className?: string
  style?: React.CSSProperties
  delay?: number
  tag?: 'h1' | 'h2' | 'h3' | 'p'
  onComplete?: () => void
}

/**
 * Splits text into characters and animates each in with GSAP stagger.
 * Runs after document.fonts.ready to ensure correct character metrics.
 * Dynamic import (ssr:false) is handled at the usage site.
 */
export function SplitHeadline({
  text,
  className = '',
  style,
  delay = 0,
  tag: Tag = 'h1',
  onComplete,
}: SplitHeadlineProps) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    let cancelled = false

    async function animate() {
      await document.fonts.ready
      if (cancelled || !ref.current) return

      const { gsap } = await import('gsap')

      // Split into char spans
      const chars = text.split('').map((char) => {
        const span = document.createElement('span')
        span.textContent = char === ' ' ? ' ' : char
        span.style.display = 'inline-block'
        span.style.willChange = 'transform, opacity'
        return span
      })

      if (!ref.current) return
      ref.current.innerHTML = ''
      chars.forEach((s) => ref.current!.appendChild(s))

      // Check prefers-reduced-motion
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduced) {
        chars.forEach((s) => { s.style.opacity = '1'; s.style.transform = 'none' })
        onComplete?.()
        return
      }

      gsap.fromTo(
        chars,
        { y: -80, opacity: 0, rotateX: 90 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.04,
          delay,
          onComplete,
        }
      )
    }

    animate()
    return () => { cancelled = true }
  }, [text, delay, onComplete])

  return (
    // @ts-expect-error — dynamic tag
    <Tag ref={ref} className={className} style={style} aria-label={text}>
      {text}
    </Tag>
  )
}
