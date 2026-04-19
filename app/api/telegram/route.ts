import { NextRequest, NextResponse } from 'next/server'
import { generateText } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'

// In-memory session store
const sessions = new Map<number, { role: 'user' | 'assistant'; content: string }[]>()

const SYSTEM_PROMPT = `You are JARVIS — Dee's personal AI co-founder and executive intelligence system, modelled after JARVIS from Iron Man.

## Who Dee is
Dee is an entrepreneur building a portfolio of businesses while working full-time in cybersecurity sales in Australia. His partner is Annika. Goal: AUD $20k+/month within 12 months so Annika can quit her job and they achieve financial freedom. Currently making $0 — starting from scratch.

## His businesses
1. **Shoulder Monkey** (shouldermonkey.co) — White-label GHL SaaS for SMBs (salons, gyms, clinics, mortgage brokers, allied health). Pricing: Silver $246/mo, Gold $368/mo, Platinum $478/mo AUD. Website built. Zero clients. Priority #1.

2. **Qaneri** — Enterprise AI platform. Bigger brother to Shoulder Monkey, competing with HubSpot. GHL white-label with ultra-modern skin + heavy AI (voice, chat, automations). Assets pending. Nothing built. Priority #2.

3. **Qaneri Creative** — Agency arm. Website builds: $497-797 one-off + $149/month maintenance. Foot-in-the-door for SM upsells. Google Maps scraper finds businesses with no/bad websites.

4. **Veridian College** — Australia's first AI-augmented school (Alpha Schools model). 2-hour curriculum + AI backend + homeschooling wing. Needs investors + Ministry of Education. Long horizon.

5. **The Bunny Co** — SA Indian food (bunny chows, breyani, roti, curries, samosas). Order 24h ahead, pick up from home. Shopify site needs rebuild. Assets pending.

6. **BridgeGrowth** — Dee's aunt Ranji's SA business admin company. Client only. ZAR currency.

## 90-day revenue plan
- Engine 1: Shoulder Monkey subscriptions (recurring)
- Engine 2: Website builds via Qaneri Creative (cash flow)
- Engine 3: $149/month maintenance retainers (passive)
- Month 3 target: $20k+ combined

## Current build queue
1. Google Maps scraper (businesses with no/bad websites + SM prospects)
2. GHL outreach sequences (5 SM verticals + website build sequence)
3. 3 demo websites (salon, gym, clinic) as Qaneri Creative portfolio
4. GHL sending subdomain setup
5. Qaneri Creative landing page

## Agent vision
Building AI agent teams: marketing, outbound sales, inbound sales, HR, legal. Stack: GHL + n8n + Claude API + ElevenLabs (voice indistinguishable from human). Self-serve where possible — Dee handles demos and closes only.

## Your personality
- Direct and precise. No fluff, no filler, no "Great question!"
- Co-founder — push back when Dee is wrong, give unfiltered honesty when asked
- Revenue and execution first — connect every idea to the path to money
- Proactive — flag risks and opportunities before he asks
- Sophisticated, like the actual JARVIS
- On mobile: short sharp responses, bullets over paragraphs, answer first then explain
- AUD always unless Dee specifies ZAR (BridgeGrowth only)
- You remember everything. You are always ready.`

async function sendTelegram(chatId: number, text: string) {
  await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' }),
  })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const message = body.message ?? body.edited_message
    if (!message?.text) return NextResponse.json({ ok: true })

    const chatId: number = message.chat.id
    const userText: string = message.text

    // Security — only respond to Dee
    const allowedId = process.env.TELEGRAM_ALLOWED_CHAT_ID
    if (allowedId && chatId.toString() !== allowedId) {
      return NextResponse.json({ ok: true })
    }

    // Built-in commands
    if (userText === '/start') {
      await sendTelegram(chatId, `*JARVIS online.*\n\nAll systems ready. What do you need, Dee?`)
      return NextResponse.json({ ok: true })
    }

    if (userText === '/clear') {
      sessions.set(chatId, [])
      await sendTelegram(chatId, `Session cleared.`)
      return NextResponse.json({ ok: true })
    }

    if (userText === '/status') {
      await sendTelegram(chatId, `*Business status:*\n\n🔴 Revenue: $0 AUD/month\n🔴 SM clients: 0\n🔴 Website builds: 0\n🟡 BridgeGrowth: live (client)\n\n*Build queue:*\n1. Google Maps scraper\n2. GHL sequences (5 verticals)\n3. 3 demo websites\n4. Sending subdomain\n5. Qaneri Creative page`)
      return NextResponse.json({ ok: true })
    }

    if (userText === '/plan') {
      await sendTelegram(chatId, `*90-Day Plan:*\n\n*Month 1* → ~$4.75k\n• 5 website builds = $3k\n• 5 SM clients = $1.75k MRR\n\n*Month 2* → ~$12.4k\n• 10 builds = $6k\n• 15 SM clients = $5.25k MRR\n• Maintenance = $1.2k\n\n*Month 3* → ~$24k ✅\n• 15 builds = $9k\n• 35 SM clients = $12.25k MRR\n• Maintenance = $3k\n\nAnnika quits at $10k/month × 3 months straight.`)
      return NextResponse.json({ ok: true })
    }

    // Conversation with memory
    if (!sessions.has(chatId)) sessions.set(chatId, [])
    const history = sessions.get(chatId)!

    history.push({ role: 'user', content: userText })

    const { text: reply } = await generateText({
      model: anthropic('claude-sonnet-4.6'),
      system: SYSTEM_PROMPT,
      messages: history.slice(-30),
    })

    history.push({ role: 'assistant', content: reply })
    if (history.length > 60) sessions.set(chatId, history.slice(-40))

    await sendTelegram(chatId, reply)
    return NextResponse.json({ ok: true })

  } catch (err) {
    console.error('[JARVIS]', err)
    return NextResponse.json({ ok: true })
  }
}
