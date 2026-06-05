import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Starter Guide — AI Unlocked',
  description: '9 AI tools every young Australian entrepreneur should start with today. Free tiers, quick wins, no coding required.',
  robots: { index: false, follow: false }, // not indexed — waitlist members only
}

const TOOLS = [
  {
    name: 'ChatGPT',
    what: 'The starting point for almost everything AI. Write, research, brainstorm, plan.',
    free: 'Free tier available — no card needed to start',
    quickWin: 'Describe your side hustle idea and ask it to find the three biggest problems with it. See what it finds.',
    url: 'https://chat.openai.com',
    color: '#10B981',
  },
  {
    name: 'Claude AI',
    what: 'Better reasoning, longer documents, and it explains things more clearly than ChatGPT. Our go-to for serious work.',
    free: 'Free tier available',
    quickWin: 'Paste a business idea and ask: "What are the five ways this could fail?" Use the answers to make it stronger.',
    url: 'https://claude.ai',
    color: '#FF3366',
  },
  {
    name: 'Claude Code',
    what: 'Build things by describing them. Your instructor Dee uses this to ship every product. No coding experience needed.',
    free: 'Free tier available',
    quickWin: 'Open Claude Code and say: "Build me a simple landing page for a pet-sitting service." Watch what happens.',
    url: 'https://claude.ai/code',
    color: '#FF3366',
  },
  {
    name: 'Gemini',
    what: "Google's AI. Reads images, PDFs, and YouTube videos. Deep integration with Google Docs and Drive.",
    free: 'Free — your Google account works',
    quickWin: 'Paste a YouTube video URL and ask Gemini to summarise the key points in under 10 bullet points.',
    url: 'https://gemini.google.com',
    color: '#4285F4',
  },
  {
    name: 'Perplexity',
    what: 'AI search that cites its sources. Every answer comes with links you can actually verify.',
    free: 'Free tier available',
    quickWin: 'Ask: "What are the top 5 problems teenagers in Australia are trying to solve in 2026?" Use it as market research.',
    url: 'https://perplexity.ai',
    color: '#7B3FE4',
  },
  {
    name: 'ElevenLabs',
    what: 'Clone your voice. Create characters. Turn any text into audio that sounds human.',
    free: '10,000 characters per month free',
    quickWin: 'Record yourself for 30 seconds, clone your voice, then generate a 60-second podcast intro in your own voice — without recording it.',
    url: 'https://elevenlabs.io',
    color: '#F59E0B',
  },
  {
    name: 'Higgsfield',
    what: 'Type a prompt and get a cinematic video. Product ads, brand stories, social content — in minutes.',
    free: 'Free credits on signup',
    quickWin: 'Type: "A 15-year-old launching their first business, Sydney Harbour in the background, confident, cinematic." See what it creates.',
    url: 'https://higgsfield.ai',
    color: '#EC4899',
  },
  {
    name: 'ShoulderMonkey',
    what: 'An entire business platform built with AI — CRM, automation, bookings. This is what 12 months of building with AI looks like.',
    free: 'Live at shouldermonkey.co',
    quickWin: 'Go to shouldermonkey.co and explore what your instructor built. This is the proof that it works.',
    url: 'https://shouldermonkey.co',
    color: '#7B3FE4',
  },
  {
    name: 'Lovable',
    what: 'Describe an app, watch it build. No code. Ship in hours, not weeks.',
    free: 'Free tier available',
    quickWin: 'Type: "Build me a simple app where people can enter their suburb and see the top 3 AI jobs available." Watch Lovable build it.',
    url: 'https://lovable.dev',
    color: '#FF3366',
  },
]

export default function StarterGuidePage() {
  return (
    <div style={{ background: '#000', minHeight: '100vh', color: '#f0edff', fontFamily: 'var(--font-inter, system-ui, sans-serif)' }}>
      {/* Header */}
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '60px 24px 40px' }}>
        <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#7B3FE4', marginBottom: 12 }}>
          AI Unlocked · Starter Guide
        </p>
        <h1 style={{ fontFamily: 'var(--font-syne, system-ui)', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, letterSpacing: '-0.03em', color: '#ffffff', margin: '0 0 16px', lineHeight: 1.1 }}>
          9 AI tools to start with today.
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1rem', lineHeight: 1.6, maxWidth: 580, margin: 0 }}>
          Every one has a free tier. Every one is demonstrable on day one. Every one gets taught in the webinar.
          Start with any of them — the goal is to start.
        </p>
      </div>

      {/* Tools */}
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 24px 80px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {TOOLS.map((tool, i) => (
          <div key={tool.name} style={{
            background: 'rgba(255,255,255,0.03)',
            border: `1px solid ${tool.color}33`,
            borderLeft: `4px solid ${tool.color}`,
            borderRadius: 12,
            padding: '24px 28px',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <span style={{ fontFamily: 'var(--font-syne, system-ui)', fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>
                    {i + 1}. {tool.name}
                  </span>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: tool.color, background: `${tool.color}18`, padding: '2px 8px', borderRadius: 4 }}>
                    {tool.free}
                  </span>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.9rem', lineHeight: 1.6, margin: '0 0 12px' }}>
                  {tool.what}
                </p>
                <div style={{ background: `${tool.color}0d`, border: `1px solid ${tool.color}22`, borderRadius: 8, padding: '10px 14px' }}>
                  <p style={{ fontSize: '0.78rem', fontWeight: 700, color: tool.color, margin: '0 0 4px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    Quick win
                  </p>
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem', lineHeight: 1.55, margin: 0 }}>
                    {tool.quickWin}
                  </p>
                </div>
              </div>
              <a href={tool.url} target="_blank" rel="noopener noreferrer"
                style={{ flexShrink: 0, fontSize: '0.82rem', fontWeight: 600, color: tool.color, textDecoration: 'none', whiteSpace: 'nowrap', marginTop: 4 }}>
                Try it →
              </a>
            </div>
          </div>
        ))}

        {/* Footer note */}
        <div style={{ marginTop: 32, padding: '24px', background: 'rgba(123,63,228,0.06)', border: '1px solid rgba(123,63,228,0.2)', borderRadius: 12, textAlign: 'center' }}>
          <p style={{ color: '#7B3FE4', fontWeight: 700, fontSize: '0.9rem', marginBottom: 8 }}>
            All 9 of these tools are taught in the webinar.
          </p>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', lineHeight: 1.6, margin: '0 0 16px' }}>
            August 2026, AEST — one live session where you watch them used in real time, not explained in slides.
          </p>
          <a href="/ai-unlocked#waitlist-form"
            style={{ display: 'inline-block', background: 'linear-gradient(135deg, #7B3FE4 0%, #FF3366 100%)', color: '#fff', fontWeight: 700, fontSize: '0.9rem', padding: '10px 24px', borderRadius: 100, textDecoration: 'none' }}>
            Back to Waitlist →
          </a>
        </div>
      </div>
    </div>
  )
}
