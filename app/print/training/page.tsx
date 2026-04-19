import type { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'BridgeGrowth — Platform Training Guide',
  robots: { index: false, follow: false },
}

/* ─── Colour tokens ──────────────────────────────────────────── */
const C = {
  bg:        '#030108',
  bgCard:    '#0d0a18',
  bgBox:     '#110e1f',
  purple:    '#844bfe',
  purpleSoft:'rgba(132,75,254,0.12)',
  purpleBdr: 'rgba(132,75,254,0.35)',
  white:     '#ffffff',
  whiteHi:   'rgba(255,255,255,0.90)',
  whiteMid:  'rgba(255,255,255,0.65)',
  whiteLow:  'rgba(255,255,255,0.40)',
  divider:   'rgba(255,255,255,0.08)',
  green:     '#22c55e',
  amber:     '#f59e0b',
  red:       '#ef4444',
  greenSoft: 'rgba(34,197,94,0.12)',
  amberSoft: 'rgba(245,158,11,0.12)',
  redSoft:   'rgba(239,68,68,0.12)',
}

/* ─── Typography helpers ─────────────────────────────────────── */
const T = {
  label:   { fontFamily: 'var(--font-inter)', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: C.purple },
  h1:      { fontFamily: 'var(--font-jakarta)', fontSize: '2.6rem', fontWeight: 800, color: C.white, lineHeight: 1.1 },
  h2:      { fontFamily: 'var(--font-jakarta)', fontSize: '1.5rem', fontWeight: 700, color: C.white, lineHeight: 1.2 },
  h3:      { fontFamily: 'var(--font-jakarta)', fontSize: '1.05rem', fontWeight: 700, color: C.white },
  h4:      { fontFamily: 'var(--font-jakarta)', fontSize: '0.875rem', fontWeight: 600, color: C.purple },
  body:    { fontFamily: 'var(--font-inter)', fontSize: '0.8125rem', color: C.whiteMid, lineHeight: 1.75 },
  small:   { fontFamily: 'var(--font-inter)', fontSize: '0.75rem', color: C.whiteLow, lineHeight: 1.6 },
  mono:    { fontFamily: 'monospace', fontSize: '0.75rem', color: C.purple },
}

/* ─── Layout constants ───────────────────────────────────────── */
const PAGE = {
  width: '210mm',
  minHeight: '297mm',
  padding: '14mm 16mm',
  background: C.bg,
  boxSizing: 'border-box' as const,
  pageBreakAfter: 'always' as const,
}

/* ─── Reusable components ────────────────────────────────────── */

function PageWrapper({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ ...PAGE, ...style }}>
      {children}
    </div>
  )
}

