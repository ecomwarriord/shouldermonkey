'use client'

import * as Accordion from '@radix-ui/react-accordion'
import { motion } from 'framer-motion'
import { ScrollReveal } from '../ui/ScrollReveal'

const FAQS = [
  // Parent questions first
  {
    id: 'p1',
    q: 'Is this legitimate? What qualifications do the presenters have?',
    a: 'Dee has built 6 live AI-powered products in the last 12 months — all still running. Abhinav has taught 1,000+ students through RackTheBrain. This is a structured 12-week programme, not a one-off event.',
    audience: 'parent',
  },
  {
    id: 'p2',
    q: 'What is the refund policy?',
    a: '14-day satisfaction guarantee. If your child attends the first two sessions and decides it\'s not for them, we\'ll refund in full, no questions. We only want committed students.',
    audience: 'parent',
  },
  {
    id: 'p3',
    q: 'My child says they\'ll make $1,000 in 12 weeks. Is that realistic?',
    a: 'Some will. Some won\'t. It depends on effort, consistency, and what they build. What we guarantee is that by Week 12, they\'ll have a working AI product and a concrete strategy. The $1,000 is a target, not a promise — and it\'s one of many possible outcomes, not a baseline.',
    audience: 'parent',
  },
  {
    id: 'p4',
    q: 'How does $2,999 compare to other AI education options?',
    a: 'University AI units cost $3,500+ per subject. Coding bootcamps average $15,000+. Private AI tutors in Sydney charge $80-$150/hr. This is 12 weeks of structured, live instruction with real project delivery — at a fraction of the alternatives.',
    audience: 'parent',
  },
  {
    id: 'p5',
    q: 'What if my child loses interest partway through?',
    a: '14-day refund covers the first two weeks. After that, the curriculum is structured to keep engagement high — each week builds on real work from the previous one. Students who complete Week 6 consistently finish.',
    audience: 'parent',
  },
  {
    id: 'p6',
    q: 'Is the webinar ticket fee refundable?',
    a: 'The $149 webinar ticket is non-refundable, but it is fully credited toward the course if you enrol within 48 hours of attending. Effectively, attending the webinar and then joining costs the same as joining directly.',
    audience: 'parent',
  },
  // Teen questions
  {
    id: 't1',
    q: 'Do I need any coding experience?',
    a: 'None. If you can use YouTube, Instagram, or a smartphone, you have all the technical ability needed. We teach you to build with AI tools — not to write code.',
    audience: 'teen',
  },
  {
    id: 't2',
    q: 'Can I do this while I\'m still in school?',
    a: 'Yes. The course is designed for school students. Sessions are recorded so you can catch up. Most students put in 4-6 hours per week including the live session.',
    audience: 'teen',
  },
  {
    id: 't3',
    q: 'What kind of products will I build?',
    a: 'Depends what interests you — it could be an AI content tool, a small SaaS product, an automation business, or a digital product. By Week 6 you\'ll have chosen your direction and by Week 12 it\'ll be live.',
    audience: 'teen',
  },
  {
    id: 't4',
    q: 'Will I meet other students my age?',
    a: 'Yes. The course includes a private community (Skool or Discord) of other students in the same cohort. Weekly live sessions mean you\'ll see the same faces building alongside you for 12 weeks.',
    audience: 'teen',
  },
]

function ChevronIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function FAQSection() {
  return (
    <section className="py-24 px-6" style={{ background: 'var(--ai-bg, #030108)' }}>
      <div className="max-w-3xl mx-auto">
        <ScrollReveal>
          <p className="label-pill mb-4" style={{ width: 'fit-content' }}>FAQ</p>
          <h2
            className="font-display font-black mb-10"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--ai-text)', letterSpacing: '-0.02em' }}
          >
            Questions answered.
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--ai-muted)' }}>For Parents</p>
            <Accordion.Root type="multiple" className="flex flex-col gap-2">
              {FAQS.filter((f) => f.audience === 'parent').map((faq) => (
                <Accordion.Item
                  key={faq.id}
                  value={faq.id}
                  className="rounded-xl overflow-hidden"
                  style={{ background: 'rgba(132,75,254,0.04)', border: '1px solid rgba(132,75,254,0.1)' }}
                >
                  <Accordion.Header>
                    <Accordion.Trigger
                      className="w-full flex items-center justify-between px-5 py-4 text-left font-semibold text-sm gap-4 group"
                      style={{ color: 'var(--ai-text)', background: 'transparent', border: 'none', cursor: 'pointer' }}
                    >
                      {faq.q}
                      <motion.span
                        className="shrink-0 text-current"
                        style={{ color: 'var(--ai-accent)' }}
                        initial={false}
                        // Radix passes data-state="open" when open
                      >
                        <ChevronIcon />
                      </motion.span>
                    </Accordion.Trigger>
                  </Accordion.Header>
                  <Accordion.Content className="px-5 pb-4 text-sm leading-relaxed" style={{ color: 'var(--ai-muted)' }}>
                    {faq.a}
                  </Accordion.Content>
                </Accordion.Item>
              ))}
            </Accordion.Root>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--ai-muted)' }}>For Students</p>
            <Accordion.Root type="multiple" className="flex flex-col gap-2">
              {FAQS.filter((f) => f.audience === 'teen').map((faq) => (
                <Accordion.Item
                  key={faq.id}
                  value={faq.id}
                  className="rounded-xl overflow-hidden"
                  style={{ background: 'rgba(132,75,254,0.04)', border: '1px solid rgba(132,75,254,0.1)' }}
                >
                  <Accordion.Header>
                    <Accordion.Trigger
                      className="w-full flex items-center justify-between px-5 py-4 text-left font-semibold text-sm gap-4"
                      style={{ color: 'var(--ai-text)', background: 'transparent', border: 'none', cursor: 'pointer' }}
                    >
                      {faq.q}
                      <span className="shrink-0" style={{ color: 'var(--ai-accent)' }}>
                        <ChevronIcon />
                      </span>
                    </Accordion.Trigger>
                  </Accordion.Header>
                  <Accordion.Content className="px-5 pb-4 text-sm leading-relaxed" style={{ color: 'var(--ai-muted)' }}>
                    {faq.a}
                  </Accordion.Content>
                </Accordion.Item>
              ))}
            </Accordion.Root>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
