'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function LiveDemo() {
  const [prompt, setPrompt] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const triesRef = useRef(0)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!prompt.trim() || loading) return

    // Client-side session rate limit
    if (triesRef.current >= 3) {
      setError("You've used all 3 free tries. Join the waitlist to see more!")
      return
    }

    setLoading(true)
    setResult('')
    setError('')
    triesRef.current++

    try {
      const res = await fetch('/api/ai-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })

      const data = await res.json()

      if (res.status === 429) {
        setError("You've hit the limit. Join the waitlist to explore more!")
        return
      }
      if (res.status === 408 || data.error === 'timeout') {
        setError('Took too long — try again with a shorter idea.')
        return
      }
      if (!res.ok || data.error) {
        setError('Something went wrong. Please try again.')
        return
      }

      setResult(data.result ?? '')
    } catch {
      setError('Connection error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. an app that helps students find part-time jobs"
            maxLength={200}
            className="flex-1 rounded-xl px-4 py-3 text-sm outline-none"
            style={{
              background: 'rgba(132,75,254,0.08)',
              border: '1px solid rgba(132,75,254,0.25)',
              color: '#f0edff',
            }}
            aria-label="Describe your business idea"
          />
          <button
            type="submit"
            disabled={loading || !prompt.trim()}
            className="btn-primary whitespace-nowrap"
            style={{ padding: '0.75rem 1.5rem', fontSize: '0.875rem', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? (
              <span className="flex gap-1 items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" style={{ animationDelay: '300ms' }} />
              </span>
            ) : 'Try it →'}
          </button>
        </div>
      </form>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="mt-4 rounded-2xl p-6"
            style={{ background: 'rgba(132,75,254,0.06)', border: '1px solid rgba(132,75,254,0.2)' }}
          >
            <p className="text-xs font-bold mb-3 uppercase tracking-widest" style={{ color: 'var(--ai-pop)' }}>
              AI Generated in seconds
            </p>
            <pre className="text-sm whitespace-pre-wrap font-sans leading-relaxed" style={{ color: 'var(--ai-text)' }}>
              {result}
            </pre>
            <p className="mt-4 text-xs" style={{ color: 'var(--ai-muted)' }}>
              That&apos;s the tool. The course teaches you to combine it, direct it, and turn it into something people actually pay for.
            </p>
          </motion.div>
        )}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 rounded-xl p-4 text-sm"
            style={{ background: 'rgba(255,1,153,0.08)', border: '1px solid rgba(255,1,153,0.2)', color: '#ff6ab5' }}
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
