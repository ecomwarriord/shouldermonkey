import type { Metadata } from 'next'
import { CursorFix } from '@/components/ai-unlocked/CursorFix'

export const metadata: Metadata = {
  title: 'Your 7-Day AI Starter Plan — AI Unlocked',
  description: 'A 7-day action plan to go from zero AI experience to having built something real. One tool per day. 30-45 minutes each.',
  robots: { index: false, follow: false },
}

const DAYS = [
  {
    day: 1,
    title: 'Find and test your first idea',
    tool: 'ChatGPT',
    toolUrl: 'https://chat.openai.com',
    timeEstimate: '30 minutes',
    color: '#10B981',
    what: "Don't have an idea yet? Good. AI finds them faster than you do. Already have one? Even better — today you find out if it is actually worth building before you spend a second more on it.",
    prompt: `If you need an idea — copy this exactly and fill in the blanks:
"I am [your age, e.g. 16] years old. Five things I enjoy, know about, or notice problems with in daily life: [list five things, e.g. gaming, cooking for my family, helping younger kids with homework, sport, social media for small businesses]. For each one, suggest one specific business idea I could start using AI tools, with no money and no experience. For each idea, tell me: exactly who would pay for it, roughly how much they would pay, and how I could make the first $100."

If you already have an idea — copy this exactly and fill in the blanks:
"My business idea is: [one sentence, e.g. 'an AI-powered study guide service for Year 10 students in Australia']. The people I want to help are [e.g. 'Year 10 students who are stressed about exams and don't have money for tutors']. Tell me: (1) the three most likely reasons this idea fails, (2) the one thing that would make it succeed, (3) the single most important question I need to answer before building anything."

What a good AI response looks like: specific names for the type of person who would pay, actual dollar amounts, a clear reason why they'd choose your solution over what they use now. If the response is vague, type: "Be more specific. Give me real examples."`,
    deliverable: "An idea you have actually tested with AI — not just thought about. If it survived, you have something worth building. If it didn't, you saved yourself months.",
    tip: "If AI says your idea has problems, do not quit. Type: \"How would I fix those three problems?\" The fix is often better than the original idea.",
  },
  {
    day: 2,
    title: 'Find out who actually has the problem',
    tool: 'Perplexity',
    toolUrl: 'https://perplexity.ai',
    timeEstimate: '30 minutes',
    color: '#7B3FE4',
    what: 'Perplexity is AI search that shows you where it got every answer. Today you use it to find out who already has the problem you are solving, how many of them there are, and what they are doing about it right now.',
    prompt: `"I want to understand who has this problem: [describe the problem your idea solves]. Tell me: (1) what kinds of people specifically deal with this problem and how often, (2) what they are currently doing to solve it and why they are unhappy with those solutions, (3) roughly how much they spend on solutions right now. Cite your sources."`,
    deliverable: "A clear picture of your customer — who they are, what frustrates them, and what they already spend money on. This is more market research than most adults do before starting a business.",
    tip: 'If the answer feels too general, ask: "Specifically for Australia" or "Specifically for people aged 15-25." Narrow it down until it feels real.',
  },
  {
    day: 3,
    title: 'Write the one sentence that sells your idea',
    tool: 'Claude AI',
    toolUrl: 'https://claude.ai',
    timeEstimate: '45 minutes',
    color: '#FF3366',
    what: "Every successful business can explain itself in one sentence. Not a paragraph. Not a pitch. One sentence that makes someone think \"I need that.\" Today you write yours.",
    prompt: `Copy this exactly and fill in the blanks:
"I am building [e.g. 'an AI-powered study guide service']. The people I help are [e.g. 'Year 10 students in Australia who are stressed about exams and can't afford tutors']. The thing they hate most about their current options is [e.g. 'tutors are too expensive, YouTube videos are too long and unfocused, and their school teachers don't have time for one-on-one help']. Write me 5 different one-sentence descriptions of my business that focus only on what the customer gets — not on what I do or how it works. Make them different: one aimed at teenagers, one aimed at parents, one that sounds urgent, one that sounds exciting, one that sounds reassuringly simple."

What a good response looks like: each sentence starts with what the customer experiences, not with "we" or "I." It should describe a feeling or an outcome, not a feature. If a sentence starts with "I help" or "We provide" — ask AI to rewrite it starting from the customer's perspective instead.`,
    deliverable: "Five ways to describe your business. Pick the one that makes someone immediately say \"tell me more.\" That is the sentence you use everywhere from now on.",
    tip: 'Read each one to a real person and watch their face. The one that makes them lean forward or ask a question is the one.',
  },
  {
    day: 4,
    title: 'Decide how your business sounds',
    tool: 'Claude AI',
    toolUrl: 'https://claude.ai',
    timeEstimate: '30 minutes',
    color: '#FF3366',
    what: "Your business has a personality — the way it sounds in every post, every message, every piece of content. Getting this clear now means everything you create from Day 5 onwards will sound like it belongs together.",
    prompt: `"I am building a business called [name or working title]. My customers are [who they are]. Three businesses or brands I think sound great and would want to be similar to are [list three — can be brands, YouTubers, apps, anything]. Write me: (1) three words that describe how my business should sound, (2) five words my business would use a lot, (3) five words my business would never use, (4) two example sentences written the way my business would write."`,
    deliverable: "A personality guide for your business. Save this — you will paste it into every AI prompt from here on to make sure everything sounds like you.",
    tip: 'Add this to the start of future prompts: "Write this in my business tone: [paste your guide]." Everything you create will instantly sound more consistent.',
  },
  {
    day: 5,
    title: 'Write and design your first social post',
    tool: 'Claude AI + Canva',
    toolUrl: 'https://claude.ai',
    timeEstimate: '45 minutes',
    color: '#7B3FE4',
    what: "Today you put something real into the world. First Claude writes the words. Then Canva designs the visual. One post, ready to publish. This is how creators who look like they have a team actually work alone.",
    prompt: `Step 1 — Write the post with Claude:
"Write a social media post for [Instagram/TikTok] announcing my business for the first time. Use my business tone: [paste your Day 4 guide]. The post should: start with a line that makes someone stop scrolling, explain the problem I solve in two sentences, end with a question that makes people want to comment."

Step 2 — Design the visual: open Canva (canva.com), click Create, search "Instagram post," use Magic Design with a description of your idea, and match it to the post tone.`,
    deliverable: "A written post and a designed graphic — ready to post tonight. The goal is not perfection. The goal is having something real exist.",
    tip: 'Post it. Even if only five people see it. The habit of publishing is more valuable than the reach of any single post.',
  },
  {
    day: 6,
    title: 'Create a 60-second pitch in your voice',
    tool: 'ElevenLabs',
    toolUrl: 'https://elevenlabs.io',
    timeEstimate: '45 minutes',
    color: '#F59E0B',
    what: "A voice pitch in your own voice — that you can send in a DM, attach to an email, or post as audio content. Today you clone your voice once and then generate it as many times as you want without ever recording yourself again.",
    prompt: `Step 1 — Write your script with Claude. Copy this exactly:
"Write me a 60-second pitch script for [your business name and one-sentence description from Day 3]. My business tone is: [paste your Day 4 guide here]. Structure: one sentence naming the problem my customer has right now, two sentences on who I help and exactly how, one sentence on why this matters more now than a year ago [e.g. 'because AI tools now make this possible for anyone'], one sentence on what to do next. Sound like I am explaining this to a friend at lunch — not presenting to a boardroom."

What a good script looks like: reading it aloud takes 55-65 seconds, sounds like a normal conversation, and someone could repeat the main idea back to you. If it sounds stiff, type: "Rewrite this to sound more like a teenager explaining something they are genuinely excited about."

Step 2 — Go to ElevenLabs (free account), click Voice Lab, record 30 seconds of yourself reading anything aloud in a quiet room, clone the voice, paste your script, click Generate.`,
    deliverable: "A 60-second MP3 in your own cloned voice. Send it to someone today and watch their reaction.",
    tip: 'Record your voice sample in the quietest room you can find. Speak at your natural pace. The better the sample, the more natural the clone.',
  },
  {
    day: 7,
    title: 'Make a 10-second video for your business',
    tool: 'Higgsfield',
    toolUrl: 'https://higgsfield.ai',
    timeEstimate: '45 minutes',
    color: '#EC4899',
    what: "Cinematic video used to cost thousands and take weeks. Today you make one in under an hour with a text prompt. This is the kind of content that makes people stop and think \"that looks like a real brand.\"",
    prompt: `Write your prompt for Higgsfield:
"[Describe your target customer in one sentence], [describe what they are doing — working, creating, building something], in [a setting that matches your brand — bedroom, cafe, outdoors], looking focused and capable, cinematic lighting, authentic."

Example: "A 16-year-old in a Sydney bedroom, laptop open, building a business online, focused expression, warm afternoon light, cinematic."

Generate 3-4 versions with slight variations. Pick your favourite.`,
    deliverable: "A 5-10 second cinematic video. Post it. Use it as a website background. Attach it to your pitch. This is what your brand looks like.",
    tip: 'The more specific your prompt, the better the result. Add details: the colour of the walls, the time of day, the mood. Specificity is the skill.',
  },
]

