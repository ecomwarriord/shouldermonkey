import { NextRequest, NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

const WEBHOOK_URL = process.env.SHOULDERMONKEY_WEBHOOK_URL!

async function postToGHL(payload: Record<string, unknown>, attempt = 1): Promise<boolean> {
  try {
    const res = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (res.ok) return true
    if (attempt < 3) {
      await new Promise((r) => setTimeout(r, attempt * 1000))
      return postToGHL(payload, attempt + 1)
    }
    return false
  } catch {
    if (attempt < 3) {
      await new Promise((r) => setTimeout(r, attempt * 1000))
      return postToGHL(payload, attempt + 1)
    }
    return false
  }
}

async function sendTelegram(text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_ALLOWED_CHAT_ID
  if (!token || !chatId) return
  fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text }),
  }).catch(() => {})
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown'
  const rateKey = `ai-waitlist-rate:${ip}`

  const count = await redis.incr(rateKey)
  if (count === 1) await redis.expire(rateKey, 3600)
  if (count > 3) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })

  let body: {
    firstName?: string
    lastName?: string
    email?: string
    phone?: string
    role?: string
    age?: string
    ageRange?: string
    parentFirstName?: string
    parentLastName?: string
    parentEmail?: string
    parentPhone?: string
    parentConsentProvided?: boolean
    archetype?: string
    utm_source?: string
    ref?: string
    website?: string // honeypot
  }

  try { body = await req.json() }
  catch { return NextResponse.json({ error: 'Invalid request' }, { status: 400 }) }

  // Honeypot
  if (body.website) return NextResponse.json({ success: true })

  const email = (body.email ?? '').trim().toLowerCase()
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }

  const role = body.role ?? 'unknown'
  const ageRange = body.ageRange ?? 'age-unknown'
  const isUnder18 = ageRange === 'age-under-15' || ageRange === 'age-15-17'
  const firstName = body.firstName ?? ''
  const lastName = body.lastName ?? ''
  const fullName = `${firstName} ${lastName}`.trim()

  const tags = [
    'ai-unlocked-waitlist',
    `role-${role}`,
    ageRange,
    isUnder18 && body.parentConsentProvided ? 'parental-consent-provided' : null,
    body.archetype ? `archetype-${body.archetype.toLowerCase()}` : null,
    body.utm_source ? `utm-${body.utm_source}` : null,
    body.ref ? `referred-by-${body.ref}` : null,
    'source-landing-page',
  ].filter(Boolean) as string[]

  // Primary GHL contact — GHL workflow handles confirmation email + nurture
  const primaryPayload = {
    firstName,
    lastName,
    email,
    phone: body.phone ?? '',
    source: 'ai-unlocked-landing',
    tags,
    customFields: {
      age: body.age,
      role,
      ...(isUnder18 ? {
        parentGuardianName: `${body.parentFirstName ?? ''} ${body.parentLastName ?? ''}`.trim(),
        parentGuardianEmail: body.parentEmail ?? '',
        parentGuardianPhone: body.parentPhone ?? '',
        parentalConsentDate: new Date().toISOString(),
      } : {}),
    },
  }

  const ghlSuccess = await postToGHL(primaryPayload)

  if (!ghlSuccess) {
    await redis.lpush('ai-waitlist-fallback', JSON.stringify({ ...primaryPayload, timestamp: Date.now() }))
    await sendTelegram(`⚠️ AI Unlocked: GHL webhook failed for ${email}. Saved to fallback.`)
  } else {
    const roleEmoji = role === 'student' ? '🎓' : role === 'parent' ? '👨‍👩‍👧' : role === 'educator' ? '📚' : '👤'
    await sendTelegram(
      `${roleEmoji} New AI Unlocked signup!\n` +
      `Name: ${fullName}\n` +
      `Email: ${email}\n` +
      `Phone: ${body.phone ?? '—'}\n` +
      `Role: ${role}${body.age ? ` · Age: ${body.age}` : ''}\n` +
      `Tags: ${tags.join(', ')}`
    )
  }

  // Under-18: register parent as a separate GHL contact
  // GHL workflow on role-parent tag handles parent confirmation email
  if (isUnder18 && body.parentEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.parentEmail)) {
    const parentPayload = {
      firstName: body.parentFirstName ?? '',
      lastName: body.parentLastName ?? '',
      email: body.parentEmail.toLowerCase(),
      phone: body.parentPhone ?? '',
      source: 'ai-unlocked-landing',
      tags: ['ai-unlocked-waitlist', 'role-parent', 'parental-consent-provided', `child-age-${ageRange}`, 'source-landing-page'],
      customFields: {
        childName: fullName,
        childAge: body.age,
        consentDate: new Date().toISOString(),
      },
    }
    await postToGHL(parentPayload) // best-effort
  }

  await redis.incr('ai-waitlist-total').catch(() => {})

  return NextResponse.json({ success: true })
}
