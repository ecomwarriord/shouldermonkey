'use client'

import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

const ROLES = [
  { value: 'student', label: "I'm a student (13+)", emoji: '🎓' },
  { value: 'parent', label: "I'm a parent", emoji: '👨‍👩‍👧' },
  { value: 'both', label: 'We both are', emoji: '✨' },
]

interface SegmentationQuestionProps {
  email: string
  onComplete: (role: string) => void
}

export function SegmentationQuestion({ email, onComplete }: SegmentationQuestionProps) {
  const focusRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    focusRef.current?.focus()
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'ai_unlocked_quiz_start')
    }
  }, [])

  async function handleSelect(role: string) {
    // Update GHL tag with role
    await fetch('/api/ai-waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, role, website: '' }),
    }).catch(() => {})

    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'ai_unlocked_quiz_complete', { role })
    }

    onComplete(role)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center max-w-sm mx-auto"
      role="group"
      aria-labelledby="seg-title"
    >
      <h3
        ref={focusRef}
        id="seg-title"
        tabIndex={-1}
        className="font-display font-black text-2xl mb-2"
        style={{ color: 'var(--ai-text)' }}
      >
        You&apos;re in! One quick thing:
      </h3>
      <p className="text-sm mb-6" style={{ color: 'var(--ai-muted)' }}>
        This helps us send you the right content.
      </p>

      <div className="flex flex-col gap-3" role="radiogroup" aria-label="Who are you?">
        {ROLES.map((r) => (
          <button
            key={r.value}
            onClick={() => handleSelect(r.value)}
            className="flex items-center gap-3 px-5 py-4 rounded-xl font-semibold text-sm text-left transition-all hover:scale-[1.02]"
            style={{
              background: 'rgba(132,75,254,0.08)',
              border: '1px solid rgba(132,75,254,0.2)',
              color: 'var(--ai-text)',
            }}
            role="radio"
            aria-checked="false"
          >
            <span className="text-xl" aria-hidden="true">{r.emoji}</span>
            {r.label}
          </button>
        ))}
      </div>
    </motion.div>
  )
}
