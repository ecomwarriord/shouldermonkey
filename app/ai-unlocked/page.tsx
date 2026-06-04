import type { Metadata } from 'next'
import { AIUnlockedPage } from '@/components/ai-unlocked/AIUnlockedPage'

export const metadata: Metadata = {
  title: 'AI Unlocked — Learn AI, Build Real Things | Young Entrepreneurs 13+ | Australia',
  description:
    'Join the waitlist for Australia\'s first AI education webinar for young entrepreneurs aged 13+. 90 minutes live. Led by Dee (ShoulderMonkey) and Abhinav Verma (RackTheBrain). Sydney, Australia.',
  openGraph: {
    title: 'AI Unlocked — 90 minutes to change what\'s possible',
    description:
      'Learn it. Build it. Own it. Australia\'s first AI education webinar for 13+ young entrepreneurs. RackTheBrain × ShoulderMonkey.',
    url: 'https://www.shouldermonkey.co/ai-unlocked',
    type: 'website',
    images: [
      {
        url: '/og-ai-unlocked.jpg',
        width: 1200,
        height: 630,
        alt: 'AI Unlocked — AI education for young Australians',
      },
    ],
    locale: 'en_AU',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Unlocked — 90 minutes to change what\'s possible',
    description: 'Australia\'s first AI education webinar for 13+ young entrepreneurs. Learn, build, and own it.',
    images: ['/og-ai-unlocked.jpg'],
  },
  alternates: {
    canonical: 'https://www.shouldermonkey.co/ai-unlocked',
  },
}

// FAQ structured data for rich results
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is this legitimate? What qualifications do the presenters have?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Dee has built 6 live AI-powered products in the last 12 months. Abhinav has taught 1,000+ students through RackTheBrain. This is a structured 12-week programme, not a one-off event.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I need any coding experience?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'None. If you can use YouTube, Instagram, or a smartphone, you have all the technical ability needed. We teach you to build with AI tools — not to write code.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the refund policy?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '14-day satisfaction guarantee. If your child attends the first two sessions and decides it\'s not for them, we\'ll refund in full, no questions.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can students do this while still in school?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Sessions are recorded so you can catch up. Most students put in 4-6 hours per week including the live session.',
      },
    },
  ],
}

const eventSchema = {
  '@context': 'https://schema.org',
  '@type': 'Event',
  name: 'AI Unlocked — Live Webinar for Young Entrepreneurs',
  description: '90-minute paid webinar covering AI tools, automation, content creation, and money-making strategies for young Australians aged 13+.',
  eventStatus: 'https://schema.org/EventScheduled',
  eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
  location: {
    '@type': 'VirtualLocation',
    url: 'https://www.shouldermonkey.co/ai-unlocked',
  },
  organizer: [
    { '@type': 'Organization', name: 'RackTheBrain', url: 'https://rackthebrain.com.au' },
    { '@type': 'Organization', name: 'ShoulderMonkey', url: 'https://www.shouldermonkey.co' },
  ],
  offers: {
    '@type': 'Offer',
    price: '149',
    priceCurrency: 'AUD',
    availability: 'https://schema.org/InStock',
    url: 'https://www.shouldermonkey.co/ai-unlocked#waitlist',
  },
}

export default function AIUnlockedRoute() {
  return (
    <>
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }}
      />

      {/* SSR hero h1 — this is the LCP element, rendered server-side */}
      {/* It will be replaced by SplitHeadline after preloader, but exists in SSR HTML */}
      <div
        style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: -1, opacity: 0, pointerEvents: 'none' }}
        aria-hidden="true"
      >
        <h1
          style={{
            fontFamily: 'var(--font-display, sans-serif)',
            fontWeight: 900,
            fontSize: 'clamp(4rem, 10vw, 9rem)',
            letterSpacing: '-0.04em',
            color: '#ffffff',
          }}
        >
          AI UNLOCKED
        </h1>
      </div>

      <AIUnlockedPage />
    </>
  )
}
