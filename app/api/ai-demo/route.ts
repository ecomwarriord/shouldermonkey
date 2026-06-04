import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown'
  const key = `ai-demo-rate:${ip}`

  // Rate limit: 3 requests per IP per session window (1hr)
  const count = await redis.incr(key)
  if (count === 1) await redis.expire(key, 3600)
  if (count > 3) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 })
  }

  let body: { prompt?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid_request' }, { status: 400 })
  }

  const userPrompt = (body.prompt ?? '').slice(0, 300).trim()
  if (!userPrompt) {
    return NextResponse.json({ error: 'missing_prompt' }, { status: 400 })
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 10_000)

  try {
    const message = await client.messages.create(
      {
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 300,
        messages: [
          {
            role: 'user',
            content: `You are a helpful AI that turns ideas into startup concepts. Given this idea: "${userPrompt}"

Return a JSON object (no markdown, raw JSON only) with these fields:
- name: a catchy product name (2-4 words)
- tagline: one sentence that explains what it does
- stack: an array of 3 AI tools they would use to build it
- revenue: one sentence on how it could make money

Keep everything simple enough for a 15-year-old to understand.`,
          },
        ],
      },
      { signal: controller.signal }
    )

    clearTimeout(timeout)
    const content = message.content[0]
    if (content.type !== 'text') {
      return NextResponse.json({ error: 'failed' }, { status: 500 })
    }

    // Parse and return plain text (no raw JSON to client to avoid XSS)
    try {
      const parsed = JSON.parse(content.text)
      const result = `${parsed.name}\n"${parsed.tagline}"\n\nBuilt with: ${parsed.stack?.join(', ') ?? 'AI tools'}\n\nHow it earns: ${parsed.revenue}`
      return NextResponse.json({ result })
    } catch {
      // If parsing fails, return the raw text stripped of JSON syntax
      const cleaned = content.text.replace(/[{}[\]"]/g, '').replace(/:\s*/g, ': ').trim()
      return NextResponse.json({ result: cleaned })
    }
  } catch (err: unknown) {
    clearTimeout(timeout)
    if (err instanceof Error && err.name === 'AbortError') {
      return NextResponse.json({ error: 'timeout' }, { status: 408 })
    }
    return NextResponse.json({ error: 'failed' }, { status: 500 })
  }
}
