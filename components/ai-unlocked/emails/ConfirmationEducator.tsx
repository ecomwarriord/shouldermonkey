import {
  Html, Head, Body, Container, Section, Text, Heading,
  Hr, Link, Preview, Font,
} from '@react-email/components'

interface Props {
  firstName: string
}

export function ConfirmationEducator({ firstName }: Props) {
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
      <Preview>You're on the AI Unlocked waitlist, {firstName}. Here's what's coming.</Preview>
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
              Welcome, {firstName}.
            </Heading>
            <Text style={heroSubtext}>
              You're on the waitlist for AI Unlocked — a 90-minute live session on building
              real things with AI. You'll hear from us first when tickets open.
            </Text>
          </Section>

          <Hr style={divider} />

          {/* What it is */}
          <Section style={contentSection}>
            <Heading style={sectionHeading}>The short version</Heading>
            <Text style={bodyText}>
              AI Unlocked is a live 90-minute webinar built for young Australians aged 13+ —
              and the educators, mentors, and professionals who work with them. It's run by
              Dee (Shoulder Monkey) and Abhinav Verma (RackTheBrain).
            </Text>
            <Text style={bodyText}>
              Abhinav has trained 1,000+ young people through RackTheBrain, holds a Cert IV in
              Training and Assessment, and runs national competitions in Memory, Rubik's Cube, and
              Brain Games. He's Tony Buzan-trained in Mind Mapping. Dee has built 6 live AI products
              in under 12 months.
            </Text>
            <Text style={bodyText}>
              Together, they're building a program that teaches young people to work with AI —
              not just talk about it.
            </Text>
          </Section>

          <Hr style={divider} />

          {/* For educators */}
          <Section style={contentSection}>
            <Heading style={sectionHeading}>For educators and professionals</Heading>
            <Text style={bodyText}>
              If you work with young people — whether in education, mentorship, coaching, or
              a professional capacity — this gives you a front-row seat to what they'll be learning.
            </Text>

            <div style={bulletRow}>
              <Text style={bullet}>→</Text>
              <Text style={bulletText}>
                See the curriculum in action (live build, not a demo)
              </Text>
            </div>
            <div style={bulletRow}>
              <Text style={bullet}>→</Text>
              <Text style={bulletText}>
                Understand what AI fluency looks like for the 13–25 age group
              </Text>
            </div>
            <div style={bulletRow}>
              <Text style={bullet}>→</Text>
              <Text style={bulletText}>
                Evaluate whether this fits what your students or clients need
              </Text>
            </div>

            <Text style={{ ...bodyText, marginTop: '16px' }}>
              If there's an opportunity to bring this to your organisation, school, or community —
              hit reply. We're building a B2B workshop offer from Month 3 and want to hear from
              people who are already interested.
            </Text>
          </Section>

          <Hr style={divider} />

          {/* CTA */}
          <Section style={ctaSection}>
            <Text style={ctaText}>
              Questions before tickets drop? Hit reply — Dee reads everything.
            </Text>
            <Link href="https://shouldermonkey.co/ai-unlocked" style={ctaButton}>
              View the AI Unlocked page →
            </Link>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              AI Unlocked · RackTheBrain × Shoulder Monkey · Sydney, Australia
            </Text>
            <Text style={footerText}>
              You're receiving this because you joined the AI Unlocked waitlist as an educator or professional.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

ConfirmationEducator.PreviewProps = {
  firstName: 'Sarah',
} satisfies Props

export default ConfirmationEducator

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
  padding: '28px 40px 20px',
  textAlign: 'center' as const,
  borderBottom: '1px solid rgba(123,63,228,0.15)',
}

const logoText = {
  fontSize: '24px',
  fontWeight: '800',
  letterSpacing: '0.12em',
  color: '#f0edff',
  margin: '0 0 4px',
}

const tagline = {
  fontSize: '11px',
  color: 'rgba(240,237,255,0.4)',
  letterSpacing: '0.08em',
  textTransform: 'uppercase' as const,
  margin: '0',
}

const heroSection = {
  padding: '36px 40px 28px',
  textAlign: 'center' as const,
}

const heroHeading = {
  fontSize: '32px',
  fontWeight: '800',
  color: '#f0edff',
  margin: '0 0 14px',
  lineHeight: '1.2',
}

const heroSubtext = {
  fontSize: '16px',
  color: 'rgba(240,237,255,0.65)',
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
  fontSize: '17px',
  fontWeight: '700',
  color: '#f0edff',
  margin: '0 0 16px',
}

const bodyText = {
  fontSize: '15px',
  color: 'rgba(240,237,255,0.65)',
  lineHeight: '1.7',
  margin: '0 0 14px',
}

const bulletRow = {
  display: 'flex' as const,
  gap: '10px',
  marginBottom: '10px',
}

const bullet = {
  color: '#7B3FE4',
  fontWeight: '700',
  fontSize: '14px',
  margin: '0',
  flexShrink: 0,
  lineHeight: '1.7',
}

const bulletText = {
  fontSize: '15px',
  color: 'rgba(240,237,255,0.65)',
  lineHeight: '1.7',
  margin: '0',
}

const ctaSection = {
  padding: '32px 40px',
  textAlign: 'center' as const,
  borderTop: '1px solid rgba(123,63,228,0.1)',
}

const ctaText = {
  fontSize: '15px',
  color: 'rgba(240,237,255,0.5)',
  margin: '0 0 20px',
}

const ctaButton = {
  display: 'inline-block',
  border: '1.5px solid rgba(123,63,228,0.6)',
  color: '#f0edff',
  fontWeight: '600',
  fontSize: '14px',
  padding: '12px 28px',
  borderRadius: '10px',
  textDecoration: 'none',
}

const footer = {
  padding: '20px 40px',
  borderTop: '1px solid rgba(123,63,228,0.08)',
  background: 'rgba(0,0,0,0.3)',
}

const footerText = {
  fontSize: '11px',
  color: 'rgba(240,237,255,0.2)',
  textAlign: 'center' as const,
  margin: '0 0 4px',
  lineHeight: '1.5',
}
