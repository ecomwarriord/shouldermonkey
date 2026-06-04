'use client'

const TOOLS = [
  {
    name: 'ChatGPT',
    tag: 'The one everyone knows',
    desc: 'Brainstorm, write, research, plan. This is where most people start — we go way beyond the basics.',
    badge: 'Free tier',
    color: '#10B981',
    url: 'https://chat.openai.com',
  },
  {
    name: 'Claude AI',
    tag: 'Best for thinking and writing',
    desc: 'Longer documents, sharper reasoning, better code explanations. Our go-to for serious work.',
    badge: 'Free tier',
    color: '#FF3366',
    url: 'https://claude.ai',
  },
  {
    name: 'Claude Code',
    tag: 'Build with AI in your terminal',
    desc: 'The tool your instructor uses to build everything. Type what you want — it writes the code.',
    badge: 'Free tier',
    color: '#FF3366',
    url: 'https://claude.ai/code',
  },
  {
    name: 'Gemini',
    tag: 'Google\'s AI',
    desc: 'Research, summarise, analyse documents and images. Deep integration with Google Workspace.',
    badge: 'Free',
    color: '#4285F4',
    url: 'https://gemini.google.com',
  },
  {
    name: 'Perplexity',
    tag: 'AI search with sources',
    desc: 'Ask anything, get a cited answer. Replaces hours of Googling. Great for market research.',
    badge: 'Free tier',
    color: '#7B3FE4',
    url: 'https://perplexity.ai',
  },
  {
    name: 'ElevenLabs',
    tag: 'AI voice and audio',
    desc: 'Clone your voice. Create characters. Narrate content. The live demo alone will blow your mind.',
    badge: 'Free tier',
    color: '#F59E0B',
    url: 'https://elevenlabs.io',
  },
  {
    name: 'Higgsfield',
    tag: 'AI video generation',
    desc: 'Cinematic AI video from a single prompt. Product ads, social content, brand stories — in minutes.',
    badge: 'Free tier',
    color: '#EC4899',
    url: 'https://higgsfield.ai',
  },
  {
    name: 'ShoulderMonkey',
    tag: 'Built by your instructor',
    desc: 'An entire business platform built with AI. CRM, automation, bookings — this is what 12 weeks can build.',
    badge: 'Live product',
    color: '#7B3FE4',
    url: 'https://shouldermonkey.co',
  },
  {
    name: 'Lovable',
    tag: 'Build apps by chatting',
    desc: 'Describe what you want and it builds a working web app. No code required. Ship in hours, not weeks.',
    badge: 'Free tier',
    color: '#FF3366',
    url: 'https://lovable.dev',
  },
]

export function AffiliateSection() {
  return (
    <section style={{ background: 'transparent', padding: '80px 24px 60px' }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>

        {/* Section header */}
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <p style={{
            fontSize: '0.7rem',
            fontWeight: 700,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: '#7B3FE4',
            marginBottom: 16,
          }}>
            Tools we use
          </p>
          <h2 style={{
            fontFamily: 'var(--font-display, var(--font-syne), sans-serif)',
            fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            lineHeight: 1.15,
            color: '#ffffff',
            margin: '0 0 16px',
          }}>
            Nine tools.{' '}
            <span style={{ color: '#FF3366' }}>All taught in the course.</span>
          </h2>
          <p style={{
            color: 'rgba(255,255,255,0.45)',
            fontSize: '1rem',
            maxWidth: 520,
            margin: '0 auto',
            lineHeight: 1.6,
          }}>
            Every one has a free tier to get started. Every one is demonstrable on day one.
            ShoulderMonkey? That&apos;s what 12 weeks of AI building looks like.
          </p>
        </div>

        {/* Tool grid — 3 columns on desktop */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 14,
        }}>
          {TOOLS.map((tool) => (
            <a
              key={tool.name}
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: `1.5px solid ${tool.color}44`,
                borderRadius: 14,
                padding: '22px 22px 18px',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                textDecoration: 'none',
                transition: 'transform 0.15s ease, border-color 0.15s ease',
              }}
              onMouseEnter={e => {
                ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'
                ;(e.currentTarget as HTMLElement).style.borderColor = `${tool.color}88`
              }}
              onMouseLeave={e => {
                ;(e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
                ;(e.currentTarget as HTMLElement).style.borderColor = `${tool.color}44`
              }}
            >
              {/* Tag */}
              <p style={{
                fontSize: '0.67rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: tool.color,
                margin: 0,
              }}>
                {tool.tag}
              </p>

              {/* Name */}
              <p style={{
                fontFamily: 'var(--font-display, var(--font-syne), sans-serif)',
                fontSize: '1.25rem',
                fontWeight: 700,
                letterSpacing: '-0.01em',
                color: '#ffffff',
                lineHeight: 1.15,
                margin: 0,
              }}>
                {tool.name}
              </p>

              {/* Description */}
              <p style={{
                fontFamily: 'var(--font-body, var(--font-inter), system-ui, sans-serif)',
                fontSize: '0.875rem',
                lineHeight: 1.65,
                color: 'rgba(255,255,255,0.55)',
                flexGrow: 1,
                margin: 0,
              }}>
                {tool.desc}
              </p>

              {/* Badge */}
              <p style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                color: tool.color,
                margin: 0,
              }}>
                ✓ {tool.badge}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