function SectionHeader({ number, title, subtitle }: { number: string; title: string; subtitle?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '20px' }}>
      <div style={{
        width: '40px', height: '40px', borderRadius: '10px', flexShrink: 0,
        background: C.purpleSoft, border: `1.5px solid ${C.purpleBdr}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-jakarta)', fontSize: '0.9rem', fontWeight: 800, color: C.purple,
      }}>
        {number}
      </div>
      <div>
        <div style={T.h2}>{title}</div>
        {subtitle && <div style={{ ...T.body, color: C.whiteLow, marginTop: '3px' }}>{subtitle}</div>}
      </div>
    </div>
  )
}

function Divider() {
  return <div style={{ borderTop: `1px solid ${C.divider}`, margin: '16px 0' }} />
}

function InfoBox({ children, color = 'purple' }: { children: React.ReactNode; color?: 'purple' | 'green' | 'amber' | 'red' }) {
  const map = { purple: [C.purpleSoft, C.purpleBdr, C.purple], green: [C.greenSoft, 'rgba(34,197,94,0.35)', C.green], amber: [C.amberSoft, 'rgba(245,158,11,0.35)', C.amber], red: [C.redSoft, 'rgba(239,68,68,0.35)', C.red] }
  const [bg, bdr, accent] = map[color]
  return (
    <div style={{ background: bg, border: `1px solid ${bdr}`, borderRadius: '8px', padding: '10px 14px', marginBottom: '10px' }}>
      <div style={{ ...T.body, color: accent }}>{children}</div>
    </div>
  )
}

function Step({ n, title, children }: { n: number; title: string; children?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: '12px', marginBottom: '10px', alignItems: 'flex-start' }}>
      <div style={{
        width: '22px', height: '22px', borderRadius: '50%', flexShrink: 0, marginTop: '1px',
        background: C.purple, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-jakarta)', fontSize: '0.7rem', fontWeight: 700, color: C.white,
      }}>
        {n}
      </div>
      <div>
        <div style={{ ...T.body, fontWeight: 600, color: C.whiteHi }}>{title}</div>
        {children && <div style={{ ...T.body, marginTop: '2px' }}>{children}</div>}
      </div>
    </div>
  )
}

function Pill({ text, color = 'purple' }: { text: string; color?: 'purple' | 'green' | 'amber' | 'red' | 'white' }) {
  const map: Record<string, [string, string]> = {
    purple: [C.purpleSoft, C.purple],
    green:  [C.greenSoft, C.green],
    amber:  [C.amberSoft, C.amber],
    red:    [C.redSoft, C.red],
    white:  ['rgba(255,255,255,0.08)', C.whiteMid],
  }
  const [bg, fg] = map[color]
  return (
    <span style={{ ...T.label, background: bg, color: fg, borderRadius: '4px', padding: '2px 7px', display: 'inline-block', marginRight: '4px', marginBottom: '4px', letterSpacing: '0.08em' }}>
      {text}
    </span>
  )
}

function TwoCol({ left, right, ratio = '1fr 1fr' }: { left: React.ReactNode; right: React.ReactNode; ratio?: string }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: ratio, gap: '16px' }}>
      <div>{left}</div>
      <div>{right}</div>
    </div>
  )
}

function Card({ title, children, accent }: { title?: string; children: React.ReactNode; accent?: string }) {
  return (
    <div style={{ background: C.bgBox, border: `1px solid ${accent ?? C.divider}`, borderRadius: '10px', padding: '12px 14px', marginBottom: '10px' }}>
      {title && <div style={{ ...T.h4, marginBottom: '8px' }}>{title}</div>}
      {children}
    </div>
  )
}

function TableRow({ label, value, tag }: { label: string; value: string; tag?: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: `1px solid ${C.divider}` }}>
      <div style={{ ...T.body, color: C.whiteMid, flex: 1 }}>{label}</div>
      <div style={{ ...T.body, color: C.whiteHi, flex: 1.2, textAlign: 'right' }}>{value}</div>
      {tag && <div style={{ marginLeft: '10px' }}><Pill text={tag} color="green" /></div>}
    </div>
  )
}

function FooterBar({ page, total }: { page: number; total: number }) {
  return (
    <div style={{ position: 'absolute', bottom: '10mm', left: '16mm', right: '16mm', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={T.small}>BridgeGrowth Platform Training Guide</div>
      <div style={{ ...T.small, color: C.purple }}>{page} / {total}</div>
    </div>
  )
}

const TOTAL_PAGES = 12

/* ═══════════════════════════════════════════════════════════════
   COVER PAGE
═══════════════════════════════════════════════════════════════ */
function CoverPage() {
  return (
    <PageWrapper style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', minHeight: '297mm', padding: '0' }}>

      {/* Top accent bar */}
      <div style={{ height: '4px', background: `linear-gradient(90deg, ${C.purple}, rgba(132,75,254,0.2))` }} />

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '14mm 18mm' }}>

        {/* SM Logo */}
        <div style={{ marginBottom: '40px' }}>
          <Image
            src="/images/SM - Logo - Flat Lay White.png"
            alt="Shoulder Monkey"
            width={220}
            height={50}
            style={{ height: '42px', width: 'auto', objectFit: 'contain', objectPosition: 'left' }}
          />
        </div>

        {/* Label */}
        <div style={{ ...T.label, marginBottom: '16px' }}>Client Training Guide · BridgeGrowth</div>

        {/* Title */}
        <div style={{ ...T.h1, fontSize: '3rem', marginBottom: '20px' }}>
          Platform<br />Training<br />Guide
        </div>

        {/* Subtitle */}
        <div style={{ maxWidth: '420px', ...T.body, color: C.whiteMid, fontSize: '0.9375rem', lineHeight: 1.8 }}>
          Everything you need to run your BridgeGrowth business on the Shoulder Monkey platform — from day-to-day tasks to the workflows you should never touch.
        </div>

        {/* Divider line */}
        <div style={{ width: '60px', height: '3px', background: C.purple, borderRadius: '2px', margin: '28px 0' }} />

        {/* Prepared for */}
        <div style={{ display: 'flex', gap: '40px' }}>
          <div>
            <div style={T.label}>Prepared for</div>
            <div style={{ ...T.h3, marginTop: '5px' }}>BridgeGrowth</div>
            <div style={{ ...T.small, marginTop: '2px' }}>hello@bridgegrowth.co.za</div>
          </div>
          <div>
            <div style={T.label}>Prepared by</div>
            <div style={{ ...T.h3, marginTop: '5px' }}>Qaneri Creative</div>
            <div style={{ ...T.small, marginTop: '2px' }}>Powered by Shoulder Monkey</div>
          </div>
          <div>
            <div style={T.label}>Date</div>
            <div style={{ ...T.h3, marginTop: '5px' }}>April 2026</div>
            <div style={{ ...T.small, marginTop: '2px' }}>Version 1.0</div>
          </div>
        </div>
      </div>

      {/* Module index strip */}
      <div style={{ background: C.bgBox, borderTop: `1px solid ${C.divider}`, padding: '14px 18mm', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {[
          '01 Platform Overview', '02 Contacts & Pipelines', '03 Conversations',
          '04 Calendar', '05 Forms & Lead Capture', '06 Workflows & Automation',
          '07 Documents & Contracts', '08 Payments & Invoicing', '09 Quick Reference', '10 Do Not Touch',
        ].map(m => (
          <span key={m} style={{ ...T.small, background: C.purpleSoft, color: C.purple, borderRadius: '4px', padding: '3px 8px' }}>{m}</span>
        ))}
      </div>
    </PageWrapper>
  )
}

/* ═══════════════════════════════════════════════════════════════
   PAGE 2 — How to Use This Guide
═══════════════════════════════════════════════════════════════ */
function HowToUsePage() {
  return (
    <PageWrapper style={{ position: 'relative' }}>
      <div style={{ ...T.label, marginBottom: '6px' }}>Getting Started</div>
      <div style={{ ...T.h2, marginBottom: '6px' }}>How to Use This Guide</div>
      <div style={{ ...T.body, color: C.whiteLow, marginBottom: '20px' }}>Read this page first — it will save you a lot of confusion later.</div>
      <Divider />

      <TwoCol
        ratio="1fr 1fr"
        left={
          <>
            <Card title="What this guide covers">
              <div style={T.body}>This guide is specific to the BridgeGrowth account on the Shoulder Monkey platform. Screenshots and steps may differ from generic GHL tutorials you find online — always use this guide first.</div>
            </Card>
            <Card title="Platform access">
              <div style={{ ...T.body, marginBottom: '8px' }}>You access the platform from any browser:</div>
              <div style={{ ...T.mono, background: C.bgBox, borderRadius: '6px', padding: '8px 12px', fontSize: '0.8rem' }}>app.qanericreative.com</div>
              <div style={{ ...T.small, marginTop: '6px' }}>Bookmark this URL. Log in with the credentials Qaneri shared with you.</div>
            </Card>
            <Card title="Mobile app">
              <div style={T.body}>Download the <strong style={{ color: C.white }}>LeadConnector</strong> app (iOS or Android) for on-the-go access to conversations, contacts, and notifications. Use the same login credentials.</div>
            </Card>
          </>
        }
        right={
          <>
            <Card title="Key icons used in this guide" accent={C.purpleBdr}>
              {[
                ['⚡', 'Automated', 'The system does this for you — no action needed.'],
                ['👤', 'Manual', 'You need to do this step yourself.'],
                ['⚠️', 'Important', 'Pay attention — mistakes here affect clients.'],
                ['🚫', 'Do Not Touch', 'Configured by Qaneri. Do not modify.'],
                ['💡', 'Tip', 'A helpful shortcut or best practice.'],
              ].map(([icon, label, desc]) => (
                <div key={label as string} style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'flex-start' }}>
                  <div style={{ fontSize: '1rem', flexShrink: 0, marginTop: '1px' }}>{icon}</div>
                  <div>
                    <div style={{ ...T.body, fontWeight: 600, color: C.white }}>{label as string}</div>
                    <div style={{ ...T.small }}>{desc as string}</div>
                  </div>
                </div>
              ))}
            </Card>
            <InfoBox color="amber">
              <strong>Before you start:</strong> Never share your login credentials. Each person should have their own user account. Contact Qaneri if you need additional users added.
            </InfoBox>
          </>
        }
      />

      <Divider />
      <div style={{ ...T.label, marginBottom: '10px' }}>Quick contacts</div>
      <div style={{ display: 'flex', gap: '12px' }}>
        {[
          { label: 'Platform Support', value: 'Qaneri Creative', note: 'For setup issues, broken workflows, anything technical' },
          { label: 'Login Issues', value: 'hello@qanericreative.com', note: 'If you cannot access the platform' },
          { label: 'Your Account URL', value: 'app.qanericreative.com', note: 'Bookmark this in your browser now' },
        ].map(({ label, value, note }) => (
          <div key={label} style={{ flex: 1, background: C.bgBox, borderRadius: '8px', padding: '10px 12px', border: `1px solid ${C.divider}` }}>
            <div style={T.label}>{label}</div>
            <div style={{ ...T.body, color: C.white, fontWeight: 600, marginTop: '4px' }}>{value}</div>
            <div style={{ ...T.small, marginTop: '3px' }}>{note}</div>
          </div>
        ))}
      </div>

      <FooterBar page={2} total={TOTAL_PAGES} />
    </PageWrapper>
  )
}

/* ═══════════════════════════════════════════════════════════════
   PAGE 3 — Module 01: Platform Overview
═══════════════════════════════════════════════════════════════ */
function PlatformOverviewPage() {
  const navItems = [
    { icon: '💬', name: 'Conversations', desc: 'All your email and SMS messages in one inbox' },
    { icon: '👥', name: 'Contacts', desc: 'Your client database — everyone who has ever enquired or signed up' },
    { icon: '📊', name: 'Pipelines', desc: 'Track where each prospect or client is in the sales/service process' },
    { icon: '📅', name: 'Calendars', desc: 'Appointment scheduling and bookings' },
    { icon: '⚡', name: 'Automation', desc: 'Workflows — the engine that runs in the background (do not touch)' },
    { icon: '📄', name: 'Documents', desc: 'Service agreements and contracts' },
    { icon: '💳', name: 'Payments', desc: 'Invoices and payment tracking' },
    { icon: '📋', name: 'Forms', desc: 'Lead capture forms — submissions land here' },
    { icon: '📣', name: 'Marketing', desc: 'Email campaigns and broadcasts' },
    { icon: '⚙️', name: 'Settings', desc: 'Account configuration — ask Qaneri before changing anything here' },
  ]

  return (
    <PageWrapper style={{ position: 'relative' }}>
      <SectionHeader number="01" title="Platform Overview" subtitle="What the platform is and how to navigate it" />

      <TwoCol
        ratio="1.1fr 0.9fr"
        left={
          <>
            <div style={{ ...T.label, marginBottom: '8px' }}>Left-hand navigation — what each section does</div>
            {navItems.map(({ icon, name, desc }) => (
              <div key={name} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '7px 0', borderBottom: `1px solid ${C.divider}` }}>
                <div style={{ fontSize: '0.9rem', flexShrink: 0, marginTop: '1px' }}>{icon}</div>
                <div>
                  <span style={{ ...T.body, fontWeight: 600, color: C.white }}>{name}: </span>
                  <span style={{ ...T.body }}>{desc}</span>
                </div>
              </div>
            ))}
          </>
        }
        right={
          <>
            <Card title="Your dashboard" accent={C.purpleBdr}>
              <div style={{ ...T.body, marginBottom: '8px' }}>When you log in, you land on the Dashboard. It shows a real-time snapshot of:</div>
              {['Leads in each pipeline stage', 'Conversations waiting for reply', 'Today\'s appointments', 'Recent contact activity'].map(i => (
                <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '5px' }}>
                  <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: C.purple, flexShrink: 0 }} />
                  <div style={T.body}>{i}</div>
                </div>
              ))}
            </Card>
            <Card title="Top bar explained">
              {[
                ['🔔', 'Notifications', 'New leads, signed contracts, messages'],
                ['👤', 'User menu', 'Your profile and logout'],
                ['🏢', 'Sub-account', 'Should always say BridgeGrowth'],
                ['🔍', 'Search', 'Find any contact or conversation quickly'],
              ].map(([icon, label, desc]) => (
                <div key={label as string} style={{ display: 'flex', gap: '8px', marginBottom: '7px' }}>
                  <div style={{ fontSize: '0.85rem' }}>{icon}</div>
                  <div>
                    <span style={{ ...T.body, fontWeight: 600, color: C.white }}>{label as string}: </span>
                    <span style={T.body}>{desc as string}</span>
                  </div>
                </div>
              ))}
            </Card>
            <InfoBox color="purple">
              <strong>💡 Tip:</strong> The search bar (top right) is the fastest way to find any contact. Just type a name, number, or email and it finds them instantly.
            </InfoBox>
          </>
        }
      />

      <FooterBar page={3} total={TOTAL_PAGES} />
    </PageWrapper>
  )
}

/* ═══════════════════════════════════════════════════════════════
   PAGE 4 — Module 02: Contacts & Pipelines
═══════════════════════════════════════════════════════════════ */
function ContactsPipelinesPage() {
  const prospectStages = ['New Lead', 'Contacted', 'Qualified', 'Proposal Sent', 'Closed Won', 'Closed Lost']
  const clientStages = ['Onboarding', 'Active', 'Review Due', 'Churned']
  const serviceStages = ['Intake', 'In Progress', 'Awaiting Client', 'Complete']

  return (
    <PageWrapper style={{ position: 'relative' }}>
      <SectionHeader number="02" title="Contacts & Pipelines" subtitle="Managing your leads, prospects, and active clients" />

      <TwoCol
        ratio="1fr 1fr"
        left={
          <>
            <div style={{ ...T.label, marginBottom: '8px' }}>Adding a new contact</div>
            <Step n={1} title="Go to Contacts in the left menu" />
            <Step n={2} title='Click the green "+ Add Contact" button (top right)' />
            <Step n={3} title="Fill in at minimum: First Name, Last Name, Email, Phone">
              <div style={T.small}>The more info you add, the better. Business name, address, and notes are useful for BridgeGrowth services.</div>
            </Step>
            <Step n={4} title="Under Tags, add relevant tags">
              <div style={T.small}>e.g. <em>CIPC, SARS, Admin, Debtors</em> — helps with filtering and automations.</div>
            </Step>
            <Step n={5} title='Click "Save" — the contact is now in the system' />

            <InfoBox color="amber">
              <strong>⚠️ Check for duplicates first.</strong> Search the contact&apos;s name or email before adding. Duplicates cause confusion and broken automations.
            </InfoBox>

            <Divider />
            <div style={{ ...T.label, marginBottom: '8px' }}>Moving a contact through a pipeline</div>
            <Step n={1} title="Open the contact record" />
            <Step n={2} title='Scroll to "Opportunities" on the right panel' />
            <Step n={3} title='Click "+ Add" or the existing opportunity card' />
            <Step n={4} title="Drag the card to the correct stage OR edit the stage from the opportunity detail" />
          </>
        }
        right={
          <>
            <div style={{ ...T.label, marginBottom: '8px' }}>Your 3 pipelines</div>

            <Card title="🎯 Prospect Pipeline" accent={C.purpleBdr}>
              <div style={{ ...T.small, marginBottom: '8px' }}>New enquiries and leads from the website form or direct contact.</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {prospectStages.map((s, i) => <Pill key={s} text={s} color={i === prospectStages.length - 2 ? 'green' : i === prospectStages.length - 1 ? 'red' : 'purple'} />)}
              </div>
            </Card>

            <Card title="✅ Active Clients Pipeline">
              <div style={{ ...T.small, marginBottom: '8px' }}>Signed clients currently receiving services.</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {clientStages.map(s => <Pill key={s} text={s} color="white" />)}
              </div>
            </Card>

            <Card title="🔧 Service Delivery Pipeline">
              <div style={{ ...T.small, marginBottom: '8px' }}>Track individual service tasks (CIPC, SARS submissions, etc.).</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {serviceStages.map(s => <Pill key={s} text={s} color="white" />)}
              </div>
            </Card>

            <InfoBox color="green">
              <strong>💡 Best practice:</strong> Update the pipeline stage the moment something changes. This keeps your dashboard accurate and triggers the right automations.
            </InfoBox>

            <div style={{ ...T.label, marginBottom: '6px', marginTop: '10px' }}>Contact tags to use</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {['CIPC', 'SARS', 'Admin Retainer', 'Debtors Mgmt', 'New Enquiry', 'Starter Plan', 'Growth Plan', 'Operations Plan', 'Annual Review'].map(t => <Pill key={t} text={t} color="white" />)}
            </div>
          </>
        }
      />

      <FooterBar page={4} total={TOTAL_PAGES} />
    </PageWrapper>
  )
}

/* ═══════════════════════════════════════════════════════════════
   PAGE 5 — Module 03: Conversations
═══════════════════════════════════════════════════════════════ */
function ConversationsPage() {
  return (
    <PageWrapper style={{ position: 'relative' }}>
      <SectionHeader number="03" title="Conversations" subtitle="Your unified inbox for email and SMS — all client messages in one place" />

      <TwoCol
        ratio="1fr 1fr"
        left={
          <>
            <Card title="What you&apos;ll see in your inbox" accent={C.purpleBdr}>
              <div style={T.body}>Every email and SMS sent to or from BridgeGrowth contacts appears here — including automated messages the system sent on your behalf. You can reply to all of them from this screen.</div>
            </Card>

            <div style={{ ...T.label, marginBottom: '8px', marginTop: '4px' }}>Replying to a message</div>
            <Step n={1} title="Click any conversation in the left list" />
            <Step n={2} title="The full message thread opens on the right" />
            <Step n={3} title="Select Email or SMS at the bottom before typing">
              <div style={T.small}>Email and SMS are separate channels. Make sure you pick the right one — SMS has a character limit.</div>
            </Step>
            <Step n={4} title="Type your reply and click Send" />

            <Divider />
            <div style={{ ...T.label, marginBottom: '8px' }}>Sending a new message to a contact</div>
            <Step n={1} title="Go to Contacts → find the contact" />
            <Step n={2} title='Click "Send Message" on their contact record' />
            <Step n={3} title="Choose Email or SMS, write your message, send" />

            <InfoBox color="amber">
              <strong>⚠️ Always reply from the platform.</strong> Never reply from your personal Gmail or phone number for BridgeGrowth clients. It breaks the conversation history and automations cannot track it.
            </InfoBox>
          </>
        }
        right={
          <>
            <div style={{ ...T.label, marginBottom: '8px' }}>Sending email — important details</div>
            <Card>
              <TableRow label="From name" value="BridgeGrowth" />
              <TableRow label="From address" value="hello@bridgegrowth.co.za" />
              <TableRow label="Reply-to" value="hello@bridgegrowth.co.za" />
              <TableRow label="SMS From" value="Your Twilio number" />
              <div style={{ ...T.small, marginTop: '8px', color: C.amber }}>⚠️ Do not change these settings. Changing the from address breaks deliverability.</div>
            </Card>

            <div style={{ ...T.label, marginBottom: '8px', marginTop: '10px' }}>Filtering your inbox</div>
            <Card>
              {[
                ['All', 'Every conversation'],
                ['Unread', 'Messages you haven\'t opened yet'],
                ['Mine', 'Assigned specifically to you'],
                ['Starred', 'Conversations you\'ve marked as important'],
              ].map(([label, desc]) => (
                <div key={label as string} style={{ display: 'flex', gap: '10px', padding: '6px 0', borderBottom: `1px solid ${C.divider}` }}>
                  <Pill text={label as string} color="purple" />
                  <div style={T.body}>{desc as string}</div>
                </div>
              ))}
            </Card>

            <div style={{ ...T.label, marginBottom: '8px', marginTop: '10px' }}>Automated messages you&apos;ll see</div>
            <Card>
              <div style={T.body}>These messages were sent automatically by a workflow. You do not need to manually send them — they are already sent:</div>
              <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {['Welcome email to new enquiries', 'Contract delivery email', 'Payment due reminders', 'Follow-up after no reply (48h)'].map(m => (
                  <div key={m} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <div style={{ ...T.small, color: C.purple }}>⚡</div>
                    <div style={T.body}>{m}</div>
                  </div>
                ))}
              </div>
            </Card>

            <InfoBox color="green">
              <strong>💡 Tip:</strong> Use the star (⭐) to mark conversations that need a follow-up. Review your starred inbox at the start of each day.
            </InfoBox>
          </>
        }
      />

      <FooterBar page={5} total={TOTAL_PAGES} />
    </PageWrapper>
  )
}

/* ═══════════════════════════════════════════════════════════════
   PAGE 6 — Module 04: Calendar & Module 05: Forms
═══════════════════════════════════════════════════════════════ */
function CalendarFormsPage() {
  return (
    <PageWrapper style={{ position: 'relative' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

        {/* Calendar */}
        <div>
          <SectionHeader number="04" title="Calendar" subtitle="Appointments and bookings" />

          <Card title="Your calendar types" accent={C.purpleBdr}>
            {[
              ['Discovery Call', '30 min — for new enquiries to book a call with you'],
              ['Consultation', '60 min — for detailed service discussions'],
              ['Internal', 'For your own time-blocking and scheduling'],
            ].map(([name, desc]) => (
              <div key={name as string} style={{ padding: '8px 0', borderBottom: `1px solid ${C.divider}` }}>
                <div style={{ ...T.body, fontWeight: 600, color: C.white }}>{name as string}</div>
                <div style={T.small}>{desc as string}</div>
              </div>
            ))}
          </Card>

          <div style={{ ...T.label, marginBottom: '8px' }}>Viewing and managing bookings</div>
          <Step n={1} title="Go to Calendars in the left menu" />
          <Step n={2} title="Switch between Day / Week / Month view" />
          <Step n={3} title="Click any appointment to see contact details, reschedule, or cancel" />

          <Divider />

          <div style={{ ...T.label, marginBottom: '8px' }}>Sharing your booking link</div>
          <Step n={1} title='Go to Calendars → "Calendar Links" tab' />
          <Step n={2} title="Copy the link for the relevant calendar type" />
          <Step n={3} title="Share it via email, WhatsApp, or your email signature" />

          <InfoBox color="green">
            <strong>💡</strong> When you send a booking link, the system automatically confirms the appointment and sends a reminder to the client — no manual follow-up needed.
          </InfoBox>

          <InfoBox color="amber">
            <strong>⚠️ Availability:</strong> Set your available hours in Calendars → Settings → Availability. Keep this updated or clients may book at times you are unavailable.
          </InfoBox>
        </div>

        {/* Forms */}
        <div>
          <SectionHeader number="05" title="Forms & Lead Capture" subtitle="Where enquiries and submissions come in" />

          <Card title="Your forms" accent={C.purpleBdr}>
            {[
              ['Website Enquiry Form', 'General enquiries from bridgegrowth.co.za — goes to Prospect Pipeline automatically'],
              ['CIPC Application Form', 'Collects all info needed to register a company'],
              ['SARS Tax Compliance Form', 'Intake form for tax-related services'],
              ['Onboarding Questionnaire', 'Sent to new signed clients to gather all required details'],
            ].map(([name, desc]) => (
              <div key={name as string} style={{ padding: '8px 0', borderBottom: `1px solid ${C.divider}` }}>
                <div style={{ ...T.body, fontWeight: 600, color: C.white }}>{name as string}</div>
                <div style={T.small}>{desc as string}</div>
              </div>
            ))}
          </Card>

          <div style={{ ...T.label, marginBottom: '8px', marginTop: '4px' }}>Finding form submissions</div>
          <Step n={1} title="Go to Marketing → Forms in the left menu" />
          <Step n={2} title="Click the form name to see all submissions" />
          <Step n={3} title="Each submission also creates or updates a contact record automatically" />

          <InfoBox color="amber">
            <strong>⚠️ You do not need to manually check forms daily.</strong> When someone submits a form, a workflow sends them a confirmation email and adds them to the correct pipeline automatically. You&apos;ll see new contacts appear in your Prospect Pipeline.
          </InfoBox>

          <div style={{ ...T.label, marginBottom: '8px', marginTop: '10px' }}>Linking a submission to the right contact</div>
          <div style={{ ...T.body }}>If a submission creates a duplicate contact, go to the duplicate → click the three dots (⋮) → &quot;Merge Contact&quot; → select the original contact to keep.</div>
        </div>
      </div>

      <FooterBar page={6} total={TOTAL_PAGES} />
    </PageWrapper>
  )
}

/* ═══════════════════════════════════════════════════════════════
   PAGE 7 — Module 06: Workflows & Automation
═══════════════════════════════════════════════════════════════ */
function WorkflowsPage() {
  const workflows = [
    { name: 'New Enquiry — Welcome Email', trigger: 'Website form submitted', action: 'Sends welcome email, adds to Prospect Pipeline', touch: false },
    { name: 'New Lead — Internal Notification', trigger: 'Contact added to Prospect Pipeline', action: 'Sends Slack/email alert to Ranji', touch: false },
    { name: 'No Reply Follow-Up', trigger: '48h after first contact — no reply', action: 'Sends a follow-up SMS or email automatically', touch: false },
    { name: 'Proposal Sent — Reminder', trigger: 'Contact moved to Proposal Sent stage', action: 'Sends follow-up after 3 days if no contract signed', touch: false },
    { name: 'Contract Signed — Welcome Sequence', trigger: 'Document signed by client', action: 'Sends welcome + onboarding form + adds to Active Clients', touch: false },
    { name: 'Onboarding Form Received', trigger: 'Onboarding questionnaire submitted', action: 'Notifies Ranji with a task to review and begin service delivery', touch: false },
    { name: 'Invoice Sent — Payment Reminder', trigger: 'Invoice created', action: 'Sends payment reminder at 3 days and 7 days if unpaid', touch: false },
    { name: 'Payment Received', trigger: 'Invoice marked paid', action: 'Sends payment confirmation email to client', touch: false },
    { name: 'Monthly Retainer Renewal', trigger: '28th of each month', action: 'Sends invoice for next month\'s retainer automatically', touch: false },
    { name: 'Review Request', trigger: '30 days after Closed Won', action: 'Sends a Google Review request to the client', touch: false },
    { name: 'Client Reactivation', trigger: 'Contact inactive for 90 days', action: 'Sends a check-in message to re-engage', touch: false },
  ]

  return (
    <PageWrapper style={{ position: 'relative' }}>
      <SectionHeader number="06" title="Workflows & Automation" subtitle="What happens automatically — and what you still need to do manually" />

      <InfoBox color="red">
        <strong>🚫 Do NOT modify, pause, or delete any of the workflows below.</strong> They were built and tested by Qaneri Creative. Changes will break your automations and you may stop receiving leads or clients may not receive their documents.
      </InfoBox>

      <div style={{ ...T.label, marginBottom: '8px' }}>Your 11 automated workflows</div>
      <div style={{ background: C.bgBox, borderRadius: '10px', overflow: 'hidden', border: `1px solid ${C.divider}` }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.4fr 1.8fr', padding: '8px 12px', background: 'rgba(132,75,254,0.1)', borderBottom: `1px solid ${C.divider}` }}>
          <div style={T.label}>Workflow Name</div>
          <div style={T.label}>Trigger</div>
          <div style={T.label}>What It Does</div>
        </div>
        {workflows.map(({ name, trigger, action }) => (
          <div key={name} style={{ display: 'grid', gridTemplateColumns: '2fr 1.4fr 1.8fr', padding: '8px 12px', borderBottom: `1px solid ${C.divider}` }}>
            <div style={{ ...T.body, fontWeight: 600, color: C.white, display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
              <span style={{ color: C.purple, fontSize: '0.7rem', marginTop: '3px' }}>⚡</span>{name}
            </div>
            <div style={T.body}>{trigger}</div>
            <div style={T.body}>{action}</div>
          </div>
        ))}
      </div>

      <TwoCol
        ratio="1fr 1fr"
        left={
          <div style={{ marginTop: '14px' }}>
            <div style={{ ...T.label, marginBottom: '8px' }}>What you still do manually 👤</div>
            {[
              'Send contracts to clients (from Documents & Contracts → template → use template)',
              'Sign the contract after the client signs (check your email for the signing notification)',
              'Move contacts between pipeline stages as work progresses',
              'Create one-off invoices for ad-hoc services',
              'Add notes to contact records after calls or meetings',
              'Tag contacts when their service type changes',
            ].map(item => (
              <div key={item} style={{ display: 'flex', gap: '8px', marginBottom: '7px', alignItems: 'flex-start' }}>
                <div style={{ color: C.amber, fontSize: '0.75rem', marginTop: '3px', flexShrink: 0 }}>👤</div>
                <div style={T.body}>{item}</div>
              </div>
            ))}
          </div>
        }
        right={
          <div style={{ marginTop: '14px' }}>
            <InfoBox color="green">
              <strong>💡 Remember:</strong> Automations only fire when the correct trigger happens. For example, the &quot;Contract Signed&quot; workflow only runs when the client actually signs digitally through the platform. If you collect a manual signature, you must manually move the contact and send the onboarding form.
            </InfoBox>
            <InfoBox color="purple">
              <strong>💡 Checking automations:</strong> You can see what a workflow sent by going to Contacts → the contact record → scroll to &quot;Activity&quot;. It shows every automated email, SMS, and task that the system ran for that contact.
            </InfoBox>
          </div>
        }
      />

      <FooterBar page={7} total={TOTAL_PAGES} />
    </PageWrapper>
  )
}

/* ═══════════════════════════════════════════════════════════════
   PAGE 8 — Module 07: Documents & Contracts
═══════════════════════════════════════════════════════════════ */
function DocumentsPage() {
  return (
    <PageWrapper style={{ position: 'relative' }}>
      <SectionHeader number="07" title="Documents & Contracts" subtitle="How to send the BridgeGrowth Client Service Agreement to a new client" />

      <TwoCol
        ratio="1fr 1fr"
        left={
          <>
            <div style={{ ...T.label, marginBottom: '8px' }}>Your contract templates</div>
            <Card accent={C.purpleBdr}>
              {[
                { name: 'BridgeGrowth — Client Service Agreement (Starter)', note: 'Once-off payment. For the Starter package only.', color: 'green' as const },
                { name: 'BridgeGrowth — Client Service Agreement (Monthly)', note: 'Recurring monthly payment. For Growth and Operations packages.', color: 'purple' as const },
              ].map(({ name, note, color }) => (
                <div key={name} style={{ padding: '10px 0', borderBottom: `1px solid ${C.divider}` }}>
                  <div style={{ ...T.body, fontWeight: 600, color: C.white }}>{name}</div>
                  <div style={{ ...T.small, marginTop: '3px' }}>{note}</div>
                  <Pill text={color === 'green' ? 'Once-off' : 'Monthly Recurring'} color={color} />
                </div>
              ))}
            </Card>

            <div style={{ ...T.label, marginBottom: '8px', marginTop: '4px' }}>Step-by-step: Sending a contract 👤</div>
            <Step n={1} title='Go to Documents & Contracts in the left menu' />
            <Step n={2} title='Click "Templates" to see all your templates' />
            <Step n={3} title='Right-click (or click the ⋮ menu) on the correct template → "Use Template"'>
              <div style={T.small}>Use Starter template for Starter package. Use Monthly template for Growth or Operations.</div>
            </Step>
            <Step n={4} title='Fill in the recipient details: Client full name, email address' />
            <Step n={5} title='Set signing order: YOU sign first (Ranji), then the client'>
              <div style={T.small}>⚠️ This is important — GHL requires the sender to set signing order. You cannot pre-sign before sending.</div>
            </Step>
            <Step n={6} title='Fill in the document fields: package selected, services, amounts' />
            <Step n={7} title='Click "Send Document" (not "Share Link")'>
              <div style={T.small}>Send Document sends a branded BridgeGrowth email. The link is unique to that client.</div>
            </Step>
            <Step n={8} title='You receive the document in your email — sign it first' />
            <Step n={9} title='The system then sends it to the client for their signature' />
            <Step n={10} title='Both parties receive the completed copy once both have signed ⚡' />
          </>
        }
        right={
          <>
            <InfoBox color="amber">
              <strong>⚠️ Fill in ALL the grey boxes</strong> before sending. These are the client-specific fields (name, business name, ID number, package selected, service details). Blank boxes look unprofessional and may affect the contract&apos;s legal standing.
            </InfoBox>

            <Card title="What the client receives" accent={C.purpleBdr}>
              <div style={T.body}>The client gets a branded BridgeGrowth email with a &quot;View &amp; Sign Document&quot; button. They click it, complete their details in the form fields, and sign digitally.</div>
            </Card>

            <Card title="After signing">
              {[
                { icon: '⚡', text: 'Both parties get a completed PDF copy via email' },
                { icon: '⚡', text: 'The contract is stored in Documents & Contracts → Signed' },
                { icon: '⚡', text: 'The "Contract Signed" workflow fires — welcome email and onboarding form are sent automatically' },
                { icon: '👤', text: 'Move the contact to "Active Clients" pipeline manually' },
              ].map(({ icon, text }) => (
                <div key={text} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', marginBottom: '7px' }}>
                  <div style={{ ...T.small, color: icon === '⚡' ? C.purple : C.amber, flexShrink: 0 }}>{icon}</div>
                  <div style={T.body}>{text}</div>
                </div>
              ))}
            </Card>

            <Card title="Where to find sent contracts">
              <div style={T.body}>Documents &amp; Contracts → switch from &quot;Templates&quot; to &quot;Documents&quot; tab. Filter by status: Sent, Viewed, Signed, or Completed.</div>
            </Card>

            <InfoBox color="red">
              <strong>🚫 Never edit the template itself</strong> unless Qaneri asks you to. Editing the master template changes it for all future contracts.
            </InfoBox>
          </>
        }
      />

      <FooterBar page={8} total={TOTAL_PAGES} />
    </PageWrapper>
  )
}

/* ═══════════════════════════════════════════════════════════════
   PAGE 9 — Module 08: Payments & Invoicing
═══════════════════════════════════════════════════════════════ */
function PaymentsPage() {
  return (
    <PageWrapper style={{ position: 'relative' }}>
      <SectionHeader number="08" title="Payments & Invoicing" subtitle="Creating invoices, sending payment requests, and tracking what&apos;s been paid" />

      <TwoCol
        ratio="1fr 1fr"
        left={
          <>
            <div style={{ ...T.label, marginBottom: '8px' }}>Creating a new invoice 👤</div>
            <Step n={1} title='Go to Payments in the left menu → "Invoices" tab' />
            <Step n={2} title='Click "New Invoice" (top right)' />
            <Step n={3} title="Select the client contact from the dropdown">
              <div style={T.small}>Start typing their name — it searches your contact database.</div>
            </Step>
            <Step n={4} title="Add line items: service name, description, quantity, price">
              <div style={T.small}>Use the BridgeGrowth pricing for your packages. Be specific in the description.</div>
            </Step>
            <Step n={5} title="Set the due date and any notes" />
            <Step n={6} title='Click "Send Invoice" — the client receives a payment link by email' />

            <Divider />

            <div style={{ ...T.label, marginBottom: '8px' }}>Package pricing reference</div>
            <Card>
              {[
                { pkg: 'Starter Package', price: 'R 1,500 (once-off)', note: 'CIPC registration + basic setup' },
                { pkg: 'Growth Package', price: 'R 2,500 / month', note: 'Admin retainer + SARS compliance' },
                { pkg: 'Operations Package', price: 'R 4,500 / month', note: 'Full admin + debtors management' },
              ].map(({ pkg, price, note }) => (
                <div key={pkg} style={{ padding: '8px 0', borderBottom: `1px solid ${C.divider}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ ...T.body, fontWeight: 600, color: C.white }}>{pkg}</div>
                    <div style={{ ...T.body, color: C.purple, fontWeight: 600 }}>{price}</div>
                  </div>
                  <div style={T.small}>{note}</div>
                </div>
              ))}
              <div style={{ ...T.small, marginTop: '8px', color: C.amber }}>All prices excl. VAT. Add 15% if the client is VAT registered.</div>
            </Card>
          </>
        }
        right={
          <>
            <Card title="Automated vs manual payments" accent={C.purpleBdr}>
              {[
                { type: 'Monthly retainer invoice', auto: true, note: 'Fires on the 28th of each month automatically' },
                { type: 'Once-off service invoice', auto: false, note: 'Create manually per the steps on the left' },
                { type: 'Ad-hoc / extra charges', auto: false, note: 'Create manually — describe the extra service clearly' },
                { type: 'Payment reminder (3 days)', auto: true, note: 'Sent automatically if invoice unpaid' },
                { type: 'Payment reminder (7 days)', auto: true, note: 'Second automated reminder' },
                { type: 'Payment confirmation', auto: true, note: 'Sent to client as soon as payment is received' },
              ].map(({ type, auto, note }) => (
                <div key={type} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '7px 0', borderBottom: `1px solid ${C.divider}` }}>
                  <div style={{ ...T.small, color: auto ? C.purple : C.amber, flexShrink: 0, marginTop: '2px' }}>{auto ? '⚡' : '👤'}</div>
                  <div>
                    <div style={{ ...T.body, color: C.white, fontWeight: 600 }}>{type}</div>
                    <div style={T.small}>{note}</div>
                  </div>
                </div>
              ))}
            </Card>

            <div style={{ ...T.label, marginBottom: '8px', marginTop: '10px' }}>Tracking payment status</div>
            <Card>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {[
                  ['Draft', 'Created but not sent yet', 'white'],
                  ['Sent', 'Emailed to client', 'purple'],
                  ['Viewed', 'Client opened the invoice', 'amber'],
                  ['Paid', 'Payment received', 'green'],
                  ['Overdue', 'Past due date, unpaid', 'red'],
                ].map(([status, desc, color]) => (
                  <div key={status as string} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <Pill text={status as string} color={color as 'white' | 'purple' | 'amber' | 'green' | 'red'} />
                    <div style={T.body}>{desc as string}</div>
                  </div>
                ))}
              </div>
            </Card>

            <InfoBox color="purple">
              <strong>💡 Mark as paid manually</strong> if a client pays via EFT directly. Go to the invoice → click &quot;Record Payment&quot; → enter the amount and date. This triggers the payment confirmation email automatically.
            </InfoBox>
          </>
        }
      />

      <FooterBar page={9} total={TOTAL_PAGES} />
    </PageWrapper>
  )
}

