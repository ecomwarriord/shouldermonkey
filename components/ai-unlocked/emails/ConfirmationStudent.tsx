import {
  Html, Head, Body, Container, Section, Text, Heading,
  Hr, Link, Preview, Font,
} from '@react-email/components'

interface Props {
  firstName: string
  age?: string
}

export function ConfirmationStudent({ firstName, age }: Props) {
  return (
    <Html>
      <Head>
        <Font
          fontFamily="Inter"
          fallbackFontFamily="Arial"
          webFont={{ url: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2', format: 'woff2' }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>You're on the list. AI Unlocked is coming to you, {firstName}. 🔥</Preview>
      <Body style={body}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Text style={logoText}>AI UNLOCKED</Text>
            <Text style={tagline}>RackTheBrain × Shoulder Monkey</Text>
          </Section>

          {/* Hero */}
          <Section style={heroSection}>
            <Heading style={heroHeading}>
              You're in, {firstName}. 🚀
            </Heading>
            <Text style={heroSubtext}>
              You just joined the waitlist for Australia's most exciting AI event for young people.
              You're early. That matters.
            </Text>
          </Section>

          <Hr style={divider} />

          {/* What happens next */}
          <Section style={contentSection}>
            <Heading style={sectionHeading}>What happens next</Heading>

            <div style={stepRow}>
              <div style={stepNumber}>1</div>
              <div style={stepContent}>
                <Text style={stepTitle}>Tickets drop — you get first access</Text>
                <Text style={stepBody}>
                  Waitlist members get notified before anyone else. Founding cohort tickets are
                  limited — you'll have a 48-hour head start.
                </Text>
              </div>
            </div>

            <div style={stepRow}>
              <div style={stepNumber}>2</div>
              <div style={stepContent}>
                <Text style={stepTitle}>90 minutes that actually do something</Text>
                <Text style={stepBody}>
                  Not theory. Not slides. You'll leave with a real AI tool you built yourself —
                  something you can show people.
                </Text>
              </div>
            </div>

            <div style={stepRow}>
              <div style={stepNumber}>3</div>
              <div style={stepContent}>
                <Text style={stepTitle}>The webinar is just the beginning</Text>
                <Text style={stepBody}>
                  Dee and Abhinav will show you what's actually possible. What comes after is up to you.
                </Text>
              </div>
            </div>
          </Section>

          <Hr style={divider} />

          {/* Social proof / hype */}
          <Section style={contentSection}>
            <Text style={quoteText}>
              "Most students your age are waiting for someone to teach them AI.
              You just signed up to learn it. That's already different."
            </Text>
            <Text style={quoteAttribution}>— Dee, Shoulder Monkey</Text>
          </Section>

          <Hr style={divider} />

          {/* CTA */}
          <Section style={ctaSection}>
            <Text style={ctaText}>
              Know a mate who'd be into this? Send them the link.
            </Text>
            <Link href="https://shouldermonkey.co/ai-unlocked" style={ctaButton}>
              Share AI Unlocked →
            </Link>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              AI Unlocked · RackTheBrain × Shoulder Monkey · Sydney, Australia
            </Text>
            <Text style={footerText}>
              You're receiving this because you joined the AI Unlocked waitlist.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

ConfirmationStudent.PreviewProps = {
  firstName: 'Jordan',
  age: '16',
} satisfies Props

export default ConfirmationStudent

// Styles
const body = {
  backgroundColor: '#030108',
  fontFamily: 'Inter, Arial, sans-serif',
  margin: '0',
  padding: '0',
}

const container = {
  backgroundColor: '#0a0612',
  maxWidth: '600px',
  margin: '0 auto',
  border: '1px solid rgba(123,63,228,0.2)',
  borderRadius: '16px',
  overflow: 'hidden' as const,
}

const header = {
  background: 'linear-gradient(135deg, #1a0836 0%, #0a0612 100%)',
  padding: '32px 40px 24px',
  textAlign: 'center' as const,
  borderBottom: '1px solid rgba(123,63,228,0.15)',
}

const logoText = {
  fontSize: '28px',
  fontWeight: '800',
  letterSpacing: '0.15em',
  background: 'linear-gradient(135deg, #7B3FE4, #FF3366)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  color: '#7B3FE4',
  margin: '0 0 4px',
}

const tagline = {
  fontSize: '12px',
  color: 'rgba(240,237,255,0.4)',
  letterSpacing: '0.08em',
  textTransform: 'uppercase' as const,
  margin: '0',
}

const heroSection = {
  padding: '40px 40px 32px',
  textAlign: 'center' as const,
}

const heroHeading = {
  fontSize: '36px',
  fontWeight: '800',
  color: '#f0edff',
  margin: '0 0 16px',
  lineHeight: '1.2',
}

const heroSubtext = {
  fontSize: '16px',
  color: 'rgba(240,237,255,0.7)',
  lineHeight: '1.6',
  margin: '0',
}

const divider = {
  borderColor: 'rgba(123,63,228,0.15)',
  margin: '0',
}

const contentSection = {
  padding: '32px 40px',
}

const sectionHeading = {
  fontSize: '18px',
  fontWeight: '700',
  color: '#f0edff',
  margin: '0 0 24px',
  letterSpacing: '0.02em',
}

const stepRow = {
  display: 'flex' as const,
  gap: '16px',
  marginBottom: '20px',
  alignItems: 'flex-start' as const,
}

const stepNumber = {
  width: '28px',
  height: '28px',
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #7B3FE4, #FF3366)',
  color: '#ffffff',
  fontSize: '13px',
  fontWeight: '700',
  display: 'flex' as const,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
  flexShrink: 0,
  lineHeight: '28px',
  textAlign: 'center' as const,
}

const stepContent = {
  flex: 1,
}

const stepTitle = {
  fontSize: '15px',
  fontWeight: '700',
  color: '#f0edff',
  margin: '0 0 4px',
}

const stepBody = {
  fontSize: '14px',
  color: 'rgba(240,237,255,0.6)',
  lineHeight: '1.6',
  margin: '0',
}

const quoteText = {
  fontSize: '17px',
  fontStyle: 'italic',
  color: 'rgba(240,237,255,0.8)',
  lineHeight: '1.7',
  margin: '0 0 12px',
  borderLeft: '3px solid #7B3FE4',
  paddingLeft: '16px',
}

const quoteAttribution = {
  fontSize: '13px',
  color: 'rgba(240,237,255,0.4)',
  margin: '0',
  paddingLeft: '16px',
}

const ctaSection = {
  padding: '32px 40px',
  textAlign: 'center' as const,
}

const ctaText = {
  fontSize: '15px',
  color: 'rgba(240,237,255,0.6)',
  margin: '0 0 20px',
}

const ctaButton = {
  display: 'inline-block',
  background: 'linear-gradient(135deg, #7B3FE4, #FF3366)',
  color: '#ffffff',
  fontWeight: '700',
  fontSize: '15px',
  padding: '14px 32px',
  borderRadius: '10px',
  textDecoration: 'none',
  letterSpacing: '0.02em',
}

const footer = {
  padding: '24px 40px',
  borderTop: '1px solid rgba(123,63,228,0.1)',
  background: 'rgba(0,0,0,0.3)',
}

const footerText = {
  fontSize: '12px',
  color: 'rgba(240,237,255,0.25)',
  textAlign: 'center' as const,
  margin: '0 0 4px',
  lineHeight: '1.5',
}
