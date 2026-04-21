import { NextRequest, NextResponse } from 'next/server'
import { generateText } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

const SYSTEM_PROMPT = `You are JARVIS — Dee's personal AI co-founder and executive intelligence system, modelled after JARVIS from Iron Man.

## Who Dee is
Dee is an entrepreneur building a portfolio of businesses while working full-time in cybersecurity sales in Australia. His partner is Annika. Goal: AUD $20k+/month within 12 months so Annika can quit her job and they achieve financial freedom. Currently making $0 — starting from scratch. Android only — no Apple devices.

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

async function getTelegramFileUrl(fileId: string): Promise<string> {
  const res = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/getFile?file_id=${fileId}`)
  const data = await res.json()
  return `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${data.result.file_path}`
}

async function fetchFileAsBase64(url: string): Promise<{ base64: string; mimeType: string }> {
  const res = await fetch(url)
  const buffer = await res.arrayBuffer()
  const base64 = Buffer.from(buffer).toString('base64')
  const mimeType = res.headers.get('content-type') ?? 'application/octet-stream'
  return { base64, mimeType }
}

async function buildSystemPrompt(): Promise<string> {
  const context = await redis.get<string>('jarvis:context')
  if (!context) return SYSTEM_PROMPT
  return `${SYSTEM_PROMPT}\n\n## Live Updates (from desktop session)\n${context}`
}

