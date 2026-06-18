'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface WaitlistFormProps {
  onSuccess?: (role: string) => void
  utm_source?: string
  ref_id?: string
}

interface FormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  role: 'student' | 'parent' | 'educator' | ''
  age: string
  // Under-18 parent/guardian details
  parentFirstName: string
  parentLastName: string
  parentEmail: string
  parentPhone: string
  parentConsent: boolean
  // Honeypot
  website: string
  // Main consent
  consent: boolean
}

const INITIAL: FormData = {
  firstName: '', lastName: '', email: '', phone: '',
  role: '', age: '',
  parentFirstName: '', parentLastName: '', parentEmail: '', parentPhone: '',
  parentConsent: false, website: '', consent: false,
}

const INPUT_STYLE = {
  width: '100%', borderRadius: 12, padding: '12px 16px', fontSize: '0.9rem', outline: 'none',
  background: 'rgba(240,237,255,0.05)', border: '1px solid rgba(240,237,255,0.12)', color: '#f0edff',
  fontFamily: 'inherit',
}

const LABEL_STYLE = {
  display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: 6, color: 'rgba(240,237,255,0.7)',
}

export function WaitlistForm({ onSuccess, utm_source, ref_id }: WaitlistFormProps) {
  const [form, setForm] = useState<FormData>(INITIAL)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const honeyRef = useRef<HTMLInputElement>(null)

  const age = parseInt(form.age) || 0
  const isUnder18 = form.role === 'student' && age > 0 && age < 18
  const isUnder15 = form.role === 'student' && age > 0 && age < 15

  function set(key: keyof FormData, value: string | boolean) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  function validate(): string | null {
    if (!form.firstName.trim()) return 'First name is required.'
    if (!form.lastName.trim()) return 'Last name is required.'
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'A valid email is required.'
    if (!form.phone.trim()) return 'Phone number is required (for webinar reminders).'
    if (!form.role) return 'Please select your role.'
    if (!form.age) return 'Age is required.'
    if (age < 13) return 'This event is for ages 13 and up.'
    if (isUnder18) {
      if (!form.parentFirstName.trim()) return 'Parent/guardian first name is required for under-18 registrations.'
      if (!form.parentLastName.trim()) return 'Parent/guardian last name is required.'
      if (!form.parentEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.parentEmail)) return 'A valid parent/guardian email is required.'
      if (!form.parentPhone.trim()) return 'Parent/guardian phone is required.'
      if (!form.parentConsent) return 'Parent/guardian consent is required for under-18 registrations.'
    }
    if (!form.consent) return 'Please confirm your consent to register.'
    return null
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    // Honeypot check
    if (honeyRef.current?.value) return

    const validationError = validate()
    if (validationError) { setError(validationError); return }

    setLoading(true)
    if ((window as any).gtag) (window as any).gtag('event', 'ai_unlocked_form_submit')

    try {
      const ageNum = parseInt(form.age)
      const ageRange = ageNum < 15 ? 'age-under-15' : ageNum < 18 ? 'age-15-17' : 'age-18-plus'

      const res = await fetch('/api/ai-waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          email: form.email.trim().toLowerCase(),
          phone: form.phone.trim(),
          role: form.role,
          age: form.age,
          ageRange,
          // Parent details (sent if under 18)
          parentFirstName: isUnder18 ? form.parentFirstName.trim() : undefined,
          parentLastName: isUnder18 ? form.parentLastName.trim() : undefined,
          parentEmail: isUnder18 ? form.parentEmail.trim().toLowerCase() : undefined,
          parentPhone: isUnder18 ? form.parentPhone.trim() : undefined,
          parentConsentProvided: isUnder18 ? form.parentConsent : undefined,
          // Meta
          utm_source,
          ref: ref_id,
          website: honeyRef.current?.value ?? '',
        }),
      })

      if (res.status === 429) { setError("You're already on the list. Check your inbox."); return }
      if (!res.ok) { setError('Something went wrong. Please try again.'); return }

      if ((window as any).gtag) (window as any).gtag('event', 'ai_unlocked_form_success', { role: form.role })
      onSuccess?.(form.role)
    } catch {
      setError('Connection error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Honeypot */}
      <input ref={honeyRef} name="website" type="text" tabIndex={-1} aria-hidden="true"
        style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none' }} />

      {/* Name row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <label htmlFor="ai-fname" style={LABEL_STYLE}>First name *</label>
          <input id="ai-fname" type="text" value={form.firstName} onChange={e => set('firstName', e.target.value)}
            placeholder="Jordan" required autoComplete="given-name" style={INPUT_STYLE} />
        </div>
        <div>
          <label htmlFor="ai-lname" style={LABEL_STYLE}>Last name *</label>
          <input id="ai-lname" type="text" value={form.lastName} onChange={e => set('lastName', e.target.value)}
            placeholder="Smith" required autoComplete="family-name" style={INPUT_STYLE} />
        </div>
      </div>

      {/* Email */}
      <div>
        <label htmlFor="ai-email" style={LABEL_STYLE}>Email address *</label>
        <input id="ai-email" type="email" value={form.email} onChange={e => set('email', e.target.value)}
          placeholder="you@email.com" required autoComplete="email" style={INPUT_STYLE}
          onFocus={() => { if ((window as any).gtag) (window as any).gtag('event', 'ai_unlocked_form_start') }} />
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="ai-phone" style={LABEL_STYLE}>Phone *
          <span style={{ color: 'rgba(240,237,255,0.35)', fontWeight: 400, marginLeft: 6 }}>(for webinar reminders)</span>
        </label>
        <input id="ai-phone" type="tel" value={form.phone} onChange={e => set('phone', e.target.value)}
          placeholder="+61 400 000 000" required autoComplete="tel" style={INPUT_STYLE} />
      </div>

      {/* Role + Age row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <label style={LABEL_STYLE}>I am a *</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
            {([
              { value: 'student', label: 'Student (13+)' },
              { value: 'parent', label: 'Parent / Guardian' },
              { value: 'educator', label: 'Educator / Professional' },
            ] as const).map(r => (
              <label key={r.value} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: '0.875rem', color: form.role === r.value ? '#ffffff' : 'rgba(240,237,255,0.55)' }}>
                <input type="radio" name="role" value={r.value} checked={form.role === r.value} onChange={() => set('role', r.value)}
                  style={{ accentColor: '#7B3FE4', width: 16, height: 16 }} />
                {r.label}
              </label>
            ))}
          </div>
        </div>
        <div>
          <label htmlFor="ai-age" style={LABEL_STYLE}>Age *</label>
          <input id="ai-age" type="number" min="13" max="99" value={form.age} onChange={e => set('age', e.target.value)}
            placeholder="e.g. 16" required style={INPUT_STYLE} />
          {age > 0 && age < 13 && (
            <p style={{ color: '#FF3366', fontSize: '0.75rem', marginTop: 4 }}>This event is for ages 13 and up.</p>
          )}
        </div>
      </div>

      {/* Under-18 parent section */}
      <AnimatePresence>
        {isUnder18 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '20px', background: 'rgba(255,51,102,0.05)', border: '1.5px solid rgba(255,51,102,0.2)', borderRadius: 14, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <p style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#FF3366', marginBottom: 4 }}>
                  {isUnder15 ? 'Parental consent required (under 15)' : 'Parent / Guardian details required (under 18)'}
                </p>
                <p style={{ fontSize: '0.8rem', color: 'rgba(240,237,255,0.5)', lineHeight: 1.5 }}>
                  Under Australian Privacy Act 1988, we require a parent or guardian to consent on behalf of attendees under 18.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label htmlFor="ai-pfname" style={LABEL_STYLE}>Guardian first name *</label>
                  <input id="ai-pfname" type="text" value={form.parentFirstName} onChange={e => set('parentFirstName', e.target.value)}
                    placeholder="Alex" required={isUnder18} autoComplete="given-name" style={INPUT_STYLE} />
                </div>
                <div>
                  <label htmlFor="ai-plname" style={LABEL_STYLE}>Guardian last name *</label>
                  <input id="ai-plname" type="text" value={form.parentLastName} onChange={e => set('parentLastName', e.target.value)}
                    placeholder="Smith" required={isUnder18} autoComplete="family-name" style={INPUT_STYLE} />
                </div>
              </div>

              <div>
                <label htmlFor="ai-pemail" style={LABEL_STYLE}>Guardian email *</label>
                <input id="ai-pemail" type="email" value={form.parentEmail} onChange={e => set('parentEmail', e.target.value)}
                  placeholder="parent@email.com" required={isUnder18} autoComplete="email" style={INPUT_STYLE} />
              </div>

              <div>
                <label htmlFor="ai-pphone" style={LABEL_STYLE}>Guardian phone *</label>
                <input id="ai-pphone" type="tel" value={form.parentPhone} onChange={e => set('parentPhone', e.target.value)}
                  placeholder="+61 400 000 000" required={isUnder18} autoComplete="tel" style={INPUT_STYLE} />
              </div>

              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <input id="ai-parent-consent" type="checkbox" checked={form.parentConsent} onChange={e => set('parentConsent', e.target.checked)}
                  required={isUnder18} style={{ accentColor: '#FF3366', width: 16, height: 16, marginTop: 2, flexShrink: 0 }} />
                <label htmlFor="ai-parent-consent" style={{ fontSize: '0.78rem', lineHeight: 1.6, color: 'rgba(240,237,255,0.6)', cursor: 'pointer' }}>
                  I am the parent or guardian of this student. I have read the{' '}
                  <a href="/privacy" style={{ color: '#FF3366' }}>Privacy Policy</a>{' '}
                  and consent to AI Unlocked (RackTheBrain × ShoulderMonkey) collecting, storing, and using my child&apos;s personal information for the purposes of this event and related communications. I understand I can request access, correction, or deletion of this data at any time. *
                </label>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main consent */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <input id="ai-consent" type="checkbox" checked={form.consent} onChange={e => set('consent', e.target.checked)}
          required style={{ accentColor: '#7B3FE4', width: 16, height: 16, marginTop: 2, flexShrink: 0 }} />
        <label htmlFor="ai-consent" style={{ fontSize: '0.78rem', lineHeight: 1.6, color: 'rgba(240,237,255,0.55)', cursor: 'pointer' }}>
          I confirm I am 18 or over, OR that I have the consent of a parent or guardian to register.
          I agree to AI Unlocked collecting and using my details to notify me when tickets go on sale and send event-related information.
          I have read the <a href="/privacy" style={{ color: '#a673ff' }}>Privacy Policy</a>. *
        </label>
      </div>

      <AnimatePresence>
        {error && (
          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            role="alert" style={{ fontSize: '0.85rem', padding: '12px 16px', borderRadius: 10, background: 'rgba(255,51,102,0.08)', border: '1px solid rgba(255,51,102,0.2)', color: '#ff6ab5' }}>
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      <button type="submit" disabled={loading} className="btn-primary w-full"
        style={{ opacity: loading ? 0.7 : 1, background: 'linear-gradient(135deg, #7B3FE4 0%, #FF3366 100%)', fontSize: '1rem', padding: '0.95rem 2rem' }}>
        {loading ? (
          <span style={{ display: 'flex', gap: 6, alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff', animation: 'bounce 0.6s infinite alternate' }} />
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff', animation: 'bounce 0.6s 0.2s infinite alternate' }} />
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff', animation: 'bounce 0.6s 0.4s infinite alternate' }} />
          </span>
        ) : 'Join the Waitlist →'}
      </button>

      <p style={{ fontSize: '0.75rem', textAlign: 'center', color: 'rgba(240,237,255,0.3)' }}>
        Free to join. No commitment. We&apos;ll notify you when tickets drop.
      </p>
    </form>
  )
}
