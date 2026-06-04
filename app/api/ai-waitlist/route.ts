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

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown'
  const rateKey = `ai-waitlist-rate:${ip}`

  // Rate limit: 3 submissions per IP per hour
  const count = await redis.incr(rateKey)
  if (count === 1) await redis.expire(rateKey, 3600)
  if (count > 3) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  let body: {
    email?: string
    phone?: string
    role?: string
    archetype?: string
    utm_source?: string
    ref?: string
    website?: string // honeypot
  }

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  // Honeypot — silent discard
  if (body.website) {
    return NextResponse.json({ success: true })
  }

  const email = (body.email ?? '').trim().toLowerCase()
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }

  const role = body.role ?? 'unknown'
  const archetype = body.archetype ?? 'archetype-unknown'
  const utm = body.utm_source
  const ref = body.ref

  const tags = [
    'ai-unlocked-waitlist',
    `role-${role}`,
    archetype.startsWith('archetype-') ? archetype : `archetype-${archetype.toLowerCase()}`,
    'source-landing-page',
    utm ? `utm-${utm}` : null,
    ref ? `referred-by-${ref}` : null,
  ].filter(Boolean) as string[]

  const payload = {
    email,
    phone: body.phone ?? '',
    source: 'ai-unlocked-landing',
    firstName: '',
    tags,
  }

  const success = await postToGHL(payload)

  if (!success) {
    // Fallback: persist to Redis so no lead is lost
    await redis.lpush('ai-waitlist-fallback', JSON.stringify({ ...payload, timestamp: Date.now() }))

    // Alert via Telegram bot
    const telegramToken = process.env.TELEGRAM_BOT_TOKEN
    const chatId = process.env.TELEGRAM_ALLOWED_CHAT_ID
    if (telegramToken && chatId) {
      fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: `⚠️ AI Unlocked: GHL webhook failed for ${email}. Saved to fallback queue.`,
        }),
      }).catch(() => {})
    }
  }

  // Increment city counter for cohort map (use a placeholder city for now)
  await redis.incr('ai-waitlist-total').catch(() => {})

  return NextResponse.json({ success: true })
}
