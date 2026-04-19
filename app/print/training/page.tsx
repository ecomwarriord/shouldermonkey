import type { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'BridgeGrowth — Platform Training Guide',
  robots: { index: false, follow: false },
}

/* ─── Colour tokens ──────────────────────────────────────────── */
const C = {
  bg:        '#ffffff',
  bgLight:   '#f7f6fb',
  bgCard:    '#f2f0fa',
  purple:    '#844bfe',
  purpleDark:'#5e2fd4',
  purpleSoft:'rgba(132,75,254,0.08)',
  purpleBdr: 'rgba(132,75,254,0.25)',
  ink:       '#0d0b1a',
  inkMid:    '#3d3a52',
  inkLight:  '#7a778f',
  divider:   '#e8e5f4',
  green:     '#16a34a',
  amber:     '#b45309',
  red:       '#dc2626',
  greenBg:   '#f0fdf4',
  greenBdr:  '#bbf7d0',
  amberBg:   '#fffbeb',
  amberBdr:  '#fde68a',
  redBg:     '#fef2f2',
  redBdr:    '#fecaca',
}

/* ─── Typography helpers ─────────────────────────────────────── */
const T = {
  label:  { fontFamily: 'var(--font-inter)', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: C.purple },
  h1:     { fontFamily: 'var(--font-jakarta)', fontSize: '2.6rem', fontWeight: 800, color: C.ink, lineHeight: 1.1 },
  h2:     { fontFamily: 'var(--font-jakarta)', fontSize: '1.4rem', fontWeight: 700, color: C.ink, lineHeight: 1.2 },
  h3:     { fontFamily: 'var(--font-jakarta)', fontSize: '1rem', fontWeight: 700, color: C.ink },
  h4:     { fontFamily: 'var(--font-jakarta)', fontSize: '0.8125rem', fontWeight: 700, color: C.purple },
  body:   { fontFamily: 'var(--font-inter)', fontSize: '0.78rem', color: C.inkMid, lineHeight: 1.75 },
  small:  { fontFamily: 'var(--font-inter)', fontSize: '0.7rem', color: C.inkLight, lineHeight: 1.6 },
  mono:   { fontFamily: 'monospace', fontSize: '0.75rem', color: C.purpleDark, background: C.purpleSoft, borderRadius: '4px', padding: '4px 8px', display: 'inline-block' },
}

/* ─── Layout constants ───────────────────────────────────────── */
const PAGE: React.CSSProperties = {
  width: '210mm',
  minHeight: '297mm',
  padding: '13mm 15mm',
  background: C.bg,
  boxSizing: 'border-box',
  pageBreakAfter: 'always',
  position: 'relative',
}

const TOTAL_PAGES = 12

/* ─── Reusable components ────────────────────────────────────── */

function PageWrapper({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div style={{ ...PAGE, ...style }}>{children}</div>
}

function SectionHeader({ number, title, subtitle }: { number: string; title: string; subtitle?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '18px', paddingBottom: '14px', borderBottom: `2px solid ${C.divider}` }}>
      <div style={{
        width: '36px', height: '36px', borderRadius: '8px', flexShrink: 0,
        background: C.purple,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-jakarta)', fontSize: '0.85rem', fontWeight: 800, color: '#fff',
      }}>
        {number}
      </div>
      <div>
        <div style={T.h2}>{title}</div>
        {subtitle && <div style={{ ...T.small, marginTop: '2px' }}>{subtitle}</div>}
      </div>
    </div>
  )
}

function Divider() {
  return <div style={{ borderTop: `1px solid ${C.divider}`, margin: '14px 0' }} />
}

function InfoBox({ children, color = 'purple' }: { children: React.ReactNode; color?: 'purple' | 'green' | 'amber' | 'red' }) {
  const styles = {
    purple: { bg: C.purpleSoft, bdr: C.purpleBdr, text: C.purpleDark },
    green:  { bg: C.greenBg,   bdr: C.greenBdr,  text: C.green },
    amber:  { bg: C.amberBg,   bdr: C.amberBdr,  text: C.amber },
    red:    { bg: C.redBg,     bdr: C.redBdr,    text: C.red },
  }
  const s = styles[color]
  return (
    <div style={{ background: s.bg, border: `1px solid ${s.bdr}`, borderRadius: '7px', padding: '9px 12px', marginBottom: '9px' }}>
      <div style={{ ...T.body, color: s.text }}>{children}</div>
    </div>
  )
}

function Step({ n, title, children }: { n: number; title: string; children?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: '10px', marginBottom: '9px', alignItems: 'flex-start' }}>
      <div style={{
        width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0, marginTop: '1px',
        background: C.purple, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-jakarta)', fontSize: '0.65rem', fontWeight: 700, color: '#fff',
      }}>{n}</div>
      <div>
        <div style={{ ...T.body, fontWeight: 600, color: C.ink }}>{title}</div>
        {children && <div style={{ ...T.body, marginTop: '2px' }}>{children}</div>}
      </div>
    </div>
  )
}

function Pill({ text, color = 'purple' }: { text: string; color?: 'purple' | 'green' | 'amber' | 'red' | 'neutral' }) {
  const styles = {
    purple:  { bg: C.purpleSoft,  text: C.purpleDark },
    green:   { bg: C.greenBg,     text: C.green },
    amber:   { bg: C.amberBg,     text: C.amber },
    red:     { bg: C.redBg,       text: C.red },
    neutral: { bg: C.bgLight,     text: C.inkLight },
  }
  const s = styles[color]
  return (
    <span style={{ ...T.label, background: s.bg, color: s.text, borderRadius: '4px', padding: '2px 6px', display: 'inline-block', marginRight: '3px', marginBottom: '3px' }}>
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

function Card({ title, children, accent, noPad }: { title?: string; children: React.ReactNode; accent?: string; noPad?: boolean }) {
  return (
    <div style={{ background: C.bgLight, border: `1px solid ${accent ?? C.divider}`, borderRadius: '8px', padding: noPad ? '0' : '11px 13px', marginBottom: '9px', overflow: 'hidden' }}>
      {title && <div style={{ ...T.h4, marginBottom: '8px' }}>{title}</div>}
      {children}
    </div>
  )
}

function TableRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: last ? 'none' : `1px solid ${C.divider}` }}>
      <div style={T.body}>{label}</div>
      <div style={{ ...T.body, fontWeight: 600, color: C.ink }}>{value}</div>
    </div>
  )
}

