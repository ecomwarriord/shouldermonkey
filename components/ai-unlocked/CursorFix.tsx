'use client'
import { useEffect } from 'react'

/** Sets data-page on body so the AI Unlocked cursor CSS rule applies */
export function CursorFix() {
  useEffect(() => {
    document.body.setAttribute('data-page', 'ai-unlocked')
    return () => document.body.removeAttribute('data-page')
  }, [])
  return null
}
