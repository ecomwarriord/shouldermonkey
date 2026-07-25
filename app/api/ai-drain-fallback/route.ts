import { NextRequest, NextResponse } from 'next/server'
import { render } from '@react-email/components'
import { ConfirmationStudent } from '@/components/ai-unlocked/emails/ConfirmationStudent'
import { ConfirmationParent } from '@/components/ai-unlocked/emails/ConfirmationParent'
import { ConfirmationEducator } from '@/components/ai-unlocked/emails/ConfirmationEducator'
import { redis, saveContact, contactExists, type AiContact } from '@/lib/ai-unlocked/store'
import { sendEmail, sendTelegram, safeEqual, ABHI_EMAIL } from '@/lib/ai-unlocked/mailer'

// One-off admin job: migrates contacts stuck in the old GHL fallback queue
// into the Redis contact store, sends update-framed confirmations, and emails
// Abhinav a digest. Idempotent: already-migrated emails are skipped.

const FALLBACK_KEY = 'ai-waitlist-fallback'
const ARCHIVE_KEY = 'ai-waitlist-fallback-archive'

export const maxDuration = 300

interface FallbackEntry {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  tags?: string[]
  customFields?: {
    age?: string
    role?: string
    parentGuardianName?: string
    parentGuardianEmail?: string
    parentGuardianPhone?: string
    parentalConsentDate?: string
    childName?: string
    childAge?: string
    consentDate?: string
  }
  timestamp?: number
}

// Digest HTML is built by string interpolation from user-submitted fields —
// escape everything to prevent HTML injection into Abhi's inbox
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function parseEntry(raw: unknown): FallbackEntry | null {
  if (typeof raw === 'string') {
    try { return JSON.parse(raw) } catch { return null }
  }
  if (raw && typeof raw === 'object') return raw as FallbackEntry
  return null
}