function FooterBar({ page, total }: { page: number; total: number }) {
  return (
    <div style={{ position: 'absolute', bottom: '9mm', left: '15mm', right: '15mm', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: `1px solid ${C.divider}`, paddingTop: '6px' }}>
      <div style={{ ...T.small, color: C.inkLight }}>BridgeGrowth Platform Training Guide · Confidential</div>
      <div style={{ ...T.small, color: C.purple, fontWeight: 600 }}>{page} / {total}</div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   PAGE 1 — COVER
═══════════════════════════════════════════════════════════════ */
function CoverPage() {
  return (
    <PageWrapper style={{ padding: 0, display: 'flex', flexDirection: 'column' }}>

      {/* Purple header band */}
      <div style={{ background: C.purple, padding: '16mm 15mm 12mm', flex: 'none' }}>
        <Image
          src="/images/SM - Logo - Flat Lay White.png"
          alt="Shoulder Monkey"
          width={200} height={46}
          style={{ height: '38px', width: 'auto', objectFit: 'contain', objectPosition: 'left', marginBottom: '32px' }}
        />
        <div style={{ fontSize: '0.65rem', fontFamily: 'var(--font-inter)', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', marginBottom: '10px' }}>
          Client Training Guide · BridgeGrowth
        </div>
        <div style={{ fontFamily: 'var(--font-jakarta)', fontSize: '2.8rem', fontWeight: 800, color: '#fff', lineHeight: 1.1, marginBottom: '14px' }}>
          Platform<br />Training<br />Guide
        </div>
        <div style={{ fontFamily: 'var(--font-inter)', fontSize: '0.875rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.7, maxWidth: '400px' }}>
          Everything you need to run your BridgeGrowth business on the Shoulder Monkey platform — from day-to-day tasks to the things you should never touch.
        </div>
      </div>

      {/* White body */}
      <div style={{ flex: 1, padding: '12mm 15mm' }}>

        {/* Meta row */}
        <div style={{ display: 'flex', gap: '32px', marginBottom: '24px' }}>
          {[
            { label: 'Prepared for', value: 'BridgeGrowth', sub: 'hello@bridgegrowth.co.za' },
            { label: 'Supported by', value: 'Shoulder Monkey', sub: 'info@shouldermonkey.co' },
            { label: 'Date', value: 'April 2026', sub: 'Version 1.0' },
          ].map(({ label, value, sub }) => (
            <div key={label}>
              <div style={T.label}>{label}</div>
              <div style={{ ...T.h3, marginTop: '4px' }}>{value}</div>
              <div style={{ ...T.small, marginTop: '2px' }}>{sub}</div>
            </div>
          ))}
        </div>

        <Divider />

        {/* Module index */}
        <div style={{ ...T.label, marginBottom: '10px' }}>Contents</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
          {[
            ['01', 'Platform Overview'],
            ['02', 'Contacts & Pipelines'],
            ['03', 'Conversations'],
            ['04', 'Calendar'],
            ['05', 'Forms & Lead Capture'],
            ['06', 'Workflows & Automation'],
            ['07', 'Documents & Contracts'],
            ['08', 'Payments & Invoicing'],
            ['09', 'Quick Reference'],
            ['10', 'Do Not Touch'],
          ].map(([num, title]) => (
            <div key={num} style={{ display: 'flex', gap: '10px', alignItems: 'center', padding: '6px 10px', background: C.bgLight, borderRadius: '6px', border: `1px solid ${C.divider}` }}>
              <span style={{ fontFamily: 'var(--font-jakarta)', fontSize: '0.7rem', fontWeight: 800, color: C.purple, width: '18px', flexShrink: 0 }}>{num}</span>
              <span style={{ ...T.body, color: C.ink, fontWeight: 500 }}>{title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom strip */}
      <div style={{ background: C.bgLight, borderTop: `1px solid ${C.divider}`, padding: '8px 15mm', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={T.small}>For internal use only · Not for distribution</div>
        <div style={{ ...T.small, color: C.purple }}>shouldermonkey.co</div>
      </div>
    </PageWrapper>
  )
}

/* ═══════════════════════════════════════════════════════════════
   PAGE 2 — How to Use This Guide
═══════════════════════════════════════════════════════════════ */
function HowToUsePage() {
  return (
    <PageWrapper>
      <div style={{ ...T.label, marginBottom: '4px' }}>Before You Begin</div>
      <div style={{ ...T.h2, marginBottom: '4px' }}>How to Use This Guide</div>
      <div style={{ ...T.small, marginBottom: '16px' }}>Read this page first — it will save you a lot of confusion later.</div>
      <Divider />

      <TwoCol
        ratio="1fr 1fr"
        left={<>
          <Card title="What this guide covers">
            <div style={T.body}>This guide is specific to the BridgeGrowth account on Shoulder Monkey. Steps and screenshots may differ from generic online tutorials — always follow this guide first.</div>
          </Card>
          <Card title="Platform access">
            <div style={{ ...T.body, marginBottom: '6px' }}>Log in from any browser at:</div>
            <div style={T.mono}>app.shouldermonkey.co</div>
            <div style={{ ...T.small, marginTop: '6px' }}>Bookmark this. Log in with the credentials Shoulder Monkey shared with you.</div>
          </Card>
          <Card title="Mobile app">
            <div style={T.body}>Download <strong>LeadConnector</strong> (iOS or Android) for on-the-go access to conversations, contacts, and notifications. Same login credentials.</div>
          </Card>
          <Card title="Quick support contacts">
            <TableRow label="Platform issues" value="info@shouldermonkey.co" />
            <TableRow label="Platform URL" value="app.shouldermonkey.co" />
            <TableRow label="Mobile app" value="LeadConnector" last />
          </Card>
        </>}
        right={<>
          <Card title="Icons used in this guide" accent={C.purpleBdr}>
            {[
              ['⚡', 'Automated', 'The system does this — no action needed from you.'],
              ['👤', 'Manual', 'You need to do this step yourself.'],
              ['⚠️', 'Important', 'Pay attention — mistakes here affect clients.'],
              ['🚫', 'Do Not Touch', 'Configured by Shoulder Monkey. Do not modify.'],
              ['💡', 'Tip', 'A helpful shortcut or best practice.'],
            ].map(([icon, label, desc]) => (
              <div key={label as string} style={{ display: 'flex', gap: '9px', marginBottom: '9px', alignItems: 'flex-start' }}>
                <div style={{ fontSize: '0.95rem', flexShrink: 0 }}>{icon}</div>
                <div>
                  <div style={{ ...T.body, fontWeight: 600, color: C.ink }}>{label as string}</div>
                  <div style={T.small}>{desc as string}</div>
                </div>
              </div>
            ))}
          </Card>
          <InfoBox color="amber">
            <strong>Before you start:</strong> Never share your login credentials. Each person needs their own user account. Contact Shoulder Monkey to add more users.
          </InfoBox>
          <InfoBox color="purple">
            <strong>💡 Tip:</strong> The search bar (top right of the platform) is the fastest way to find any contact. Just type a name, phone number, or email.
          </InfoBox>
        </>}
      />
      <FooterBar page={2} total={TOTAL_PAGES} />
    </PageWrapper>
  )
}

/* ═══════════════════════════════════════════════════════════════
   PAGE 3 — Module 01: Platform Overview
═══════════════════════════════════════════════════════════════ */
function PlatformOverviewPage() {
  return (
    <PageWrapper>
      <SectionHeader number="01" title="Platform Overview" subtitle="What the platform is and how to navigate it" />
      <TwoCol
        ratio="1.1fr 0.9fr"
        left={<>
          <div style={{ ...T.label, marginBottom: '7px' }}>Left-hand navigation — what each section does</div>
          {[
            ['💬', 'Conversations', 'All your email and SMS messages in one unified inbox'],
            ['👥', 'Contacts', 'Your full client database — everyone who has ever enquired or signed up'],
            ['📊', 'Pipelines', 'Track where each prospect or client is in the sales/service process'],
            ['📅', 'Calendars', 'Appointment scheduling and booking management'],
            ['⚡', 'Automation', 'Workflows — the engine that runs in the background (do not touch)'],
            ['📄', 'Documents', 'Service agreements and contracts'],
            ['💳', 'Payments', 'Invoices, payment links, and payment tracking'],
            ['📋', 'Forms', 'Lead capture forms — enquiry submissions land here'],
            ['📣', 'Marketing', 'Email campaigns and broadcasts'],
            ['⚙️', 'Settings', 'Account configuration — ask Shoulder Monkey before changing anything here'],
          ].map(([icon, name, desc]) => (
            <div key={name as string} style={{ display: 'flex', gap: '9px', alignItems: 'flex-start', padding: '6px 0', borderBottom: `1px solid ${C.divider}` }}>
              <div style={{ fontSize: '0.85rem', flexShrink: 0, marginTop: '1px' }}>{icon}</div>
              <div><span style={{ ...T.body, fontWeight: 600, color: C.ink }}>{name as string}: </span><span style={T.body}>{desc as string}</span></div>
            </div>
          ))}
        </>}
        right={<>
          <Card title="Your dashboard" accent={C.purpleBdr}>
            <div style={{ ...T.body, marginBottom: '7px' }}>When you log in you land on the Dashboard. It shows a real-time snapshot of:</div>
            {['Leads in each pipeline stage', 'Conversations waiting for reply', "Today's appointments", 'Recent contact activity'].map(i => (
              <div key={i} style={{ display: 'flex', gap: '7px', alignItems: 'center', marginBottom: '5px' }}>
                <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: C.purple, flexShrink: 0 }} />
                <div style={T.body}>{i}</div>
              </div>
            ))}
          </Card>
          <Card title="Top bar explained">
            {[
              ['🔔', 'Notifications', 'New leads, signed contracts, messages'],
              ['👤', 'User menu', 'Your profile and logout button'],
              ['🏢', 'Sub-account', 'Should always say BridgeGrowth'],
              ['🔍', 'Search', 'Find any contact instantly'],
            ].map(([icon, label, desc]) => (
              <div key={label as string} style={{ display: 'flex', gap: '8px', marginBottom: '7px' }}>
                <div style={{ fontSize: '0.85rem' }}>{icon}</div>
                <div><span style={{ ...T.body, fontWeight: 600, color: C.ink }}>{label as string}: </span><span style={T.body}>{desc as string}</span></div>
              </div>
            ))}
          </Card>
          <InfoBox color="purple">
            <strong>💡</strong> If you ever see the wrong sub-account name at the top, click it and select BridgeGrowth before doing anything else.
          </InfoBox>
        </>}
      />
      <FooterBar page={3} total={TOTAL_PAGES} />
    </PageWrapper>
  )
}

/* ═══════════════════════════════════════════════════════════════
   PAGE 4 — Module 02: Contacts & Pipelines
═══════════════════════════════════════════════════════════════ */
function ContactsPipelinesPage() {
  return (
    <PageWrapper>
      <SectionHeader number="02" title="Contacts & Pipelines" subtitle="Managing your leads, prospects, and active clients" />
      <TwoCol
        ratio="1fr 1fr"
        left={<>
          <div style={{ ...T.label, marginBottom: '7px' }}>Adding a new contact 👤</div>
          <Step n={1} title="Go to Contacts in the left menu" />
          <Step n={2} title='Click the green "+ Add Contact" button (top right)' />
          <Step n={3} title="Fill in at minimum: First Name, Last Name, Email, Phone">
            <div style={T.small}>The more info you add, the better. Business name, ID number, and notes are especially useful for BridgeGrowth services.</div>
          </Step>
          <Step n={4} title="Add relevant Tags (e.g. CIPC, SARS, Debtors, New Enquiry)" />
          <Step n={5} title='Click "Save"' />
          <InfoBox color="amber">
            <strong>⚠️ Check for duplicates first.</strong> Search the contact's name or email before adding. Duplicates break automations.
          </InfoBox>
          <Divider />
          <div style={{ ...T.label, marginBottom: '7px' }}>Moving a contact through a pipeline 👤</div>
          <Step n={1} title="Open the contact record" />
          <Step n={2} title='Scroll to the "Opportunities" panel on the right' />
          <Step n={3} title="Click the stage name and select the new stage, or drag the card in the pipeline board view" />
        </>}
        right={<>
          <div style={{ ...T.label, marginBottom: '7px' }}>Your 3 pipelines</div>
          <Card title="🎯 Prospect Pipeline" accent={C.purpleBdr}>
            <div style={{ ...T.small, marginBottom: '7px' }}>New enquiries and leads from the website or direct contact.</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px' }}>
              {['New Lead', 'Contacted', 'Qualified', 'Proposal Sent', 'Closed Won', 'Closed Lost'].map((s, i, arr) => (
                <Pill key={s} text={s} color={i === arr.length - 2 ? 'green' : i === arr.length - 1 ? 'red' : 'purple'} />
              ))}
            </div>
          </Card>
          <Card title="✅ Active Clients Pipeline">
            <div style={{ ...T.small, marginBottom: '7px' }}>Signed clients currently receiving services.</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px' }}>
              {['Onboarding', 'Active', 'Review Due', 'Churned'].map(s => <Pill key={s} text={s} color="neutral" />)}
            </div>
          </Card>
          <Card title="🔧 Service Delivery Pipeline">
            <div style={{ ...T.small, marginBottom: '7px' }}>Track individual service tasks (CIPC, SARS, admin jobs).</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px' }}>
              {['Intake', 'In Progress', 'Awaiting Client', 'Complete'].map(s => <Pill key={s} text={s} color="neutral" />)}
            </div>
          </Card>
          <div style={{ ...T.label, marginBottom: '6px', marginTop: '4px' }}>Contact tags to use</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px' }}>
            {['CIPC', 'SARS', 'Admin Retainer', 'Debtors Mgmt', 'New Enquiry', 'Starter Plan', 'Growth Plan', 'Operations Plan'].map(t => <Pill key={t} text={t} color="neutral" />)}
          </div>
          <InfoBox color="green">
            <strong>💡 Best practice:</strong> Update the pipeline stage the moment something changes. This keeps your dashboard accurate and triggers the right automations.
          </InfoBox>
        </>}
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
    <PageWrapper>
      <SectionHeader number="03" title="Conversations" subtitle="Your unified inbox for email and SMS — all client messages in one place" />
      <TwoCol ratio="1fr 1fr"
        left={<>
          <Card title="What you'll see in your inbox" accent={C.purpleBdr}>
            <div style={T.body}>Every email and SMS to or from BridgeGrowth contacts appears here — including automated messages the system sent on your behalf. Reply to all of them from this screen.</div>
          </Card>
          <div style={{ ...T.label, marginBottom: '7px', marginTop: '4px' }}>Replying to a message 👤</div>
          <Step n={1} title="Click any conversation in the left list" />
          <Step n={2} title="The full message thread opens on the right" />
          <Step n={3} title="Select Email or SMS at the bottom before typing">
            <div style={T.small}>They are separate channels — make sure you pick the right one. SMS has a character limit.</div>
          </Step>
          <Step n={4} title="Type your reply and click Send" />
          <Divider />
          <div style={{ ...T.label, marginBottom: '7px' }}>Sending a new message to a contact 👤</div>
          <Step n={1} title="Go to Contacts → find the contact" />
          <Step n={2} title='Click "Send Message" on their record' />
          <Step n={3} title="Choose Email or SMS, write your message, send" />
          <InfoBox color="amber">
            <strong>⚠️ Always reply from the platform.</strong> Never reply from your personal Gmail or phone. It breaks the conversation history and automations cannot track it.
          </InfoBox>
        </>}
        right={<>
          <div style={{ ...T.label, marginBottom: '7px' }}>Your sending details</div>
          <Card>
            <TableRow label="From name" value="BridgeGrowth" />
            <TableRow label="From email" value="hello@bridgegrowth.co.za" />
            <TableRow label="Reply-to" value="hello@bridgegrowth.co.za" />
            <TableRow label="SMS from" value="Your Twilio number" last />
            <div style={{ ...T.small, marginTop: '7px', color: C.red }}>⚠️ Do not change these settings. Changing the from address breaks email delivery.</div>
          </Card>
          <div style={{ ...T.label, marginBottom: '7px', marginTop: '8px' }}>Inbox filters</div>
          <Card>
            {[['All', 'Every conversation'], ['Unread', "Messages you haven't opened"], ['Mine', 'Assigned to you specifically'], ['Starred', 'Conversations you marked important']].map(([l, d]) => (
              <div key={l as string} style={{ display: 'flex', gap: '8px', alignItems: 'center', padding: '5px 0', borderBottom: `1px solid ${C.divider}` }}>
                <Pill text={l as string} color="purple" /><div style={T.body}>{d as string}</div>
              </div>
            ))}
          </Card>
          <div style={{ ...T.label, marginBottom: '7px', marginTop: '8px' }}>Automated messages you'll see ⚡</div>
          <Card>
            <div style={T.body}>These were already sent automatically — you do not need to resend them:</div>
            <div style={{ marginTop: '7px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {['Welcome email to new enquiries', 'Contract delivery after signing', 'Payment due reminders', '48h follow-up after no reply'].map(m => (
                <div key={m} style={{ display: 'flex', gap: '7px', alignItems: 'center' }}>
                  <div style={{ color: C.purple, fontSize: '0.7rem' }}>⚡</div>
                  <div style={T.body}>{m}</div>
                </div>
              ))}
            </div>
          </Card>
          <InfoBox color="green">
            <strong>💡 Tip:</strong> Star (⭐) conversations that need follow-up. Review your starred inbox at the start of each day.
          </InfoBox>
        </>}
      />
      <FooterBar page={5} total={TOTAL_PAGES} />
    </PageWrapper>
  )
}

/* ═══════════════════════════════════════════════════════════════
   PAGE 6 — Module 04: Calendar + 05: Forms
═══════════════════════════════════════════════════════════════ */
function CalendarFormsPage() {
  return (
    <PageWrapper>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          <SectionHeader number="04" title="Calendar" subtitle="Appointments and bookings" />
          <Card title="Your calendar types" accent={C.purpleBdr}>
            {[['Discovery Call', '30 min — new enquiries book a call with you'], ['Consultation', '60 min — detailed service discussions'], ['Internal', 'Your own time-blocking']].map(([n, d]) => (
              <div key={n as string} style={{ padding: '7px 0', borderBottom: `1px solid ${C.divider}` }}>
                <div style={{ ...T.body, fontWeight: 600, color: C.ink }}>{n as string}</div>
                <div style={T.small}>{d as string}</div>
              </div>
            ))}
          </Card>
          <div style={{ ...T.label, marginBottom: '7px' }}>Viewing and managing bookings 👤</div>
          <Step n={1} title="Go to Calendars in the left menu" />
          <Step n={2} title="Switch between Day / Week / Month view" />
          <Step n={3} title="Click any appointment to see details, reschedule, or cancel" />
          <Divider />
          <div style={{ ...T.label, marginBottom: '7px' }}>Sharing your booking link 👤</div>
          <Step n={1} title='Go to Calendars → "Calendar Links" tab' />
          <Step n={2} title="Copy the link for the calendar type you want to share" />
          <Step n={3} title="Send it via email, WhatsApp, or your email signature" />
          <InfoBox color="green">
            <strong>💡</strong> When a client books, the system automatically confirms and sends a reminder. No manual follow-up needed.
          </InfoBox>
          <InfoBox color="amber">
            <strong>⚠️ Keep your availability up to date</strong> in Calendars → Settings → Availability, or clients may book at times you are unavailable.
          </InfoBox>
        </div>
        <div>
          <SectionHeader number="05" title="Forms & Lead Capture" subtitle="Where enquiries and submissions come in" />
          <Card title="Your forms" accent={C.purpleBdr}>
            {[
              ['Website Enquiry Form', 'General enquiries — auto-added to Prospect Pipeline'],
              ['CIPC Application Form', 'Collects everything needed to register a company'],
              ['SARS Tax Compliance Form', 'Intake for tax-related services'],
              ['Onboarding Questionnaire', 'Sent to new signed clients to gather required details'],
            ].map(([n, d]) => (
              <div key={n as string} style={{ padding: '7px 0', borderBottom: `1px solid ${C.divider}` }}>
                <div style={{ ...T.body, fontWeight: 600, color: C.ink }}>{n as string}</div>
                <div style={T.small}>{d as string}</div>
              </div>
            ))}
          </Card>
          <div style={{ ...T.label, marginBottom: '7px', marginTop: '4px' }}>Finding form submissions 👤</div>
          <Step n={1} title="Go to Marketing → Forms in the left menu" />
          <Step n={2} title="Click the form name → Submissions tab" />
          <Step n={3} title="Each submission also creates or updates a contact automatically ⚡" />
          <InfoBox color="amber">
            <strong>⚠️ You don't need to check forms manually every day.</strong> When someone submits, a workflow sends them a confirmation and adds them to the correct pipeline automatically.
          </InfoBox>
          <div style={{ ...T.label, marginBottom: '7px', marginTop: '4px' }}>Handling duplicate contacts 👤</div>
          <div style={T.body}>If a submission creates a duplicate, open the duplicate contact → click ⋮ → &quot;Merge Contact&quot; → select the original to keep.</div>
        </div>
      </div>
      <FooterBar page={6} total={TOTAL_PAGES} />
    </PageWrapper>
  )
}

/* ═══════════════════════════════════════════════════════════════
   PAGE 7 — Module 06: Workflows
═══════════════════════════════════════════════════════════════ */
function WorkflowsPage() {
  const wf = [
    ['New Enquiry — Welcome Email', 'Website form submitted', 'Sends welcome email, adds to Prospect Pipeline'],
    ['New Lead — Internal Notification', 'Contact added to pipeline', 'Notifies Ranji of a new lead'],
    ['No Reply Follow-Up', '48h after first contact, no reply', 'Sends automated follow-up SMS or email'],
    ['Proposal Sent — Reminder', 'Moved to Proposal Sent stage', 'Follow-up after 3 days if contract not signed'],
    ['Contract Signed — Welcome Sequence', 'Document signed by client', 'Sends welcome + onboarding form + moves to Active Clients'],
    ['Onboarding Form Received', 'Questionnaire submitted', 'Notifies Ranji with task to begin service delivery'],
    ['Invoice Sent — Payment Reminder', 'Invoice created and sent', 'Reminder at 3 days and 7 days if unpaid'],
    ['Payment Received', 'Invoice marked paid', 'Sends payment confirmation email to client'],
    ['Monthly Retainer Renewal', '28th of each month', 'Creates and sends next month\'s retainer invoice automatically'],
    ['Review Request', '30 days after Closed Won', 'Sends a Google Review request to the client'],
    ['Client Reactivation', 'Contact inactive 90 days', 'Sends a check-in message to re-engage'],
  ]
  return (
    <PageWrapper>
      <SectionHeader number="06" title="Workflows & Automation" subtitle="What happens automatically — and what you still need to do manually" />
      <InfoBox color="red">
        <strong>🚫 Do NOT modify, pause, or delete any workflow below.</strong> They were built and tested by Shoulder Monkey. Any change can break your automations — clients may stop receiving documents, invoices, or confirmations.
      </InfoBox>
      <div style={{ ...T.label, marginBottom: '7px' }}>Your 11 automated workflows ⚡</div>
      <div style={{ border: `1px solid ${C.divider}`, borderRadius: '8px', overflow: 'hidden', marginBottom: '12px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 2fr', padding: '7px 11px', background: C.purpleSoft, borderBottom: `1px solid ${C.divider}` }}>
          <div style={T.label}>Workflow Name</div><div style={T.label}>Trigger</div><div style={T.label}>What It Does</div>
        </div>
        {wf.map(([name, trigger, action], i) => (
          <div key={name} style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 2fr', padding: '6px 11px', borderBottom: i < wf.length - 1 ? `1px solid ${C.divider}` : 'none', background: i % 2 === 0 ? C.bg : C.bgLight }}>
            <div style={{ ...T.body, fontWeight: 600, color: C.ink, display: 'flex', gap: '5px', alignItems: 'flex-start' }}><span style={{ color: C.purple, marginTop: '1px' }}>⚡</span>{name}</div>
            <div style={T.body}>{trigger}</div>
            <div style={T.body}>{action}</div>
          </div>
        ))}
      </div>
      <TwoCol ratio="1fr 1fr"
        left={<>
          <div style={{ ...T.label, marginBottom: '7px' }}>What you still do manually 👤</div>
          {['Send contracts to clients (Documents & Contracts → template → Use Template)', 'Sign the contract after the client signs (check your email for the signing notification)', 'Move contacts between pipeline stages as work progresses', 'Create one-off invoices for ad-hoc services', 'Add notes to contact records after calls or meetings', 'Tag contacts when their service type changes'].map(item => (
            <div key={item} style={{ display: 'flex', gap: '7px', marginBottom: '6px', alignItems: 'flex-start' }}>
              <div style={{ color: C.amber, fontSize: '0.75rem', marginTop: '2px', flexShrink: 0 }}>👤</div>
              <div style={T.body}>{item}</div>
            </div>
          ))}
        </>}
        right={<>
          <InfoBox color="purple">
            <strong>💡 Remember:</strong> Automations only fire when the correct trigger happens. The &quot;Contract Signed&quot; workflow only runs when the client signs digitally through the platform. Manual signatures require you to complete the follow-up steps yourself.
          </InfoBox>
          <InfoBox color="green">
            <strong>💡 Checking what an automation sent:</strong> Open the contact record → scroll to the &quot;Activity&quot; tab. It shows every automated email, SMS, and task the system ran for that contact.
          </InfoBox>
        </>}
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
    <PageWrapper>
      <SectionHeader number="07" title="Documents & Contracts" subtitle="How to send the BridgeGrowth Client Service Agreement to a new client" />
      <TwoCol ratio="1fr 1fr"
        left={<>
          <div style={{ ...T.label, marginBottom: '7px' }}>Your 2 contract templates</div>
          <Card accent={C.purpleBdr}>
            {[
              { name: 'Client Service Agreement (Starter)', note: 'Once-off payment. Use for the Starter package only.', tag: 'Once-off' as const },
              { name: 'Client Service Agreement (Monthly)', note: 'Recurring monthly payment. Use for Growth and Operations.', tag: 'Monthly' as const },
            ].map(({ name, note, tag }) => (
              <div key={name} style={{ padding: '9px 0', borderBottom: `1px solid ${C.divider}` }}>
                <div style={{ ...T.body, fontWeight: 600, color: C.ink }}>{name}</div>
                <div style={{ ...T.small, margin: '2px 0 5px' }}>{note}</div>
                <Pill text={tag} color={tag === 'Once-off' ? 'green' : 'purple'} />
              </div>
            ))}
          </Card>
          <div style={{ ...T.label, marginBottom: '7px', marginTop: '4px' }}>Step-by-step: Sending a contract 👤</div>
          <Step n={1} title="Go to Documents & Contracts in the left menu" />
          <Step n={2} title='Click "Templates" tab' />
          <Step n={3} title="Right-click (or click ⋮) on the correct template → Use Template">
            <div style={T.small}>Starter template for Starter package. Monthly template for Growth or Operations.</div>
          </Step>
          <Step n={4} title="Enter the client's full name and email address" />
          <Step n={5} title="Set signing order: YOU (Ranji) sign first, then the client">
            <div style={T.small}>⚠️ GHL requires the signing order to be set. You cannot pre-sign before sending.</div>
          </Step>
          <Step n={6} title="Fill in all the grey document fields: package, services, amounts" />
          <Step n={7} title='Click "Send Document" (not "Share Link")' />
          <Step n={8} title="You receive it in your email — sign it first" />
          <Step n={9} title="System sends it to the client — they fill in their details and sign" />
          <Step n={10} title="Both parties receive the completed copy once both have signed ⚡" />
        </>}
        right={<>
          <InfoBox color="amber">
            <strong>⚠️ Fill in ALL the grey boxes before sending.</strong> These are the client-specific fields (name, business name, ID number, package selected, service details). Blank boxes look unprofessional and may affect the contract's legal standing.
          </InfoBox>
          <Card title="What the client receives" accent={C.purpleBdr}>
            <div style={T.body}>A branded BridgeGrowth email with a &quot;View &amp; Sign Document&quot; button. They click it, fill in their details in the form fields, and sign digitally. No account or download needed.</div>
          </Card>
          <Card title="After signing — what happens">
            {[
              ['⚡', 'Both parties get a completed PDF copy by email'],
              ['⚡', 'Contract stored in Documents → Signed tab'],
              ['⚡', '"Contract Signed" workflow fires — welcome email and onboarding form sent automatically'],
              ['👤', 'Move the contact to "Active Clients" pipeline manually'],
            ].map(([icon, text]) => (
              <div key={text as string} style={{ display: 'flex', gap: '7px', alignItems: 'flex-start', marginBottom: '6px' }}>
                <div style={{ ...T.small, color: icon === '⚡' ? C.purple : C.amber, flexShrink: 0 }}>{icon}</div>
                <div style={T.body}>{text as string}</div>
              </div>
            ))}
          </Card>
          <Card title="Finding sent contracts">
            <div style={T.body}>Documents &amp; Contracts → switch to the &quot;Documents&quot; tab → filter by status: Sent, Viewed, Signed, or Completed.</div>
          </Card>
          <InfoBox color="red">
            <strong>🚫 Never edit the template itself.</strong> Editing the master template changes it for all future contracts. Tell Shoulder Monkey if terms need to change and we'll update it for you.
          </InfoBox>
        </>}
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
    <PageWrapper>
      <SectionHeader number="08" title="Payments & Invoicing" subtitle="Creating invoices, sending payment requests, and tracking what's been paid" />
      <TwoCol ratio="1fr 1fr"
        left={<>
          <div style={{ ...T.label, marginBottom: '7px' }}>Creating a new invoice 👤</div>
          <Step n={1} title='Go to Payments → "Invoices" tab' />
          <Step n={2} title='"New Invoice" button (top right)' />
          <Step n={3} title="Select the client contact from the dropdown">
            <div style={T.small}>Start typing their name — it searches your contact database.</div>
          </Step>
          <Step n={4} title="Add line items: service name, description, quantity, price">
            <div style={T.small}>Be specific in the description. e.g. "CIPC Company Registration — [Company Name]"</div>
          </Step>
          <Step n={5} title="Set the due date and any notes" />
          <Step n={6} title='"Send Invoice" — client receives a payment link by email' />
          <Divider />
          <div style={{ ...T.label, marginBottom: '7px' }}>Package pricing reference</div>
          <Card>
            {[
              { pkg: 'Starter Package', price: 'R 1,500 once-off', note: 'CIPC registration + basic setup' },
              { pkg: 'Growth Package', price: 'R 2,500 / month', note: 'Admin retainer + SARS compliance' },
              { pkg: 'Operations Package', price: 'R 4,500 / month', note: 'Full admin + debtors management' },
            ].map(({ pkg, price, note }) => (
              <div key={pkg} style={{ padding: '7px 0', borderBottom: `1px solid ${C.divider}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div style={{ ...T.body, fontWeight: 600, color: C.ink }}>{pkg}</div>
                  <div style={{ ...T.body, color: C.purple, fontWeight: 700 }}>{price}</div>
                </div>
                <div style={T.small}>{note}</div>
              </div>
            ))}
            <div style={{ ...T.small, marginTop: '7px', color: C.amber }}>All prices excl. VAT. Add 15% for VAT-registered clients.</div>
          </Card>
        </>}
        right={<>
          <Card title="Automated vs manual" accent={C.purpleBdr}>
            {[
              { type: 'Monthly retainer invoice', auto: true, note: 'Fires on 28th of each month' },
              { type: 'Once-off service invoice', auto: false, note: 'Create manually per the steps on the left' },
              { type: 'Ad-hoc / extra charge invoice', auto: false, note: 'Create manually — describe the extra service clearly' },
              { type: 'Payment reminder (3 days)', auto: true, note: 'Sent automatically if invoice unpaid' },
              { type: 'Payment reminder (7 days)', auto: true, note: 'Second automated reminder' },
              { type: 'Payment confirmation', auto: true, note: 'Sent to client as soon as payment received' },
            ].map(({ type, auto, note }) => (
              <div key={type} style={{ display: 'flex', gap: '9px', alignItems: 'flex-start', padding: '6px 0', borderBottom: `1px solid ${C.divider}` }}>
                <div style={{ ...T.small, color: auto ? C.purple : C.amber, flexShrink: 0, marginTop: '2px' }}>{auto ? '⚡' : '👤'}</div>
                <div>
                  <div style={{ ...T.body, fontWeight: 600, color: C.ink }}>{type}</div>
                  <div style={T.small}>{note}</div>
                </div>
              </div>
            ))}
          </Card>
          <div style={{ ...T.label, marginBottom: '7px', marginTop: '8px' }}>Invoice status reference</div>
          <Card>
            {[['Draft', 'Created but not sent', 'neutral'], ['Sent', 'Emailed to client', 'purple'], ['Viewed', 'Client opened it', 'amber'], ['Paid', 'Payment received', 'green'], ['Overdue', 'Past due, unpaid', 'red']].map(([s, d, c]) => (
              <div key={s as string} style={{ display: 'flex', gap: '8px', alignItems: 'center', padding: '5px 0', borderBottom: `1px solid ${C.divider}` }}>
                <Pill text={s as string} color={c as 'neutral' | 'purple' | 'amber' | 'green' | 'red'} />
                <div style={T.body}>{d as string}</div>
              </div>
            ))}
          </Card>
          <InfoBox color="purple">
            <strong>💡 EFT payments:</strong> If a client pays via bank transfer, go to the invoice → &quot;Record Payment&quot; → enter amount and date. This triggers the payment confirmation email automatically.
          </InfoBox>
        </>}
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
    ['Add a new contact', 'Contacts → + Add Contact → fill details → Save', false],
    ['Move a contact to next stage', 'Contacts → open record → Opportunities panel → change stage', false],
    ['Reply to a client email', 'Conversations → find thread → select Email → type → Send', false],
    ['Send a contract', 'Documents & Contracts → Templates → ⋮ → Use Template → fill → Send Document', false],
    ['Sign a contract (your turn)', 'Check your email for signing notification → click link → sign', false],
    ['View completed contracts', 'Documents & Contracts → Documents tab → filter: Completed', false],
    ['Create a one-off invoice', 'Payments → Invoices → New Invoice → add client + items → Send Invoice', false],
    ['Record an EFT payment', 'Payments → Invoices → find invoice → Record Payment', false],
    ['Share booking link', 'Calendars → Calendar Links tab → copy link → send to client', false],
    ['Find form submissions', 'Marketing → Forms → click form name → Submissions tab', false],
    ['Merge duplicate contacts', 'Contacts → open duplicate → ⋮ → Merge Contact → select original', false],
    ['Check what automation sent', 'Contacts → open record → Activity tab', false],
    ['New enquiry welcome email', 'Automatic — fires when website form is submitted', true],
    ['Contract delivery email', 'Automatic — fires after both parties sign', true],
    ['Monthly retainer invoice', 'Automatic — fires on 28th of each month', true],
    ['Payment reminders', 'Automatic — at 3 days and 7 days if unpaid', true],
    ['Post-contract welcome + onboarding form', 'Automatic — fires when client signs contract', true],
  ]
  return (
    <PageWrapper>
      <SectionHeader number="09" title="Quick Reference" subtitle="Common tasks at a glance — ⚡ = automatic, 👤 = you do it" />
      <div style={{ border: `1px solid ${C.divider}`, borderRadius: '8px', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 3.2fr 28px', padding: '7px 11px', background: C.purpleSoft, borderBottom: `1px solid ${C.divider}` }}>
          <div style={T.label}>Task</div><div style={T.label}>How to do it</div><div style={T.label}></div>
        </div>
        {tasks.map(([task, steps, auto], i) => (
          <div key={task as string} style={{ display: 'grid', gridTemplateColumns: '2fr 3.2fr 28px', padding: '6px 11px', borderBottom: i < tasks.length - 1 ? `1px solid ${C.divider}` : 'none', background: i % 2 === 0 ? C.bg : C.bgLight, alignItems: 'center' }}>
            <div style={{ ...T.body, fontWeight: 600, color: auto ? C.inkLight : C.ink }}>{task as string}</div>
            <div style={T.body}>{steps as string}</div>
            <div style={{ textAlign: 'center', fontSize: '0.8rem' }}>{auto ? '⚡' : '👤'}</div>
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
    <PageWrapper>
      <SectionHeader number="10" title="Do Not Touch" subtitle="Configured by Shoulder Monkey. Any changes can break your system." />
      <InfoBox color="red">
        <strong>🚫 If you accidentally change something on this list, stop immediately and contact Shoulder Monkey.</strong> Do not try to fix it yourself — it is faster and safer for us to restore it.
      </InfoBox>
      <TwoCol ratio="1fr 1fr"
        left={<>
          <Card title="⚡ Automation & Workflows" accent={C.redBdr}>
            <div style={{ ...T.body, marginBottom: '7px' }}>Do not open, edit, pause, or delete any workflow. Even accidentally saving after viewing can break them.</div>
            {['All 11 automated workflows in Automation → Workflows', 'Workflow triggers, actions, and timing delays', 'Email and SMS templates inside workflows'].map(item => (
              <div key={item} style={{ display: 'flex', gap: '7px', alignItems: 'flex-start', marginBottom: '5px' }}>
                <div style={{ color: C.red, flexShrink: 0 }}>🚫</div><div style={T.body}>{item}</div>
              </div>
            ))}
          </Card>
          <Card title="📧 Email & Sending Domain" accent={C.redBdr}>
            {['Settings → Email Services → sending domain (bridgegrowth.co.za)', 'SMTP or mailbox connection settings', 'Reply-to or from-name settings', 'Email signature HTML in Settings'].map(item => (
              <div key={item} style={{ display: 'flex', gap: '7px', alignItems: 'flex-start', marginBottom: '5px' }}>
                <div style={{ color: C.red, flexShrink: 0 }}>🚫</div><div style={T.body}>{item}</div>
              </div>
            ))}
          </Card>
          <Card title="📄 Contract Templates" accent={C.redBdr}>
            <div style={T.body}>Always use contracts by using a template — never by editing the template itself. If terms need to change, contact Shoulder Monkey and we will update the master template.</div>
          </Card>
        </>}
        right={<>
          <Card title="⚙️ Custom Values & Phone" accent={C.redBdr}>
            <div style={{ ...T.body, marginBottom: '7px' }}>Custom Values are global variables used throughout your automations, emails, and documents. Changing one value changes it everywhere.</div>
            {['Settings → Custom Values (business name, phone, email, etc.)', 'Twilio phone number connection', 'SMS sender settings'].map(item => (
              <div key={item} style={{ display: 'flex', gap: '7px', alignItems: 'flex-start', marginBottom: '5px' }}>
                <div style={{ color: C.red, flexShrink: 0 }}>🚫</div><div style={T.body}>{item}</div>
              </div>
            ))}
          </Card>
          <Card title="🌐 Website & Funnels" accent={C.redBdr}>
            {['Your website is on Framer — do not touch Sites in this platform', 'Any published landing pages or funnels', 'Form embed codes on the website'].map(item => (
              <div key={item} style={{ display: 'flex', gap: '7px', alignItems: 'flex-start', marginBottom: '5px' }}>
                <div style={{ color: C.red, flexShrink: 0 }}>🚫</div><div style={T.body}>{item}</div>
              </div>
            ))}
          </Card>
          <Card title="🔗 Integrations" accent={C.redBdr}>
            {['Settings → Integrations (Google, Stripe, Twilio)', 'API keys or webhook URLs', 'Sub-account settings', 'User permissions or roles (ask Shoulder Monkey to add users)'].map(item => (
              <div key={item} style={{ display: 'flex', gap: '7px', alignItems: 'flex-start', marginBottom: '5px' }}>
                <div style={{ color: C.red, flexShrink: 0 }}>🚫</div><div style={T.body}>{item}</div>
              </div>
            ))}
          </Card>
          <InfoBox color="amber">
            <strong>⚠️ When in doubt, don't.</strong> Screenshot it, send it to Shoulder Monkey, and ask first. We would rather answer a quick question than fix a broken system.
          </InfoBox>
        </>}
      />
      <FooterBar page={11} total={TOTAL_PAGES} />
    </PageWrapper>
  )
}

/* ═══════════════════════════════════════════════════════════════
   PAGE 12 — Back Cover
═══════════════════════════════════════════════════════════════ */
function BackCoverPage() {
  return (
    <PageWrapper style={{ pageBreakAfter: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 0 }}>
      {/* Purple top band */}
      <div style={{ background: C.purple, padding: '12mm 15mm 10mm' }}>
        <div style={{ fontSize: '0.65rem', fontFamily: 'var(--font-inter)', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', marginBottom: '8px' }}>
          Need Help?
        </div>
        <div style={{ fontFamily: 'var(--font-jakarta)', fontSize: '1.8rem', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
          We&apos;re right here.
        </div>
        <div style={{ fontFamily: 'var(--font-inter)', fontSize: '0.85rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, maxWidth: '400px' }}>
          If something isn&apos;t working, you&apos;re not sure how to do something, or you think an automation isn&apos;t firing — reach out to Shoulder Monkey before trying to fix it yourself.
        </div>
      </div>

      {/* White body */}
      <div style={{ flex: 1, padding: '12mm 15mm' }}>
        <div style={{ display: 'flex', gap: '14px', marginBottom: '24px' }}>
          {[
            { label: 'For platform issues', value: 'info@shouldermonkey.co', note: 'Broken workflows, access issues, missing features' },
            { label: 'Platform URL', value: 'app.shouldermonkey.co', note: 'Bookmark this in your browser' },
            { label: 'Mobile app', value: 'LeadConnector', note: 'iOS and Android — same login credentials' },
          ].map(({ label, value, note }) => (
            <div key={label} style={{ flex: 1, background: C.bgLight, border: `1px solid ${C.purpleBdr}`, borderRadius: '8px', padding: '12px' }}>
              <div style={T.label}>{label}</div>
              <div style={{ ...T.body, color: C.ink, fontWeight: 700, marginTop: '4px' }}>{value}</div>
              <div style={{ ...T.small, marginTop: '3px' }}>{note}</div>
            </div>
          ))}
        </div>

        <Divider />

        <div style={{ ...T.label, marginBottom: '10px' }}>What&apos;s coming next</div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['Twilio number (pending SA regulatory approval)', 'Google Business Profile → review automation', 'Facebook & Instagram connection', 'Client portal access'].map(item => (
            <div key={item} style={{ background: C.purpleSoft, border: `1px solid ${C.purpleBdr}`, borderRadius: '6px', padding: '5px 10px' }}>
              <div style={{ ...T.small, color: C.purpleDark }}>Upcoming: {item}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer strip */}
      <div style={{ background: C.bgLight, borderTop: `1px solid ${C.divider}`, padding: '10px 15mm', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Image
          src="/images/SM - Logo - No Monkey Flat Lay.png"
          alt="Shoulder Monkey"
          width={160} height={36}
          style={{ height: '26px', width: 'auto', objectFit: 'contain', objectPosition: 'left' }}
        />
        <div style={{ textAlign: 'right' }}>
          <div style={{ ...T.small, color: C.purple }}>BridgeGrowth Platform Training Guide v1.0</div>
          <div style={T.small}>April 2026 · Internal use only</div>
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
    <div style={{ background: '#e5e5e5', fontFamily: 'var(--font-inter)' }}>
      <style>{`* { box-sizing: border-box; margin: 0; padding: 0; }`}</style>
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
