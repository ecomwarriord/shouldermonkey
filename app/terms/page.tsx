import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms and conditions for using the Shoulder Monkey platform.',
}

const SECTIONS = [
  {
    title: '1. Acceptance of Terms',
    body: `By accessing or using the Shoulder Monkey platform ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, do not use the Service.

These Terms apply to all users, including those on a free trial and paid subscribers. By starting a free trial or subscribing, you confirm you have the authority to bind yourself or your business to these Terms.`,
  },
  {
    title: '2. The Service',
    body: `Shoulder Monkey provides a white-label business management platform ("Platform") built on enterprise-grade cloud infrastructure. The Platform includes CRM, pipeline management, booking and appointment scheduling, email marketing, 2-way SMS, automation and workflows, reputation management, website and funnel building, call tracking, invoicing, social media planning, and related tools.

The specific features available to you depend on your subscription plan. We reserve the right to modify, add, or remove features with reasonable notice.`,
  },
  {
    title: '3. Free Trial',
    body: `We offer a 14-day free trial for new subscribers. During the trial:

• You have full access to the features included in your selected plan
• A valid payment method is required to begin the trial
• You will not be charged until the trial period ends
• If you cancel before the trial ends, you will not be charged
• If you do not cancel before the trial ends, your subscription will begin automatically and you will be charged the applicable plan fee

Trial accounts are for new users only. Creating multiple trial accounts to extend the free period is prohibited.`,
  },
  {
    title: '4. Subscriptions and Billing',
    body: `Subscriptions are billed monthly or annually in advance in Australian Dollars (AUD), exclusive of GST where applicable.

Prices are:
• Silver: AUD $246/month
• Gold: AUD $368/month
• Platinum: AUD $478/month
• Annual plans: billed as 11 months (1 month free)

Prices may change with 30 days' notice. Continued use after a price change constitutes acceptance.

Payments are processed securely via our payment provider. We do not store your card details. Failed payments may result in service suspension after a grace period.`,
  },
  {
    title: '5. Cancellation and Refunds',
    body: `You may cancel your subscription at any time through your account dashboard or by contacting us at info@shouldermonkey.co.

Monthly subscriptions: cancellation takes effect at the end of the current billing period. No partial refunds are issued for unused time.

Annual subscriptions: cancellation takes effect at the end of the annual period. We do not offer refunds for annual plans unless required by applicable law.

We reserve the right to terminate your account for breach of these Terms, in which case no refund will be issued.`,
  },
  {
    title: '6. Acceptable Use',
    body: `You agree to use the Service only for lawful purposes and in accordance with these Terms. You must not:

• Use the Service to send unsolicited bulk messages (spam)
• Violate any applicable laws or regulations, including Australian Spam Act 2003 and applicable SMS marketing laws
• Collect or process personal data in violation of applicable privacy laws
• Attempt to gain unauthorised access to the Service or its infrastructure
• Use the Service to store or transmit malicious code
• Resell or sub-license the Service without our express written consent
• Misrepresent your identity or affiliation

We reserve the right to suspend or terminate accounts that violate this section.`,
  },
  {
    title: '7. Your Data and Content',
    body: `You retain ownership of all data, content, and contact information you upload to or generate within the Platform ("Your Content"). By using the Service, you grant us a limited licence to store, process, and transmit Your Content solely to provide the Service.

You are responsible for ensuring you have the right to upload and process Your Content, including any personal data of your clients. You must comply with applicable privacy laws when collecting and using client data through the Platform.

We do not use Your Content for any purpose other than providing and improving the Service.`,
  },
  {
    title: '8. Intellectual Property',
    body: `The Shoulder Monkey brand, logo, platform interface, and all associated intellectual property are owned by us or licensed to us. Nothing in these Terms grants you any rights to our intellectual property.

Certain underlying platform technology used to deliver the Service is owned by third-party providers. Our use of that technology is governed by separate agreements with those providers.`,
  },
  {
    title: '9. Limitation of Liability',
    body: `To the maximum extent permitted by law:

• The Service is provided "as is" without warranty of any kind
• We are not liable for any indirect, incidental, special, consequential, or punitive damages
• Our total liability to you for any claim arising from the Service shall not exceed the fees paid by you in the 3 months preceding the claim

Nothing in these Terms excludes liability for fraud, death or personal injury caused by our negligence, or any liability that cannot be excluded under applicable law (including Australian Consumer Law).`,
  },
  {
    title: '10. Service Availability',
    body: `We aim to maintain high availability but do not guarantee uninterrupted access to the Service. We may perform scheduled maintenance with advance notice, and unscheduled maintenance when necessary.

We are not liable for downtime caused by circumstances beyond our reasonable control, including failures of third-party infrastructure providers, telecommunications networks, or internet outages.`,
  },
  {
    title: '11. Governing Law',
    body: `These Terms are governed by the laws of New South Wales, Australia. Any disputes will be subject to the exclusive jurisdiction of the courts of New South Wales, unless you are a consumer in another jurisdiction entitled to the protection of local mandatory laws.

Australian Consumer Law: Nothing in these Terms limits any rights you have under the Australian Consumer Law, including consumer guarantees.`,
  },
  {
    title: '12. Changes to Terms',
    body: `We may update these Terms from time to time. We will notify you of material changes by email at least 14 days before they take effect. Your continued use of the Service after that date constitutes acceptance of the updated Terms.`,
  },
  {
    title: '13. Contact',
    body: `For questions about these Terms:

Email: info@shouldermonkey.co
Phone: +61 2 5657 6545
Address: Shoulder Monkey, 377 Kent St, Sydney NSW 2000, Australia`,
  },
]

export default function TermsPage() {
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
          }}>Terms of Service</h1>
          <p style={{ fontSize: '0.9375rem', color: 'rgba(240,237,255,0.4)', lineHeight: 1.6 }}>
            Last updated: 1 April 2026 · Effective: 1 April 2026
          </p>
          <p style={{ fontSize: '0.9375rem', color: 'rgba(240,237,255,0.5)', lineHeight: 1.7, marginTop: '1rem' }}>
            Please read these Terms carefully before using Shoulder Monkey. They govern your use of our platform and form a binding agreement between you and Shoulder Monkey.
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
          © 2026 Shoulder Monkey · <Link href="/privacy" style={{ color: 'rgba(240,237,255,0.35)', textDecoration: 'none' }}>Privacy Policy</Link>
        </div>
      </div>
    </main>
  )
}
