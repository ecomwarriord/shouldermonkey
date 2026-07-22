import { NextRequest, NextResponse } from 'next/server'
import { getContact, markUnsubscribed } from '@/lib/ai-unlocked/store'
import { unsubToken, safeEqual } from '@/lib/ai-unlocked/mailer'

function page(message: string): NextResponse {
  return new NextResponse(
    `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>AI Unlocked</title></head>
<body style="margin:0;background:#030108;font-family:-apple-system,'Segoe UI',Arial,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh">
<div style="max-width:420px;padding:40px;text-align:center;color:#f0edff">
<div style="font-size:20px;font-weight:800;letter-spacing:0.12em;margin-bottom:16px">AI UNLOCKED</div>
<p style="color:rgba(240,237,255,0.7);font-size:15px;line-height:1.6">${message}</p>
</div></body></html>`,
    { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
  )
}

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('e')?.trim().toLowerCase()
  const token = req.nextUrl.searchParams.get('t')

  const invalidPage = () =>
    page('That unsubscribe link is not valid. If you want off the list, reply to any of our emails and we will remove you.')

  if (!email || !token) return invalidPage()

  let valid = false
  try {
    valid = safeEqual(token, unsubToken(email))
  } catch (err) {
    // unsubToken throws if AI_UNSUB_SECRET is unset — treat as invalid link
    console.error('Unsubscribe token check failed:', err)
  }
  if (!valid) return invalidPage()

  const contact = await getContact(email)
  if (contact) await markUnsubscribed(email)

  return page('You are unsubscribed. No more emails from us. If you change your mind before August, you can rejoin at shouldermonkey.co/ai-unlocked.')
}