/* ═══════════════════════════════════════════════════════════════
   PAGE 10 — Module 09: Quick Reference
═══════════════════════════════════════════════════════════════ */
function QuickReferencePage() {
  const tasks = [
    { task: 'Add a new enquiry/contact', steps: 'Contacts → + Add Contact → fill details → Save', auto: false },
    { task: 'Move a contact to next stage', steps: 'Contacts → open record → Opportunities panel → drag or edit stage', auto: false },
    { task: 'Reply to a client email', steps: 'Conversations → find thread → select Email → type → Send', auto: false },
    { task: 'Send a contract', steps: 'Documents & Contracts → Templates → right-click → Use Template → fill → Send Document', auto: false },
    { task: 'Sign a sent contract (your turn)', steps: 'Check your email for signing notification → click link → sign', auto: false },
    { task: 'View signed contracts', steps: 'Documents & Contracts → Documents tab → filter: Completed', auto: false },
    { task: 'Create a one-off invoice', steps: 'Payments → Invoices → New Invoice → add client + line items → Send Invoice', auto: false },
    { task: 'Mark EFT payment as received', steps: 'Payments → Invoices → find invoice → Record Payment', auto: false },
    { task: 'Share booking link with client', steps: 'Calendars → Calendar Links tab → copy link → send via email/WhatsApp', auto: false },
    { task: 'Find form submissions', steps: 'Marketing → Forms → click form name → Submissions tab', auto: false },
    { task: 'Merge duplicate contacts', steps: 'Contacts → open duplicate → ⋮ menu → Merge Contact → select original', auto: false },
    { task: 'View what automation sent to a contact', steps: 'Contacts → open record → scroll to Activity tab', auto: false },
    { task: 'New enquiry welcome email', steps: 'Automatic — fires when website form is submitted', auto: true },
    { task: 'Contract delivery to client after signing', steps: 'Automatic — fires after both parties sign', auto: true },
    { task: 'Monthly retainer invoice', steps: 'Automatic — fires on 28th of each month', auto: true },
    { task: 'Payment reminders', steps: 'Automatic — at 3 days and 7 days if unpaid', auto: true },
    { task: 'Post-contract welcome + onboarding form', steps: 'Automatic — fires when client signs contract', auto: true },
  ]

  return (
    <PageWrapper style={{ position: 'relative' }}>
      <SectionHeader number="09" title="Quick Reference" subtitle="Common tasks at a glance — ⚡ = automatic, 👤 = you do it" />

      <div style={{ background: C.bgBox, borderRadius: '10px', overflow: 'hidden', border: `1px solid ${C.divider}` }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 3fr auto', padding: '8px 12px', background: 'rgba(132,75,254,0.1)', borderBottom: `1px solid ${C.divider}` }}>
          <div style={T.label}>Task</div>
          <div style={T.label}>How to do it</div>
          <div style={T.label}>Type</div>
        </div>
        {tasks.map(({ task, steps, auto }) => (
          <div key={task} style={{ display: 'grid', gridTemplateColumns: '2fr 3fr auto', padding: '7px 12px', borderBottom: `1px solid ${C.divider}`, alignItems: 'center', background: auto ? 'rgba(132,75,254,0.03)' : 'transparent' }}>
            <div style={{ ...T.body, fontWeight: 600, color: auto ? C.whiteMid : C.white }}>{task}</div>
            <div style={T.body}>{steps}</div>
            <div style={{ textAlign: 'center', fontSize: '0.85rem' }}>{auto ? '⚡' : '👤'}</div>
          </div>
        ))}
      </div>

      <FooterBar page={10} total={TOTAL_PAGES} />
    </PageWrapper>
  )
}

/* ═══════════════════════════════════════════════════════════════
   PAGE 11 — Module 10: Do Not Touch
═══════════════════════════════════════════════════════════════ */
function DoNotTouchPage() {
  return (
    <PageWrapper style={{ position: 'relative' }}>
      <SectionHeader number="10" title="Do Not Touch" subtitle="These settings and features are configured by Qaneri Creative. Any changes can break your system." />

      <InfoBox color="red">
        <strong>🚫 If you ever accidentally change something on this list, stop immediately and contact Qaneri.</strong> Do not try to fix it yourself — it is almost always faster and safer for us to restore it than to troubleshoot after further changes.
      </InfoBox>

      <TwoCol
        ratio="1fr 1fr"
        left={
          <>
            <div style={{ ...T.label, marginBottom: '8px' }}>Automation & Workflows</div>
            <Card accent="rgba(239,68,68,0.35)">
              <div style={{ ...T.body, color: C.whiteMid, marginBottom: '8px' }}>Do not open, edit, pause, or delete any workflow. Even &quot;viewing&quot; and accidentally saving can break them.</div>
              {[
                'All 11 automated workflows in Automation → Workflows',
                'Any workflow triggers or actions',
                'Workflow timing delays',
                'Email/SMS templates inside workflows',
              ].map(item => (
                <div key={item} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', marginBottom: '5px' }}>
                  <div style={{ color: C.red, flexShrink: 0 }}>🚫</div>
                  <div style={T.body}>{item}</div>
                </div>
              ))}
            </Card>

            <div style={{ ...T.label, marginBottom: '8px', marginTop: '10px' }}>Email & Sending Domain</div>
            <Card accent="rgba(239,68,68,0.35)">
              {[
                'Settings → Email Services → sending domain (bridgegrowth.co.za)',
                'SMTP or mailbox connection',
                'Reply-to or from-name settings',
                'Email signature HTML in Settings',
              ].map(item => (
                <div key={item} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', marginBottom: '5px' }}>
                  <div style={{ color: C.red, flexShrink: 0 }}>🚫</div>
                  <div style={T.body}>{item}</div>
                </div>
              ))}
            </Card>

            <div style={{ ...T.label, marginBottom: '8px', marginTop: '10px' }}>Contract Templates</div>
            <Card accent="rgba(239,68,68,0.35)">
              <div style={T.body}>You send contracts by using a template — never by editing the template itself. If contract terms need to change, tell Qaneri and we will update the master template.</div>
            </Card>
          </>
        }
        right={
          <>
            <div style={{ ...T.label, marginBottom: '8px' }}>Custom Values & Phone</div>
            <Card accent="rgba(239,68,68,0.35)">
              <div style={{ ...T.body, color: C.whiteMid, marginBottom: '8px' }}>Custom Values are global variables that appear throughout your automations, emails, and documents. Changing one value changes it everywhere.</div>
              {[
                'Settings → Custom Values (business name, phone, email, etc.)',
                'Twilio phone number connection',
                'SMS sender settings',
              ].map(item => (
                <div key={item} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', marginBottom: '5px' }}>
                  <div style={{ color: C.red, flexShrink: 0 }}>🚫</div>
                  <div style={T.body}>{item}</div>
                </div>
              ))}
            </Card>

            <div style={{ ...T.label, marginBottom: '8px', marginTop: '10px' }}>Website & Funnels</div>
            <Card accent="rgba(239,68,68,0.35)">
              {[
                'Your website is hosted separately (Framer) — do not touch Sites in this platform',
                'Any published landing pages or funnels',
                'Form embed codes on the website',
              ].map(item => (
                <div key={item} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', marginBottom: '5px' }}>
                  <div style={{ color: C.red, flexShrink: 0 }}>🚫</div>
                  <div style={T.body}>{item}</div>
                </div>
              ))}
            </Card>

            <div style={{ ...T.label, marginBottom: '8px', marginTop: '10px' }}>Integrations</div>
            <Card accent="rgba(239,68,68,0.35)">
              {[
                'Settings → Integrations (Google, Stripe, Twilio)',
                'API keys or webhook URLs',
                'Sub-account settings',
                'User permissions or roles (ask Qaneri to add new users)',
              ].map(item => (
                <div key={item} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', marginBottom: '5px' }}>
                  <div style={{ color: C.red, flexShrink: 0 }}>🚫</div>
                  <div style={T.body}>{item}</div>
                </div>
              ))}
            </Card>

            <InfoBox color="amber">
              <strong>⚠️ When in doubt, don&apos;t.</strong> If you are not sure whether something is safe to change, screenshot it and send it to Qaneri first. We would rather answer a quick question than fix a broken system.
            </InfoBox>
          </>
        }
      />

      <FooterBar page={11} total={TOTAL_PAGES} />
    </PageWrapper>
  )
}

/* ═══════════════════════════════════════════════════════════════
   PAGE 12 — Back cover / Contact & Support
═══════════════════════════════════════════════════════════════ */
function BackCoverPage() {
  return (
    <PageWrapper style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '297mm', padding: '0', pageBreakAfter: 'auto' as const }}>

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '14mm 18mm' }}>

        <div style={{ ...T.label, marginBottom: '12px' }}>Need help?</div>
        <div style={{ ...T.h2, marginBottom: '8px' }}>We&apos;re right here.</div>
        <div style={{ ...T.body, maxWidth: '420px', marginBottom: '32px' }}>
          If something is not working, you are not sure how to do something, or you think an automation is not firing correctly — reach out to Qaneri before trying to fix it yourself.
        </div>

        <div style={{ display: 'flex', gap: '16px', marginBottom: '40px' }}>
          {[
            { label: 'For platform issues', value: 'hello@qanericreative.com', note: 'Broken workflows, access issues, missing features' },
            { label: 'For urgent matters', value: 'WhatsApp Qaneri', note: 'If a client is waiting and something is broken' },
            { label: 'For training questions', value: 'Refer to this guide first', note: 'Then contact us if it doesn\'t answer your question' },
          ].map(({ label, value, note }) => (
            <div key={label} style={{ flex: 1, background: C.bgBox, border: `1px solid ${C.purpleBdr}`, borderRadius: '10px', padding: '16px' }}>
              <div style={{ ...T.label, marginBottom: '6px' }}>{label}</div>
              <div style={{ ...T.body, color: C.white, fontWeight: 700, marginBottom: '4px' }}>{value}</div>
              <div style={T.small}>{note}</div>
            </div>
          ))}
        </div>

        <div style={{ width: '60px', height: '3px', background: C.purple, borderRadius: '2px', marginBottom: '28px' }} />

        <div style={{ ...T.label, marginBottom: '12px' }}>What&apos;s coming next</div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {[
            'Twilio number (pending SA regulatory approval)',
            'Google Business Profile → review request automation',
            'Facebook & Instagram connection',
            'Client portal access',
          ].map(item => (
            <div key={item} style={{ background: C.purpleSoft, border: `1px solid ${C.purpleBdr}`, borderRadius: '6px', padding: '6px 12px' }}>
              <div style={{ ...T.small, color: C.purple }}>Upcoming: {item}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{ background: C.bgBox, borderTop: `1px solid ${C.divider}`, padding: '20px 18mm', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Image
            src="/images/SM - Logo - Flat Lay White.png"
            alt="Shoulder Monkey"
            width={160}
            height={36}
            style={{ height: '30px', width: 'auto', objectFit: 'contain', objectPosition: 'left', opacity: 0.7 }}
          />
          <div style={{ ...T.small, marginTop: '6px' }}>Powering BridgeGrowth on the Shoulder Monkey platform</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ ...T.small, color: C.purple }}>BridgeGrowth Platform Training Guide v1.0</div>
          <div style={T.small}>April 2026 · Confidential — BridgeGrowth internal use only</div>
        </div>
      </div>
    </PageWrapper>
  )
}

/* ═══════════════════════════════════════════════════════════════
   MAIN EXPORT
═══════════════════════════════════════════════════════════════ */
export default function TrainingPage() {
  return (
    <div style={{ background: '#000', fontFamily: 'var(--font-inter)' }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #000; }
        @media print {
          body { background: #000; }
          div[style*="pageBreakAfter"] { page-break-after: always; }
        }
      `}</style>
      <CoverPage />
      <HowToUsePage />
      <PlatformOverviewPage />
      <ContactsPipelinesPage />
      <ConversationsPage />
      <CalendarFormsPage />
      <WorkflowsPage />
      <DocumentsPage />
      <PaymentsPage />
      <QuickReferencePage />
      <DoNotTouchPage />
      <BackCoverPage />
    </div>
  )
}