export default function StarterGuidePage() {
  return (
    <div style={{ background: '#000', minHeight: '100vh', color: '#f0edff', fontFamily: 'var(--font-inter, system-ui, sans-serif)' }}>
      <CursorFix />

      {/* Header */}
      <div style={{ maxWidth: 780, margin: '0 auto', padding: '60px 24px 48px' }}>
        <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#7B3FE4', marginBottom: 12 }}>
          AI Unlocked · Starter Plan
        </p>
        <h1 style={{ fontFamily: 'var(--font-syne, system-ui)', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, letterSpacing: '-0.03em', color: '#ffffff', margin: '0 0 16px', lineHeight: 1.1 }}>
          7 days. 7 builds.<br />
          <span style={{ color: '#FF3366' }}>Zero experience needed.</span>
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1rem', lineHeight: 1.7, maxWidth: 580, margin: 0 }}>
          This is not a list of tools. It is a plan. By Day 7 you will have a tested idea, real market research,
          a selling sentence, a business personality, a social post live in the world, a voice pitch you can send in a DM,
          and a cinematic video. One tool per day. 30-45 minutes each. All free to start.
        </p>

        <div style={{ marginTop: 24, display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          {['A tested idea', 'Market research', 'Your selling sentence', 'Your business personality', 'A social post', 'A voice pitch', 'A brand video'].map((item) => (
            <span key={item} style={{ fontSize: '0.78rem', fontWeight: 600, color: 'rgba(255,255,255,0.6)', background: 'rgba(123,63,228,0.08)', border: '1px solid rgba(123,63,228,0.2)', padding: '4px 12px', borderRadius: 100 }}>
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Days */}
      <div style={{ maxWidth: 780, margin: '0 auto', padding: '0 24px 80px', display: 'flex', flexDirection: 'column', gap: 24 }}>
        {DAYS.map((day) => (
          <div key={day.day} style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderLeft: `4px solid ${day.color}`,
            borderRadius: 14,
            padding: '28px 28px 24px',
          }}>
            {/* Day header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 16 }}>
              <div>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: day.color }}>
                  Day {day.day} · {day.timeEstimate}
                </span>
                <h2 style={{ fontFamily: 'var(--font-syne, system-ui)', fontSize: '1.3rem', fontWeight: 800, color: '#ffffff', margin: '6px 0 0', letterSpacing: '-0.01em' }}>
                  {day.title}
                </h2>
              </div>
              <a href={day.toolUrl} target="_blank" rel="noopener noreferrer"
                style={{ flexShrink: 0, fontSize: '0.82rem', fontWeight: 700, color: day.color, background: `${day.color}15`, border: `1px solid ${day.color}33`, padding: '6px 14px', borderRadius: 100, textDecoration: 'none' }}>
                Open {day.tool} →
              </a>
            </div>

            {/* What */}
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', lineHeight: 1.65, marginBottom: 20 }}>
              {day.what}
            </p>

            {/* Prompt */}
            <div style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '16px 18px', marginBottom: 16 }}>
              <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 10 }}>
                Your prompt
              </p>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.88rem', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-wrap' }}>
                {day.prompt}
              </p>
            </div>

            {/* Deliverable + Tip */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ background: `${day.color}0a`, border: `1px solid ${day.color}22`, borderRadius: 8, padding: '12px 14px' }}>
                <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: day.color, marginBottom: 6 }}>
                  What you end the day with
                </p>
                <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.85rem', lineHeight: 1.55, margin: 0 }}>
                  {day.deliverable}
                </p>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, padding: '12px 14px' }}>
                <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 6 }}>
                  Tip
                </p>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', lineHeight: 1.55, margin: 0 }}>
                  {day.tip}
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* Footer */}
        <div style={{ marginTop: 16, padding: '32px', background: 'rgba(123,63,228,0.06)', border: '1px solid rgba(123,63,228,0.2)', borderRadius: 14, textAlign: 'center' }}>
          <h3 style={{ fontFamily: 'var(--font-syne, system-ui)', fontSize: '1.3rem', fontWeight: 800, color: '#ffffff', margin: '0 0 10px', letterSpacing: '-0.01em' }}>
            After 7 days, you have 7 real things.
          </h3>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', lineHeight: 1.65, margin: '0 0 20px', maxWidth: 480, marginLeft: 'auto', marginRight: 'auto' }}>
            The webinar in August shows you how to use these same tools to turn that foundation into
            your first income online. One night live. August 2026, AEST.
          </p>
          <a href="/ai-unlocked#waitlist-form"
            style={{ display: 'inline-block', background: 'linear-gradient(135deg, #7B3FE4 0%, #FF3366 100%)', color: '#fff', fontWeight: 700, fontSize: '0.9rem', padding: '12px 28px', borderRadius: 100, textDecoration: 'none' }}>
            Back to the Waitlist →
          </a>
        </div>
      </div>
    </div>
  )
}
