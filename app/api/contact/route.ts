import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const webhookUrl = process.env.SHOULDERMONKEY_WEBHOOK_URL

  if (!webhookUrl) {
    console.error('[contact] SHOULDERMONKEY_WEBHOOK_URL not set')
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 })
  }

  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: body.name,
      businessName: body.businessName,
      email: body.email,
      phone: body.phone,
      challenge: body.challenge,
      niche: body.niche,
      source: body.source ?? 'shouldermonkey',
      tags: ['shouldermonkey', body.niche].filter(Boolean),
    }),
  })

  console.log(`[contact] ${body.niche} enquiry from ${body.email} — webhook status ${res.status}`)
  return NextResponse.json({ ok: true }, { status: res.ok ? 200 : 500 })
}
