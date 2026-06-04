'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'

interface ParentHandoffProps {
  role: string
  contactId?: string
}

export function ParentHandoff({ role, contactId }: ParentHandoffProps) {
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'ai_unlocked_form_success', { role })
    }
  }, [role])

  const isStudent = role === 'student'
  const isParent = role === 'parent' || role === 'both'

  const parentUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/ai-unlocked?role=parent#for-parents${contactId ? `&ref=teen-${contactId}` : ''}`
  const shareText = `Hey! I just joined the waitlist for AI Unlocked, a live event teaching 13+ how to build with AI. Can you check it out? ${parentUrl}`

  function handleShareToParent() {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'ai_unlocked_parent_handoff_click')
    }
    if (navigator.share) {
      navigator.share({ title: 'AI Unlocked', text: shareText, url: parentUrl }).catch(() => {})
    } else {
      navigator.clipboard.writeText(shareText).then(() => {
        alert('Copied. Paste it in a message to your parents.')
      }).catch(() => {})
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center max-w-sm mx-auto"
      role="status"
      aria-live="polite"
    >
      <div className="text-4xl mb-4" aria-hidden="true">✓</div>
      <h3 className="font-display font-black text-2xl mb-2" style={{ color: 'var(--ai-text, #f0edff)' }}>
        You&apos;re on the list.
      </h3>
      <p className="text-sm mb-6" style={{ color: 'rgba(240,237,255,0.55)' }}>
        Watch your inbox. You&apos;ll hear from us when tickets go on sale.
      </p>

      {isStudent && (
        <div className="mt-4 rounded-xl p-4" style={{ background: 'rgba(123,63,228,0.08)', border: '1px solid rgba(123,63,228,0.2)' }}>
          <p className="text-sm font-semibold mb-3" style={{ color: '#ffffff' }}>
            One more thing: send this to your parents.
          </p>
          <button
            onClick={handleShareToParent}
            className="btn-primary w-full"
            aria-label="Send AI Unlocked link to your parents"
          >
            Send to my parents →
          </button>
          <p className="text-xs mt-2" style={{ color: 'rgba(240,237,255,0.4)' }}>
            They&apos;ll get everything they need to make the decision.
          </p>
        </div>
      )}

      {isParent && (
        <p className="text-sm" style={{ color: 'rgba(240,237,255,0.5)' }}>
          We&apos;ll send you everything you need before tickets go on sale: the date, pricing, and what to expect.
        </p>
      )}
    </motion.div>
  )
}