export async function POST(req: NextRequest) {
  let chatId: number | null = null
  try {
    const body = await req.json()
    const message = body.message ?? body.edited_message

    // Drop anything that's not a message we can handle
    if (!message) return NextResponse.json({ ok: true })

    chatId = message.chat.id as number

    // Security — only respond to Dee
    const allowedId = process.env.TELEGRAM_ALLOWED_CHAT_ID
    if (allowedId && chatId.toString() !== allowedId) {
      return NextResponse.json({ ok: true })
    }

    const userText: string = message.text ?? message.caption ?? ''
    const hasDocument = !!message.document
    const hasPhoto = !!message.photo

    // Must have at least text, a document, or a photo
    if (!userText && !hasDocument && !hasPhoto) return NextResponse.json({ ok: true })

    // Built-in commands (text only)
    if (userText === '/start') {
      await sendTelegram(chatId, `*JARVIS online.*\n\nAll systems ready. What do you need, Dee?`)
      return NextResponse.json({ ok: true })
    }

    if (userText === '/clear') {
      await redis.del(`jarvis:${chatId}`)
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

    // /brief — summarise conversation and save for desktop pickup
    if (userText === '/brief') {
      const history = (await redis.get<{ role: 'user' | 'assistant'; content: string }[]>(`jarvis:${chatId}`)) ?? []
      if (history.length === 0) {
        await sendTelegram(chatId, `Nothing to brief — conversation is empty.`)
        return NextResponse.json({ ok: true })
      }
      const transcript = history.slice(-20)
        .map(m => `${m.role === 'user' ? 'Dee' : 'JARVIS'}: ${m.content}`)
        .join('\n\n')

      const { text: summary } = await generateText({
        model: anthropic('claude-sonnet-4-5'),
        prompt: `Extract the key decisions, new information, and important context from this conversation. Format as tight bullet points. Focus only on things that matter for business execution — decisions made, new information shared, tasks agreed, context that wasn't previously known. Skip small talk. Be concise and factual.\n\nConversation:\n${transcript}`,
      })
      await redis.set('jarvis:briefing', { summary, timestamp: new Date().toISOString() })
      await sendTelegram(chatId, `*Briefing saved.* Desktop Jarvis will be caught up when you return.\n\n${summary}`)
      return NextResponse.json({ ok: true })
    }

    // /sync — show current shared context
    if (userText === '/sync') {
      const context = await redis.get<string>('jarvis:context')
      const briefing = await redis.get<{ summary: string; timestamp: string }>('jarvis:briefing')

      let msg = `*Shared brain status:*\n\n`
      msg += context
        ? `*Desktop context:*\n${context}\n\n`
        : `*Desktop context:* None pushed yet.\n\n`
      msg += briefing
        ? `*Last briefing:* ${new Date(briefing.timestamp).toLocaleString('en-AU')}\n${briefing.summary}`
        : `*Last briefing:* None saved yet.`

      await sendTelegram(chatId, msg)
      return NextResponse.json({ ok: true })
    }

    // Conversation with persistent memory + live context
    const key = `jarvis:${chatId}`
    const [history, systemPrompt] = await Promise.all([
      redis.get<{ role: 'user' | 'assistant'; content: string }[]>(key).then(h => h ?? []),
      buildSystemPrompt(),
    ])

    // Build the user message — text or multimodal (file/photo)
    type ContentPart =
      | { type: 'text'; text: string }
      | { type: 'file'; data: string; mediaType: string }
      | { type: 'image'; image: string; mediaType: string }

    let userContent: string | ContentPart[]

    if (hasDocument || hasPhoto) {
      const parts: ContentPart[] = []

      if (hasDocument) {
        // Reject files over 15MB — large PDFs exceed Claude's 200k token limit
        const fileSize: number = message.document.file_size ?? 0
        if (fileSize > 15 * 1024 * 1024) {
          await sendTelegram(chatId, `That PDF is too large for me to read in one go (${Math.round(fileSize / 1024 / 1024)}MB). Send me the specific pages or paste the key sections as text.`)
          return NextResponse.json({ ok: true })
        }
        const fileUrl = await getTelegramFileUrl(message.document.file_id)
        const { base64 } = await fetchFileAsBase64(fileUrl)
        const fileName = message.document.file_name ?? 'document'
        // Telegram sometimes sets mime_type to octet-stream — infer from extension instead
        const rawMime: string = message.document.mime_type ?? ''
        const ext = (fileName.split('.').pop() ?? '').toLowerCase()
        const EXT_MAP: Record<string, string> = {
          pdf: 'application/pdf',
          png: 'image/png',
          jpg: 'image/jpeg',
          jpeg: 'image/jpeg',
          gif: 'image/gif',
          webp: 'image/webp',
          txt: 'text/plain',
          csv: 'text/csv',
          docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        }
        const mimeType: string = (rawMime && rawMime !== 'application/octet-stream')
          ? rawMime
          : (EXT_MAP[ext] ?? 'application/pdf')
        parts.push({ type: 'text', text: userText ? userText : `Analyse this file: ${fileName}` })
        parts.push({ type: 'file', data: base64, mediaType: mimeType })
      } else if (hasPhoto) {
        // Telegram sends multiple sizes — take the largest
        const photo = message.photo[message.photo.length - 1]
        const fileUrl = await getTelegramFileUrl(photo.file_id)
        const { base64, mimeType } = await fetchFileAsBase64(fileUrl)
        parts.push({ type: 'text', text: userText ? userText : 'What do you see in this image?' })
        parts.push({ type: 'image', image: base64, mediaType: mimeType })
      }

      userContent = parts
    } else {
      userContent = userText
    }

    const isFileSend = hasDocument || hasPhoto

    // Files eat most of the context window — skip history to avoid 200k token limit
    const messagesForApi = isFileSend
      ? [{ role: 'user' as const, content: userContent }]
      : [
          ...history.slice(-29).map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })),
          { role: 'user' as const, content: userContent },
        ]

    // Never store file content in history — store a placeholder instead
    const historyUserContent = isFileSend
      ? `[File sent: ${hasDocument ? (message.document.file_name ?? 'document') : 'photo'}]${userText ? ` — "${userText}"` : ''}`
      : userText
    history.push({ role: 'user', content: historyUserContent })

    const { text: reply } = await generateText({
      model: anthropic('claude-sonnet-4-5'),
      system: systemPrompt,
      messages: messagesForApi,
    })

    history.push({ role: 'assistant', content: reply })
    await redis.set(key, history.length > 60 ? history.slice(-40) : history)

    await sendTelegram(chatId, reply)
    return NextResponse.json({ ok: true })

  } catch (err: unknown) {
    console.error('[JARVIS]', err)
    const msg = err instanceof Error ? err.message : ''
    if (msg.includes('prompt is too long') && chatId) {
      await sendTelegram(chatId, `That file is too large for me to process. Send me the specific pages or paste the key sections as text.`)
    }
    return NextResponse.json({ ok: true })
  }
}
