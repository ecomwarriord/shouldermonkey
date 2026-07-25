import { Resend } from 'resend'
import { createHmac, createHash, timingSafeEqual } from 'crypto'
import { redis } from './store'

const resend = new Resend(process.env.RESEND_API_KEY)

// Sends from the dedicated aiunlocked subdomain (isolated sending reputation),
// but replies route to a real monitored inbox — nurture emails invite replies
export const FROM_EMAIL = 'AI Unlocked <hello@aiunlocked.shouldermonkey.co>'
export const REPLY_TO = 'info@shouldermonkey.co'
export const ABHI_EMAIL = 'rackdbrain@gmail.com'
// API routes (unsubscribe, drain) live on the root Vercel app
export const SITE_URL = 'https://shouldermonkey.co'

// Resend free tier allows 100 emails/day. Shared date-keyed budget across all
// send paths (signup confirmations, Abhi notifications, nurture cron) so the
// combined total backs off before Resend starts rejecting.
const DAILY_SEND_BUDGET = 95

async function withinDailyBudget(): Promise<boolean> {
  try {
    const key = `ai-unlocked:sends:${new Date().toISOString().slice(0, 10)}`
    const count = await redis.incr(key)
    if (count === 1) await redis.expire(key, 172800)
    return count <= DAILY_SEND_BUDGET
  } catch {
    // Budget tracking failure should never block a real send
    return true
  }
}

export async function sendEmail(opts: {
  to: string
  subject: string
  html: string
}): Promise<boolean> {
  if (!(await withinDailyBudget())) {
    console.error(`Daily send budget (${DAILY_SEND_BUDGET}) exhausted — skipped email to ${opts.to}`)
    return false
  }
  // List-Unsubscribe (+ one-click) is a strong inbox-placement signal for
  // Gmail/Outlook. Point it at the per-recipient unsubscribe URL.
  let listUnsub: Record<string, string> | undefined
  try {
    listUnsub = {
      'List-Unsubscribe': `<${unsubUrl(opts.to)}>, <mailto:${REPLY_TO}?subject=unsubscribe>`,
      'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
    }
  } catch {
    listUnsub = undefined
  }

  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: opts.to,
      replyTo: REPLY_TO,
      subject: opts.subject,
      html: opts.html,
      ...(listUnsub ? { headers: listUnsub } : {}),
    })
    if (error) {
      console.error(`Resend error for ${opts.to}:`, error)
      return false
    }
    return true
  } catch (err) {
    console.error(`Resend send failed for ${opts.to}:`, err)
    return false
  }
}

export async function sendTelegram(text: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_ALLOWED_CHAT_ID
  if (!token || !chatId) return
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text }),
  }).catch(() => {})
}

export function unsubToken(email: string): string {
  const secret = process.env.AI_UNSUB_SECRET
  if (!secret) throw new Error('AI_UNSUB_SECRET is not set')
  return createHmac('sha256', secret).update(email.toLowerCase()).digest('hex').slice(0, 24)
}

// Constant-time string comparison (hash both sides to equalise length first)
export function safeEqual(a: string, b: string): boolean {
  const ha = createHash('sha256').update(a).digest()
  const hb = createHash('sha256').update(b).digest()
  return timingSafeEqual(ha, hb)
}

export function unsubUrl(email: string): string {
  return `${SITE_URL}/api/ai-unsubscribe?e=${encodeURIComponent(email.toLowerCase())}&t=${unsubToken(email)}`
}
