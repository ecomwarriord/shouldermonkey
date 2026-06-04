'use client'

import * as Accordion from '@radix-ui/react-accordion'

const FAQS = [
  {
    id: 'p1',
    q: 'Is this legitimate? What qualifications do the presenters have?',
    a: 'Dee has built 6 live AI-powered products in the last 12 months — all still running, all publicly accessible. Abhinav has taught 1,000+ students through RackTheBrain, his online learning platform. This is a structured 12-week programme, not a one-off webinar.',
    audience: 'parent',
  },
  {
    id: 'p2',
    q: 'What is the refund policy?',
    a: '14-day satisfaction guarantee. If your child attends the first two sessions and it\'s not working for them, we\'ll refund in full — no questions, no chasing. We only want committed students.',
    audience: 'parent',
  },
  {
    id: 'p3',
    q: 'My child says they\'ll make $1,000 in 12 weeks. Is that realistic?',
    a: 'Some will. Some won\'t — it depends on effort and what they build. What we guarantee is that by Week 12 they\'ll have a working AI product and a concrete launch strategy. The $1,000 is a target, not a promise.',
    audience: 'parent',
  },
  {
    id: 'p4',
    q: 'How does $2,999 compare to other options?',
    a: 'University AI units cost $3,500+ per subject. Coding bootcamps average $15,000+. Private AI tutors in Sydney charge $80–$150/hr. This is 12 weeks of live, structured instruction with real project delivery — at a fraction of the cost.',
    audience: 'parent',
  },
  {
    id: 'p5',
    q: 'What if my child loses interest partway through?',
    a: '14-day refund covers the first two weeks. After that, the curriculum is built to keep momentum high — each week builds directly on real work from the previous one. Students who complete Week 6 almost always finish.',
    audience: 'parent',
  },
  {
    id: 'p6',
    q: 'Is the webinar ticket fee refundable?',
    a: 'The webinar ticket ($149) is non-refundable, but it\'s fully credited toward the course if you enrol within 48 hours of attending. Effectively, attending the webinar costs you nothing if you join the course.',
    audience: 'parent',
  },
  {
    id: 't1',
    q: 'Do I need any coding experience?',
    a: 'None. If you can use YouTube, Instagram, or a smartphone, you have everything you need. We teach you to build with AI tools — not to write code.',
    audience: 'teen',
  },
  {
    id: 't2',
    q: 'Can I do this while I\'m still in school?',
    a: 'Yes — it\'s designed for school students. Sessions are recorded so you can catch up. Most students put in 4–6 hours per week including the live session.',
    audience: 'teen',
  },
  {
    id: 't3',
    q: 'What kind of products will I build?',
    a: 'Depends what interests you — an AI content tool, a small SaaS product, an automation business, or a digital product. By Week 6 you\'ll have chosen your direction and by Week 12 it\'ll be live.',
    audience: 'teen',
  },
  {
    id: 't4',
    q: 'Will I meet other students my age?',
    a: 'Yes. The course has a private community (Skool or Discord) with all students in the same cohort. Weekly live sessions mean you\'ll see the same people building alongside you for 12 weeks.',
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
      <p style={{
        fontSize: '0.72rem',
        fontWeight: 800,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: accentColor,
        marginBottom: 16,
      }}>
        {label}
      </p>
      <Accordion.Root type="multiple" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {faqs.map((faq) => (
          <Accordion.Item
            key={faq.id}
            value={faq.id}
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 12,
              overflow: 'hidden',
            }}
          >
            <Accordion.Header style={{ margin: 0 }}>
              <Accordion.Trigger
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '18px 20px',
                  textAlign: 'left',
                  fontFamily: 'inherit',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  lineHeight: 1.4,
                  color: '#ffffff',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  gap: 16,
                }}
              >
                <span>{faq.q}</span>
                <span style={{ color: accentColor }}><ChevronIcon /></span>
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content
              style={{
                padding: '0 20px 18px',
                fontSize: '0.9rem',
                lineHeight: 1.7,
                color: 'rgba(255,255,255,0.55)',
              }}
            >
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
        {/* Heading */}
        <div style={{ marginBottom: 48 }}>
          <p style={{
            fontSize: '0.7rem',
            fontWeight: 700,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: '#7B3FE4',
            marginBottom: 12,
          }}>
            FAQ
          </p>
          <h2 style={{
            fontFamily: 'var(--font-display, var(--font-syne), sans-serif)',
            fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            lineHeight: 1.15,
            color: '#ffffff',
            margin: 0,
          }}>
            Questions answered.
          </h2>
        </div>

        <FAQGroup
          label="For Parents"
          faqs={FAQS.filter((f) => f.audience === 'parent')}
          accentColor="#FF3366"
        />
        <FAQGroup
          label="For Students"
          faqs={FAQS.filter((f) => f.audience === 'teen')}
          accentColor="#7B3FE4"
        />
      </div>
    </section>
  )
}
