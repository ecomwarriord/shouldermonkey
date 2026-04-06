import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Inter } from 'next/font/google'
import './globals.css'

const syne = Plus_Jakarta_Sans({
  variable: '--font-syne',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
})

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://www.shouldermonkey.co'),
  title: {
    default: 'Shoulder Monkey — The All-In-One Business Platform for Service Businesses',
    template: '%s | Shoulder Monkey',
  },
  description:
    'Shoulder Monkey replaces 12+ disconnected tools with one platform built for service businesses. CRM, bookings, automation, reputation management, SMS, and more — operational from day one. Trusted by salons, gyms, clinics, brokers, and allied health practices across Australia, New Zealand, and worldwide.',
  keywords: [
    'business management software',
    'CRM for small business',
    'all-in-one business platform',
    'white label business platform',
    'salon software',
    'gym management software',
    'medical spa software',
    'mortgage broker CRM',
    'chiropractor practice management',
    'automated follow-up software',
    'lead management small business',
    'business automation software',
    'appointment booking software',
    'reputation management software',
    'SMS marketing platform',
    'business management software Australia',
    'business management software New Zealand',
    'CRM for small business Australia',
    'CRM for small business New Zealand',
    'business management platform Australia',
    'business management platform New Zealand',
    'salon software Australia',
    'gym management software Australia',
    'replace multiple business tools',
    'Shoulder Monkey',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_AU',
    url: 'https://www.shouldermonkey.co',
    siteName: 'Shoulder Monkey',
    title: 'Shoulder Monkey — Your Whole Business. One Platform. Finally.',
    description:
      'Stop losing leads to disconnected tools. Shoulder Monkey is the all-in-one platform built for service businesses — pre-configured and operational from day one. Available in Australia, New Zealand, and worldwide.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Shoulder Monkey — One Platform. Every Tool You Need.' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shoulder Monkey — Your Whole Business. One Platform. Finally.',
    description: 'Replace 12+ disconnected tools with one platform built for service businesses. Available in AU, NZ & worldwide. 14-day free trial.',
    images: ['/og-image.jpg'],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large' } },
  alternates: { canonical: 'https://www.shouldermonkey.co' },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      '@id': 'https://www.shouldermonkey.co/#app',
      name: 'Shoulder Monkey',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web, iOS, Android',
      description:
        'Shoulder Monkey is an all-in-one business management platform for service businesses worldwide. It consolidates CRM, pipeline management, automation, reputation management, bookings, email marketing, sales funnels, website building, social planning, 2-way SMS, and call tracking into a single platform — pre-configured and operational from day one. Headquartered in Australia, serving businesses in AU, NZ, and globally.',
      url: 'https://www.shouldermonkey.co',
      offers: [
        { '@type': 'Offer', name: 'Silver', price: '246', priceCurrency: 'AUD', billingIncrement: 'Month' },
        { '@type': 'Offer', name: 'Gold', price: '368', priceCurrency: 'AUD', billingIncrement: 'Month' },
        { '@type': 'Offer', name: 'Platinum', price: '478', priceCurrency: 'AUD', billingIncrement: 'Month' },
      ],
      featureList: [
        'CRM and Pipeline Management',
        'Booking and Appointment Scheduling',
        'Email Marketing',
        '2-Way SMS Marketing',
        'Sales Funnels',
        'Automation and Workflows',
        'Reputation Management',
        'Call Tracking',
        'Website Builder',
        'Social Media Planner',
        'Invoicing and Contracts',
        'Courses and Digital Products',
        'Tracking and Analytics',
      ],
      availableInCountry: ['AU', 'NZ', 'US', 'GB', 'CA', 'SG', 'ZA'],
      provider: {
        '@type': 'Organization',
        '@id': 'https://www.shouldermonkey.co/#org',
        name: 'Shoulder Monkey',
        url: 'https://www.shouldermonkey.co',
        areaServed: [
          { '@type': 'Country', name: 'Australia' },
          { '@type': 'Country', name: 'New Zealand' },
          { '@type': 'AdministrativeArea', name: 'Worldwide' },
        ],
        founders: [
          { '@type': 'Person', name: 'Dee' },
          { '@type': 'Person', name: 'Annika' },
        ],
        address: { '@type': 'PostalAddress', addressLocality: 'Sydney', addressRegion: 'NSW', addressCountry: 'AU' },
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is Shoulder Monkey?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Shoulder Monkey is an all-in-one business management platform built for service businesses in Australia, New Zealand, and worldwide. It replaces 12+ disconnected tools — including your CRM, booking system, email marketing, SMS, automation, and reputation management — with a single platform that is pre-configured and operational from day one.',
          },
        },
        {
          '@type': 'Question',
          name: 'Who is Shoulder Monkey designed for?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Shoulder Monkey is built for service businesses worldwide, with a focus on Australia and New Zealand. Ideal industries include hair salons, beauty businesses, gyms, personal trainers, med spas, cosmetic clinics, mortgage brokers, chiropractors, allied health practitioners, accountants, real estate agents, and event businesses.',
          },
        },
        {
          '@type': 'Question',
          name: 'How much does Shoulder Monkey cost?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Shoulder Monkey offers three plans: Silver at AUD $246/month, Gold at AUD $368/month, and Platinum at AUD $478/month (ex GST where applicable). Pricing is in AUD and available globally. All plans include a 14-day free trial. Annual subscriptions receive one month free.',
          },
        },
        {
          '@type': 'Question',
          name: 'Does Shoulder Monkey replace my existing tools?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Shoulder Monkey is designed to replace your existing booking app, CRM, email marketing tool, SMS platform, pipeline tracker, and reputation management tool — consolidating everything into one platform at a lower combined cost.',
          },
        },
      ],
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-AU" className={`${syne.variable} ${inter.variable}`}>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
