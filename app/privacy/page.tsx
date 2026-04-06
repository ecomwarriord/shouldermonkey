import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Shoulder Monkey collects, uses, and protects your personal information.',
}

const SECTIONS = [
  {
    title: '1. Information We Collect',
    body: `We collect information you provide directly to us, such as when you create an account, start a free trial, or contact us for support. This includes:

• Name, email address, and phone number
• Business name, type, and location
• Billing information (processed securely via our payment provider — we do not store card details)
• Usage data and activity within the platform
• Communications you send us

We also collect information automatically when you use our services, including IP address, browser type, device information, and pages visited.`,
  },
  {
    title: '2. How We Use Your Information',
    body: `We use the information we collect to:

• Provide, maintain, and improve the Shoulder Monkey platform
• Process transactions and send billing-related communications
• Send onboarding, product updates, and support communications
• Personalise your experience and pre-configure your account
• Analyse usage patterns to improve our product
• Comply with legal obligations

We do not sell your personal information to third parties.`,
  },
  {
    title: '3. Data Storage and Security',
    body: `Your data is stored on secure servers located in your region. Australian business data is stored on Australian servers. New Zealand business data is stored on New Zealand servers. Data is not transferred outside your region without your consent, except where required by law.

We use industry-standard encryption (TLS/SSL) for data in transit and encryption at rest for sensitive data. We implement access controls, audit logging, and regular security reviews. Our infrastructure maintains SOC 2 compliance and industry-standard security practices.

While we take data security seriously, no method of transmission or storage is 100% secure. We encourage you to use a strong, unique password for your account.`,
  },
  {
    title: '4. Data Sharing',
    body: `We share your information only in the following circumstances:

• With service providers who assist us in operating our platform (e.g., payment processors, email delivery, hosting providers)
• With our platform infrastructure provider, to deliver the service
• When required by law or in response to valid legal process
• In connection with a merger, acquisition, or sale of assets (you will be notified)

We require all third parties to maintain appropriate data security standards.`,
  },
  {
    title: '5. Your Data Rights',
    body: `Depending on your jurisdiction, you may have the right to:

• Access the personal data we hold about you
• Correct inaccurate or incomplete data
• Request deletion of your data
• Object to or restrict certain processing
• Data portability (receive your data in a structured, machine-readable format)

Australian residents: Your rights are governed by the Privacy Act 1988 (Cth) and the Australian Privacy Principles.
New Zealand residents: Your rights are governed by the Privacy Act 2020.

To exercise any of these rights, contact us at privacy@shouldermonkey.co. We will respond within 30 days.`,
  },
  {
    title: '6. Cookies',
    body: `We use cookies and similar tracking technologies to operate the platform, remember your preferences, and analyse usage. You can control cookie settings through your browser, though disabling certain cookies may affect platform functionality.

We do not use cookies for third-party advertising.`,
  },
  {
    title: '7. Data Retention',
    body: `We retain your personal data for as long as your account is active or as needed to provide services. If you cancel your account, we will delete or anonymise your data within 90 days, unless we are legally required to retain it longer.

Backup data may persist for up to 30 additional days after deletion.`,
  },
  {
    title: '8. Third-Party Links',
    body: `Our platform may contain links to third-party websites or services. We are not responsible for the privacy practices of those third parties and encourage you to review their privacy policies.`,
  },
  {
    title: '9. Children\'s Privacy',
    body: `Shoulder Monkey is not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If you believe we have inadvertently collected such information, please contact us immediately.`,
  },
  {
    title: '10. Changes to This Policy',
    body: `We may update this Privacy Policy from time to time. We will notify you of material changes by email or through the platform at least 14 days before the changes take effect. Your continued use of the platform after that date constitutes acceptance of the updated policy.`,
  },
  {
    title: '11. Contact Us',
    body: `For privacy-related enquiries, requests, or complaints:

Email: privacy@shouldermonkey.co
Phone: +61 2 5657 6545
Address: Shoulder Monkey, 377 Kent St, Sydney NSW 2000, Australia

If you are not satisfied with our response, you may contact the relevant authority in your jurisdiction:
• Australia: Office of the Australian Information Commissioner (oaic.gov.au)
• New Zealand: Office of the Privacy Commissioner (privacy.org.nz)`,
  },
]

export default function PrivacyPage() {
  return (
    <main style={{
      background: '#030108',
      minHeight: '100vh',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      color: '#f0edff',
      paddingTop: '80px',
    }}>
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '4rem 2rem' }}>

        {/* Back */}
        <Link href="/" style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          color: 'rgba(240,237,255,0.4)', textDecoration: 'none',
          fontSize: '0.875rem', fontWeight: 500, marginBottom: '2.5rem',
          transition: 'color 0.15s ease',
        }}>
          ← Back to Shoulder Monkey
        </Link>

        {/* Header */}
        <div style={{
          borderBottom: '1px solid rgba(132,75,254,0.15)',
          paddingBottom: '2rem', marginBottom: '3rem',
        }}>
          <div style={{
            display: 'inline-block',
            padding: '3px 12px', borderRadius: '100px',
            background: 'rgba(132,75,254,0.1)', border: '1px solid rgba(132,75,254,0.2)',
            color: '#a673ff', fontSize: '0.7rem', fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            marginBottom: '1rem',
          }}>Legal</div>
          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 800, letterSpacing: '-0.03em',
            color: '#ffffff', marginBottom: '0.75rem',
          }}>Privacy Policy</h1>
          <p style={{ fontSize: '0.9375rem', color: 'rgba(240,237,255,0.4)', lineHeight: 1.6 }}>
            Last updated: 1 April 2026 · Effective: 1 April 2026
          </p>
          <p style={{ fontSize: '0.9375rem', color: 'rgba(240,237,255,0.5)', lineHeight: 1.7, marginTop: '1rem' }}>
            Shoulder Monkey (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is committed to protecting your privacy. This policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
          </p>
        </div>

        {/* Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {SECTIONS.map((s) => (
            <div key={s.title}>
              <h2 style={{
                fontSize: '1.0625rem', fontWeight: 700,
                color: '#ffffff', marginBottom: '0.875rem',
              }}>{s.title}</h2>
              <div style={{
                fontSize: '0.9375rem', color: 'rgba(240,237,255,0.55)',
                lineHeight: 1.75, whiteSpace: 'pre-line',
              }}>{s.body}</div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div style={{
          marginTop: '4rem', paddingTop: '2rem',
          borderTop: '1px solid rgba(132,75,254,0.1)',
          fontSize: '0.8125rem', color: 'rgba(240,237,255,0.25)',
          textAlign: 'center',
        }}>
          © 2026 Shoulder Monkey · <Link href="/terms" style={{ color: 'rgba(240,237,255,0.35)', textDecoration: 'none' }}>Terms of Service</Link>
        </div>
      </div>
    </main>
  )
}