export async function POST(req: NextRequest) {
  const auth = req.headers.get('authorization') ?? ''
  if (!process.env.CRON_SECRET || !safeEqual(auth, `Bearer ${process.env.CRON_SECRET}`)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const rawEntries = await redis.lrange(FALLBACK_KEY, 0, -1)
  const entries = rawEntries.map(parseEntry).filter((e): e is FallbackEntry => !!e?.email)

  const migrated: string[] = []
  const skipped: string[] = []
  const emailFailed: string[] = []
  const migrationFailed: string[] = []
  const digestRows: { name: string; email: string; phone: string; role: string; age: string }[] = []

  for (const entry of entries) {
    const email = entry.email!.trim().toLowerCase()
    const role = entry.customFields?.role
      ?? entry.tags?.find((t) => t.startsWith('role-'))?.replace('role-', '')
      ?? 'unknown'
    const firstName = entry.firstName ?? ''
    const fullName = `${firstName} ${entry.lastName ?? ''}`.trim()
    const ageRange = entry.tags?.find((t) => t.startsWith('age-')) ?? 'age-unknown'
    const age = entry.customFields?.age ?? entry.customFields?.childAge

    digestRows.push({ name: fullName || '(no name)', email, phone: entry.phone ?? '', role, age: age ?? '' })

    // Per-entry isolation: one bad entry must not abort the whole migration
    try {

    if (await contactExists(email)) {
      skipped.push(email)
      continue
    }

    const contact: AiContact = {
      email,
      firstName,
      lastName: entry.lastName ?? '',
      phone: entry.phone ?? '',
      role,
      age,
      ageRange,
      tags: entry.tags ?? ['ai-unlocked-waitlist'],
      parentGuardianName: entry.customFields?.parentGuardianName,
      parentGuardianEmail: entry.customFields?.parentGuardianEmail?.toLowerCase(),
      parentGuardianPhone: entry.customFields?.parentGuardianPhone,
      parentalConsentDate: entry.customFields?.parentalConsentDate ?? entry.customFields?.consentDate,
      childName: entry.customFields?.childName,
      // Nurture clock starts now, not at original signup, so drained contacts
      // enter the sequence fresh instead of getting 5 emails at once
      joinedAt: Date.now(),
      nurtureStep: 0,
      lastSentAt: 0,
    }
    await saveContact(contact)
    migrated.push(email)

    // Update-framed confirmation (these people signed up weeks ago and never
    // heard from us — subject acknowledges time passed without apologising)
    let html: string
    let subject: string
    if (role === 'student') {
      html = await render(ConfirmationStudent({ firstName, age }))
      subject = `Update: you're locked in for AI Unlocked, ${firstName} 🔥`
    } else if (role === 'educator') {
      html = await render(ConfirmationEducator({ firstName }))
      subject = `Update: your spot on the AI Unlocked waitlist, ${firstName}`
    } else {
      html = await render(ConfirmationParent({
        parentFirstName: firstName,
        childFirstName: entry.customFields?.childName ?? firstName,
        childAge: age,
      }))
      subject = `Update: ${firstName}, you're confirmed for AI Unlocked`
    }

    const ok = await sendEmail({ to: email, subject, html })
    if (!ok) emailFailed.push(email)

    } catch (err) {
      console.error(`Drain migration failed for ${email}:`, err)
      migrationFailed.push(email)
    }
  }

  // Digest to Abhinav — one email covering everyone recovered
  let digestSent = false
  if (digestRows.length > 0) {
    const rowsHtml = digestRows.map((r) =>
      `<tr><td style="padding:8px 12px;border-bottom:1px solid #eee">${escapeHtml(r.name)}</td><td style="padding:8px 12px;border-bottom:1px solid #eee">${escapeHtml(r.email)}</td><td style="padding:8px 12px;border-bottom:1px solid #eee">${escapeHtml(r.phone || '-')}</td><td style="padding:8px 12px;border-bottom:1px solid #eee">${escapeHtml(r.role)}</td><td style="padding:8px 12px;border-bottom:1px solid #eee">${escapeHtml(r.age || '-')}</td></tr>`
    ).join('')
    const digestHtml = `<!DOCTYPE html><html><body style="font-family:-apple-system,'Segoe UI',Arial,sans-serif;color:#222;padding:24px">
<h2 style="margin:0 0 8px">AI Unlocked — waitlist catch-up</h2>
<p style="margin:0 0 16px;color:#555">Abhi, here are all ${digestRows.length} waitlist signups so far. Earlier system issue meant these didn't reach you one by one. Individual alerts resume from now on.</p>
<table style="border-collapse:collapse;font-size:14px;width:100%">
<tr><th style="text-align:left;padding:8px 12px;border-bottom:2px solid #333">Name</th><th style="text-align:left;padding:8px 12px;border-bottom:2px solid #333">Email</th><th style="text-align:left;padding:8px 12px;border-bottom:2px solid #333">Phone</th><th style="text-align:left;padding:8px 12px;border-bottom:2px solid #333">Role</th><th style="text-align:left;padding:8px 12px;border-bottom:2px solid #333">Age</th></tr>
${rowsHtml}</table></body></html>`
    digestSent = await sendEmail({
      to: ABHI_EMAIL,
      subject: `AI Unlocked: ${digestRows.length} waitlist signups to date (catch-up digest)`,
      html: digestHtml,
    })
  }

  // Archive the queue only after processing (copy then delete)
  if (rawEntries.length > 0) {
    const serialised = rawEntries.map((e) => (typeof e === 'string' ? e : JSON.stringify(e)))
    await redis.rpush(ARCHIVE_KEY, ...serialised)
    await redis.del(FALLBACK_KEY)
  }

  const summary = {
    queued: entries.length,
    migrated: migrated.length,
    skippedExisting: skipped.length,
    migrationFailed,
    confirmationFailed: emailFailed,
    abhiDigestSent: digestSent,
  }
  console.log('ai-drain-fallback:', JSON.stringify(summary))
  await sendTelegram(
    `🔄 AI Unlocked fallback drained\n` +
    `Migrated: ${migrated.length} · Skipped (already in CRM): ${skipped.length} · Errors: ${migrationFailed.length ? migrationFailed.join(', ') : 'none'}\n` +
    `Confirmations failed: ${emailFailed.length ? emailFailed.join(', ') : 'none'}\n` +
    `Abhi digest: ${digestSent ? 'sent ✅' : 'FAILED ⚠️'}`
  )

  return NextResponse.json(summary)
}
