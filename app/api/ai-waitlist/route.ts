import { NextRequest, NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'
import { Resend } from 'resend'
import { render } from '@react-email/components'
import { ConfirmationStudent } from '@/components/ai-unlocked/emails/ConfirmationStudent'
import { ConfirmationParent } from '@/components/ai-unlocked/emails/ConfirmationParent'
import { ConfirmationEducator } from '@/components/ai-unlocked/emails/ConfirmationEducator'
import { AbhiNotification } from '@/components/ai-unlocked/emails/AbhiNotification'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

const resend = new Resend(process.env.RESEND_API_KEY)
const WEBHOOK_URL = process.env.SHOULDERMONKEY_WEBHOOK_URL!
const ABHI_EMAIL = 'rackdbrain@gmail.com'
const FROM_EMAIL = 'AI Unlocked <info@shouldermonkey.co>'

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

  // Primary GHL contact
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
    // Telegram alert on every successful signup
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

  // Under-18: register parent as separate GHL contact
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

  // Send confirmation email to registrant
  try {
    let confirmHtml: string

    if (role === 'student') {
      confirmHtml = await render(ConfirmationStudent({ firstName, age: body.age }))
    } else if (role === 'educator') {
      confirmHtml = await render(ConfirmationEducator({ firstName }))
    } else {
      // parent or unknown — use parent template
      // If this is an under-18 registration, the parent filling in the form is the "parent" role.
      // If role=parent but signed up standalone, treat same.
      confirmHtml = await render(ConfirmationParent({
        parentFirstName: firstName,
        childFirstName: body.parentFirstName ?? firstName, // fallback: same person
        childAge: body.age,
      }))
    }

    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: role === 'student'
        ? `You're on the list, ${firstName}. AI Unlocked is coming. 🔥`
        : role === 'educator'
        ? `Welcome to the AI Unlocked waitlist, ${firstName}.`
        : `${body.parentFirstName || firstName}, you're confirmed for AI Unlocked.`,
      html: confirmHtml,
    })

    // If under-18, also send parent confirmation to parent email
    if (isUnder18 && body.parentEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.parentEmail)) {
      const parentConfirmHtml = await render(ConfirmationParent({
        parentFirstName: body.parentFirstName ?? '',
        childFirstName: firstName,
        childAge: body.age,
      }))
      await resend.emails.send({
        from: FROM_EMAIL,
        to: body.parentEmail.toLowerCase(),
        subject: `${firstName} is on the AI Unlocked waitlist — what to expect`,
        html: parentConfirmHtml,
      })
    }
  } catch (err) {
    // Email failure is non-fatal — registrant is still in GHL
    console.error('Resend email failed:', err)
  }

  // Send notification to Abhinav on every signup
  try {
    const abhiHtml = await render(AbhiNotification({
      registrantName: fullName,
      registrantEmail: email,
      registrantPhone: body.phone ?? '',
      role,
      age: body.age,
      ageRange,
      parentName: isUnder18 ? `${body.parentFirstName ?? ''} ${body.parentLastName ?? ''}`.trim() : undefined,
      parentEmail: isUnder18 ? body.parentEmail : undefined,
    }))

    await resend.emails.send({
      from: FROM_EMAIL,
      to: ABHI_EMAIL,
      subject: `New AI Unlocked signup: ${fullName} (${role})`,
      html: abhiHtml,
    })
  } catch (err) {
    console.error('Abhi notification failed:', err)
  }

  await redis.incr('ai-waitlist-total').catch(() => {})

  return NextResponse.json({ success: true })
}
