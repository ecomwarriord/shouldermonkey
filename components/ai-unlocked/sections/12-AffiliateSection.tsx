'use client'

// Tools selected for 13+ Australian entrepreneurs:
// Free/accessible tiers, demonstrable in the course, high wow-factor
const TOOLS = [
  {
    name: 'ChatGPT',
    tag: 'The one everyone knows',
    desc: 'Brainstorm, write, research, code — the Swiss Army knife of AI. We go way deeper than the basics.',
    badge: 'Free tier',
    color: '#10B981',
  },
  {
    name: 'Claude',
    tag: 'Best for building',
    desc: 'Longer documents, better reasoning, and it can actually write code that works. Our go-to for serious work.',
    badge: 'Free tier',
    color: '#FF3366',
  },
  {
    name: 'Canva AI',
    tag: 'Design in minutes',
    desc: 'Logos, social posts, pitch decks, thumbnails — AI does the design, you do the direction.',
    badge: 'Free tier',
    color: '#7B3FE4',
  },
  {
    name: 'CapCut AI',
    tag: 'Video content machine',
    desc: 'Auto-captions, AI B-roll, voice enhancement. A week of content in under an hour.',
    badge: 'Free',
    color: '#FF3366',
  },
  {
    name: 'Make',
    tag: 'Automate anything',
    desc: 'Connect apps without writing code. Build automations that run while you sleep.',
    badge: 'Free tier',
    color: '#7B3FE4',
  },
  {
    name: 'ElevenLabs',
    tag: 'AI voice',
    desc: 'Clone your voice, create characters, narrate content. The demo alone will blow your mind.',
    badge: 'Free tier',
    color: '#10B981',
  },
]

export function AffiliateSection() {
  return (
    <section style={{ background: '#000', padding: '100px 24px 80px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        {/* Section header */}
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <p style={{
            display: 'inline-block',
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
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 900,
            letterSpacing: '-0.03em',
            lineHeight: 1.05,
            color: '#ffffff',
            margin: '0 0 16px',
          }}>
            Six tools.<br />
            <span style={{ color: '#FF3366' }}>You&apos;ll use all of them.</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '1rem', maxWidth: 500, margin: '0 auto' }}>
            All free tiers to start. All demonstrable on day one. All taught in the course.
          </p>
        </div>

        {/* Tool grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: 16,
        }}>
          {TOOLS.map((tool) => (
            <div
              key={tool.name}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: `1.5px solid ${tool.color}33`,
                borderRadius: 16,
                padding: '24px 24px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}
            >
              {/* Tag */}
              <p style={{
                fontSize: '0.68rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: tool.color,
              }}>
                {tool.tag}
              </p>

              {/* Name */}
              <p style={{
                fontFamily: 'var(--font-display, var(--font-syne), sans-serif)',
                fontSize: '1.35rem',
                fontWeight: 900,
                letterSpacing: '-0.02em',
                color: '#ffffff',
                lineHeight: 1.1,
              }}>
                {tool.name}
              </p>

              {/* Description */}
              <p style={{
                fontSize: '0.875rem',
                lineHeight: 1.6,
                color: 'rgba(255,255,255,0.55)',
                flexGrow: 1,
              }}>
                {tool.desc}
              </p>

              {/* Badge */}
              <p style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                color: tool.color,
                marginTop: 4,
              }}>
                ✓ {tool.badge}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
