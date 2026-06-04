'use client'

import * as Accordion from '@radix-ui/react-accordion'

// FAQ is for the WEBINAR only. The 12-week course is not on this page.
const FAQS = [
  {
    id: 'p1',
    q: 'What exactly happens at this webinar?',
    a: '90 minutes live, online. You\'ll see AI tools used in real time. Not slides. Not theory. Your child will watch a product get built from scratch, learn the tool stack, see an automation created live, and leave with resources they can use the same night.',
    audience: 'parent',
  },
  {
    id: 'p2',
    q: 'How much are tickets, and when do they go on sale?',
    a: 'Tickets start from $149 AUD early bird, $199 standard. Waitlist members get first access and the early bird price. That\'s why joining free now matters. We\'ll email you the moment tickets drop.',
    audience: 'parent',
  },
  {
    id: 'p3',
    q: 'Is there a refund if my child can\'t attend?',
    a: 'Webinar tickets are non-refundable once purchased. All ticket holders receive the full replay, so missing the live session doesn\'t mean missing the content. If the event is cancelled by us, a full refund will be issued. This is required under Australian Consumer Law regardless of our policy.',
    audience: 'parent',
  },
  {
    id: 'p4',
    q: 'Who is running this, and are they qualified?',
    a: 'Dee is a Sydney-based founder who has shipped 6 live AI-powered products in the last 12 months, including ShoulderMonkey (a SaaS platform with 200+ active business users) and Qaneri (an enterprise all-in-one platform, live at qaneri.com). These are not experiments. They are real products, built with AI, used by real businesses. He built this event using the same tools he teaches. Abhinav Verma is the founder of RackTheBrain, an online learning platform with 1,000+ students, and a Sydney-based educator and podcaster with a track record of helping young people perform at a higher level.',
    audience: 'parent',
  },
  {
    id: 'p5',
    q: 'Is the content age-appropriate for a 13-year-old?',
    a: 'Yes. The webinar is designed for 13 and up. No coding required, no technical background needed. If your child can use a smartphone, they have everything they need.',
    audience: 'parent',
  },
  {
    id: 't1',
    q: 'Do I need to know how to code?',
    a: 'No. We teach you to build with AI tools, not write code. If you can use YouTube, Instagram, or a phone, you\'re ready.',
    audience: 'teen',
  },
  {
    id: 't2',
    q: 'What will I actually walk away with?',
    a: 'A live AI build you watched happen step by step, an automation template you can use immediately, a week of content you could post tonight, and the full tool stack we use. Plus the replay.',
    audience: 'teen',
  },
  {
    id: 't3',
    q: 'Is it actually live or pre-recorded?',
    a: 'Fully live. You can ask questions, watch things get built in real time, and see what happens when something goes wrong the first time. The replay is available to all ticket holders after.',
    audience: 'teen',
  },
  {
    id: 't4',
    q: 'What happens at the end of the webinar?',
    a: 'Something you won\'t see coming. We\'ll leave it at that.',
    audience: 'teen',
  },
]

function ChevronIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M4.5 7l4.5 4 4.5-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

interface FAQGroupProps {
  label: string
  faqs: typeof FAQS
  accentColor: string
}

function FAQGroup({ label, faqs, accentColor }: FAQGroupProps) {
  return (
    <div style={{ marginBottom: 40 }}>
      <p style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: accentColor, marginBottom: 16 }}>
        {label}
      </p>
      <Accordion.Root type="multiple" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {faqs.map((faq) => (
          <Accordion.Item
            key={faq.id}
            value={faq.id}
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, overflow: 'hidden' }}
          >
            <Accordion.Header style={{ margin: 0 }}>
              <Accordion.Trigger
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '18px 20px', textAlign: 'left', fontFamily: 'inherit', fontWeight: 600,
                  fontSize: '0.95rem', lineHeight: 1.4, color: '#ffffff', background: 'transparent',
                  border: 'none', cursor: 'pointer', gap: 16,
                }}
              >
                <span>{faq.q}</span>
                <span style={{ color: accentColor }}><ChevronIcon /></span>
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content style={{ padding: '0 20px 18px', fontSize: '0.9rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.55)' }}>
              {faq.a}
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </div>
  )
}

export function FAQSection() {
  return (
    <section style={{ background: 'transparent', padding: '60px 24px 60px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <div style={{ marginBottom: 48 }}>
          <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#7B3FE4', marginBottom: 12 }}>
            FAQ
          </p>
          <h2 style={{
            fontFamily: 'var(--font-display, var(--font-syne), sans-serif)',
            fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
            fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.15, color: '#ffffff', margin: 0,
          }}>
            Questions about the webinar.
          </h2>
        </div>
        <FAQGroup label="For Parents" faqs={FAQS.filter((f) => f.audience === 'parent')} accentColor="#FF3366" />
        <FAQGroup label="For Students" faqs={FAQS.filter((f) => f.audience === 'teen')} accentColor="#7B3FE4" />
      </div>
    </section>
  )
}
