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
    prompt: `If you need an idea:
"I am [your age] and I am interested in [hobbies, things you know about, problems you notice around you]. What are five specific business ideas I could start with AI tools, no money, and no experience? For each one, tell me who would pay for it and why."

If you already have an idea:
"My idea is: [describe it in one sentence]. The people I want to sell to are [describe them]. Tell me: (1) the three most likely reasons this fails, (2) the one thing that would make it work, (3) the one question I need to answer before going further."`,
    deliverable: "An idea that has been stress-tested by AI. If it survived, you have something worth building. If it didn't, you just saved months.",
    tip: "If AI says your idea has problems, don't quit — ask it: \"How would I fix those problems?\" The fix is often better than the original idea.",
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
    prompt: `"I am building [your idea]. The people I help are [who they are]. The biggest thing they hate about current options is [what frustrates them]. Write me 5 different one-sentence descriptions of my business that focus entirely on what the customer gets — not what I do. Make each one different: one for teenagers, one for parents, one that sounds urgent, one that sounds exciting, one that sounds simple."`,
    deliverable: "Five ways to describe your business. Pick the one that makes someone immediately say \"tell me more.\" That is the sentence you use everywhere.",
    tip: 'Read each one to someone else and watch their face. The one that makes them lean in slightly is the winner.',
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
    prompt: `Step 1 — Write the script with Claude:
"Write a 60-second spoken pitch for [your business]. Use my business tone: [paste your Day 4 guide]. Structure: one sentence naming the problem, two sentences on who I help and how, one sentence on why now, one sentence on what to do next. Make it sound like I am talking to a friend — not reading a script."

Step 2 — Go to ElevenLabs, create a free account, go to Voice Lab, record 30 seconds of yourself speaking naturally, clone your voice, paste the script, and generate.`,
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
