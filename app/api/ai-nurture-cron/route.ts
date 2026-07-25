import { NextRequest, NextResponse } from 'next/server'
import { render } from '@react-email/components'
import { NURTURE_STEPS } from '@/components/ai-unlocked/emails/nurture-sequence'
import { getContact, listContactEmails, updateContact } from '@/lib/ai-unlocked/store'
import { sendEmail, sendTelegram, unsubUrl, safeEqual } from '@/lib/ai-unlocked/mailer'

// Resend free tier is 100 emails/day — leave headroom for signups + notifications
const MAX_SENDS_PER_RUN = 60
const DAY_MS = 86_400_000

export const maxDuration = 300

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization') ?? ''
  if (!process.env.CRON_SECRET || !safeEqual(auth, `Bearer ${process.env.CRON_SECRET}`)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const emails = await listContactEmails()
  let sent = 0
  let failed = 0
  let done = 0

  for (const email of emails) {
    if (sent >= MAX_SENDS_PER_RUN) break

    const contact = await getContact(email)
    if (!contact || contact.unsubscribed) continue

    const step = NURTURE_STEPS[contact.nurtureStep]
    if (!step) { done++; continue }

    const daysIn = (Date.now() - contact.joinedAt) / DAY_MS
    if (daysIn < step.day) continue

    const firstName = contact.firstName || 'there'
    const html = await render(step.render({ firstName, unsubUrl: unsubUrl(email) }))
    const ok = await sendEmail({ to: email, subject: step.subject(firstName), html })

    if (ok) {
      await updateContact(email, { nurtureStep: contact.nurtureStep + 1, lastSentAt: Date.now() })
      sent++
    } else {
      failed++
    }
  }

  console.log(`ai-nurture-cron: contacts=${emails.length} sent=${sent} failed=${failed} complete=${done}`)
  if (sent > 0 || failed > 0) {
    await sendTelegram(`📬 AI Unlocked nurture run: ${sent} sent${failed ? `, ${failed} FAILED` : ''} (${emails.length} contacts, ${done} finished sequence)`)
  }

  return NextResponse.json({ contacts: emails.length, sent, failed, sequenceComplete: done })
}
