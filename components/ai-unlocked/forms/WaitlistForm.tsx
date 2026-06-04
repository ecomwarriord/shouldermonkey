'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface WaitlistFormProps {
  onSuccess?: (role: string) => void
  utm_source?: string
  ref_id?: string
}

export function WaitlistForm({ onSuccess, utm_source, ref_id }: WaitlistFormProps) {
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [consent, setConsent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const honeyRef = useRef<HTMLInputElement>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.')
      return
    }
    if (!consent) {
      setError('Please confirm you have permission to sign up.')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/ai-waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          phone: phone || undefined,
          role: 'unknown', // role captured in SegmentationQuestion post-submit
          website: honeyRef.current?.value ?? '', // honeypot
          utm_source,
          ref: ref_id,
        }),
      })

      if (res.status === 429) {
        setError("You've already joined. Check your inbox for the confirmation.")
        return
      }
      if (!res.ok) {
        setError('Something went wrong. Please try again.')
        return
      }

      // GA4 event
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'ai_unlocked_form_success', { email_domain: email.split('@')[1] })
      }

      onSuccess?.('unknown')
    } catch {
      setError('Connection error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md mx-auto" noValidate>
      {/* Honeypot — hidden from humans, visible to bots */}
      <input
        ref={honeyRef}
        name="website"
        type="text"
        tabIndex={-1}
        aria-hidden="true"
        style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none' }}
      />

      <div>
        <label htmlFor="ai-email" className="block text-sm font-semibold mb-2" style={{ color: 'rgba(240,237,255,0.8)' }}>
          Email address *
        </label>
        <input
          id="ai-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          required
          autoComplete="email"
          className="w-full rounded-xl px-4 py-3 text-sm outline-none"
          style={{
            background: 'rgba(240,237,255,0.05)',
            border: '1px solid rgba(240,237,255,0.15)',
            color: '#f0edff',
          }}
          onFocus={() => {
            if (typeof window !== 'undefined' && (window as any).gtag) {
              (window as any).gtag('event', 'ai_unlocked_form_start')
            }
          }}
        />
      </div>

      <div>
        <label htmlFor="ai-phone" className="block text-sm font-semibold mb-2" style={{ color: 'rgba(240,237,255,0.6)' }}>
          Phone <span style={{ color: 'rgba(240,237,255,0.35)', fontWeight: 400 }}>(optional — for webinar reminders)</span>
        </label>
        <input
          id="ai-phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+61 400 000 000"
          autoComplete="tel"
          className="w-full rounded-xl px-4 py-3 text-sm outline-none"
          style={{
            background: 'rgba(240,237,255,0.05)',
            border: '1px solid rgba(240,237,255,0.12)',
            color: '#f0edff',
          }}
        />
      </div>

      <div className="flex gap-3 items-start">
        <input
          id="ai-consent"
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          required
          className="mt-1 rounded"
          style={{ accentColor: '#844bfe', width: 16, height: 16, flexShrink: 0 }}
        />
        <label htmlFor="ai-consent" className="text-xs leading-relaxed" style={{ color: 'rgba(240,237,255,0.55)' }}>
          I am 18 or over, OR I have a parent or guardian&apos;s permission to sign up.
          By joining, you agree to our{' '}
          <a href="/privacy" className="underline" style={{ color: '#a673ff' }}>Privacy Policy</a>.
        </label>
      </div>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-sm rounded-lg px-4 py-3"
            style={{ background: 'rgba(255,1,153,0.08)', border: '1px solid rgba(255,1,153,0.2)', color: '#ff6ab5' }}
            role="alert"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full"
        style={{ opacity: loading ? 0.7 : 1 }}
        onClick={() => {
          if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'ai_unlocked_form_submit')
          }
        }}
      >
        {loading ? (
          <span className="flex gap-1 items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" style={{ animationDelay: '300ms' }} />
          </span>
        ) : 'Join the Waitlist →'}
      </button>

      <p className="text-xs text-center" style={{ color: 'rgba(240,237,255,0.3)' }}>
        Free to join. Founding cohort pricing held for waitlist members.
      </p>
    </form>
  )
}
