import { NextRequest, NextResponse } from 'next/server'
import { render } from '@react-email/components'
import { ConfirmationStudent } from '@/components/ai-unlocked/emails/ConfirmationStudent'
import { ConfirmationParent } from '@/components/ai-unlocked/emails/ConfirmationParent'
import { ConfirmationEducator } from '@/components/ai-unlocked/emails/ConfirmationEducator'
import { AbhiNotification } from '@/components/ai-unlocked/emails/AbhiNotification'
import { redis, saveContact, contactExists, type AiContact } from '@/lib/ai-unlocked/store'
import { sendEmail, sendTelegram, ABHI_EMAIL } from '@/lib/ai-unlocked/mailer'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Strip control characters, trim, cap length — used on all free-text fields
// that flow into emails and stored records
function clean(value: string | undefined, max = 80): string {
  return (value ?? '').replace(/[\x00-\x1f\x7f]/g, '').trim().slice(0, max)
}

export async function POST(req: NextRequest) {
  // x-real-ip is set by Vercel's proxy; leftmost x-forwarded-for is client-spoofable
  const ip = req.headers.get('x-real-ip')
    ?? req.headers.get('x-forwarded-for')?.split(',').pop()?.trim()
    ?? 'unknown'
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
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }

  // Idempotent: repeat submissions for a known email succeed without
  // re-sending emails (also blocks confirmation-spam abuse per address)
  if (await contactExists(email)) {
    return NextResponse.json({ success: true })
  }

  const role = body.role ?? 'unknown'
  const ageRange = body.ageRange ?? 'age-unknown'
  const isUnder18 = ageRange === 'age-under-15' || ageRange === 'age-15-17'
  const firstName = clean(body.firstName)
  const lastName = clean(body.lastName)
  const fullName = `${firstName} ${lastName}`.trim()
  const parentEmail = body.parentEmail?.trim().toLowerCase()
  const hasValidParentEmail = isUnder18 && !!parentEmail && EMAIL_RE.test(parentEmail)
  // Consent is only recorded when explicitly declared AND a valid guardian
  // email was supplied — never stamped by default for under-18s
  const consentRecorded = hasValidParentEmail && body.parentConsentProvided === true
  const parentFirstName = clean(body.parentFirstName)
  const parentLastName = clean(body.parentLastName)
  const phone = clean(body.phone, 40)
  const parentPhone = clean(body.parentPhone, 40)

  const tags = [
    'ai-unlocked-waitlist',
    `role-${role}`,
    ageRange,
    consentRecorded ? 'parental-consent-provided' : null,
    body.archetype ? `archetype-${body.archetype.toLowerCase()}` : null,
    body.utm_source ? `utm-${body.utm_source}` : null,
    body.ref ? `referred-by-${body.ref}` : null,
    'source-landing-page',
  ].filter(Boolean) as string[]

  // Contact store in Redis is the CRM of record (GHL removed)
  const contact: AiContact = {
    email,
    firstName,
    lastName,
    phone,
    role,
    age: body.age,
    ageRange,
    tags,
    ...(isUnder18 ? {
      parentGuardianName: `${parentFirstName} ${parentLastName}`.trim(),
      parentGuardianEmail: parentEmail ?? '',
      parentGuardianPhone: parentPhone,
      // Consent date only recorded when consent was explicitly declared with
      // a valid guardian email — never stamped by default
      ...(consentRecorded ? { parentalConsentDate: new Date().toISOString() } : {}),
    } : {}),
    joinedAt: Date.now(),
    nurtureStep: 0,
    lastSentAt: 0,
  }

  try {
    await saveContact(contact)
  } catch (err) {
    console.error('Contact save failed:', err)
    await sendTelegram(`🚨 AI Unlocked: FAILED to save contact ${email}. Check Redis.`)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }

  // Under-18: store parent as separate contact
  if (hasValidParentEmail && parentEmail !== email) {
    const parentContact: AiContact = {
      email: parentEmail,
      firstName: parentFirstName,
      lastName: parentLastName,
      phone: parentPhone,
      role: 'parent',
      ageRange: 'age-18-plus',
      tags: [
        'ai-unlocked-waitlist',
        'role-parent',
        ...(consentRecorded ? ['parental-consent-provided'] : []),
        `child-age-${ageRange}`,
        'source-landing-page',
      ],
      childName: fullName,
      joinedAt: Date.now(),
      nurtureStep: 0,
      lastSentAt: 0,
    }
    await saveContact(parentContact).catch((err) => console.error('Parent contact save failed:', err))
  }

  // Confirmation email to registrant
  let confirmationSent = false
  try {
    let confirmHtml: string
    let subject: string

    if (role === 'student') {
      confirmHtml = await render(ConfirmationStudent({ firstName, age: body.age }))
      subject = `You're on the list, ${firstName}. AI Unlocked is coming. 🔥`
    } else if (role === 'educator') {
      confirmHtml = await render(ConfirmationEducator({ firstName }))
      subject = `Welcome to the AI Unlocked waitlist, ${firstName}.`
    } else {
      confirmHtml = await render(ConfirmationParent({
        parentFirstName: firstName,
        childFirstName: firstName,
        childAge: body.age,
      }))
      subject = `${firstName}, you're confirmed for AI Unlocked.`
    }

    confirmationSent = await sendEmail({ to: email, subject, html: confirmHtml })

    // Under-18: parent confirmation to guardian address
    if (hasValidParentEmail) {
      const parentConfirmHtml = await render(ConfirmationParent({
        parentFirstName,
        childFirstName: firstName,
        childAge: body.age,
      }))
      await sendEmail({
        to: parentEmail!,
        subject: `${firstName} is on the AI Unlocked waitlist — what to expect`,
        html: parentConfirmHtml,
      })
    }
  } catch (err) {
    console.error('Confirmation email failed:', err)
  }

  // Notify Abhinav on every signup
  try {
    const abhiHtml = await render(AbhiNotification({
      registrantName: fullName,
      registrantEmail: email,
      registrantPhone: phone,
      role,
      age: body.age,
      ageRange,
      parentName: isUnder18 ? `${parentFirstName} ${parentLastName}`.trim() : undefined,
      parentEmail: isUnder18 ? parentEmail : undefined,
    }))
    await sendEmail({
      to: ABHI_EMAIL,
      subject: `New AI Unlocked signup: ${fullName} (${role})`,
      html: abhiHtml,
    })
  } catch (err) {
    console.error('Abhi notification failed:', err)
  }

  const roleEmoji = role === 'student' ? '🎓' : role === 'parent' ? '👨‍👩‍👧' : role === 'educator' ? '📚' : '👤'
  await sendTelegram(
    `${roleEmoji} New AI Unlocked signup!\n` +
    `Name: ${fullName}\n` +
    `Email: ${email}\n` +
    `Phone: ${phone || '—'}\n` +
    `Role: ${role}${body.age ? ` · Age: ${body.age}` : ''}\n` +
    `Confirmation email: ${confirmationSent ? 'sent ✅' : 'FAILED ⚠️ (contact saved, check Resend)'}\n` +
    `Tags: ${tags.join(', ')}`
  )

  await redis.incr('ai-waitlist-total').catch(() => {})

  return NextResponse.json({ success: true })
}
